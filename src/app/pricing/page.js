import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Pricing — Free static QR forever, dynamic QR from ₹199/month",
  description:
    "lumiqgen pricing in ₹. Unlimited free static QR codes. Dynamic QR with editable destinations and scan analytics from ₹199/month. Billed via Razorpay — UPI, cards, netbanking.",
  alternates: { canonical: "/pricing" },
};

const TIERS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    blurb: "For anyone who needs a QR code that just works.",
    cta: ["Create a free QR", "/"],
    accent: false,
    features: [
      "Unlimited static QR codes",
      "All 10 QR types — URL, WhatsApp, UPI, Wi-Fi…",
      "PNG & SVG download, colors, logo",
      "No signup, no watermark, no expiry",
      "3 dynamic QR codes to try the paid layer",
    ],
  },
  {
    name: "Creator",
    price: "₹199",
    period: "/month",
    blurb: "For creators and small shops going dynamic.",
    cta: ["Start 14-day free trial", "/signup?plan=creator"],
    accent: false,
    features: [
      "25 dynamic QR codes",
      "Edit destinations after printing",
      "Scan analytics — device, city, time",
      "Campaign names & organization",
      "Email support",
    ],
  },
  {
    name: "Business",
    price: "₹699",
    period: "/month",
    blurb: "The full toolkit for a growing business.",
    cta: ["Start 14-day free trial", "/signup?plan=business"],
    accent: true,
    badge: "Most popular",
    features: [
      "250 dynamic QR codes",
      "Everything in Creator",
      "Smart routing — device, time & country rules",
      "Advanced analytics & CSV export",
      "Scheduled redirects & pause/resume",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "₹1,999",
    period: "/month",
    blurb: "For agencies managing client campaigns.",
    cta: ["Talk to us", "/contact"],
    accent: false,
    features: [
      "2,000 dynamic QR codes",
      "Everything in Business",
      "Client workspaces (rolling out)",
      "White-label & custom domain (rolling out)",
      "API access (rolling out)",
    ],
  },
];

const FAQS = [
  {
    q: "Will my free static QR codes ever stop working?",
    a: "Never. Static codes encode your data directly in the pattern — they work forever and don't depend on our servers at all. We could vanish tomorrow and your printed codes would still scan.",
  },
  {
    q: "What happens to my dynamic QR codes if I cancel?",
    a: "They enter a grace period in read-only mode rather than dying instantly — your printed codes keep redirecting while you decide. Reactivate any time and everything resumes.",
  },
  {
    q: "How do I pay?",
    a: "Through Razorpay — UPI, all major cards, and netbanking, billed in ₹ with GST invoice. Annual billing gets you 2 months free.",
  },
  {
    q: "What counts as a dynamic QR?",
    a: "Any code whose destination you can edit after creating it. Static codes you generate on the free tools are unlimited and never counted.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Static is free. Forever.
            <br />
            <span className="text-muted">Pay only for management.</span>
          </h1>
          <p className="mt-4 text-muted">
            Editable destinations, analytics, and smart routing — priced in ₹
            for Indian businesses, billed by Razorpay.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`card relative flex flex-col p-6 ${
                t.accent ? "border-accent shadow-pop ring-1 ring-accent/30" : ""
              }`}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white">
                  {t.badge}
                </span>
              )}
              <h2 className="font-semibold">{t.name}</h2>
              <p className="mt-3">
                <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                <span className="ml-1 text-sm text-faint">{t.period}</span>
              </p>
              <p className="mt-2 min-h-10 text-[13px] leading-relaxed text-muted">{t.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-ink-soft">
                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.cta[1]} className={`btn mt-6 w-full text-sm ${t.accent ? "btn-accent" : "btn-ghost"}`}>
                {t.cta[0]}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          Annual billing: 2 months free on every paid plan. Prices exclude GST.
        </p>

        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Questions, answered</h2>
          <div className="mt-6 divide-y divide-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer select-none items-center justify-between text-[15px] font-medium">
                  {f.q}
                  <svg className="ml-4 h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
