# The Resell Path — Ebook Sales Site

React + Vite frontend and Node/Express backend with Stripe Checkout and Resend email delivery.

## Structure

```txt
ebook-site/
  client/
    src/
      App.jsx
      main.jsx
      index.css
      assets/ebook-cover.png
  server/
    server.js
    package.json
    .env.example
    private/The_Resell_Path.pdf
```

## Local setup

### 1) Client

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 2) Server

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On Mac/Linux use `cp .env.example .env` instead of `copy`.

## Required server `.env`

```env
PORT=4242
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=The Resell Path <onboarding@resend.dev>
```

## Stripe CLI webhook test

```bash
stripe login
stripe listen --forward-to localhost:4242/api/webhook
```

Copy the `whsec_...` secret into `STRIPE_WEBHOOK_SECRET`.

## Deploy notes

- Frontend: Vercel/Netlify, build command `npm run build`, output `dist`, env `VITE_API_URL=https://your-backend.onrender.com`.
- Backend: Render Web Service, root `server`, build `npm install`, start `npm start`.
- Put the PDF in `server/private/`, not in `client/public` or `client/src/assets` except for the public cover image.
