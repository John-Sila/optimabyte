import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInvoiceData } from "@/lib/invoice-context";
import { saveSettings } from "@/lib/invoice-data";
import { formatInvoiceNumber, todayISO, type InvoiceSettings } from "@/lib/invoice-types";
import { Field, SectionTitle, cardClass } from "./shared";

export default function SettingsSection() {
  const { settings, ready } = useInvoiceData();
  const [form, setForm] = useState<InvoiceSettings>(settings);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  // Follow the saved settings until the admin starts editing.
  useEffect(() => {
    if (!dirty) setForm(settings);
  }, [settings, dirty]);

  const set = <K extends keyof InvoiceSettings>(key: K, value: InvoiceSettings[K]) => {
    setDirty(true);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) return toast.error("Enter your business name");
    if (!(form.dueDays >= 0 && form.dueDays <= 365)) return toast.error("Payment terms must be between 0 and 365 days");
    if (!(form.vatRate >= 0 && form.vatRate <= 100)) return toast.error("VAT must be between 0 and 100");
    if (!(form.nextNumber >= 1)) return toast.error("The next invoice number must be 1 or more");
    setBusy(true);
    try {
      await saveSettings({ ...form, businessName: form.businessName.trim(), prefix: form.prefix.trim(), nextNumber: Math.floor(form.nextNumber) });
      setDirty(false);
      toast.success("Invoice settings saved");
    } catch {
      toast.error("Could not save the settings");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <SectionTitle title="Invoice settings" description="Your business details, numbering and the defaults used for every new invoice. Issued invoices keep the values they were created with." />
      <form onSubmit={submit} className="max-w-3xl space-y-6">
        <section className={cardClass}>
          <h2 className="mb-4 text-base font-semibold">Business details on the PDF</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" htmlFor="st-name" className="sm:col-span-2"><Input id="st-name" value={form.businessName} maxLength={120} onChange={(e) => set("businessName", e.target.value)} /></Field>
            <Field label="Address" htmlFor="st-address" className="sm:col-span-2"><Input id="st-address" value={form.address} maxLength={160} onChange={(e) => set("address", e.target.value)} /></Field>
            <Field label="Email" htmlFor="st-email"><Input id="st-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Phone" htmlFor="st-phone"><Input id="st-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="KRA PIN (optional)" htmlFor="st-pin"><Input id="st-pin" value={form.kraPin} maxLength={20} onChange={(e) => set("kraPin", e.target.value.toUpperCase())} /></Field>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="mb-4 text-base font-semibold">Numbering and defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number prefix" htmlFor="st-prefix" hint={`Next invoice: ${formatInvoiceNumber(form.prefix, todayISO(), form.nextNumber)}`}>
              <Input id="st-prefix" value={form.prefix} maxLength={12} onChange={(e) => set("prefix", e.target.value.toUpperCase())} />
            </Field>
            <Field label="Next invoice number" htmlFor="st-next" hint="Counts up automatically. Change it only to continue an existing sequence.">
              <Input id="st-next" type="number" min="1" step="1" value={form.nextNumber} onChange={(e) => set("nextNumber", Number(e.target.value))} />
            </Field>
            <Field label="Payment terms (days until due)" htmlFor="st-days"><Input id="st-days" type="number" min="0" max="365" value={form.dueDays} onChange={(e) => set("dueDays", Number(e.target.value))} /></Field>
            <Field label="VAT rate (%)" htmlFor="st-vat" hint="Above 0 means VAT is switched on by default for new invoices. You can still toggle it per invoice."><Input id="st-vat" type="number" min="0" max="100" step="0.01" value={form.vatRate} onChange={(e) => set("vatRate", Number(e.target.value))} /></Field>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="mb-4 text-base font-semibold">Default wording</h2>
          <div className="grid gap-4">
            <Field label="How to pay" htmlFor="st-pay" hint="Shown on every invoice. Put your M-Pesa Paybill or Till and bank details here."><Textarea id="st-pay" rows={4} value={form.paymentDetails} onChange={(e) => set("paymentDetails", e.target.value)} /></Field>
            <Field label="Terms" htmlFor="st-terms"><Textarea id="st-terms" rows={3} value={form.terms} onChange={(e) => set("terms", e.target.value)} /></Field>
            <Field label="Footer line" htmlFor="st-footer"><Input id="st-footer" value={form.footer} maxLength={120} onChange={(e) => set("footer", e.target.value)} /></Field>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy || !ready || !dirty}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
          </Button>
          {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        </div>
      </form>
    </div>
  );
}
