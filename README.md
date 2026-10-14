# TapNet Network

TapNet sells affordable prepaid internet in Kenya. Customers compare plans, subscribe, pay, and manage a line. Staff manage customers, packages, subscriptions, payments, routers, tickets, and audit logs.

The public site and both portals are a Vite + React app. Account, package, ticket, and router screens use the in-app mock in `src/services/api.js`. Payments do not: M-Pesa STK Push and Airtel Money run through `/api` and are stored in Postgres. The Flask API in `backend/` is separate and is not required to build or deploy the website.

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

## Payments

Copy `.env.example` to `.env` for local prompts. The site still builds with those values empty. A real prompt needs `DATABASE_URL` plus either the Daraja keys or the IntaSend keys.

- M-Pesa uses Safaricom Daraja STK Push. The package starts only after an STK status query returns success.
- Airtel Money uses the IntaSend collection API. The package starts only after a webhook with the matching challenge, followed by a status check, or after that same status check from the payment page.
- Amounts are the catalog prices in Kenyan shillings. The browser cannot set the amount.
- `npm test` runs the payment checks.

The contact form confirms on the page only. It does not send mail.

## Deploying on Vercel

1. Import the Git repository in Vercel, or push to the branch the existing project already tracks.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add the variables from `.env.example` in Project Settings. Do not commit filled-in secrets.
6. `vercel.json` sends every path except `/api` to `index.html`. The files in `api/` are the payment functions.

The current project is [tapnet-network-udrn](https://tapnet-network-udrn.vercel.app). After this change is on the production branch, redeploy that project. The Flask backend is not part of this Vercel build.
