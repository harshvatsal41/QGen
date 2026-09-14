const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/r/", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
