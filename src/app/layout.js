import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "lumiqgen — Free QR Code Generator. Create once, change anytime.",
    template: "%s · lumiqgen",
  },
  description:
    "Free QR codes for URL, WhatsApp, UPI, Wi-Fi, Google Review and more — no signup, no watermark, no expiry. Upgrade to dynamic QR for editable destinations and scan analytics.",
  applicationName: "lumiqgen",
  category: "technology",
  keywords: [
    "qr code generator", "free qr code generator", "qr code maker",
    "dynamic qr code", "qr code with analytics", "editable qr code",
    "upi qr code generator", "whatsapp qr code generator",
    "wifi qr code generator", "google review qr code", "vcard qr code",
    "qr code without watermark", "qr code no signup",
  ],
  authors: [{ name: "Luminara Software Solutions", url: "https://luminaraconsulting.co" }],
  creator: "Luminara Software Solutions",
  publisher: "Luminara Software Solutions",
  formatDetection: { telephone: false },
  openGraph: {
    siteName: "lumiqgen",
    type: "website",
    locale: "en_IN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "lumiqgen — Free QR Code Generator",
    description:
      "Free QR codes with no signup, no watermark, no expiry — and dynamic QR with editable destinations and scan analytics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Sitewide structured data: who publishes this and what the site is. Every page
// carries these two; page-level schemas add the specifics on top.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "Luminara Software Solutions",
  url: "https://luminaraconsulting.co",
  logo: `${BASE}/icon.svg`,
  sameAs: ["https://lumihop.luminaraconsulting.co"],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  name: "lumiqgen",
  url: BASE,
  publisher: { "@id": `${BASE}/#organization` },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {children}
      </body>
    </html>
  );
}
