import Link from "next/link";
import { Logo } from "./Logo";
import { QR_TYPES } from "@/lib/qr-types";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Create once. Change anytime. Know who scanned. Free QR creation for
              everyone — powerful QR management for businesses.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              QR generators
            </h3>
            <ul className="mt-4 space-y-2.5">
              {Object.entries(QR_TYPES).map(([slug, t]) => (
                <li key={slug}>
                  <Link href={`/qr/${slug}`} className="text-sm text-white/70 hover:text-white">
                    {t.label} QR code
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/pricing" className="text-sm text-white/70 hover:text-white">Pricing</Link></li>
              <li><Link href="/signup" className="text-sm text-white/70 hover:text-white">Dynamic QR codes</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/70 hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/contact" className="text-sm text-white/70 hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/70 hover:text-white">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/70 hover:text-white">Terms of service</Link></li>
              <li><Link href="/refund" className="text-sm text-white/70 hover:text-white">Refund policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Luminara Software Solutions. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Free static QR codes never expire and carry no watermark. Ever.
          </p>
        </div>
      </div>
    </footer>
  );
}
