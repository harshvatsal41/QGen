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
  openGraph: {
    siteName: "lumiqgen",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
