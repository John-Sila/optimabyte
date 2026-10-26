// Admin-only Firestore access for invoices. Imported only from the lazy-loaded
// invoice screens, same as admin-data.ts.
//
// Collections (all admin-only, see firestore.rules.invoices.txt):
//   invoices/{id}         the invoice itself (client snapshot, items, totals, payments)
//   invoicePdfs/{id}      { data: <base64 PDF> }, kept apart so the list stays light
//   invoiceClients/{id}   saved clients
//   invoiceSettings/main  business details, defaults and the running invoice number

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { prepareFirebase } from "./firebase";
import {
  DEFAULT_SETTINGS,
  calcTotals,
  formatInvoiceNumber,
  type Client,
  type ClientSnapshot,
  type Invoice,
  type InvoiceSettings,
  type LineItem,
  type Payment,
} from "./invoice-types";
import { base64ToBlob, blobToBase64, buildInvoicePdf } from "./invoice-pdf";

const dbReady = async () => getFirestore(await prepareFirebase());

function toDate(value: unknown): Date {
  const ts = value as Timestamp | null | undefined;
  return ts && typeof ts.toDate === "function" ? ts.toDate() : new Date();
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

// ------------------------------------------------------------------ settings

function mergeSettings(raw: Record<string, unknown> | undefined): InvoiceSettings {
  const d = DEFAULT_SETTINGS;
  const r = raw ?? {};
  return {
    businessName: str(r.businessName) || d.businessName,
    address: typeof r.address === "string" ? r.address : d.address,
    email: typeof r.email === "string" ? r.email : d.email,
    phone: typeof r.phone === "string" ? r.phone : d.phone,
    kraPin: typeof r.kraPin === "string" ? r.kraPin : d.kraPin,
    prefix: typeof r.prefix === "string" ? r.prefix : d.prefix,
    nextNumber: Math.max(1, Math.floor(num(r.nextNumber)) || d.nextNumber),
    dueDays: typeof r.dueDays === "number" ? r.dueDays : d.dueDays,
    vatRate: typeof r.vatRate === "number" ? r.vatRate : d.vatRate,
    paymentDetails: typeof r.paymentDetails === "string" ? r.paymentDetails : d.paymentDetails,
    terms: typeof r.terms === "string" ? r.terms : d.terms,
    footer: typeof r.footer === "string" ? r.footer : d.footer,
  };
}

export function subscribeSettings(
  onData: (s: InvoiceSettings) => void,
  onError: (e: Error) => void,
): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void dbReady()
    .then((db) => {
      if (cancelled) return;
      unsub = onSnapshot(
        doc(db, "invoiceSettings", "main"),
        (snap) => onData(mergeSettings(snap.data())),
        onError,
      );
    })
    .catch((e) => onError(e as Error));
  return () => {
    cancelled = true;
    unsub?.();
  };
}

export async function saveSettings(s: InvoiceSettings): Promise<void> {
  await setDoc(doc(await dbReady(), "invoiceSettings", "main"), s, { merge: true });
}

// ------------------------------------------------------------------ clients

export function subscribeClients(
  onData: (rows: Client[]) => void,
  onError: (e: Error) => void,
): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void dbReady()
    .then((db) => {
      if (cancelled) return;
      unsub = onSnapshot(
        query(collection(db, "invoiceClients"), orderBy("name", "asc")),
        (snap) =>
          onData(
            snap.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                name: str(x.name),
                email: str(x.email),
                phone: str(x.phone),
                address: str(x.address),
                kraPin: str(x.kraPin),
                createdAt: toDate(x.createdAt),
              } satisfies Client;
            }),
          ),
        onError,
      );
    })
    .catch((e) => onError(e as Error));
  return () => {
    cancelled = true;
    unsub?.();
  };
}

/** Creates a client, or updates it when `id` is given. Returns the client id. */
export async function saveClient(data: ClientSnapshot, id?: string): Promise<string> {
  const db = await dbReady();
  if (id) {
    await updateDoc(doc(db, "invoiceClients", id), { ...data });
    return id;
  }
  const ref = await addDoc(collection(db, "invoiceClients"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(await dbReady(), "invoiceClients", id));
}

// ------------------------------------------------------------------ invoices

function readInvoice(id: string, x: Record<string, unknown>): Invoice {
  const c = (x.client ?? {}) as Record<string, unknown>;
  return {
    id,
    number: str(x.number),
    clientId: str(x.clientId),
    client: {
      name: str(c.name),
      email: str(c.email),
      phone: str(c.phone),
      address: str(c.address),
      kraPin: str(c.kraPin),
    },
    issueDate: str(x.issueDate),
    dueDate: str(x.dueDate),
    items: Array.isArray(x.items) ? (x.items as LineItem[]) : [],
    discount: num(x.discount),
    vatRate: num(x.vatRate),
    notes: str(x.notes),
    terms: str(x.terms),
    paymentDetails: str(x.paymentDetails),
    subtotal: num(x.subtotal),
    vat: num(x.vat),
    total: num(x.total),
    payments: Array.isArray(x.payments) ? (x.payments as Payment[]) : [],
    voided: x.voided === true,
    pdfSize: num(x.pdfSize),
    createdAt: toDate(x.createdAt),
  };
}

export function subscribeInvoices(
  onData: (rows: Invoice[]) => void,
  onError: (e: Error) => void,
): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void dbReady()
    .then((db) => {
      if (cancelled) return;
      unsub = onSnapshot(
        query(collection(db, "invoices"), orderBy("createdAt", "desc")),
        (snap) => onData(snap.docs.map((d) => readInvoice(d.id, d.data()))),
        onError,
      );
    })
    .catch((e) => onError(e as Error));
  return () => {
    cancelled = true;
    unsub?.();
  };
}

export interface NewInvoiceInput {
  clientId: string;
  client: ClientSnapshot;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  discount: number;
  vatRate: number;
  notes: string;
  terms: string;
  paymentDetails: string;
}

/**
 * Reserves the next invoice number and saves the invoice in one transaction (so two
 * invoices can never share a number), then builds the PDF and stores it with the record.
 * If only the PDF step fails, the invoice is still saved and the PDF can be rebuilt later.
 */
export async function createInvoice(
  input: NewInvoiceInput,
  settings: InvoiceSettings,
): Promise<{ invoice: Invoice; pdfStored: boolean }> {
  const db = await dbReady();
  const ref = doc(collection(db, "invoices"));
  const settingsRef = doc(db, "invoiceSettings", "main");
  const totals = calcTotals(input.items, input.discount, input.vatRate);

  const number = await runTransaction(db, async (tx) => {
    const snap = await tx.get(settingsRef);
    const current = mergeSettings(snap.data());
    const n = formatInvoiceNumber(current.prefix, input.issueDate, current.nextNumber);
    tx.set(settingsRef, { nextNumber: current.nextNumber + 1 }, { merge: true });
    tx.set(ref, {
      number: n,
      clientId: input.clientId,
      client: input.client,
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      items: input.items,
      discount: totals.discount,
      vatRate: input.vatRate,
      notes: input.notes,
      terms: input.terms,
      paymentDetails: input.paymentDetails,
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      payments: [],
      voided: false,
      pdfSize: 0,
      createdAt: serverTimestamp(),
    });
    return n;
  });

  const invoice: Invoice = {
    id: ref.id,
    number,
    clientId: input.clientId,
    client: input.client,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    items: input.items,
    discount: totals.discount,
    vatRate: input.vatRate,
    notes: input.notes,
    terms: input.terms,
    paymentDetails: input.paymentDetails,
    subtotal: totals.subtotal,
    vat: totals.vat,
    total: totals.total,
    payments: [],
    voided: false,
    pdfSize: 0,
    createdAt: new Date(),
  };

  try {
    await storeInvoicePdf(invoice, settings);
    return { invoice, pdfStored: true };
  } catch (err) {
    console.warn("Invoice saved but its PDF could not be stored", err);
    return { invoice, pdfStored: false };
  }
}

/** Builds the PDF from the invoice's current data and saves it with the record. */
export async function storeInvoicePdf(invoice: Invoice, settings: InvoiceSettings): Promise<Blob> {
  const blob = await buildInvoicePdf(invoice, settings);
  const data = await blobToBase64(blob);
  // Firestore documents are capped at 1 MB. A text invoice is a few dozen KB, so this is a safety net only.
  if (data.length > 900_000) throw new Error("pdf-too-large");
  const db = await dbReady();
  await setDoc(doc(db, "invoicePdfs", invoice.id), { data, updatedAt: serverTimestamp() });
  await updateDoc(doc(db, "invoices", invoice.id), { pdfSize: blob.size });
  return blob;
}

/** The stored PDF if there is one, otherwise a freshly built one (which is then stored). */
export async function getInvoicePdf(invoice: Invoice, settings: InvoiceSettings): Promise<Blob> {
  const snap = await getDoc(doc(await dbReady(), "invoicePdfs", invoice.id));
  const data = snap.exists() ? (snap.data().data as string | undefined) : undefined;
  if (data) return base64ToBlob(data);
  try {
    return await storeInvoicePdf(invoice, settings);
  } catch {
    return buildInvoicePdf(invoice, settings);
  }
}

/** After a payment or void, rebuild the PDF so it shows the new balance and stamp. Best effort. */
async function refreshPdf(invoice: Invoice, settings: InvoiceSettings): Promise<void> {
  try {
    await storeInvoicePdf(invoice, settings);
  } catch (err) {
    console.warn("Could not refresh the stored PDF", err);
  }
}

export async function addPayment(
  invoice: Invoice,
  payment: Omit<Payment, "id">,
  settings: InvoiceSettings,
): Promise<void> {
  const payments = [...invoice.payments, { ...payment, id: crypto.randomUUID() }];
  await updateDoc(doc(await dbReady(), "invoices", invoice.id), { payments });
  await refreshPdf({ ...invoice, payments }, settings);
}

export async function removePayment(invoice: Invoice, paymentId: string, settings: InvoiceSettings): Promise<void> {
  const payments = invoice.payments.filter((p) => p.id !== paymentId);
  await updateDoc(doc(await dbReady(), "invoices", invoice.id), { payments });
  await refreshPdf({ ...invoice, payments }, settings);
}

export async function setInvoiceVoided(invoice: Invoice, voided: boolean, settings: InvoiceSettings): Promise<void> {
  await updateDoc(doc(await dbReady(), "invoices", invoice.id), { voided });
  await refreshPdf({ ...invoice, voided }, settings);
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = await dbReady();
  await deleteDoc(doc(db, "invoicePdfs", id)).catch(() => undefined);
  await deleteDoc(doc(db, "invoices", id));
}
