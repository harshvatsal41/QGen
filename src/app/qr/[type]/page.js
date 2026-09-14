import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import QRGenerator from "@/components/QRGenerator";
import { QR_TYPES, QR_TYPE_SLUGS, getType } from "@/lib/qr-types";

export function generateStaticParams() {
  return QR_TYPE_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({ params }) {
  const { type } = await params;
  const def = getType(type);
  if (!def) return {};
  const label = def.label.toLowerCase();
  return {
    title: def.seo.title,
    description: def.seo.description,
    alternates: { canonical: `/qr/${type}` },
    keywords: [
      `${label} qr code`,
      `${label} qr code generator`,
      `free ${label} qr code`,
      `qr code for ${label}`,
      "qr code generator", "free qr code", "no watermark qr code",
    ],
    openGraph: {
      title: def.seo.title,
      description: def.seo.description,
      url: `/qr/${type}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: def.seo.title,
      description: def.seo.description,
    },
  };
}

export default async function QRTypePage({ params }) {
  const { type } = await params;
  const def = getType(type);
  if (!def) notFound();

  const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: def.seo.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // The visible breadcrumb, restated for machines.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "lumiqgen", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: `${def.label} QR code`,
        item: `${BASE}/qr/${type}`,
      },
    ],
  };

  // The tool on this page as a rich result: a free web app, price zero.
  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${def.label} QR Code Generator`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    url: `${BASE}/qr/${type}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": `${BASE}/#organization` },
  };

  // The guide, as explicit steps.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to create a free ${def.label.toLowerCase()} QR code`,
    step: [
      {
        "@type": "HowToStep",
        name: "Fill in the details",
        text: `Enter the ${def.label.toLowerCase()} details in the generator — everything renders in your browser and nothing is uploaded.`,
      },
      {
        "@type": "HowToStep",
        name: "Preview the code",
        text: "The QR code updates instantly as you type. Scan it with your phone camera to check it.",
      },
      {
        "@type": "HowToStep",
        name: "Download and print",
        text: "Download as PNG for screens and documents, or SVG for razor-sharp printing at any size. The code never expires and carries no watermark.",
      },
    ],
  };

  const others = QR_TYPE_SLUGS.filter((s) => s !== type).slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <SiteNav />
      <main>
        {/* tool above the fold — the page IS the product */}
        <section className="relative overflow-hidden">
          <div className="aura absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-12">
            <nav className="mb-6 text-xs text-faint">
              <Link href="/" className="hover:text-ink">lumiqgen</Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted">{def.label} QR code</span>
            </nav>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {def.seo.h1}
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{def.seo.intro}</p>
            <div className="mt-8">
              <QRGenerator initialType={type} />
            </div>
          </div>
        </section>

        {/* guide */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
              How to get the most from a {def.label.toLowerCase()} QR code
            </h2>
            <div className="prose-lumi">
              {def.seo.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* in-context dynamic upsell */}
            <aside className="mt-10 rounded-2xl border border-accent/25 bg-accent-soft/50 p-6">
              <h3 className="font-semibold text-ink">
                Need to change this later without reprinting?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                A dynamic QR keeps the printed pattern fixed while the
                destination stays editable — and counts every scan by device,
                city and time. Your first 3 dynamic codes are free.
              </p>
              <Link href={`/signup?type=${type}`} className="btn btn-accent mt-4 text-sm">
                Make it dynamic
              </Link>
            </aside>

            {/* FAQ */}
            <h2 className="mb-2 mt-14 text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-line">
              {def.seo.faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer select-none items-center justify-between text-[15px] font-medium text-ink">
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
        </section>

        {/* cross-links */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
              More free generators
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((s) => (
                <Link key={s} href={`/qr/${s}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-deep">
                  {QR_TYPES[s].label} QR code
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
