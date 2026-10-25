# OptimaByte website

React + TypeScript + Vite + Tailwind, with Firebase (Auth + Firestore) for the request form and the admin area.

- **Public site:** Home, Services, Portfolio, Pricing, About, Contact, Help, Terms, Privacy.
- **Contact form:** saves each request to Firebase (not WhatsApp), with an "I'm not a robot" box and a limit of 3 requests per hour per email and per device. Visitors get a popup saying when to expect an email reply.
- **Admin:** the **Admin** button (top right) opens a password popup (email is fixed to `admin@optimabyte.com`). Once signed in you get a **Reports** page (statuses Pending / In progress / Completed, sort, group by day / week / month / year, search, filter, export CSV), a **Login activity** page (last 5 admin sign-ins with device and location) and you can set portfolio screenshot URLs directly on the Portfolio cards.
- WhatsApp buttons stay everywhere else on the site.

## Cloudflare Worker

`cloudflare/worker` emails you each new request and looks up IP location for admin logins, on Cloudflare's free plan (no Firebase Cloud Functions needed). See its README.

## First-time setup

Follow **FIREBASE_SETUP.md**. In short:

```
npm install
copy .env.example .env.local      (then fill in your Firebase keys)
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
npm run create-admin               (with ADMIN_PASSWORD set, see the guide)
```

## Everyday commands

```
npm run dev        # local development
npm run build      # production build into dist/
npm run typecheck  # TypeScript check
npm run lint
```

## Editing content

- Contact details, services, portfolio text, FAQs, pricing: `src/lib/site-config.ts`.
- Logo: `public/logo.svg`.
- Legal text: `src/pages/Terms.tsx` and `src/pages/Privacy.tsx` (review them with a lawyer before relying on them).
- Portfolio screenshots: sign in as admin and use the **Add image / Edit image** button on each card. Images are stored as URLs in Firestore (`content/portfolio`).

## Performance

Pages are code-split and cached. The Firebase SDK is only downloaded when it is needed (form, portfolio images, admin). Built files in `/assets` are cached for a year by Vercel (`vercel.json`), and portfolio image URLs are cached in the browser and refreshed in the background.
