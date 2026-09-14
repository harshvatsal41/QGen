import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { planFor } from "@/lib/plans";
import StatusDot from "@/components/StatusDot";

export default async function DashboardPage() {
  const user = await requireUser();
  const workspace = user.workspaces[0];
  const plan = planFor(workspace);

  const qrcodes = await db.qRCode.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
  });
  const totalScans = qrcodes.reduce((s, q) => s + q.scanCount, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QR codes</h1>
          <p className="mt-1 text-sm text-muted">
            {qrcodes.length} of {plan.dynamicLimit} dynamic codes ·{" "}
            <span className="font-medium text-ink-soft">{plan.name} plan</span>
          </p>
        </div>
        <Link href="/dashboard/qr/new" className="btn btn-accent text-sm">
          + Create QR
        </Link>
      </div>

      {/* stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Total scans" value={totalScans.toLocaleString("en-IN")} />
        <StatTile label="Active codes" value={qrcodes.filter((q) => q.status === "active").length} />
        <StatTile label="Dynamic codes" value={`${qrcodes.length} / ${plan.dynamicLimit}`} />
      </div>

      {qrcodes.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-2xl">✨</div>
          <h2 className="mt-5 text-lg font-semibold">Create your first dynamic QR</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Print it once, repoint it forever. You have {plan.dynamicLimit} dynamic
            codes on the {plan.name} plan — the printed pattern never changes while
            you edit where it goes.
          </p>
          <Link href="/dashboard/qr/new" className="btn btn-primary mt-6 text-sm">
            Create a dynamic QR
          </Link>
        </div>
      ) : (
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-faint">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Short link</th>
                <th className="px-5 py-3 text-right font-medium">Scans</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {qrcodes.map((q) => (
                <tr key={q.id} className="group hover:bg-paper/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/qr/${q.id}`} className="font-medium text-ink hover:text-accent-deep">
                      {q.title}
                    </Link>
                    {q.campaign && <span className="ml-2 rounded-full bg-paper px-2 py-0.5 text-xs text-muted">{q.campaign}</span>}
                    <p className="mt-0.5 max-w-xs truncate text-xs text-faint">{q.destination}</p>
                  </td>
                  <td className="hidden px-5 py-3.5 font-mono text-xs text-muted sm:table-cell">/r/{q.shortCode}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{q.scanCount.toLocaleString("en-IN")}</td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">
                    <StatusDot status={q.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/dashboard/qr/${q.id}/analytics`} className="text-xs font-medium text-accent-deep opacity-0 transition-opacity group-hover:opacity-100">
                      Analytics →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}
