# TapNet Network

TapNet sells affordable prepaid internet in Kenya. Customers compare plans, subscribe, pay, and manage a line. Staff manage customers, packages, subscriptions, payments, routers, tickets, and audit logs.

The public site and both portals are a Vite + React app. The browser currently talks to the in-app mock service in `src/services/api.js`, which is what the live Vercel site already uses. The Flask API in `backend/` is separate and is not required to build or deploy the website.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Preview accounts are filled in on the sign-in screens:

- Customer: `john@example.com`
- Staff: `admin@tapnet.co.ke`

The preview accepts those filled-in passwords. Do not replace them with real credentials in the repo.

## Production build

```bash
npm run build
npm run preview
```

The static site is written to `dist/`. `vercel.json` rewrites unknown paths to `index.html` so client-side routes such as `/plans` and `/dashboard` survive a refresh.

## Deploying on Vercel

No environment variables or secrets are required for this frontend.

1. Import the Git repository in Vercel, or push to the branch the existing project already tracks.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Leave environment variables empty. The contact form confirms on the page only; it does not send mail.

The current project is [tapnet-network-udrn](https://tapnet-network-udrn.vercel.app). After this change is on the production branch, redeploy that project. The Flask backend is not part of this Vercel build.
