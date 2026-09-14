# lumiqgen — Execution Plan (this build)

Product plan lives in the master doc. This file tracks what THIS codebase ships now,
in build order. Target: live at https://qgen.luminaraconsulting.co on Railway + Postgres.

## Scope shipped in v1 (Phases 0–2 of the master roadmap, plus Smart QR routing)

### Free layer (no signup, zero server cost)
- [x] Landing page `/` with live client-side generator (renders as you type)
- [x] `/qr/[type]` SEO pages, each with a working tool + guide + FAQ (JSON-LD schema):
      url, whatsapp, upi, wifi, google-review, vcard, email, sms, phone, text
- [x] PNG / SVG download, copy-to-clipboard, colors, error correction, size, logo overlay
- [x] Pricing page, Privacy, Terms, Contact, Refund (AdSense-approvable surface)
- [x] sitemap.xml, robots.txt, OpenGraph metadata

### Paid-capable core
- [x] Auth: email + password (bcrypt), JWT session cookie (jose), middleware-guarded dashboard
- [x] Postgres via Prisma: User, Workspace, QRCode, ScanEvent (master-plan data model)
- [x] Dynamic QR: create, edit destination *after* printing, pause/activate, delete
- [x] Redirect `/r/[code]`: 302 (never 301), in-memory hot cache before DB,
      scan logging fire-and-forget via `after()` — never blocks the redirect
- [x] Smart QR rules: device (iOS/Android/desktop), time-of-day schedule, geo country → URL
- [x] Analytics: total/unique scans, 30-day time series, device / OS / browser / country / referrer
- [x] Plan limits enforced in code (Free trial: 3 dynamic QRs; Creator 25; Business 250; Agency 2000)

### Deliberately deferred (master plan phases 3+)
- Razorpay checkout (billing page ships as plan-aware stub; needs live keys)
- Bulk CSV, team seats, public API, hosted landing pages `/p/[code]`, white-label
- Redis cache (in-memory LRU now; Upstash slot ready in `lib/cache.js`)

## Non-negotiables encoded in the redirect path
1. 302, never 301
2. cache before DB
3. scan logging never blocks the redirect
4. free static QRs render 100% client-side — no server involvement, no expiry, no watermark

## Deploy
- Railway project (Hobby), service `qgen` + Postgres plugin, region EU West
- Node pinned ≥22 (engines + .nvmrc), build `npm install` (never `npm ci` on Railway)
- `npx prisma migrate deploy` in start command
- Domain: CNAME `qgen` → Railway target at GoDaddy (same drill as lumihop)

## Local dev
```bash
createdb lumiqr                      # homebrew postgres 16
cp .env.example .env                 # DATABASE_URL preset for local
npx prisma migrate dev
npm run dev
```
