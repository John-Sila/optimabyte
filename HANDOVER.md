# OptimaByte website

## Before you deploy

Open `src/lib/site-config.ts` and set:

- `whatsappNumber` — your real WhatsApp number, digits only, country code first (e.g. `2547XXXXXXXX`). Every WhatsApp CTA on the site reads from this one value.
- `email`, `phone`, `location`
- `social.facebook`, `social.instagram`

Replace `public/logo.svg` with your final logo file (keep the filename `logo.svg`, or update the reference in `src/components/layout/Logo.tsx` and `index.html`).

## What is in this build

- Pages: Home, Services, Portfolio, Pricing, About, Contact, plus a 404 page. Routing is client-side (React Router), so any static host needs an SPA fallback rule pointing all paths to `index.html` (Netlify, Vercel and most static hosts do this automatically or with one config line; ask if you are unsure which host you are using).
- Light and dark mode toggle in the navbar, plus automatic detection of the visitor's system preference on first visit.
- A floating WhatsApp button on every page, and WhatsApp CTAs in the hero, services, pricing and contact sections.
- The contact form does not use a backend. On submit it opens WhatsApp with the visitor's details pre-filled, so nothing is lost and nothing needs a server.
- Pricing page reflects the current rate structure: Principal (one-time, first month), Retainer and database management (monthly), Changes and modifications (per request).
- Portfolio has one real project and two clearly labelled placeholders. Add real projects and screenshots in `src/lib/site-config.ts` under `portfolio`.
- No external image dependencies. The hero graphic and service icons are all inline SVG/icon components, so the site has nothing to fetch beyond fonts and your own logo.

## Running locally

```
npm install
npm run dev
```

## Building for deployment

```
npm run build
```

This outputs static files to `dist/`. Deploy that folder to any static host, with an SPA fallback rule as noted above.
