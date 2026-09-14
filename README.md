# lumiqgen

Free QR creation for everyone. Powerful QR management for businesses.
A product of Luminara Software Solutions — live at https://qgen.luminaraconsulting.co

*Create once. Change anytime. Know who scanned.*

## What this is

- **Free layer** — static QR generator for 10 types (URL, WhatsApp, UPI, Wi-Fi,
  Google Review, vCard, email, SMS, phone, text). 100% client-side: nothing is
  uploaded, nothing expires, no watermark, no signup. Each type has its own SEO
  page with a guide and FAQ schema.
- **Paid layer** — dynamic QR codes: the printed pattern encodes a short
  `/r/<code>` link whose destination stays editable forever, with scan
  analytics (device / OS / browser / country / referrer / uniques) and Smart
  routing (iOS vs Android vs desktop, time-of-day windows, country).

See `PLAN.md` for the build plan and the master product doc for strategy.

## Stack

Next.js (App Router, JS, Tailwind v4) · Prisma + Postgres · bcryptjs + jose
sessions · `qrcode` for client-side generation · ua-parser-js on the redirect.

## Local dev

```bash
createdb lumiqr                 # homebrew postgres
cp .env.example .env            # then set AUTH_SECRET (openssl rand -hex 32)
npm install
npx prisma migrate dev
npm run dev
```

## Deploy (Railway)

Service + Postgres plugin. Env vars: `DATABASE_URL` (reference the plugin),
`AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL=https://qgen.luminaraconsulting.co`,
`NIXPACKS_INSTALL_CMD=npm install` (never `npm ci` on Railway — its cache
mount inside node_modules makes `npm ci` fail EBUSY).
`npm run start` runs `prisma migrate deploy` before `next start`.
Node is pinned ≥22 via `engines` + `.nvmrc`.

## The redirect path (do not break these)

1. `/r/[code]` answers **302, never 301** — a cached 301 would freeze the
   destination in scanners forever.
2. Cache before DB — in-memory 60s TTL LRU (`src/lib/cache.js`); edits
   propagate within a minute.
3. Scan logging is fire-and-forget via `after()` — never blocks the redirect.
4. Free static QRs render entirely in the browser — no server dependency.
