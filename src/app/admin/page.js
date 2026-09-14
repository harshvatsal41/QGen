import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/plans";
import StatusDot from "@/components/StatusDot";

export default async function AdminOverview() {
  await requireAdmin();

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [userCount, qrCount, scanCount, scans30, planGroups, users, topQrs] =
    await Promise.all([
      db.user.count(),
      db.qRCode.count(),
      db.scanEvent.count(),
      db.scanEvent.count({ where: { ts: { gte: since30 } } }),
      db.workspace.groupBy({ by: ["plan"], _count: { plan: true } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          workspaces: {
            include: {
              qrcodes: { select: { scanCount: true } },
              _count: { select: { qrcodes: true } },
            },
          },
        },
      }),
      db.qRCode.findMany({
        orderBy: { scanCount: "desc" },
        take: 8,
        include: { workspace: { include: { owner: { select: { email: true } } } } },
      }),
    ]);

  const planDist = Object.fromEntries(planGroups.map((g) => [g.plan, g._count.plan]));

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
      <p className="mt-1 text-sm text-muted">
        {Object.entries(PLANS)
          .map(([key, p]) => `${p.name} ${planDist[key] || 0}`)
          .join(" · ")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Tile label="Users" value={userCount} />
        <Tile label="Dynamic QRs" value={qrCount} />
        <Tile label="Scans (all time)" value={scanCount} />
        <Tile label="Scans (30d)" value={scans30} />
      </div>

      {/* users */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight">Users</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-faint">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 text-right font-medium">QRs</th>
              <th className="px-5 py-3 text-right font-medium">Scans</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => {
              const ws = u.workspaces[0];
              const qrs = ws?._count.qrcodes ?? 0;
              const scans = ws?.qrcodes.reduce((s, q) => s + q.scanCount, 0) ?? 0;
              return (
                <tr key={u.id} className="hover:bg-paper/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/users/${u.id}`} className="font-medium text-ink hover:text-accent-deep">
                      {u.email}
                    </Link>
                    {u.name && <p className="mt-0.5 text-xs text-faint">{u.name}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium capitalize text-accent-deep">
                      {ws?.plan ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{qrs}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{scans.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5 text-xs text-muted">
                    {u.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/users/${u.id}`} className="text-xs font-medium text-accent-deep">
                      Manage →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* top codes */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight">Most scanned codes</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-faint">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Owner</th>
              <th className="px-5 py-3 font-medium">Short code</th>
              <th className="px-5 py-3 text-right font-medium">Scans</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {topQrs.map((q) => (
              <tr key={q.id} className="hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{q.title}</p>
                  <p className="mt-0.5 max-w-xs truncate text-xs text-faint">{q.destination}</p>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted">{q.workspace.owner.email}</td>
                <td className="px-5 py-3.5 font-mono text-xs">{q.shortCode}</td>
                <td className="px-5 py-3.5 text-right tabular-nums">{q.scanCount.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3.5"><StatusDot status={q.status} /></td>
              </tr>
            ))}
            {topQrs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-faint">No dynamic codes yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Tile({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {Number(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
