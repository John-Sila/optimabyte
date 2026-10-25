// Precise-location helper used ONLY for the admin sign-in. Visitors who send a
// request through the contact form are never asked for location.

export interface GeoFix {
  latitude: number;
  longitude: number;
  accuracyM: number;
}

export interface GeoResult {
  geo: GeoFix | null;
  /** Set when geo is null: the person blocked it, or the device could not provide it. */
  reason: "denied" | "unavailable" | null;
}

function readPosition(highAccuracy: boolean, timeout: number): Promise<GeoResult> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          geo: {
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            accuracyM: Math.round(pos.coords.accuracy),
          },
          reason: null,
        }),
      (err) => resolve({ geo: null, reason: err.code === 1 ? "denied" : "unavailable" }),
      { enableHighAccuracy: highAccuracy, timeout, maximumAge: 0 },
    );
  });
}

/**
 * Asks the browser for the position (this is what shows the permission prompt).
 * Tries a precise GPS fix first; if the device is slow to get one, falls back to
 * a quicker, less exact fix instead of leaving the person waiting.
 */
export async function requestPreciseLocation(): Promise<GeoResult> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return { geo: null, reason: "unavailable" };
  }
  const precise = await readPosition(true, 8000);
  if (precise.geo || precise.reason === "denied") return precise;
  return readPosition(false, 8000);
}

// The fix obtained before the dialog opened, handed to the login log after sign-in.
let pending: GeoFix | null = null;
export const holdGeo = (g: GeoFix | null) => {
  pending = g;
};
export const takeGeo = (): GeoFix | null => {
  const g = pending;
  pending = null;
  return g;
};
