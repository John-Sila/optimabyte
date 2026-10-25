// Admin-only Firestore access. Uses the full SDK (real-time updates) and is only
// ever imported from admin screens, which are lazy-loaded.

import {
  collection,
  deleteDoc,
  addDoc,
  deleteField,
  doc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, prepareFirebase } from "./firebase";
import type { ReportStatus } from "./reports";
import { deviceDetails } from "./device";
import { fetchNetworkInfo, type NetworkInfo } from "./worker";

export interface Report {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: ReportStatus;
  createdAt: Date;
  deviceId: string;
  fingerprint: string;
  userAgent: string;
  language: string;
  timezone: string;
  screen: string;
  referrer: string;
  page: string;
  source: string;
}

/** Older documents used new / replied / closed. Show them under the new names. */
export function normalizeStatus(raw: unknown): ReportStatus {
  switch (raw) {
    case "in_progress": return "in_progress";
    case "completed":
    case "replied":
    case "closed": return "completed";
    default: return "pending";
  }
}

const dbReady = async () => getFirestore(await prepareFirebase());

function toDate(value: unknown): Date {
  const ts = value as Timestamp | null | undefined;
  return ts && typeof ts.toDate === "function" ? ts.toDate() : new Date();
}

/** Live list of reports, oldest first. Sorting and grouping happen in the UI. */
export function subscribeReports(
  onData: (reports: Report[]) => void,
  onError: (err: Error) => void,
): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void dbReady()
    .then((database) => {
      if (cancelled) return;
      const q = query(collection(database, "reports"), orderBy("createdAt", "asc"), limit(2000));
      unsub = onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            name: x.name ?? "",
            email: x.email ?? "",
            phone: x.phone ?? "",
            service: x.service ?? "",
            message: x.message ?? "",
            status: normalizeStatus(x.status),
            // Pending server timestamps are null for a moment on fresh writes.
            createdAt: toDate(x.createdAt),
            deviceId: x.deviceId ?? "",
            fingerprint: x.fingerprint ?? "",
            userAgent: x.userAgent ?? "",
            language: x.language ?? "",
            timezone: x.timezone ?? "",
            screen: x.screen ?? "",
            referrer: x.referrer ?? "",
            page: x.page ?? "",
            source: x.source ?? "",
          } satisfies Report;
        }),
      );
    },
    onError,
      );
    })
    .catch((err) => onError(err as Error));
  return () => {
    cancelled = true;
    unsub?.();
  };
}

export async function setReportStatus(id: string, status: ReportStatus) {
  await updateDoc(doc(await dbReady(), "reports", id), { status });
}

export async function deleteReport(id: string) {
  await deleteDoc(doc(await dbReady(), "reports", id));
}

/** Set (or, with null, remove) the screenshot URL shown for a portfolio project. */
export async function setPortfolioImage(projectId: string, url: string | null) {
  await setDoc(
    doc(await dbReady(), "content", "portfolio"),
    { images: { [projectId]: url === null ? deleteField() : url } },
    { merge: true },
  );
}

// ------------------------------------------------------------ admin login log
// Only the latest 5 admin sign-ins are kept. Each new sign-in is written, then
// everything older than the 5th newest is deleted.

export const LOGIN_LOG_KEEP = 5;

export interface GeoFix {
  latitude: number;
  longitude: number;
  accuracyM: number;
}

export interface LoginRecord {
  id: string;
  at: Date;
  device: ReturnType<typeof deviceDetails>;
  network: NetworkInfo | null;
  geo: GeoFix | null;
  /** granted | denied | unavailable */
  geoStatus: string;
}

function getPreciseLocation(): Promise<{ geo: GeoFix | null; status: string }> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve({ geo: null, status: "unavailable" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          geo: {
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            accuracyM: Math.round(pos.coords.accuracy),
          },
          status: "granted",
        }),
      (err) => resolve({ geo: null, status: err.code === 1 ? "denied" : "unavailable" }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

/** Call right after a successful admin sign-in. Never throws. */
export async function recordAdminLogin(): Promise<void> {
  try {
    const [network, loc] = await Promise.all([fetchNetworkInfo(), getPreciseLocation()]);
    const database = await dbReady();
    await addDoc(collection(database, "adminLogins"), {
      at: serverTimestamp(),
      device: deviceDetails(),
      network,
      geo: loc.geo,
      geoStatus: loc.status,
    });
    // Keep only the newest LOGIN_LOG_KEEP entries.
    const snap = await getDocs(query(collection(database, "adminLogins"), orderBy("at", "desc"), limit(50)));
    await Promise.all(snap.docs.slice(LOGIN_LOG_KEEP).map((d) => deleteDoc(d.ref)));
  } catch (err) {
    console.warn("Could not record admin login", err);
  }
}

export function subscribeLogins(
  onData: (rows: LoginRecord[]) => void,
  onError: (err: Error) => void,
): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void dbReady()
    .then((database) => {
      if (cancelled) return;
      const q = query(collection(database, "adminLogins"), orderBy("at", "desc"), limit(LOGIN_LOG_KEEP));
      unsub = onSnapshot(
        q,
        (snap) =>
          onData(
            snap.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                at: toDate(x.at),
                device: x.device ?? {},
                network: x.network ?? null,
                geo: x.geo ?? null,
                geoStatus: x.geoStatus ?? "unavailable",
              } as LoginRecord;
            }),
          ),
        onError,
      );
    })
    .catch((err) => onError(err as Error));
  return () => {
    cancelled = true;
    unsub?.();
  };
}
