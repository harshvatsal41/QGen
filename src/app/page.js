import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import QRGenerator from "@/components/QRGenerator";
import { QR_TYPES } from "@/lib/qr-types";

export const metadata = {
  title: "lumiqgen — Free QR Code Generator. No signup, no watermark, no expiry.",
  description:
    "Create free QR codes for URL, WhatsApp, UPI, Wi-Fi, Google Review, vCard and more — instantly, in your browser. Upgrade to dynamic QR to edit destinations after printing and track every scan.",
  alternates: { canonical: "/" },
};

const TYPE_ICONS = {
  url: "🔗", whatsapp: "💬", upi: "₹", wifi: "📶", "google-review": "⭐",
  vcard: "👤", email: "✉️", sms: "📱", phone: "📞", text: "📄",
};

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// The product as a rich result: a free web application with a paid tier.
const appLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "lumiqgen",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  url: BASE,
  description:
    "Free QR code generator with no signup, watermark or expiry, plus dynamic QR codes with editable destinations and scan analytics.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
    { "@type": "Offer", name: "Creator", price: "199", priceCurrency: "INR" },
  ],
  publisher: { "@id": `${BASE}/#organization` },
};

// The ten generators as a crawlable list, mirroring the visible grid.
const listLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: Object.entries(QR_TYPES).map(([slug, t], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${t.label} QR code generator`,
    url: `${BASE}/qr/${slug}`,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <SiteNav />
      <main>
        {/* ---- hero + generator ---- */}
        <section className="relative overflow-hidden">
          <div className="dotgrid absolute inset-0" aria-hidden="true" />
          <div className="aura absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-good" />
                Free forever · No signup · No watermark
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
                QR codes that
                <br />
                <span className="bg-gradient-to-r from-accent to-[#3ec5ff] bg-clip-text text-transparent">
                  actually work.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Create once. Change anytime. Know who scanned. Free static QR
                codes for everyone — powerful dynamic QR management for
                businesses.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-4xl">
              <QRGenerator />
            </div>
          </div>
        </section>

        {/* ---- type grid ---- */}
        <section id="types" className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              A QR code for everything India runs on
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-muted">
              Every type has its own free generator with a guide — WhatsApp,
              UPI and Google Review are first-class citizens here, not
              afterthoughts.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Object.entries(QR_TYPES).map(([slug, t]) => (
                <Link
                  key={slug}
                  href={`/qr/${slug}`}
                  className="card group flex flex-col items-start gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-lg">
                    {TYPE_ICONS[slug]}
                  </span>
                  <span className="text-sm font-semibold text-ink group-hover:text-accent-deep">
                    {t.label}
                  </span>
                  <span className="text-xs text-faint">Free generator →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- static vs dynamic ---- */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent-deep">
                  The part worth paying for
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Printed ink is permanent.
                  <br />
                  Your destination shouldn&apos;t be.
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  A dynamic QR encodes a short lumiqgen link — so the code on
                  your menus, packaging and posters never changes, while where
                  it points is always one click away. Swap the Monday menu for
                  the Friday special. Reroute a campaign. Fix a typo in a URL
                  that&apos;s already on 10,000 boxes.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Edit after printing", "Repoint any code in seconds, forever."],
                    ["Scan analytics", "Device, city, time — every scan counted."],
                    ["Smart routing", "iPhone → App Store, Android → Play Store, 9 pm → WhatsApp."],
                    ["Campaigns", "Name codes, group them, compare performance."],
                  ].map(([h, d]) => (
                    <div key={h} className="rounded-xl border border-line bg-white p-4">
                      <h3 className="text-sm font-semibold">{h}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">{d}</p>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="btn btn-accent mt-8">
                  Try dynamic QR — 3 free codes
                </Link>
              </div>

              {/* restaurant story graphic */}
              <div className="card overflow-hidden shadow-pop">
                <div className="border-b border-line bg-paper px-5 py-3 text-xs font-medium text-muted">
                  Table 12 · printed once in January
                </div>
                <div className="space-y-0 p-6 font-mono text-sm">
                  {[
                    ["Mon", "menu-monday.pdf", false],
                    ["Tue", "menu-tuesday.pdf", false],
                    ["Fri", "friday-special.pdf", true],
                    ["Sat", "weekend-buffet.pdf", false],
                  ].map(([day, dest, hot]) => (
                    <div
                      key={day}
                      className={`flex items-center justify-between border-b border-line/60 py-3 last:border-0 ${
                        hot ? "text-accent-deep" : "text-ink-soft"
                      }`}
                    >
                      <span className="text-faint">{day}</span>
                      <span className="mx-3 h-px flex-1 bg-line" />
                      <span>{dest}</span>
                      {hot && (
                        <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-sans font-semibold">
                          live now
                        </span>
                      )}
                    </div>
                  ))}
                  <p className="pt-4 text-xs text-faint">
                    Same printed code. Zero reprints. 12,482 scans tracked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- promise strip ---- */}
        <section className="border-t border-line bg-night text-white">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {[
                ["Free means free", "Static QR codes never expire, never get watermarked, and never need an account."],
                ["Your scan, un-hijacked", "We never put an ad between a scan and your page. The redirect is instant."],
                ["Built for India", "UPI, WhatsApp and Google Review first. Priced in ₹, billed by Razorpay."],
              ].map(([h, d]) => (
                <div key={h}>
                  <h3 className="font-semibold">{h}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/55">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- final CTA ---- */}
        <section>
          <div className="mx-auto max-w-6xl px-5 py-20 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Start free. Upgrade when the scans do.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Plans from ₹199/month when you need more dynamic codes, deeper
              analytics and smart routing.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/signup" className="btn btn-primary">Create a dynamic QR</Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
