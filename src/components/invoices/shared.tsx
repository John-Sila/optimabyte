import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import type { DisplayStatus } from "@/lib/invoice-types";

export const selectClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export const cardClass = "rounded-2xl border border-border bg-card p-5 md:p-6";

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const STATUS_STYLE: Record<DisplayStatus, { label: string; cls: string }> = {
  unpaid: { label: "Unpaid", cls: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-400" },
  partial: { label: "Part paid", cls: "bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/30 dark:text-sky-300" },
  overdue: { label: "Overdue", cls: "bg-red-500/15 text-red-700 ring-1 ring-red-500/30 dark:text-red-400" },
  paid: { label: "Paid", cls: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400" },
  void: { label: "Void", cls: "bg-muted text-muted-foreground ring-1 ring-border" },
};

export function statusLabel(s: DisplayStatus): string {
  return STATUS_STYLE[s].label;
}

export function StatusBadge({ status }: { status: DisplayStatus }) {
  const st = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>
      {st.label}
    </span>
  );
}

/** Digits-only international number for wa.me links (Kenya default). */
export function whatsappDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return null;
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Opens the PDF in a new tab. Call from a click handler; pass the pre-opened window to avoid popup blockers. */
export function showBlob(blob: Blob, target?: Window | null) {
  const url = URL.createObjectURL(blob);
  if (target && !target.closed) target.location.href = url;
  else window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
