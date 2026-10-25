import { useEffect, useMemo, useState } from "react";
import {
  endOfDay,
  format,
  formatDistanceToNow,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import {
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Download,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  Search,
  Timer,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import RequireAdmin from "@/components/admin/RequireAdmin";
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
import { deleteReport, setReportStatus, subscribeReports, type Report } from "@/lib/admin-data";
import type { ReportStatus } from "@/lib/reports";
import { whatsappLink } from "@/lib/site-config";

// ------------------------------------------------------------------ options

const SORTS = [
  { value: "oldest", label: "Oldest first" },
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name A to Z" },
  { value: "name_desc", label: "Name Z to A" },
  { value: "service_asc", label: "Service A to Z" },
  { value: "service_desc", label: "Service Z to A" },
  { value: "email_asc", label: "Email A to Z" },
  { value: "email_desc", label: "Email Z to A" },
  { value: "status", label: "Status (pending first)" },
] as const;
type SortKey = (typeof SORTS)[number]["value"];

const GROUPS = [
  { value: "none", label: "No grouping" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "service", label: "Service" },
  { value: "status", label: "Status" },
] as const;
type GroupKey = (typeof GROUPS)[number]["value"];

interface StatusMeta {
  value: ReportStatus;
  label: string;
  badge: string;
  /** Left accent stripe on the card. */
  stripe: string;
  /** Selected-state style for the filter chip and the status selector. */
  chip: string;
  icon: LucideIcon;
}

const STATUSES: StatusMeta[] = [
  {
    value: "pending",
    label: "Pending",
    badge: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-400",
    stripe: "border-l-amber-500",
    chip: "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400",
    icon: CircleDashed,
  },
  {
    value: "in_progress",
    label: "In progress",
    badge: "bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/30 dark:text-sky-300",
    stripe: "border-l-sky-500",
    chip: "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300",
    icon: Timer,
  },
  {
    value: "completed",
    label: "Completed",
    badge: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400",
    stripe: "border-l-emerald-500",
    chip: "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
];
const STATUS_ORDER: Record<ReportStatus, number> = { pending: 0, in_progress: 1, completed: 2 };
const statusMeta = (s: ReportStatus): StatusMeta => STATUSES.find((x) => x.value === s) ?? STATUSES[0];

// ------------------------------------------------------------------ helpers

const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

function sortReports(list: Report[], sort: SortKey): Report[] {
  const out = [...list];
  const byDate = (a: Report, b: Report) => a.createdAt.getTime() - b.createdAt.getTime();
  switch (sort) {
    case "oldest": return out.sort(byDate);
    case "newest": return out.sort((a, b) => byDate(b, a));
    case "name_asc": return out.sort((a, b) => cmp(a.name, b.name) || byDate(a, b));
    case "name_desc": return out.sort((a, b) => cmp(b.name, a.name) || byDate(a, b));
    case "service_asc": return out.sort((a, b) => cmp(a.service, b.service) || byDate(a, b));
    case "service_desc": return out.sort((a, b) => cmp(b.service, a.service) || byDate(a, b));
    case "email_asc": return out.sort((a, b) => cmp(a.email, b.email) || byDate(a, b));
    case "email_desc": return out.sort((a, b) => cmp(b.email, a.email) || byDate(a, b));
    case "status": return out.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || byDate(a, b));
  }
}

interface Group {
  key: string;
  label: string;
  sortValue: number | string;
  items: Report[];
}

function groupReports(list: Report[], by: GroupKey): Group[] {
  if (by === "none") return [{ key: "all", label: "All requests", sortValue: 0, items: list }];
  const map = new Map<string, Group>();
  for (const r of list) {
    let key: string;
    let label: string;
    let sortValue: number | string;
    switch (by) {
      case "day": {
        const d = startOfDay(r.createdAt);
        key = String(d.getTime());
        label = format(d, "EEEE, d MMM yyyy");
        sortValue = d.getTime();
        break;
      }
      case "week": {
        const d = startOfWeek(r.createdAt, { weekStartsOn: 1 });
        key = String(d.getTime());
        label = `Week of ${format(d, "d MMM yyyy")}`;
        sortValue = d.getTime();
        break;
      }
      case "month": {
        const d = startOfMonth(r.createdAt);
        key = String(d.getTime());
        label = format(d, "MMMM yyyy");
        sortValue = d.getTime();
        break;
      }
      case "year": {
        const d = startOfYear(r.createdAt);
        key = String(d.getTime());
        label = format(d, "yyyy");
        sortValue = d.getTime();
        break;
      }
      case "service":
        key = r.service;
        label = r.service || "No service";
        sortValue = r.service.toLowerCase();
        break;
      default:
        key = r.status;
        label = statusMeta(r.status).label;
        sortValue = STATUS_ORDER[r.status];
    }
    const g = map.get(key);
    if (g) g.items.push(r);
    else map.set(key, { key, label, sortValue, items: [r] });
  }
  return [...map.values()];
}

function orderGroups(groups: Group[], by: GroupKey, sort: SortKey): Group[] {
  const out = [...groups];
  const dateGroup = by === "day" || by === "week" || by === "month" || by === "year";
  const desc =
    sort === "newest" ||
    (!dateGroup && (sort === "name_desc" || sort === "service_desc" || sort === "email_desc"));
  out.sort((a, b) => {
    const r =
      typeof a.sortValue === "number" && typeof b.sortValue === "number"
        ? a.sortValue - b.sortValue
        : cmp(String(a.sortValue), String(b.sortValue));
    return desc ? -r : r;
  });
  return out;
}

function whatsappTarget(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return null;
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

function csvCell(v: string): string {
  const safe = /^[=+\-@]/.test(v) ? `'${v}` : v; // neutralise spreadsheet formulas
  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: Report[]) {
  const head = ["Date", "Name", "Email", "Phone", "Service", "Status", "Message", "Language", "Timezone", "Screen", "Page", "Referrer"];
  const lines = [head.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        format(r.createdAt, "yyyy-MM-dd HH:mm"),
        r.name, r.email, r.phone, r.service, statusMeta(r.status).label, r.message,
        r.language, r.timezone, r.screen, r.page, r.referrer,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `optimabyte-requests-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------------------------------------------------------ UI

const selectClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function ReportCard({ report, onDelete }: { report: Report; onDelete: (r: Report) => void }) {
  const [open, setOpen] = useState(false);
  const wa = whatsappTarget(report.phone);
  const meta = statusMeta(report.status);

  const changeStatus = async (status: ReportStatus) => {
    try {
      await setReportStatus(report.id, status);
    } catch {
      toast.error("Could not update the status");
    }
  };

  const mailto = `mailto:${report.email}?subject=${encodeURIComponent(
    `Re: your ${report.service} request to OptimaByte`,
  )}&body=${encodeURIComponent(`Hello ${report.name.split(" ")[0]},\n\nThank you for contacting OptimaByte.\n\n`)}`;

  return (
    <article className={`animate-fade-up rounded-2xl border border-l-4 border-border bg-card p-5 transition-shadow hover:shadow-md ${meta.stripe} ${report.status === "completed" ? "opacity-90" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{report.name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}>
              <meta.icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <a href={mailto} className="break-all hover:text-primary">{report.email}</a>
            {report.phone && <a href={`tel:${report.phone}`} className="hover:text-primary">{report.phone}</a>}
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{format(report.createdAt, "d MMM yyyy, HH:mm")}</p>
          <p>{formatDistanceToNow(report.createdAt, { addSuffix: true })}</p>
        </div>
      </div>

      <p className="mt-3 inline-block rounded-md bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-text">
        {report.service}
      </p>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
        {report.message}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <a href={mailto}>
            <Mail className="h-4 w-4" /> Reply
          </a>
        </Button>
        {wa && (
          <Button asChild size="sm" variant="outline">
            <a
              href={whatsappLink(`Hello ${report.name.split(" ")[0]}, this is OptimaByte about your ${report.service} request.`).replace(
                /wa\.me\/\d+/,
                `wa.me/${wa}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
        )}
        <div role="group" aria-label={`Status for ${report.name}`} className="inline-flex overflow-hidden rounded-lg border border-border">
          {STATUSES.map((st) => (
            <button
              key={st.value}
              type="button"
              aria-pressed={report.status === st.value}
              onClick={() => report.status !== st.value && void changeStatus(st.value)}
              className={`inline-flex h-9 items-center gap-1 border-l border-border px-2.5 text-xs font-semibold transition first:border-l-0 ${
                report.status === st.value ? st.chip : "bg-background text-muted-foreground hover:bg-secondary"
              }`}
            >
              <st.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{st.label}</span>
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          Device details
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-destructive hover:text-destructive"
          onClick={() => onDelete(report)}
          aria-label={`Delete request from ${report.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <dl className="mt-4 animate-fade-up grid gap-x-6 gap-y-2 rounded-xl bg-secondary/50 p-4 text-xs sm:grid-cols-2">
          {[
            ["Device ID", report.deviceId],
            ["Fingerprint", report.fingerprint.slice(0, 16) + "..."],
            ["Browser", report.userAgent],
            ["Language", report.language],
            ["Time zone", report.timezone],
            ["Screen", report.screen],
            ["Sent from page", report.page],
            ["Came from", report.referrer || "Direct"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="font-semibold text-foreground">{k}</dt>
              <dd className="break-all text-muted-foreground">{v || "Unknown"}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function ReportsInner() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("oldest");
  const [group, setGroup] = useState<GroupKey>("none");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [service, setService] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    return subscribeReports(
      (list) => {
        setReports(list);
        setError("");
      },
      (err) => {
        const code = (err as { code?: string }).code ?? "";
        setError(
          code.includes("permission-denied")
            ? "Firestore refused the request. Deploy firestore.rules and make sure you are signed in as admin."
            : "Could not load requests. Check your connection.",
        );
        setReports((prev) => prev ?? []);
      },
    );
  }, []);

  const services = useMemo(
    () => [...new Set((reports ?? []).map((r) => r.service))].sort(cmp),
    [reports],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromMs = from ? startOfDay(new Date(from)).getTime() : -Infinity;
    const toMs = to ? endOfDay(new Date(to)).getTime() : Infinity;
    return (reports ?? []).filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (service !== "all" && r.service !== service) return false;
      const t = r.createdAt.getTime();
      if (t < fromMs || t > toMs) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
  }, [reports, search, status, service, from, to]);

  const groups = useMemo(
    () => orderGroups(groupReports(sortReports(filtered, sort), group), group, sort),
    [filtered, sort, group],
  );

  // Within a group, keep the chosen sort. Date grouping with name sorting still works.
  const stats = useMemo(() => {
    const all = reports ?? [];
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
    return [
      { label: "Total", value: all.length },
      { label: "Pending", value: all.filter((r) => r.status === "pending").length, color: "text-amber-600 dark:text-amber-400" },
      { label: "In progress", value: all.filter((r) => r.status === "in_progress").length, color: "text-sky-600 dark:text-sky-300" },
      { label: "Completed", value: all.filter((r) => r.status === "completed").length, color: "text-emerald-600 dark:text-emerald-400" },
      { label: "This week", value: all.filter((r) => r.createdAt.getTime() >= weekStart).length },
    ];
  }, [reports]);

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteReport(toDelete.id);
      toast.success("Request deleted");
      setToDelete(null);
    } catch {
      toast.error("Could not delete the request");
    } finally {
      setDeleting(false);
    }
  };

  const filtersActive = search || status !== "all" || service !== "all" || from || to;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin"
        title="Requests"
        description="Every request sent through the website form. Sort, group, search and follow up."
      />

      <section className="py-10 md:py-14">
        <div className="site-container space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-3xl font-bold ${s.color ?? "text-foreground"}`}>{reports ? s.value : "-"}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, service or message"
                aria-label="Search requests"
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
              <span className="mr-1 text-xs font-medium text-muted-foreground">Status</span>
              {[{ value: "all" as const, label: "All", chip: "border-primary bg-primary/10 text-foreground", icon: Inbox }, ...STATUSES].map((st) => {
                const count = st.value === "all" ? (reports?.length ?? 0) : (reports ?? []).filter((r) => r.status === st.value).length;
                const active = status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStatus(st.value)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      active ? st.chip : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <st.icon className="h-4 w-4" />
                    {st.label}
                    <span className="rounded-full bg-background/60 px-1.5 text-xs">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                Sort by
                <select className={`${selectClass} w-full`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                Group by
                <select className={`${selectClass} w-full`} value={group} onChange={(e) => setGroup(e.target.value as GroupKey)}>
                  {GROUPS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                Status
                <select className={`${selectClass} w-full`} value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | "all")}>
                  <option value="all">All statuses</option>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                Service
                <select className={`${selectClass} w-full`} value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="all">All services</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                From
                <input type="date" className={`${selectClass} w-full`} value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="space-y-1 text-xs font-medium text-muted-foreground">
                To
                <input type="date" className={`${selectClass} w-full`} value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                {reports?.length ?? 0}
              </p>
              <div className="flex gap-2">
                {filtersActive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSearch(""); setStatus("all"); setService("all"); setFrom(""); setTo("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
                {group !== "none" && groups.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCollapsed(collapsed.size ? new Set() : new Set(groups.map((g) => g.key)))
                    }
                  >
                    {collapsed.size ? "Expand all" : "Collapse all"}
                  </Button>
                )}
                <Button size="sm" variant="outline" disabled={!filtered.length} onClick={() => downloadCsv(sortReports(filtered, sort))}>
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {reports === null ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading requests" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">
                {reports.length ? "No requests match these filters" : "No requests yet"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {reports.length ? "Try clearing a filter." : "New requests from the Contact form will appear here live."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map((g) => {
                const isCollapsed = collapsed.has(g.key);
                return (
                  <div key={g.key}>
                    {group !== "none" && (
                      <button
                        onClick={() => toggle(g.key)}
                        aria-expanded={!isCollapsed}
                        className="mb-4 flex w-full items-center gap-3 border-b border-border pb-2 text-left"
                      >
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                        <span className="text-lg font-semibold text-foreground">{g.label}</span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          {g.items.length}
                        </span>
                      </button>
                    )}
                    {!isCollapsed && (
                      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                        {g.items.map((r) => (
                          <ReportCard key={r.id} report={r} onDelete={setToDelete} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this request?</AlertDialogTitle>
            <AlertDialogDescription>
              The request from {toDelete?.name} will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

export default function Reports() {
  return (
    <RequireAdmin>
      <ReportsInner />
    </RequireAdmin>
  );
}
