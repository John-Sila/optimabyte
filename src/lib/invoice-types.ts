// Shared types and pure money / date helpers for the admin invoices section.
// No Firebase or UI code in here, so it is safe to import anywhere (including the PDF builder).

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  /** yyyy-MM-dd */
  date: string;
  reference: string;
}

/** Billing details copied onto the invoice, so later edits to a client never change an issued invoice. */
export interface ClientSnapshot {
  name: string;
  email: string;
  phone: string;
  address: string;
  kraPin: string;
}

export interface Client extends ClientSnapshot {
  id: string;
  createdAt: Date;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  vat: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client: ClientSnapshot;
  /** yyyy-MM-dd */
  issueDate: string;
  /** yyyy-MM-dd */
  dueDate: string;
  items: LineItem[];
  discount: number;
  /** Percentage, 0 when VAT is not charged. */
  vatRate: number;
  notes: string;
  terms: string;
  paymentDetails: string;
  subtotal: number;
  vat: number;
  total: number;
  payments: Payment[];
  voided: boolean;
  /** Size in bytes of the stored PDF, 0 if none has been stored yet. */
  pdfSize: number;
  createdAt: Date;
}

export type DisplayStatus = "unpaid" | "partial" | "overdue" | "paid" | "void";

export interface InvoiceSettings {
  businessName: string;
  address: string;
  email: string;
  phone: string;
  kraPin: string;
  /** Used to build numbers such as INV-2026-0001. */
  prefix: string;
  nextNumber: number;
  dueDays: number;
  /** Default VAT percentage for new invoices; 0 turns VAT off by default. */
  vatRate: number;
  paymentDetails: string;
  terms: string;
  footer: string;
}

export const DEFAULT_SETTINGS: InvoiceSettings = {
  businessName: "OptimaByte Softwares Inc",
  address: "Nairobi, Kenya",
  email: "optimabyte@gmail.com",
  phone: "+254 717 405 109",
  kraPin: "",
  prefix: "INV",
  nextNumber: 1,
  dueDays: 14,
  vatRate: 0,
  paymentDetails: "M-Pesa: add your Paybill or Till number here\nBank: add your bank, account name and number here",
  terms: "Payment is due by the due date shown. Please quote the invoice number when paying.",
  footer: "Thank you for your business.",
};

export const PAYMENT_METHODS = ["M-Pesa", "Bank transfer", "Cash", "Cheque", "Card", "Other"];

// ------------------------------------------------------------------ money

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function lineAmount(item: LineItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.unitPrice) || 0));
}

export function calcTotals(items: LineItem[], discount: number, vatRate: number): InvoiceTotals {
  const subtotal = round2(items.reduce((sum, it) => sum + lineAmount(it), 0));
  const disc = round2(Math.min(Math.max(Number(discount) || 0, 0), subtotal));
  const taxable = round2(subtotal - disc);
  const vat = round2((taxable * Math.max(Number(vatRate) || 0, 0)) / 100);
  return { subtotal, discount: disc, taxable, vat, total: round2(taxable + vat) };
}

export function paidTotal(inv: Pick<Invoice, "payments">): number {
  return round2(inv.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0));
}

export function balanceDue(inv: Pick<Invoice, "payments" | "total" | "voided">): number {
  if (inv.voided) return 0;
  return Math.max(round2(inv.total - paidTotal(inv)), 0);
}

export function formatMoney(value: number, currency = "KES"): string {
  const n = Number(value) || 0;
  return `${currency} ${n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ------------------------------------------------------------------ dates (yyyy-MM-dd strings)

const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, (m || 1) - 1, (d || 1) + days));
}

/** Parses yyyy-MM-dd as a local date (new Date("2026-10-26") would be UTC and can shift a day). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

// ------------------------------------------------------------------ status

export function displayStatus(inv: Invoice, today = todayISO()): DisplayStatus {
  if (inv.voided) return "void";
  const bal = balanceDue(inv);
  if (bal <= 0) return "paid";
  if (inv.dueDate < today) return "overdue";
  return paidTotal(inv) > 0 ? "partial" : "unpaid";
}

export function formatInvoiceNumber(prefix: string, issueDate: string, n: number): string {
  const year = issueDate.slice(0, 4);
  const cleanPrefix = prefix.trim().replace(/[\s/]+/g, "-");
  return `${cleanPrefix ? cleanPrefix + "-" : ""}${year}-${String(n).padStart(4, "0")}`;
}
