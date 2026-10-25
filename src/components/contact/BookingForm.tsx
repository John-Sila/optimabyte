import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerifyBox from "./VerifyBox";
import { RateLimitDialog, RequestSentDialog, type SentInfo } from "./RequestDialogs";
import { NotConfiguredError, RateLimitError, submitReport } from "@/lib/reports";
import { replyExpectation } from "@/lib/time";
import { whatsappLink } from "@/lib/site-config";

const serviceOptions = [
  "Custom software",
  "POS system",
  "Hospital, school or business ERP",
  "Android or iOS app",
  "Fleet or rider app",
  "Website or web application",
  "Database management",
  "Changes to an existing project",
  "Graphic design or print",
];

const EMAIL_RE = /^[^@\s/|]+@[^@\s/|]+\.[^@\s/|]+$/;

// Friendly client-side cooldown (3 per hour). The real limit is enforced by
// firestore.rules; this just avoids needless round trips.
const LOG_KEY = "ob_sent_log";
const HOUR = 60 * 60 * 1000;

function readLog(): number[] {
  try {
    const arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]") as number[];
    return arr.filter((t) => typeof t === "number" && Date.now() - t < HOUR);
  } catch {
    return [];
  }
}
function pushLog() {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify([...readLog(), Date.now()]));
  } catch {
    /* ignore */
  }
}

const empty = { name: "", email: "", phone: "", service: "", message: "" };

export default function BookingForm() {
  const [form, setForm] = useState(empty);
  const [website, setWebsite] = useState(""); // honeypot, real people never see it
  const [verified, setVerified] = useState(false);
  const [verifyKey, setVerifyKey] = useState(0);
  const [touchedVerify, setTouchedVerify] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<SentInfo | null>(null);
  const [retryAt, setRetryAt] = useState<Date | null>(null);

  const set =
    (field: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError("");
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (form.name.trim().length < 2 || !form.service || form.message.trim().length < 10) {
      setError("Please add your name, choose a service and describe your project in a few words.");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address. We reply to you by email.");
      return;
    }
    if (!verified) {
      setTouchedVerify(true);
      setError("Please tick “I’m not a robot” before sending.");
      return;
    }

    // Bots that fill every field get a convincing success and nothing is stored.
    if (website) {
      setSent({ name: form.name, email: form.email, expectation: replyExpectation() });
      return;
    }

    const log = readLog();
    if (log.length >= 3) {
      setRetryAt(new Date(Math.min(...log) + HOUR));
      return;
    }

    setSending(true);
    setError("");
    try {
      await submitReport({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: form.message,
      });
      pushLog();
      setSent({ name: form.name, email: form.email.trim(), expectation: replyExpectation() });
      setForm(empty);
      setVerified(false);
      setTouchedVerify(false);
      setVerifyKey((k) => k + 1);
    } catch (err) {
      console.error("Request failed:", err);
      if (err instanceof RateLimitError) setRetryAt(err.retryAt);
      else if (err instanceof NotConfiguredError)
        setError("The request form is not available right now. Please message us on WhatsApp instead.");
      else setError("We could not send your request. Check your connection and try again, or message us on WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="rf-name" className={labelClass}>Your name</label>
            <input
              id="rf-name"
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              className={inputClass}
              value={form.name}
              onChange={set("name")}
            />
          </div>
          <div>
            <label htmlFor="rf-email" className={labelClass}>Email (we reply here)</label>
            <input
              id="rf-email"
              type="email"
              required
              maxLength={120}
              autoComplete="email"
              className={inputClass}
              value={form.email}
              onChange={set("email")}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="rf-phone" className={labelClass}>Phone (optional)</label>
            <input
              id="rf-phone"
              type="tel"
              maxLength={30}
              autoComplete="tel"
              className={inputClass}
              value={form.phone}
              onChange={set("phone")}
            />
          </div>
          <div>
            <label htmlFor="rf-service" className={labelClass}>Service</label>
            <select id="rf-service" required className={inputClass} value={form.service} onChange={set("service")}>
              <option value="">Select a service</option>
              {serviceOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="rf-message" className={labelClass}>Project details</label>
          <textarea
            id="rf-message"
            required
            rows={5}
            maxLength={2000}
            className={`${inputClass} resize-none`}
            value={form.message}
            onChange={set("message")}
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{form.message.length}/2000</p>
        </div>

        {/* Honeypot: hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <VerifyBox
          resetKey={verifyKey}
          invalid={touchedVerify && !verified}
          onChange={(v) => {
            setVerified(v);
            if (v) setError("");
          }}
        />

        {error && (
          <p role="alert" className="animate-fade-up text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? "Sending..." : "Send request"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          We reply by email. Prefer chat?{" "}
          <a
            href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Message us on WhatsApp
          </a>
          .
        </p>
      </form>

      <RequestSentDialog info={sent} onClose={() => setSent(null)} />
      <RateLimitDialog retryAt={retryAt} onClose={() => setRetryAt(null)} />
    </>
  );
}
