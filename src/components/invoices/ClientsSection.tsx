import { useMemo, useState, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInvoiceData } from "@/lib/invoice-context";
import { deleteClient, saveClient } from "@/lib/invoice-data";
import { balanceDue, displayStatus, formatMoney, type Client, type ClientSnapshot } from "@/lib/invoice-types";
import { Field, SectionTitle, selectClass } from "./shared";

const EMAIL_RE = /^[^@\s/|]+@[^@\s/|]+\.[^@\s/|]+$/;
const blank: ClientSnapshot = { name: "", email: "", phone: "", address: "", kraPin: "" };

export default function ClientsSection() {
  const { clients, invoices, ready } = useInvoiceData();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id?: string; data: ClientSnapshot } | null>(null);
  const [toDelete, setToDelete] = useState<Client | null>(null);
  const [busy, setBusy] = useState(false);

  const totals = useMemo(() => {
    const map = new Map<string, { count: number; owed: number }>();
    for (const inv of invoices) {
      const key = inv.clientId;
      if (!key) continue;
      const t = map.get(key) ?? { count: 0, owed: 0 };
      t.count += 1;
      const s = displayStatus(inv);
      if (s !== "void" && s !== "paid") t.owed += balanceDue(inv);
      map.set(key, t);
    }
    return map;
  }, [invoices]);

  const filtered = clients.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const d = editing.data;
    if (!d.name.trim()) return toast.error("Enter the client's name");
    if (d.email && !EMAIL_RE.test(d.email.trim())) return toast.error("That email address does not look right");
    setBusy(true);
    try {
      await saveClient(
        { name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), address: d.address.trim(), kraPin: d.kraPin.trim() },
        editing.id,
      );
      toast.success(editing.id ? "Client updated" : "Client added");
      setEditing(null);
    } catch {
      toast.error("Could not save the client");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const c = toDelete;
    setToDelete(null);
    try {
      await deleteClient(c.id);
      toast.success("Client deleted");
    } catch {
      toast.error("Could not delete the client");
    }
  };

  const patch = (p: Partial<ClientSnapshot>) => setEditing((s) => (s ? { ...s, data: { ...s.data, ...p } } : s));

  return (
    <div>
      <SectionTitle
        title="Clients"
        description="Saved billing details, so you can pick a client instead of retyping them. Editing a client never changes invoices you have already issued."
        action={<Button onClick={() => setEditing({ data: blank })}><Plus className="h-4 w-4" /> Add client</Button>}
      />

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients" aria-label="Search clients" className={`${selectClass} pl-9`} />
      </div>

      {!ready ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" aria-label="Loading" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">{clients.length ? "No clients match" : "No saved clients yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Clients are also saved automatically when you generate an invoice for a new one.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => {
            const t = totals.get(c.id);
            return (
              <li key={c.id} className="animate-fade-up rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{c.name}</h3>
                    <p className="mt-0.5 break-all text-xs text-muted-foreground">{[c.email, c.phone].filter(Boolean).join("  |  ") || "No contact details"}</p>
                    {c.address && <p className="mt-0.5 text-xs text-muted-foreground">{c.address}</p>}
                  </div>
                  <div className="flex shrink-0">
                    <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => setEditing({ id: c.id, data: { name: c.name, email: c.email, phone: c.phone, address: c.address, kraPin: c.kraPin } })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={`Delete ${c.name}`} onClick={() => setToDelete(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t ? `${t.count} invoice${t.count === 1 ? "" : "s"}` : "No invoices yet"}
                  {t && t.owed > 0 && <span className="ml-2 font-semibold text-destructive">Owes {formatMoney(t.owed)}</span>}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit client" : "Add client"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={submit} className="space-y-3">
              <Field label="Name" htmlFor="cl-name"><Input id="cl-name" value={editing.data.name} maxLength={120} onChange={(e) => patch({ name: e.target.value })} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email" htmlFor="cl-email"><Input id="cl-email" type="email" value={editing.data.email} maxLength={120} onChange={(e) => patch({ email: e.target.value })} /></Field>
                <Field label="Phone" htmlFor="cl-phone"><Input id="cl-phone" type="tel" value={editing.data.phone} maxLength={30} onChange={(e) => patch({ phone: e.target.value })} /></Field>
              </div>
              <Field label="Address" htmlFor="cl-address"><Input id="cl-address" value={editing.data.address} maxLength={160} onChange={(e) => patch({ address: e.target.value })} /></Field>
              <Field label="KRA PIN (optional)" htmlFor="cl-pin"><Input id="cl-pin" value={editing.data.kraPin} maxLength={20} onChange={(e) => patch({ kraPin: e.target.value.toUpperCase() })} /></Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save client</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Their existing invoices stay on record. Only the saved client entry is removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => void confirmDelete()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
