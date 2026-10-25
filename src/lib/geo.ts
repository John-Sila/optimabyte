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

/** Asks the browser for the precise position. Shows the browser's permission prompt. */
export function requestPreciseLocation(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      return resolve({ geo: null, reason: "unavailable" });
    }
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
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