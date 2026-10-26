import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Banknote,
  Ban,
  Download,
  Eye,
  FilePlus2,
  Loader2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  RotateCcw,
  Search,
  Trash2,
  Inbox,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInvoiceData } from "@/lib/invoice-context";
import { deleteInvoice, getInvoicePdf, setInvoiceVoided } from "@/lib/invoice-data";
import {
  balanceDue,
  displayStatus,
  formatMoney,
  parseISODate,
  todayISO,
  type DisplayStatus,
  type Invoice,
} from "@/lib/invoice-types";
import PaymentDialog from "./PaymentDialog";
import { SectionTitle, StatusBadge, downloadBlob, selectClass, showBlob, statusLabel, whatsappDigits } from "./shared";

type Filter = "all" | DisplayStatus;
const FILTERS: Filter[] = ["all", "unpaid", "partial", "overdue", "paid", "void"];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "due", label: "Due date (soonest)" },
  { value: "amount_desc", label: "Amount (highest)" },
  { value: "balance_desc", label: "Balance (highest)" },
  { value: "client", label: "Client A to Z" },
] as const;
type SortKey = (typeof SORTS)[number]["value"];

const dateLabel = (iso: string) => (iso ? format(parseISODate(iso), "d MMM yyyy") : "-");

function SummaryCard({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: "bad" | "good" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone === "bad" ? "text-destructive" : tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
        {value}
      </p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default function InvoiceList() {
  const { invoices, settings, ready, error, stats } = useInvoiceData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [busyId, setBusyId] = useState("");
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [toDelete, setToDelete] = useState<Invoice | null>(null);
  const [toVoid, setToVoid] = useState<Invoice | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withStatus = invoices.map((inv) => ({ inv, status: displayStatus(inv) }));
    const filtered = withStatus.filter(
      ({ inv, status }) =>
        (filter === "all" || status === filter) &&
        (!q ||
          inv.number.toLowerCase().includes(q) ||
          inv.client.name.toLowerCase().includes(q) ||
          inv.client.email.toLowerCase().includes(q) ||
          inv.items.some((it) => it.description.toLowerCase().includes(q))),
    );
    const by = (a: Invoice, b: Invoice) => b.createdAt.getTime() - a.createdAt.getTime();
    filtered.sort((a, b) => {
      switch (sort) {
        case "oldest": return -by(a.inv, b.inv);
        case "due": return a.inv.dueDate.localeCompare(b.inv.dueDate) || by(a.inv, b.inv);
        case "amount_desc": return b.inv.total - a.inv.total;
        case "balance_desc": return balanceDue(b.inv) - balanceDue(a.inv);
        case "client": return a.inv.client.name.localeCompare(b.inv.client.name, undefined, { sensitivity: "base" });
        default: return by(a.inv, b.inv);
      }
    });
    return filtered;
  }, [invoices, query, filter, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: invoices.length };
    for (const inv of invoices) {
      const s = displayStatus(inv);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [invoices]);

  const paidThisMonth = useMemo(() => {
    const month = todayISO().slice(0, 7);
    let total = 0;
    for (const inv of invoices) {
      if (inv.voided) continue;
      for (const p of inv.payments) if (p.date.startsWith(month)) total += p.amount;
    }
    return total;
  }, [invoices]);

  const withPdf = async (inv: Invoice, action: "view" | "download") => {
    setBusyId(inv.id);
    // Open the tab now (inside the click) so the browser's popup blocker allows it.
    const tab = action === "view" ? window.open("", "_blank") : null;
    try {
      const blob = await getInvoicePdf(inv, settings);
      if (action === "view") showBlob(blob, tab);
      else downloadBlob(blob, `${inv.number}.pdf`);
    } catch {
      tab?.close();
      toast.error("Could not open the PDF");
    } finally {
      setBusyId("");
    }
  };

  const message = (inv: Invoice) =>
    `Hello ${inv.client.name.split(" ")[0]}, here is invoice ${inv.number} from ${settings.businessName} for ${formatMoney(inv.total)}, due ${dateLabel(inv.dueDate)}. Balance: ${formatMoney(balanceDue(inv))}.`;

  const share = async (inv: Invoice, via: "whatsapp" | "email") => {
    // The PDF cannot be attached by a link, so it is downloaded for the admin to attach.
    await withPdf(inv, "download");
    if (via === "whatsapp") {
      const to = whatsappDigits(inv.client.phone);
      window.open(`https://wa.me/${to ?? ""}?text=${encodeURIComponent(message(inv))}`, "_blank", "noopener");
    } else {
      window.location.href = `mailto:${inv.client.email}?subject=${encodeURIComponent(`Invoice ${inv.number} from ${settings.businessName}`)}&body=${encodeURIComponent(message(inv) + "\n\nThe PDF is attached.")}`;
    }
    toast.info("The PDF was downloaded. Attach it to your message.");
  };

  const confirmVoid = async () => {
    if (!toVoid) return;
    const inv = toVoid;
    setToVoid(null);
    try {
      await setInvoiceVoided(inv, !inv.voided, settings);
      toast.success(inv.voided ? "Invoice restored" : "Invoice voided");
    } catch {
      toast.error("Could not update the invoice");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const inv = toDelete;
    setToDelete(null);
    try {
      await deleteInvoice(inv.id);
      toast.success(`${inv.number} deleted`);
    } catch {
      toast.error("Could not delete the invoice");
    }
  };

  return (
    <div>
      <SectionTitle
        title="Current invoices"
        description="Every invoice on record, with its saved PDF. Open or download the PDF, record payments and follow up on what is outstanding."
        action={
          <Button asChild>
            <Link to="/admin/invoices/generate">
              <FilePlus2 className="h-4 w-4" /> New invoice
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Outstanding" value={formatMoney(stats.outstanding)} note={`${stats.openCount} open invoice${stats.openCount === 1 ? "" : "s"}`} />
        <SummaryCard label="Overdue" value={formatMoney(stats.overdueAmount)} note={`${stats.overdueCount} invoice${stats.overdueCount === 1 ? "" : "s"}`} tone={stats.overdueCount ? "bad" : undefined} />
        <SummaryCard label="Received this month" value={formatMoney(paidThisMonth)} tone="good" />
        <SummaryCard label="Invoices on record" value={String(invoices.length)} note={`${counts.paid ?? 0} paid`} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search number, client or item"
            aria-label="Search invoices"
            className={`${selectClass} pl-9`}
          />
        </div>
        <select aria-label="Sort invoices" className={`${selectClass} sm:w-52`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f === "all" ? "All" : statusLabel(f)} <span className="opacity-70">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

      {!ready ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" aria-label="Loading" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">{invoices.length ? "No invoices match" : "No invoices yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoices.length ? "Try another search or filter." : "Generate your first invoice and its PDF will be saved here."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ inv, status }) => {
            const bal = balanceDue(inv);
            const busy = busyId === inv.id;
            return (
              <li key={inv.id} className="animate-fade-up rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{inv.number}</h3>
                      <StatusBadge status={status} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-foreground/90">{inv.client.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Issued {dateLabel(inv.issueDate)} - Due {dateLabel(inv.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatMoney(inv.total)}</p>
                    {status !== "paid" && status !== "void" ? (
                      <p className="text-xs font-semibold text-muted-foreground">Balance {formatMoney(bal)}</p>
                    ) : null}
                  </div>
                </div>

                <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                  {inv.items.map((i) => i.description).filter(Boolean).join(", ")}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => void withPdf(inv, "view")} disabled={busy}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />} View PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void withPdf(inv, "download")} disabled={busy}>
                    <Download className="h-4 w-4" /> Download
                  </Button>
                  {!inv.voided && bal > 0 && (
                    <Button size="sm" variant="outline" onClick={() => setPaying(inv)}>
                      <Banknote className="h-4 w-4" /> Record payment
                    </Button>
                  )}
                  {inv.payments.length > 0 && bal <= 0 && (
                    <Button size="sm" variant="ghost" onClick={() => setPaying(inv)}>Payments</Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label={`More actions for ${inv.number}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem className="cursor-pointer" onSelect={() => void share(inv, "whatsapp")}>
                        <MessageCircle className="mr-2 h-4 w-4" /> Send on WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" disabled={!inv.client.email} onSelect={() => void share(inv, "email")}>
                        <Mail className="mr-2 h-4 w-4" /> Send by email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onSelect={() => setToVoid(inv)}>
                        {inv.voided ? <RotateCcw className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />}
                        {inv.voided ? "Restore invoice" : "Void invoice"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onSelect={() => setToDelete(inv)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <PaymentDialog invoice={paying ? invoices.find((i) => i.id === paying.id) ?? null : null} settings={settings} onClose={() => setPaying(null)} />

      <AlertDialog open={!!toVoid} onOpenChange={(o) => !o && setToVoid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toVoid?.voided ? "Restore" : "Void"} {toVoid?.number}?</AlertDialogTitle>
            <AlertDialogDescription>
              {toVoid?.voided
                ? "The invoice counts as outstanding again and its PDF loses the VOID stamp."
                : "A voided invoice stays on record with a VOID stamp on its PDF, but no longer counts as money owed. Use this instead of deleting when an invoice was issued by mistake."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmVoid()}>{toVoid?.voided ? "Restore" : "Void invoice"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.number}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the invoice and its saved PDF. The invoice number is not reused, which leaves a gap in your numbering. Voiding is usually better for accounting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => void confirmDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
