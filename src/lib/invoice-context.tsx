import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { subscribeClients, subscribeInvoices, subscribeSettings } from "./invoice-data";
import {
  DEFAULT_SETTINGS,
  balanceDue,
  displayStatus,
  type Client,
  type Invoice,
  type InvoiceSettings,
} from "./invoice-types";

interface InvoiceData {
  invoices: Invoice[];
  clients: Client[];
  settings: InvoiceSettings;
  /** True once the first snapshot of invoices has arrived. */
  ready: boolean;
  error: string;
  stats: {
    outstanding: number;
    overdueAmount: number;
    overdueCount: number;
    openCount: number;
  };
}

const Ctx = createContext<InvoiceData | null>(null);

/** One set of live subscriptions shared by every section, so switching sections never refetches. */
export function InvoiceDataProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fail = (e: Error) => {
      setError(
        /permission|insufficient/i.test(e.message)
          ? "Firestore refused the request. Publish the invoice rules from firestore.rules.invoices.txt."
          : e.message || "Could not load invoices",
      );
      setReady(true);
    };
    const offInvoices = subscribeInvoices((rows) => {
      setInvoices(rows);
      setError("");
      setReady(true);
    }, fail);
    const offClients = subscribeClients(setClients, fail);
    const offSettings = subscribeSettings(setSettings, fail);
    return () => {
      offInvoices();
      offClients();
      offSettings();
    };
  }, []);

  const stats = useMemo(() => {
    let outstanding = 0;
    let overdueAmount = 0;
    let overdueCount = 0;
    let openCount = 0;
    for (const inv of invoices) {
      const s = displayStatus(inv);
      if (s === "void" || s === "paid") continue;
      const bal = balanceDue(inv);
      outstanding += bal;
      openCount += 1;
      if (s === "overdue") {
        overdueAmount += bal;
        overdueCount += 1;
      }
    }
    return { outstanding, overdueAmount, overdueCount, openCount };
  }, [invoices]);

  const value = useMemo(
    () => ({ invoices, clients, settings, ready, error, stats }),
    [invoices, clients, settings, ready, error, stats],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInvoiceData(): InvoiceData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useInvoiceData must be used inside InvoiceDataProvider");
  return v;
}
