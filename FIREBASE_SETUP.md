# Firebase setup (do this once)

You already have the Firebase project. These steps connect it to the site.
Run all commands in the project folder (the one containing `package.json`).

## 1. Register the web app and copy its keys

1. Firebase console > Project settings (gear icon) > General > **Your apps** > add a **Web** app (`</>`), nickname `optimabyte`. Skip "Firebase Hosting".
2. Copy the `firebaseConfig` values into a new file named `.env.local` (copy `.env.example` and fill it in):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

These keys are safe to ship in a website. Access is controlled by `firestore.rules`, not by hiding the keys.

## 2. Turn on sign-in and create the database

- **Authentication** > Get started > Sign-in method > enable **Email/Password**.
- **Firestore Database** > Create database > **Production mode** > pick a region close to Kenya (for example `europe-west1`, or `africa-south1` if offered).

## 3. Deploy the security rules

```
npx firebase-tools login
copy .firebaserc.example .firebaserc
```

Edit `.firebaserc` and replace `YOUR-FIREBASE-PROJECT-ID` with your project id, then:

```
npx firebase-tools deploy --only firestore:rules
```

(On macOS/Linux use `cp` instead of `copy`.) The rules are what enforce the limit of 3 requests per hour per email and per device, and keep reports private to the admin. Do not skip this step: until the rules are deployed, the form cannot save and admin pages cannot load.

## 4. Create the admin account (admin@optimabyte.com, name "Admin")

Pick a strong password (at least 10 characters), then run **one** of these:

PowerShell (Windows):
```
$env:ADMIN_PASSWORD="your-strong-password"; npm run create-admin
```

macOS / Linux:
```
ADMIN_PASSWORD='your-strong-password' npm run create-admin
```

Or do it by hand: Firebase console > Authentication > Users > Add user, email `admin@optimabyte.com`.

The email is fixed in the code and in `firestore.rules`. No other account can be admin.

## 5. Recommended: stop strangers creating accounts

Authentication > Settings > User actions > untick **Enable create (sign-up)** > Save.
Nobody else ever needs an account, and the rules already block non-admins, but this closes the door completely.

## 6. Add the keys to Vercel

Vercel > your project > Settings > Environment Variables: add the same six `VITE_FIREBASE_*` values for Production, Preview and Development, then **redeploy**. (Vite bakes them in at build time, so a redeploy is required after any change.)

## 7. Test it

1. Open the site > Contact > fill the form > tick "I'm not a robot" > Send request. You should see the "Thank you" popup.
2. Click **Admin** (top right), enter your password. You are now signed in as Admin.
3. Open **Reports** from the Admin menu (or the nav bar). Your test request is there.
4. Open **Portfolio** while signed in: each card has an **Add image** button where you paste an image URL.

## 8. Replying to requests

Every new request is emailed to you automatically (via the Cloudflare Worker in step 10), and is also saved in Reports. Open Reports, click **Reply** to open your email app with the customer's address filled in, or **WhatsApp** if they left a number. Set the status as you go: **Pending** (default), **In progress**, **Completed**. Filter by status with the chips at the top. Reports update live.

## 9. Optional: stronger bot protection (App Check)

The "I'm not a robot" box and the rate limits stop casual spam. For real protection against scripts, add Firebase App Check:

1. Create a reCAPTCHA v3 site key at https://www.google.com/recaptcha/admin (add your domain).
2. Firebase console > App Check > your web app > register with reCAPTCHA v3 and the secret key.
3. Put the site key in `.env.local` and Vercel as `VITE_RECAPTCHA_SITE_KEY`, redeploy.
4. Check the site works, then App Check > Firestore > **Enforce**.

If you turn this on, add one line about Google reCAPTCHA to the Privacy Policy.

## 10. Email alerts and login location (Cloudflare Worker, free)

Firebase Cloud Functions need the paid Blaze plan, so the two jobs that would need them run on a free Cloudflare Worker instead: the email alert on each new request, and the IP/city lookup for the Login activity page. Follow `cloudflare/worker/README.md`, then add `VITE_WORKER_URL` to `.env.local` and Vercel and redeploy. The rest of the site works without it; you just won't get emails or IP info.

Nothing else here needs Cloud Functions, and no paid plan is needed: Firestore (Spark plan) holds everything, and portfolio images are plain URLs so Firebase Storage is not used.

## 11. Redeploy the rules after this update

The status names changed (Pending / In progress / Completed) and there is a new `adminLogins` collection, so deploy the rules again:

```
npx firebase-tools deploy --only firestore:rules
```

Old requests keep working: "new" shows as Pending, "replied" and "closed" show as Completed.

## Admin sign-in is locked down

- The popup shows the admin email read-only; only the password is typed.
- After 5-ish wrong attempts Firebase temporarily blocks sign-in from that device.
- Anyone who somehow signs in with a different account is signed straight back out, and the rules would refuse them anyway.
- The session lasts only for the open browser tab. Closing the tab or browser signs you out.
- After 1 hour with no activity (no clicks, keys, scrolling or touch) you are signed out automatically, with a warning 5 minutes before.
- Signing out replaces the admin page in history, so pressing Back does not show it, and admin pages are sent with `no-store` so the browser does not keep a copy.
- Every sign-in is logged (time, device, browser, IP and city, and precise GPS location if the browser permits). Open **Admin menu > Login activity**. Only the latest 5 are kept; older ones are deleted automatically. Your browser will ask for location permission on sign-in: choose Allow to get the precise position.
