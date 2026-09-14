import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Analytics" };

const DAYS = 30;

export default async function AnalyticsPage({ params }) {
  const { id } = await params;
  const user = await requireUser();
  const workspace = user.workspaces[0];

  const qr = await db.qRCode.findUnique({ where: { id } });
  if (!qr || qr.workspaceId !== workspace.id) notFound();

  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
  const events = await db.scanEvent.findMany({
    where: { qrId: id, ts: { gte: since } },
    select: { ts: true, device: true, os: true, browser: true, country: true, referrer: true, isUnique: true },
    orderBy: { ts: "asc" },
    take: 50000,
  });

  const uniques = events.filter((e) => e.isUnique).length;

  // daily series
  const byDay = new Map();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const e of events) {
    const k = e.ts.toISOString().slice(0, 10);
    if (byDay.has(k)) byDay.set(k, byDay.get(k) + 1);
  }
  const series = [...byDay.entries()];

  const breakdown = (key, fallback = "Unknown") => {
    const m = new Map();
    for (const e of events) {
      const v = e[key] || fallback;
      m.set(v, (m.get(v) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  };

  return (
    <>
      <nav className="mb-4 text-xs text-faint">
        <Link href="/dashboard" className="hover:text-ink">QR codes</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/dashboard/qr/${id}`} className="hover:text-ink">{qr.title}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">Analytics</span>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight">{qr.title}</h1>
      <p className="mt-1 text-sm text-muted">Last {DAYS} days · updated live</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile label="Scans (all time)" value={qr.scanCount.toLocaleString("en-IN")} />
        <Tile label={`Scans (${DAYS}d)`} value={events.length.toLocaleString("en-IN")} />
        <Tile label={`Unique visitors (${DAYS}d)`} value={uniques.toLocaleString("en-IN")} />
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-sm font-semibold">Scans per day</h2>
        <div className="mt-4 overflow-x-auto">
          <DailyChart series={series} />
        </div>
      </div>

      {events.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-sm text-muted">
            No scans yet. Point a phone camera at your printed code — the first
            scan shows up here within seconds.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Breakdown title="Device" rows={breakdown("device")} total={events.length} />
          <Breakdown title="Operating system" rows={breakdown("os")} total={events.length} />
          <Breakdown title="Browser" rows={breakdown("browser")} total={events.length} />
          <Breakdown title="Country" rows={breakdown("country", "Unknown")} total={events.length} />
          <Breakdown title="Referrer" rows={breakdown("referrer", "Direct scan")} total={events.length} />
        </div>
      )}
    </>
  );
}

function Tile({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

// Single-series column chart, server-rendered SVG. Accent hue only; native
// <title> tooltips; recessive baseline; sparse date labels.
function DailyChart({ series }) {
  const W = 720;
  const H = 160;
  const PAD = 4;
  const max = Math.max(1, ...series.map(([, v]) => v));
  const bw = (W - PAD * 2) / series.length;

  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="min-w-[560px]" role="img"
      aria-label={`Scans per day over the last ${series.length} days`}>
      {series.map(([date, v], i) => {
        const h = v === 0 ? 2 : Math.max(3, (v / max) * (H - 10));
        const x = PAD + i * bw;
        const label = new Date(date + "T00:00:00Z").toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
        return (
          <g key={date}>
            <rect
              x={x + 1}
              y={H - h}
              width={Math.max(2, bw - 2)}
              height={h}
              rx="2"
              fill={v === 0 ? "var(--color-line)" : "var(--color-accent)"}
            >
              <title>{`${label}: ${v} scan${v === 1 ? "" : "s"}`}</title>
            </rect>
            {i % 7 === 0 && (
              <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="var(--color-faint)">
                {label}
              </text>
            )}
          </g>
        );
      })}
      <line x1="0" y1={H + 0.5} x2={W} y2={H + 0.5} stroke="var(--color-line)" />
    </svg>
  );
}

function Breakdown({ title, rows, total }) {
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-xs text-faint">No data yet</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map(([label, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <li key={label}>
                <div className="flex items-baseline justify-between gap-2 text-[13px]">
                  <span className="truncate capitalize text-ink-soft">{label}</span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {count.toLocaleString("en-IN")} · {pct}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, pct)}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
