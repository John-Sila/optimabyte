// Public request form -> Firestore. Uses the small `firestore/lite` build so
// visitors never download the full SDK.
//
// Abuse protection is enforced by firestore.rules, not just here:
//   * every report must be written together with three counter documents
//     (per email, per device, per browser fingerprint),
//   * each counter allows at most 3 reports per hour (12 for the fingerprint,
//     which identical phones can share),
//   * public visitors cannot read, edit or delete reports.
// The checks in this file only exist to give friendly errors.

import { prepareFirebase, firebaseConfigured } from "./firebase";
import { deviceSnapshot, getDeviceId, getFingerprint } from "./device";
import { notifyNewReport } from "./worker";

export interface ReportInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export type ReportStatus = "pending" | "in_progress" | "completed";

export class RateLimitError extends Error {
  retryAt: Date;
  constructor(retryAt: Date) {
    super("rate-limited");
    this.name = "RateLimitError";
    this.retryAt = retryAt;
  }
}

export class NotConfiguredError extends Error {
  constructor() {
    super("firebase-not-configured");
    this.name = "NotConfiguredError";
  }
}

const HOUR_MS = 60 * 60 * 1000;
const CAPS = { e: 3, d: 3, f: 12 } as const;

type Kind = keyof typeof CAPS;
type Plan = "new" | "bump" | "reset";

interface LimitState {
  kind: Kind;
  key: string;
  exists: boolean;
  count: number;
  windowStart: unknown; // Firestore Timestamp, passed back unchanged
  windowStartMs: number;
}

export async function submitReport(input: ReportInput): Promise<void> {
  if (!firebaseConfigured) throw new NotConfiguredError();

  const fs = await import("firebase/firestore/lite");
  const db = fs.getFirestore(await prepareFirebase());

  const email = input.email.trim().toLowerCase();
  const deviceId = getDeviceId();
  const fingerprint = await getFingerprint();

  const keys: Array<{ kind: Kind; key: string }> = [
    { kind: "e", key: `e_${email}` },
    { kind: "d", key: `d_${deviceId}` },
    { kind: "f", key: `f_${fingerprint}` },
  ];

  const states: LimitState[] = await Promise.all(
    keys.map(async ({ kind, key }) => {
      try {
        const snap = await fs.getDoc(fs.doc(db, "limits", key));
        if (!snap.exists()) {
          return { kind, key, exists: false, count: 0, windowStart: null, windowStartMs: 0 };
        }
        const data = snap.data() as { count?: number; windowStart?: { toMillis(): number } };
        return {
          kind,
          key,
          exists: true,
          count: data.count ?? 0,
          windowStart: data.windowStart,
          windowStartMs: data.windowStart?.toMillis() ?? 0,
        };
      } catch {
        // Unreadable counter: treat as missing, the server rules decide.
        return { kind, key, exists: false, count: 0, windowStart: null, windowStartMs: 0 };
      }
    }),
  );

  const reportRef = fs.doc(fs.collection(db, "reports"));
  const snapshot = deviceSnapshot();

  const attempt = async (flip: boolean) => {
    const batch = fs.writeBatch(db);
    batch.set(reportRef, {
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      service: input.service,
      message: input.message.trim(),
      createdAt: fs.serverTimestamp(),
      deviceId,
      fingerprint,
      ...snapshot,
      status: "pending",
      source: "contact-form",
    });

    for (const s of states) {
      let plan: Plan;
      if (!s.exists) plan = "new";
      else {
        const expired = s.windowStartMs + HOUR_MS <= Date.now();
        plan = expired ? "reset" : "bump";
        if (flip) plan = plan === "reset" ? "bump" : "reset";
      }
      const ref = fs.doc(db, "limits", s.key);
      if (plan === "bump") {
        batch.set(ref, {
          count: s.count + 1,
          windowStart: s.windowStart,
          lastReportId: reportRef.id,
        });
      } else {
        batch.set(ref, {
          count: 1,
          windowStart: fs.serverTimestamp(),
          lastReportId: reportRef.id,
        });
      }
    }
    await batch.commit();
  };

  const notify = () =>
    notifyNewReport({
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      service: input.service,
      message: input.message.trim(),
      page: snapshot.page,
    });

  try {
    await attempt(false);
    notify();
    return;
  } catch (first) {
    if (!isPermissionDenied(first)) throw first;
    // The visitor's clock may disagree with the server about whether the hour
    // is up. Retry once with the opposite assumption before giving up.
    try {
      await attempt(true);
      notify();
      return;
    } catch (second) {
      if (!isPermissionDenied(second)) throw second;
      const capped = states.filter(
        (s) => s.exists && s.count >= CAPS[s.kind] && s.windowStartMs + HOUR_MS > Date.now() - 5 * 60 * 1000,
      );
      if (capped.length) {
        const retryMs = Math.min(...capped.map((s) => s.windowStartMs + HOUR_MS));
        throw new RateLimitError(new Date(Math.max(retryMs, Date.now() + 60 * 1000)));
      }
      throw second;
    }
  }
}

function isPermissionDenied(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code ?? "";
  return code.includes("permission-denied");
}
