// Creates the single admin account (admin@optimabyte.com, display name "Admin").
//
//   ADMIN_PASSWORD='choose-a-strong-password' npm run create-admin
//
// Reads the API key from .env.local (VITE_FIREBASE_API_KEY). Email/Password sign-in
// must already be enabled in the Firebase console (Authentication > Sign-in method).
// Run it once. If the account already exists it tells you and does nothing.
import { readFileSync, existsSync } from "node:fs";

const EMAIL = "admin@optimabyte.com";
const NAME = "Admin";

function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

const env = loadEnv();
const apiKey = env.VITE_FIREBASE_API_KEY;
const password = env.ADMIN_PASSWORD;

if (!apiKey) {
  console.error("Missing VITE_FIREBASE_API_KEY. Create .env.local first (see .env.example).");
  process.exit(1);
}
if (!password || password.length < 10) {
  console.error("Set ADMIN_PASSWORD to a strong password of at least 10 characters, then run again.");
  process.exit(1);
}

async function call(endpoint, body) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data;
}

try {
  const created = await call("accounts:signUp", { email: EMAIL, password, returnSecureToken: true });
  await call("accounts:update", { idToken: created.idToken, displayName: NAME, returnSecureToken: false });
  console.log(`Created admin account ${EMAIL} (display name "${NAME}").`);
  console.log("Next: in the Firebase console you may disable new sign-ups (see FIREBASE_SETUP.md, step 5).");
} catch (err) {
  const msg = String(err.message || err);
  if (msg.includes("EMAIL_EXISTS")) console.log(`${EMAIL} already exists. Nothing to do.`);
  else if (msg.includes("OPERATION_NOT_ALLOWED")) console.error("Enable Email/Password in Authentication > Sign-in method first.");
  else if (msg.includes("WEAK_PASSWORD")) console.error("Firebase rejected that password as too weak. Use a longer one.");
  else console.error("Could not create the admin:", msg);
  process.exit(msg.includes("EMAIL_EXISTS") ? 0 : 1);
}
