// Lightweight device identification used only to limit abuse of the request
// form (3 requests per hour per device). No tracking across sites.

const KEY = "ob_device_id";
let memoryId: string | null = null;

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID().replace(/-/g, "");
    }
  } catch {
    /* fall through */
  }
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

/** A random id stored in this browser. Changes if the visitor clears site data. */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing && /^[a-f0-9]{16,64}$/.test(existing)) return existing;
    const id = randomId();
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    if (!memoryId) memoryId = randomId();
    return memoryId;
  }
}

async function sha256Hex(text: string): Promise<string> {
  try {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Non-secure context fallback (FNV-1a, padded to 64 hex chars).
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, "0").repeat(8);
  }
}

/**
 * A hash of stable browser/hardware traits. It survives clearing site data, so
 * it catches people who just wipe storage to reset their limit. It is shared by
 * identical devices, so the server applies a looser cap to it than to the
 * per-device id.
 */
export async function getFingerprint(): Promise<string> {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const parts = [
    nav.userAgent,
    nav.language,
    nav.platform,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    nav.hardwareConcurrency ?? "",
    nav.deviceMemory ?? "",
  ];
  return sha256Hex(parts.join("|"));
}

export function deviceSnapshot() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    userAgent: nav.userAgent.slice(0, 300),
    language: (nav.language || "").slice(0, 20),
    timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || "").slice(0, 60),
    screen: `${screen.width}x${screen.height}`,
    referrer: (document.referrer || "").slice(0, 300),
    page: location.pathname.slice(0, 200),
  };
}

/** Friendly browser / OS / device-type names from the user agent string. */
export function describeDevice(ua: string = navigator.userAgent) {
  const browser =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /SamsungBrowser/.test(ua) ? "Samsung Internet"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari"
    : "Unknown browser";
  const os =
    /Windows NT 10/.test(ua) ? "Windows 10/11"
    : /Windows/.test(ua) ? "Windows"
    : /Android ([\d.]+)/.exec(ua) ? `Android ${/Android ([\d.]+)/.exec(ua)?.[1]}`
    : /iPhone|iPad|iPod/.test(ua) ? "iOS"
    : /Mac OS X/.test(ua) ? "macOS"
    : /CrOS/.test(ua) ? "ChromeOS"
    : /Linux/.test(ua) ? "Linux"
    : "Unknown OS";
  const type = /iPad|Tablet/.test(ua) ? "Tablet" : /Mobi|Android|iPhone/.test(ua) ? "Mobile" : "Desktop";
  return { browser, os, type };
}

/** Extra hardware / network traits recorded with each admin login. */
export function deviceDetails() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number };
  };
  return {
    ...describeDevice(),
    userAgent: nav.userAgent.slice(0, 300),
    platform: (nav.platform || "").slice(0, 60),
    language: (nav.language || "").slice(0, 20),
    timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || "").slice(0, 60),
    screen: `${screen.width}x${screen.height} @${window.devicePixelRatio || 1}x`,
    cpuCores: nav.hardwareConcurrency ?? 0,
    memoryGb: nav.deviceMemory ?? 0,
    connection: nav.connection?.effectiveType ?? "",
    touch: navigator.maxTouchPoints > 0,
    deviceId: getDeviceId(),
  };
}
