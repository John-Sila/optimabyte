# Handover

See **README.md** for what is in the site and **FIREBASE_SETUP.md** for the one-time Firebase steps.

Before going live:

1. Complete FIREBASE_SETUP.md (keys, rules, admin account, Vercel env vars).
2. Check `src/lib/site-config.ts` (WhatsApp number, email, phone, social links).
3. Read the Terms and Privacy pages and adjust anything that does not match how you operate.
4. The portfolio entries (other than the fleet operations platform) describe the kinds of systems OptimaByte builds. Edit them in `site-config.ts` so each one matches real, deliverable work, and add screenshots as admin.
5. Deploy the Cloudflare Worker (`cloudflare/worker/README.md`) and set `VITE_WORKER_URL`, for email alerts and login location.
