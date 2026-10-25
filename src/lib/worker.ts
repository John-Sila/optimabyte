// Talks to the Cloudflare Worker (see cloudflare/worker). Both calls are best
// effort: if the Worker is not set up or is down, nothing on the site breaks.

import { workerUrl } from "./firebase";

export interface NotifyPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  page: string;
}

/** Fire-and-forget: asks the Worker to email the owner about a new request. */
export function notifyNewReport(payload: NotifyPayload): void {
  if (!workerUrl) return;
  try {
    void fetch(`${workerUrl}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* the request is already saved in Firestore; the email is a bonus */
    });
  } catch {
    /* ignore */
  }
}

export interface NetworkInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  isp: string;
  timezone: string;
}

/** The visitor's IP and approximate location, as seen by Cloudflare's edge. */
export async function fetchNetworkInfo(): Promise<NetworkInfo | null> {
  if (!workerUrl) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(`${workerUrl}/whoami`, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    return (await res.json()) as NetworkInfo;
  } catch {
    return null;
  }
}
