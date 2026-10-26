import { NavLink, Route, Routes } from "react-router-dom";
import { FilePlus2, FileText, Settings2, Users, type LucideIcon } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import RequireAdmin from "@/components/admin/RequireAdmin";
import InvoiceList from "@/components/invoices/InvoiceList";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import ClientsSection from "@/components/invoices/ClientsSection";
import SettingsSection from "@/components/invoices/SettingsSection";
import { InvoiceDataProvider, useInvoiceData } from "@/lib/invoice-context";
import { formatMoney } from "@/lib/invoice-types";

interface Section {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const SECTIONS: Section[] = [
  { to: "/admin/invoices", label: "Current invoices", icon: FileText, end: true },
  { to: "/admin/invoices/generate", label: "Generate invoice", icon: FilePlus2 },
  { to: "/admin/invoices/clients", label: "Clients", icon: Users },
  { to: "/admin/invoices/settings", label: "Invoice settings", icon: Settings2 },
];

function SideNav() {
  const { stats, invoices } = useInvoiceData();
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-text lg:block">
        Invoices
      </p>
      <nav
        aria-label="Invoice sections"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {SECTIONS.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            end={s.end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <s.icon className="h-4 w-4" />
            {s.label}
            {s.to === "/admin/invoices" && stats.openCount > 0 && (
              <span className="ml-auto rounded-full bg-gold/25 px-2 py-0.5 text-[11px] font-bold text-gold-text">
                {stats.openCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 hidden rounded-2xl border border-border bg-card p-4 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outstanding</p>
        <p className="mt-1 text-lg font-bold text-foreground">{formatMoney(stats.outstanding)}</p>
        {stats.overdueCount > 0 && (
          <p className="mt-1 text-xs font-semibold text-destructive">
            {stats.overdueCount} overdue, {formatMoney(stats.overdueAmount)}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{invoices.length} invoice{invoices.length === 1 ? "" : "s"} on record</p>
      </div>
    </aside>
  );
}

export default function AdminInvoices() {
  return (
    <RequireAdmin>
      <InvoiceDataProvider>
        <PageShell>
          <div className="site-container grid gap-6 py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10 lg:py-10">
            <SideNav />
            <div className="min-w-0">
              <Routes>
                <Route index element={<InvoiceList />} />
                <Route path="generate" element={<InvoiceForm />} />
                <Route path="clients" element={<ClientsSection />} />
                <Route path="settings" element={<SettingsSection />} />
                <Route path="*" element={<InvoiceList />} />
              </Routes>
            </div>
          </div>
        </PageShell>
      </InvoiceDataProvider>
    </RequireAdmin>
  );
}
