import { QR_TYPE_SLUGS } from "@/lib/qr-types";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...QR_TYPE_SLUGS.map((slug) => ({
      url: `${BASE}/qr/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
