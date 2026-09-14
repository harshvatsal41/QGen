import { after } from "next/server";
import { createHash } from "crypto";
import { UAParser } from "ua-parser-js";
import { db } from "@/lib/db";
import { cacheGet, cacheSet } from "@/lib/cache";
import { resolveDestination } from "@/lib/resolve";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// The one route that must never be slow or down.
// Non-negotiables: 302 never 301 · cache before DB · logging never blocks.
export async function GET(req, ctx) {
  const { code } = await ctx.params;

  let qr = cacheGet(code);
  if (qr === undefined) {
    qr = await db.qRCode.findUnique({
      where: { shortCode: code },
      select: { id: true, destination: true, rules: true, status: true, expiresAt: true },
    });
    cacheSet(code, qr ?? null);
  }

  if (!qr || qr.status !== "active" || (qr.expiresAt && qr.expiresAt < new Date())) {
    return Response.redirect(`${BASE}/expired`, 302);
  }

  const ua = req.headers.get("user-agent") || "";
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;

  const target = resolveDestination(qr, { ua, country, now: new Date() });

  const referrer = req.headers.get("referer") || null;
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();

  // Fire-and-forget: runs after the response is sent.
  after(() => logScan({ qrId: qr.id, ua, country, referrer, ip }));

  return Response.redirect(target, 302);
}

async function logScan({ qrId, ua, country, referrer, ip }) {
  try {
    const parsed = new UAParser(ua).getResult();
    const device = parsed.device?.type || (ua ? "desktop" : null);
    const os = parsed.os?.name || null;
    const browser = parsed.browser?.name || null;

    // Daily visitor hash: IP is hashed with the date and discarded — we never
    // store raw IPs (see privacy policy).
    const day = new Date().toISOString().slice(0, 10);
    const visitorHash = ip
      ? createHash("sha256").update(`${ip}|${ua}|${qrId}|${day}`).digest("hex").slice(0, 32)
      : null;

    let isUnique = true;
    if (visitorHash) {
      const seen = await db.scanEvent.findFirst({
        where: { qrId, visitorHash, ts: { gte: new Date(`${day}T00:00:00Z`) } },
        select: { id: true },
      });
      isUnique = !seen;
    }

    await db.$transaction([
      db.scanEvent.create({
        data: { qrId, device, os, browser, country, referrer, visitorHash, isUnique },
      }),
      db.qRCode.update({ where: { id: qrId }, data: { scanCount: { increment: 1 } } }),
    ]);
  } catch (err) {
    // Analytics loss is acceptable; a broken redirect is not.
    console.error("scan log failed", err?.message);
  }
}
