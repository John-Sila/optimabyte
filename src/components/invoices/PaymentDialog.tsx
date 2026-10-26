import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addPayment, removePayment } from "@/lib/invoice-data";
import {
  PAYMENT_METHODS,
  balanceDue,
  formatMoney,
  parseISODate,
  todayISO,
  type Invoice,
  type InvoiceSettings,
} from "@/lib/invoice-types";
import { Field, selectClass } from "./shared";

interface Props {
  invoice: Invoice | null;
  settings: InvoiceSettings;
  onClose: () => void;
}

export default function PaymentDialog({ invoice, settings, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(todayISO());
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (invoice) {
      setAmount(String(balanceDue(invoice) || ""));
      setMethod(PAYMENT_METHODS[0]);
      setDate(todayISO());
      setReference("");
    }
  }, [invoice?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!invoice) return null;
  const balance = balanceDue(invoice);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) return toast.error("Enter the amount received");
    if (value > balance + 0.005) return toast.error(`That is more than the balance of ${formatMoney(balance)}`);
    setBusy(true);
    try {
      await addPayment(invoice, { amount: value, method, date, reference: reference.trim() }, settings);
      toast.success("Payment recorded");
      onClose();
    } catch {
      toast.error("Could not record the payment");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await removePayment(invoice, id, settings);
      toast.success("Payment removed");
    } catch {
      toast.error("Could not remove the payment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payments for {invoice.number}</DialogTitle>
          <DialogDescription>
            Total {formatMoney(invoice.total)}. Balance {formatMoney(balance)}.
          </DialogDescription>
        </DialogHeader>

        {invoice.payments.length > 0 && (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {invoice.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">{formatMoney(p.amount)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {format(parseISODate(p.date), "d MMM yyyy")} - {p.method}
                    {p.reference ? ` - ${p.reference}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={busy}
                  aria-label="Remove payment"
                  onClick={() => void remove(p.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {balance > 0 && !invoice.voided ? (
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount received (KES)" htmlFor="pay-amount">
                <Input id="pay-amount" type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <Field label="Date" htmlFor="pay-date">
                <Input id="pay-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Method" htmlFor="pay-method">
                <select id="pay-method" className={selectClass} value={method} onChange={(e) => setMethod(e.target.value)}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reference" htmlFor="pay-ref" hint="M-Pesa code, cheque no.">
                <Input id="pay-ref" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={60} />
              </Field>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Record payment
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
