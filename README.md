# Cloudflare Worker (free)

Does the two jobs that would otherwise need paid Firebase Cloud Functions:

1. **Emails you** whenever someone sends a request (the request is still saved to Firestore first).
2. **Looks up the IP address and city** of each admin sign-in, shown on the Login activity page.

## Deploy

1. Create a free account at https://dash.cloudflare.com (no card needed).
2. Create a free account at https://resend.com, then **API Keys > Create API Key** (sending access). Sign up with the email you want the notifications at (optimabyte@gmail.com). Resend's test sender `onboarding@resend.dev` can only deliver to that address, which is exactly what you need.
3. In this folder (`cloudflare/worker`):

```
npx wrangler login
```

4. Edit `wrangler.toml`: set `ALLOWED_ORIGINS` to your live site, for example `https://optimabyte.vercel.app` (add your custom domain too, comma separated, no trailing slash). Check `NOTIFY_TO`.
5. Store the key as a secret and deploy:

```
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

Wrangler prints the Worker URL, like `https://optimabyte-worker.YOURNAME.workers.dev`.

6. Put that URL in `.env.local` and in Vercel (all environments) as `VITE_WORKER_URL`, then redeploy the site.

## Test

- Browser: open `https://<worker-url>/whoami` directly: you get `forbidden` (correct, only your site's origin is allowed).
- Send a test request from the Contact page: an email should arrive within a few seconds.
- Sign in as admin: Login activity shows an IP and city.

## Abuse protection

Only your site's origin can call the Worker, input is validated and HTML-escaped, and the email only ever goes to `NOTIFY_TO`. For extra safety add a free rate-limit rule in Cloudflare (Security > WAF > Rate limiting rules) on `/notify`, for example 10 requests per minute per IP.

Free limits: Workers 100,000 requests a day, Resend 100 emails a day. Far more than this site needs.
