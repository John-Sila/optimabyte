import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, Eye, FilePlus2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInvoiceData } from "@/lib/invoice-context";
import { createInvoice, getInvoicePdf, saveClient } from "@/lib/invoice-data";
import { subscribeReports, type Report } from "@/lib/admin-data";
import {
  PAYMENT_METHODS,
  addDaysISO,
  calcTotals,
  formatInvoiceNumber,
  formatMoney,
  lineAmount,
  paidTotal,
  todayISO,
  type ClientSnapshot,
  type Invoice,
  type Payment,
} from "@/lib/invoice-types";
import { Field, SectionTitle, cardClass, downloadBlob, selectClass, showBlob } from "./shared";

interface ItemDraft {
  key: number;
  description: string;
  qty: string;
  unitPrice: string;
}

interface PaymentDraft {
  key: number;
  amount: string;
  date: string;
  method: string;
  reference: string;
}

const EMAIL_RE = /^[^@\s/|]+@[^@\s/|]+\.[^@\s/|]+$/;
const emptyClient: ClientSnapshot = { name: "", email: "", phone: "", address: "", kraPin: "" };

export default function InvoiceForm() {
  const { clients, settings, ready } = useInvoiceData();

  const nextKey = useRef(1);
  const newItem = (description = ""): ItemDraft => ({ key: nextKey.current++, description, qty: "1", unitPrice: "" });

  const [clientId, setClientId] = useState(""); // "" = new client
  const [client, setClient] = useState<ClientSnapshot>(emptyClient);
  const [saveToClients, setSaveToClients] = useState(true);
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState("");
  const [dueTouched, setDueTouched] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>(() => [newItem()]);
  const [discount, setDiscount] = useState("");
  const [payments, setPayments] = useState<PaymentDraft[]>([]);
  const [vatOn, setVatOn] = useState(false);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Invoice | null>(null);
  const [pdfWarn, setPdfWarn] = useState(false);
  const [requests, setRequests] = useState<Report[]>([]);
  const seeded = useRef(false);

  // Defaults come from the invoice settings once they have loaded (and again whenever the form is reset).
  const applyDefaults = () => {
    setDueDate(addDaysISO(todayISO(), settings.dueDays));
    setDueTouched(false);
    setVatOn(settings.vatRate > 0);
    setTerms(settings.terms);
    setPaymentDetails(settings.paymentDetails);
    setNotes(settings.notes);
  };
  useEffect(() => {
    if (ready && !seeded.current) {
      seeded.current = true;
      applyDefaults();
    }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the due date following the issue date until the admin picks one themselves.
  useEffect(() => {
    if (!dueTouched && issueDate) setDueDate(addDaysISO(issueDate, settings.dueDays));
  }, [issueDate, settings.dueDays, dueTouched]);

  // Website requests, so an invoice can start from a real enquiry.
  useEffect(() => {
    const off = subscribeReports(
      (rows) => setRequests([...rows].reverse().slice(0, 100)),
      () => undefined,
    );
    return off;
  }, []);

  const vatRate = vatOn ? settings.vatRate || 16 : 0;
  const parsedItems = items.map((i) => ({
    description: i.description.trim(),
    qty: Number(i.qty) || 0,
    unitPrice: Number(i.unitPrice) || 0,
  }));
  const totals = useMemo(
    () => calcTotals(parsedItems, Number(discount) || 0, vatRate),
    [items, discount, vatRate], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const parsedPayments = payments.map((p) => ({ ...p, value: Number(p.amount) || 0 }));
  const paidSoFar = Math.round(parsedPayments.reduce((sum, p) => sum + p.value, 0) * 100) / 100;
  const balanceNow = Math.max(Math.round((totals.total - paidSoFar) * 100) / 100, 0);

  const newPayment = (): PaymentDraft => ({
    key: nextKey.current++,
    amount: "",
    date: todayISO(),
    method: PAYMENT_METHODS[0],
    reference: "",
  });
  const setPayment = (key: number, patch: Partial<PaymentDraft>) =>
    setPayments((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));

  const pickClient = (id: string) => {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    setClient(c ? { name: c.name, email: c.email, phone: c.phone, address: c.address, kraPin: c.kraPin } : emptyClient);
  };

  const prefillFromRequest = (id: string) => {
    const r = requests.find((x) => x.id === id);
    if (!r) return;
    setClientId("");
    setClient({ ...emptyClient, name: r.name, email: r.email, phone: r.phone });
    setItems((prev) => (prev.length === 1 && !prev[0].description ? [newItem(r.service)] : prev));
  };

  const setItem = (key: number, patch: Partial<ItemDraft>) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const preview = formatInvoiceNumber(settings.prefix, issueDate || todayISO(), settings.nextNumber);

  const reset = () => {
    setDone(null);
    setPdfWarn(false);
    setClientId("");
    setClient(emptyClient);
    setSaveToClients(true);
    setIssueDate(todayISO());
    setItems([newItem()]);
    setDiscount("");
    setPayments([]);
    setNotes("");
    applyDefaults();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!client.name.trim()) return toast.error("Enter the client's name");
    if (client.email && !EMAIL_RE.test(client.email.trim())) return toast.error("That email address does not look right");
    const lines = parsedItems.filter((i) => i.description || i.unitPrice);
    if (!lines.length) return toast.error("Add at least one line item");
    if (lines.some((i) => !i.description)) return toast.error("Every line item needs a description");
    if (lines.some((i) => i.qty <= 0)) return toast.error("Quantities must be above zero");
    if (lines.some((i) => i.unitPrice < 0)) return toast.error("Prices cannot be negative");
    if (totals.total <= 0) return toast.error("The invoice total must be above zero");
    if (dueDate < issueDate) return toast.error("The due date cannot be before the issue date");

    const paid = parsedPayments.filter((p) => p.value > 0 || p.reference.trim());
    if (paid.some((p) => !(p.value > 0))) return toast.error("Every payment needs an amount above zero");
    if (paid.some((p) => !p.date)) return toast.error("Every payment needs a date");
    if (paid.some((p) => p.date > todayISO())) return toast.error("A payment date cannot be in the future. Record it when it arrives.");
    if (paidSoFar > totals.total + 0.005) return toast.error(`Payments (${formatMoney(paidSoFar)}) are more than the invoice total`);
    const initialPayments: Payment[] = paid.map((p) => ({
      id: crypto.randomUUID(),
      amount: p.value,
      method: p.method,
      date: p.date,
      reference: p.reference.trim(),
    }));

    setBusy(true);
    try {
      const snapshot: ClientSnapshot = {
        name: client.name.trim(),
        email: client.email.trim(),
        phone: client.phone.trim(),
        address: client.address.trim(),
        kraPin: client.kraPin.trim(),
      };
      let cid = clientId;
      if (!cid && saveToClients) {
        try {
          cid = await saveClient(snapshot);
        } catch {
          /* the invoice matters more than the saved client */
        }
      }
      const { invoice, pdfStored } = await createInvoice(
        {
          clientId: cid,
          client: snapshot,
          issueDate,
          dueDate,
          items: lines,
          discount: totals.discount,
          vatRate,
          notes: notes.trim(),
          terms: terms.trim(),
          paymentDetails: paymentDetails.trim(),
          payments: initialPayments,
        },
        settings,
      );
      setPdfWarn(!pdfStored);
      setDone(invoice);
      toast.success(`${invoice.number} created`);
    } catch (err) {
      console.error(err);
      toast.error("Could not create the invoice. Check your connection and the Firestore rules.");
    } finally {
      setBusy(false);
    }
  };

  const openPdf = async (action: "view" | "download") => {
    if (!done) return;
    const tab = action === "view" ? window.open("", "_blank") : null;
    try {
      const blob = await getInvoicePdf(done, settings);
      if (action === "view") showBlob(blob, tab);
      else downloadBlob(blob, `${done.number}.pdf`);
    } catch {
      tab?.close();
      toast.error("Could not open the PDF");
    }
  };

  // ------------------------------------------------------------ success screen
  if (done) {
    return (
      <div>
        <SectionTitle title="Generate invoice" />
        <div className={`${cardClass} animate-fade-up mx-auto max-w-xl text-center`}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{done.number} is ready</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatMoney(done.total)} for {done.client.name}
            {paidTotal(done) > 0 ? `, ${formatMoney(paidTotal(done))} already paid, balance ${formatMoney(Math.max(done.total - paidTotal(done), 0))}` : ""}.{" "}
            {pdfWarn
              ? "The invoice was saved, but its PDF could not be stored yet. It will be built again when you open it."
              : "The PDF has been saved with the invoice record."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={() => void openPdf("view")}><Eye className="h-4 w-4" /> View PDF</Button>
            <Button variant="outline" onClick={() => void openPdf("download")}><Download className="h-4 w-4" /> Download</Button>
            <Button variant="outline" asChild><Link to="/admin/invoices">Go to current invoices</Link></Button>
            <Button variant="ghost" onClick={reset}><FilePlus2 className="h-4 w-4" /> Create another</Button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ form
  return (
    <div>
      <SectionTitle
        title="Generate invoice"
        description="Fill in the details and a PDF is created and saved to your invoice record. The number is assigned automatically."
      />

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* client */}
          <section className={cardClass}>
            <h2 className="mb-4 text-base font-semibold">Bill to</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Saved client" htmlFor="inv-client">
                <select id="inv-client" className={selectClass} value={clientId} onChange={(e) => pickClient(e.target.value)}>
                  <option value="">New client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Or start from a website request" htmlFor="inv-request">
                <select id="inv-request" className={selectClass} value="" onChange={(e) => prefillFromRequest(e.target.value)}>
                  <option value="">Choose a request</option>
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} - {r.service}</option>
                  ))}
                </select>
              </Field>
              <Field label="Client name" htmlFor="inv-name">
                <Input id="inv-name" value={client.name} maxLength={120} onChange={(e) => setClient({ ...client, name: e.target.value })} />
              </Field>
              <Field label="Email" htmlFor="inv-email">
                <Input id="inv-email" type="email" value={client.email} maxLength={120} onChange={(e) => setClient({ ...client, email: e.target.value })} />
              </Field>
              <Field label="Phone" htmlFor="inv-phone">
                <Input id="inv-phone" type="tel" value={client.phone} maxLength={30} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
              </Field>
              <Field label="KRA PIN (optional)" htmlFor="inv-pin">
                <Input id="inv-pin" value={client.kraPin} maxLength={20} onChange={(e) => setClient({ ...client, kraPin: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Address" htmlFor="inv-address" className="sm:col-span-2">
                <Input id="inv-address" value={client.address} maxLength={160} onChange={(e) => setClient({ ...client, address: e.target.value })} />
              </Field>
            </div>
            {!clientId && (
              <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={saveToClients} onChange={(e) => setSaveToClients(e.target.checked)} className="h-4 w-4 accent-primary" />
                Save this client for next time
              </label>
            )}
          </section>

          {/* dates */}
          <section className={cardClass}>
            <h2 className="mb-4 text-base font-semibold">Dates</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Issue date" htmlFor="inv-issue">
                <Input id="inv-issue" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </Field>
              <Field label="Due date" htmlFor="inv-due" hint={`Defaults to ${settings.dueDays} days after issue. Change the default in Invoice settings.`}>
                <Input id="inv-due" type="date" value={dueDate} onChange={(e) => { setDueDate(e.target.value); setDueTouched(true); }} />
              </Field>
            </div>
          </section>

          {/* items */}
          <section className={cardClass}>
            <h2 className="mb-4 text-base font-semibold">Items</h2>
            <div className="hidden gap-2 px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1fr)_70px_120px_110px_36px]">
              <span>Description</span><span>Qty</span><span>Unit price</span><span className="text-right">Amount</span><span />
            </div>
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={it.key} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[minmax(0,1fr)_70px_120px_110px_36px] sm:items-center sm:border-0 sm:p-0">
                  <Input aria-label={`Item ${idx + 1} description`} placeholder="e.g. POS system setup" value={it.description} maxLength={300} onChange={(e) => setItem(it.key, { description: e.target.value })} />
                  <Input aria-label={`Item ${idx + 1} quantity`} type="number" inputMode="decimal" min="0" step="any" value={it.qty} onChange={(e) => setItem(it.key, { qty: e.target.value })} />
                  <Input aria-label={`Item ${idx + 1} unit price`} type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={it.unitPrice} onChange={(e) => setItem(it.key, { unitPrice: e.target.value })} />
                  <p className="text-sm font-semibold sm:text-right">{formatMoney(lineAmount(parsedItems[idx]), "")}</p>
                  <Button type="button" size="icon" variant="ghost" aria-label={`Remove item ${idx + 1}`} disabled={items.length === 1} onClick={() => setItems((p) => p.filter((x) => x.key !== it.key))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" disabled={items.length >= 100} onClick={() => setItems((p) => [...p, newItem()])}>
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </section>

          {/* payments already received */}
          <section className={cardClass}>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold">Payments already received</h2>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              If the client has already paid part of this invoice, add each payment here with its date. They appear on the PDF with the balance after each one. Payments that arrive later are recorded from Current invoices.
            </p>
            {payments.length > 0 && (
              <div className="space-y-3">
                {payments.map((p, idx) => (
                  <div key={p.key} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[130px_140px_minmax(0,1fr)_minmax(0,1fr)_36px] sm:items-center">
                    <Input aria-label={`Payment ${idx + 1} amount`} type="number" inputMode="decimal" min="0" step="0.01" placeholder="Amount" value={p.amount} onChange={(e) => setPayment(p.key, { amount: e.target.value })} />
                    <Input aria-label={`Payment ${idx + 1} date`} type="date" max={todayISO()} value={p.date} onChange={(e) => setPayment(p.key, { date: e.target.value })} />
                    <select aria-label={`Payment ${idx + 1} method`} className={selectClass} value={p.method} onChange={(e) => setPayment(p.key, { method: e.target.value })}>
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <Input aria-label={`Payment ${idx + 1} reference`} placeholder="Reference (M-Pesa code)" maxLength={60} value={p.reference} onChange={(e) => setPayment(p.key, { reference: e.target.value })} />
                    <Button type="button" size="icon" variant="ghost" aria-label={`Remove payment ${idx + 1}`} onClick={() => setPayments((prev) => prev.filter((x) => x.key !== p.key))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button type="button" variant="outline" size="sm" className={payments.length ? "mt-4" : ""} disabled={payments.length >= 50} onClick={() => setPayments((prev) => [...prev, newPayment()])}>
              <Plus className="h-4 w-4" /> Add payment
            </Button>
          </section>

          {/* extras */}
          <section className={cardClass}>
            <h2 className="mb-4 text-base font-semibold">Details on the PDF</h2>
            <div className="grid gap-4">
              <Field label="How to pay" htmlFor="inv-pay"><Textarea id="inv-pay" maxLength={2000} rows={3} value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} /></Field>
              <Field label="Notes (optional)" htmlFor="inv-notes"><Textarea id="inv-notes" maxLength={2000} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
              <Field label="Terms" htmlFor="inv-terms"><Textarea id="inv-terms" maxLength={2000} rows={2} value={terms} onChange={(e) => setTerms(e.target.value)} /></Field>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className={cardClass}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-text">Summary</p>
            <p className="mt-1 text-sm text-muted-foreground">Next number: <span className="font-semibold text-foreground">{preview}</span></p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Discount</dt>
                <dd><Input aria-label="Discount amount" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" className="h-8 w-28 text-right" value={discount} onChange={(e) => setDiscount(e.target.value)} /></dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" checked={vatOn} onChange={(e) => setVatOn(e.target.checked)} className="h-4 w-4 accent-primary" />
                    VAT ({settings.vatRate || 16}%)
                  </label>
                </dt>
                <dd>{formatMoney(totals.vat)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
              {paidSoFar > 0 && (
                <>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400"><dt>Paid</dt><dd>- {formatMoney(paidSoFar)}</dd></div>
                  <div className="flex justify-between rounded-lg bg-primary/10 px-3 py-2 text-base font-bold"><dt>Balance due</dt><dd>{formatMoney(balanceNow)}</dd></div>
                </>
              )}
            </dl>
            <Button type="submit" className="mt-5 w-full" size="lg" disabled={busy || !ready}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" />}
              Generate invoice PDF
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">The PDF is saved with the invoice. You can view or download it any time from Current invoices.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
