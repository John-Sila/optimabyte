// Firebase app bootstrap. Only the tiny `firebase/app` package is loaded here;
// Auth and Firestore are imported lazily by the modules that need them so the
// public pages stay fast.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** Optional. When set, Firebase App Check (reCAPTCHA v3) vouches for every request. */
const appCheckKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let appCheckReady: Promise<void> | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseConfigured) throw new Error("firebase-not-configured");
  return getApps().length ? getApp() : initializeApp(config);
}

/**
 * Returns the app once App Check (if configured) is running, so the very first
 * Firestore request already carries a token. The App Check code is only
 * downloaded when a site key is set.
 */
export async function prepareFirebase(): Promise<FirebaseApp> {
  const app = getFirebaseApp();
  if (appCheckKey) {
    appCheckReady ??= import("firebase/app-check")
      .then((m) => {
        m.initializeAppCheck(app, {
          provider: new m.ReCaptchaV3Provider(appCheckKey),
          isTokenAutoRefreshEnabled: true,
        });
      })
      .catch(() => {
        /* App Check is a bonus layer; never block the site if it fails to start */
      });
    await appCheckReady;
  }
  return app;
}

/** The one account allowed to sign in as admin. Must match firestore.rules. */
export const ADMIN_EMAIL = "admin@optimabyte.com";

/**
 * Base URL of the Cloudflare Worker (email notifications and IP lookup).
 * Optional: the site works without it, it just skips those two features.
 */
export const workerUrl = ((import.meta.env.VITE_WORKER_URL as string | undefined) ?? "").replace(/\/$/, "");
