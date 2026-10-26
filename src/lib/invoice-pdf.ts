// Builds the real PDF for an invoice with jsPDF. The library is imported
// dynamically, so it is only downloaded when an invoice is actually generated or viewed.

import {
  balanceDue,
  displayStatus,
  formatMoney,
  lineAmount,
  parseISODate,
  paidTotal,
  type Invoice,
  type InvoiceSettings,
} from "./invoice-types";

const NAVY: [number, number, number] = [33, 53, 99];
const GOLD: [number, number, number] = [147, 108, 42];
const INK: [number, number, number] = [30, 36, 54];
const MUTED: [number, number, number] = [102, 112, 133];
const LINE: [number, number, number] = [225, 222, 212];
const SOFT: [number, number, number] = [247, 245, 240];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const RIGHT = PAGE_W - MARGIN;
const FOOTER_Y = PAGE_H - 12;

const fmtDate = (iso: string) =>
  parseISODate(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ------------------------------------------------------------- logo
// public/logo.svg is fetched in the browser and drawn onto a canvas to get a PNG,
// because jsPDF cannot embed SVG. If anything fails the PDF simply has no logo.

export const LOGO_URL = "/logo.svg";

interface Logo {
  dataUrl: string;
  /** width / height */
  ratio: number;
}

const logoCache = new Map<string, Promise<Logo | null>>();

function loadLogo(url: string): Promise<Logo | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  let p = logoCache.get(url);
  if (!p) {
    p = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        try {
          const img = new Image();
          img.decoding = "async";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("logo-decode"));
            img.src = objectUrl;
          });
          // SVGs without width/height report 0, so fall back to a square.
          const nw = img.naturalWidth || 256;
          const nh = img.naturalHeight || 256;
          const ratio = nw / nh;
          const h = 256;
          const w = Math.max(1, Math.round(h * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          ctx.drawImage(img, 0, 0, w, h);
          return { dataUrl: canvas.toDataURL("image/png"), ratio };
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      } catch {
        return null;
      }
    })();
    logoCache.set(url, p);
  }
  return p;
}

export async function buildInvoicePdf(
  invoice: Invoice,
  settings: InvoiceSettings,
  logoUrl: string = LOGO_URL,
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const logo = await loadLogo(logoUrl);
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `Invoice ${invoice.number}`,
    subject: `Invoice for ${invoice.client.name}`,
    author: settings.businessName,
  });

  const status = displayStatus(invoice);
  let y = MARGIN;

  const text = (
    value: string,
    x: number,
    yy: number,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; align?: "left" | "right" | "center"; width?: number } = {},
  ) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size ?? 10);
    doc.setTextColor(...(opts.color ?? INK));
    if (opts.width) {
      const lines = doc.splitTextToSize(value, opts.width) as string[];
      doc.text(lines, x, yy, { align: opts.align ?? "left" });
      return lines.length;
    }
    doc.text(value, x, yy, { align: opts.align ?? "left" });
    return 1;
  };

  const lineHeight = (size: number) => size * 0.42;

  // ------------------------------------------------------------- header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 4, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 4, PAGE_W, 1, "F");

  // Logo box: 20 mm tall, width follows the logo's proportions (capped), text sits to its right.
  let textX = MARGIN;
  if (logo) {
    const h = 20;
    const w = Math.min(h * logo.ratio, 40);
    doc.addImage(logo.dataUrl, "PNG", MARGIN, 11, w, w / logo.ratio);
    textX = MARGIN + w + 5;
  }

  y = 20;
  text(settings.businessName || "OptimaByte Softwares Inc", textX, y, { size: 16, bold: true, color: NAVY });
  y += 6;
  const bizLines = [settings.address, settings.email, settings.phone, settings.kraPin ? `KRA PIN: ${settings.kraPin}` : ""].filter(Boolean);
  for (const l of bizLines) {
    text(l, textX, y, { size: 9, color: MUTED });
    y += 4.3;
  }

  text("INVOICE", RIGHT, 21, { size: 24, bold: true, color: GOLD, align: "right" });
  text(invoice.number, RIGHT, 28, { size: 11, bold: true, align: "right" });
  text(`Issued: ${fmtDate(invoice.issueDate)}`, RIGHT, 34, { size: 9, color: MUTED, align: "right" });
  text(`Due: ${fmtDate(invoice.dueDate)}`, RIGHT, 38.5, { size: 9, color: MUTED, align: "right" });

  y = Math.max(y, 44) + 6;

  // ------------------------------------------------------------- bill to
  doc.setFillColor(...SOFT);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 28, 2, 2, "F");
  text("BILL TO", MARGIN + 5, y + 7, { size: 8, bold: true, color: GOLD });
  text(invoice.client.name, MARGIN + 5, y + 13, { size: 11, bold: true });
  let cy = y + 18;
  const clientLines = [
    invoice.client.address,
    [invoice.client.email, invoice.client.phone].filter(Boolean).join("  |  "),
    invoice.client.kraPin ? `KRA PIN: ${invoice.client.kraPin}` : "",
  ].filter(Boolean);
  for (const l of clientLines.slice(0, 3)) {
    text(l, MARGIN + 5, cy, { size: 9, color: MUTED });
    cy += 4.2;
  }

  // amount due summary on the right of the box
  text("AMOUNT DUE", RIGHT - 5, y + 7, { size: 8, bold: true, color: GOLD, align: "right" });
  text(formatMoney(balanceDue(invoice)), RIGHT - 5, y + 15, { size: 14, bold: true, color: NAVY, align: "right" });
  text(statusLabel(status), RIGHT - 5, y + 21, { size: 9, bold: true, color: statusColor(status), align: "right" });

  y += 28 + 8;

  // ------------------------------------------------------------- items table
  const COL = {
    desc: MARGIN + 3,
    qty: 124,
    price: 154,
    amount: RIGHT - 3,
  };
  const descWidth = COL.qty - COL.desc - 14;

  const drawTableHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, 8, "F");
    text("DESCRIPTION", COL.desc, y + 5.4, { size: 8, bold: true, color: [255, 255, 255] });
    text("QTY", COL.qty, y + 5.4, { size: 8, bold: true, color: [255, 255, 255], align: "right" });
    text("UNIT PRICE", COL.price, y + 5.4, { size: 8, bold: true, color: [255, 255, 255], align: "right" });
    text("AMOUNT", COL.amount, y + 5.4, { size: 8, bold: true, color: [255, 255, 255], align: "right" });
    y += 8;
  };

  const newPage = () => {
    doc.addPage();
    y = MARGIN + 4;
  };

  drawTableHeader();
  invoice.items.forEach((item, i) => {
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(item.description || "-", descWidth) as string[];
    const rowH = Math.max(lines.length * lineHeight(9.5) * 1.25 + 5, 9);
    if (y + rowH > PAGE_H - 50) {
      newPage();
      drawTableHeader();
    }
    if (i % 2 === 1) {
      doc.setFillColor(...SOFT);
      doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, rowH, "F");
    }
    text(lines.join("\n"), COL.desc, y + 5.6, { size: 9.5 });
    text(String(item.qty), COL.qty, y + 5.6, { size: 9.5, align: "right" });
    text(formatMoney(item.unitPrice, "").trim(), COL.price, y + 5.6, { size: 9.5, align: "right" });
    text(formatMoney(lineAmount(item), "").trim(), COL.amount, y + 5.6, { size: 9.5, bold: true, align: "right" });
    y += rowH;
    doc.setDrawColor(...LINE);
    doc.line(MARGIN, y, RIGHT, y);
  });

  // ------------------------------------------------------------- totals
  y += 6;
  if (y > PAGE_H - 70) newPage();

  const labelX = 128;
  const row = (label: string, value: string, opts: { bold?: boolean; color?: [number, number, number]; size?: number } = {}) => {
    text(label, labelX, y, { size: opts.size ?? 9.5, bold: opts.bold, color: opts.color ?? MUTED });
    text(value, RIGHT - 3, y, { size: opts.size ?? 9.5, bold: opts.bold, color: opts.color ?? INK, align: "right" });
    y += 6;
  };

  row("Subtotal", formatMoney(invoice.subtotal));
  if (invoice.discount > 0) row("Discount", `- ${formatMoney(invoice.discount)}`);
  if (invoice.vatRate > 0) row(`VAT (${invoice.vatRate}%)`, formatMoney(invoice.vat));
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(labelX, y - 3, RIGHT, y - 3);
  y += 1.5;
  row("Total", formatMoney(invoice.total), { bold: true, color: NAVY, size: 11 });
  const paid = paidTotal(invoice);
  if (paid > 0) row("Paid", `- ${formatMoney(paid)}`, { color: [4, 120, 87] });
  doc.setFillColor(...NAVY);
  doc.roundedRect(labelX - 3, y - 4.5, RIGHT - labelX + 3, 9, 1.5, 1.5, "F");
  text("Balance due", labelX, y + 1.4, { size: 10, bold: true, color: [255, 255, 255] });
  text(formatMoney(balanceDue(invoice)), RIGHT - 3, y + 1.4, { size: 10, bold: true, color: [255, 255, 255], align: "right" });
  y += 14;

  // ------------------------------------------------------------- payments received
  if (invoice.payments.length) {
    if (y > PAGE_H - 60) newPage();
    const PAY = { date: MARGIN + 3, method: MARGIN + 38, amount: 150, balance: RIGHT - 3 };
    const payHeader = () => {
      text("PAYMENTS RECEIVED", MARGIN, y, { size: 8, bold: true, color: GOLD });
      y += 3;
      doc.setFillColor(...SOFT);
      doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, 7, "F");
      text("DATE", PAY.date, y + 4.8, { size: 7.5, bold: true, color: MUTED });
      text("METHOD / REFERENCE", PAY.method, y + 4.8, { size: 7.5, bold: true, color: MUTED });
      text("PAID", PAY.amount, y + 4.8, { size: 7.5, bold: true, color: MUTED, align: "right" });
      text("BALANCE AFTER", PAY.balance, y + 4.8, { size: 7.5, bold: true, color: MUTED, align: "right" });
      y += 7;
    };
    if (y > PAGE_H - 60) newPage();
    payHeader();
    // Oldest first, so the running balance reads top to bottom.
    const ordered = [...invoice.payments].sort((a, b) => a.date.localeCompare(b.date));
    let running = invoice.total;
    for (const p of ordered) {
      if (y > PAGE_H - 30) {
        newPage();
        payHeader();
      }
      running = Math.max(Math.round((running - p.amount) * 100) / 100, 0);
      text(fmtDate(p.date), PAY.date, y + 5, { size: 9 });
      text(`${p.method}${p.reference ? ` (${p.reference})` : ""}`, PAY.method, y + 5, { size: 9, color: MUTED });
      text(formatMoney(p.amount, "").trim(), PAY.amount, y + 5, { size: 9, bold: true, align: "right" });
      text(formatMoney(running, "").trim(), PAY.balance, y + 5, { size: 9, align: "right" });
      y += 7;
      doc.setDrawColor(...LINE);
      doc.line(MARGIN, y, RIGHT, y);
    }
    y += 8;
  }

  // ------------------------------------------------------------- payment details, notes, terms
  const block = (title: string, body: string) => {
    if (!body.trim()) return;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(body, PAGE_W - MARGIN * 2) as string[];
    const needed = 6 + lines.length * 4.2 + 4;
    if (y + needed > FOOTER_Y - 6) newPage();
    if (title) {
      text(title, MARGIN, y, { size: 8, bold: true, color: GOLD });
      y += 5;
    }
    text(lines.join("\n"), MARGIN, y, { size: 9, color: INK });
    y += lines.length * 4.2 + 5;
  };

  // "How to pay": lines written as  METHOD | DETAIL | NUMBER  become a styled table.
  // Any line without a "|" is printed as plain text under it.
  const payRows = invoice.paymentDetails
    .split("\n")
    .filter((l) => l.includes("|"))
    .map((l) => l.split("|").map((c) => c.trim()))
    .slice(0, 8);
  const payPlain = invoice.paymentDetails
    .split("\n")
    .filter((l) => l.trim() && !l.includes("|"))
    .join("\n");

  if (payRows.length) {
    const ROW_H = 9;
    const need = 6 + payRows.length * ROW_H + 6;
    if (y + need > FOOTER_Y - 6) newPage();
    text("HOW TO PAY", MARGIN, y, { size: 8, bold: true, color: GOLD });
    y += 3.5;
    const W = PAGE_W - MARGIN * 2;
    const cols = [W * 0.2, W * 0.45, W * 0.35]; // method | detail | number
    const x0 = MARGIN;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    payRows.forEach((cells, i) => {
      const top = y + i * ROW_H;
      let x = x0;
      cols.forEach((w, c) => {
        if (c === 0) {
          doc.setFillColor(...NAVY);
          doc.rect(x, top, w, ROW_H, "FD");
        } else {
          doc.setFillColor(...(c === 2 ? SOFT : ([255, 255, 255] as [number, number, number])));
          doc.rect(x, top, w, ROW_H, "FD");
        }
        const value = cells[c] ?? "";
        if (c === 0) text(value, x + 4, top + 5.8, { size: 9, bold: true, color: [255, 255, 255] });
        else if (c === 1) text(value, x + 4, top + 5.8, { size: 9.5 });
        else text(value, x + 4, top + 5.8, { size: 10.5, bold: true, color: NAVY });
        x += w;
      });
    });
    y += payRows.length * ROW_H + 6;
  }
  block(payRows.length ? "" : "HOW TO PAY", payRows.length ? payPlain : invoice.paymentDetails);
  block("NOTES", invoice.notes);
  block("TERMS", invoice.terms);

  // ------------------------------------------------------------- stamp (paid / void) on page 1
  if (status === "paid" || status === "void") {
    doc.setPage(1);
    const GState = (doc as unknown as { GState: new (o: { opacity: number }) => unknown }).GState;
    const d = doc as unknown as { setGState: (g: unknown) => void };
    d.setGState(new GState({ opacity: 0.1 }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(80);
    doc.setTextColor(...(status === "paid" ? ([4, 120, 87] as [number, number, number]) : ([185, 28, 28] as [number, number, number])));
    doc.text(status === "paid" ? "PAID" : "VOID", PAGE_W / 2, 150, { align: "center", angle: 30 });
    d.setGState(new GState({ opacity: 1 }));
  }

  // ------------------------------------------------------------- footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, FOOTER_Y - 4, RIGHT, FOOTER_Y - 4);
    text(settings.footer || settings.businessName, MARGIN, FOOTER_Y, { size: 8, color: MUTED });
    text(`${invoice.number}  |  Page ${p} of ${pages}`, RIGHT, FOOTER_Y, { size: 8, color: MUTED, align: "right" });
  }

  return doc.output("blob");
}

function statusLabel(s: ReturnType<typeof displayStatus>): string {
  return { unpaid: "UNPAID", partial: "PARTLY PAID", overdue: "OVERDUE", paid: "PAID IN FULL", void: "VOID" }[s];
}

function statusColor(s: ReturnType<typeof displayStatus>): [number, number, number] {
  switch (s) {
    case "paid": return [4, 120, 87];
    case "void":
    case "overdue": return [185, 28, 28];
    default: return [180, 83, 9];
  }
}

// ------------------------------------------------------------- base64 helpers (PDF is stored inside Firestore)

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) {
    binary += String.fromCharCode(...buf.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function base64ToBlob(b64: string): Blob {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
}
