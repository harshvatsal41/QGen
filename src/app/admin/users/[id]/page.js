import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { PLANS, planFor } from "@/lib/plans";
import { adminSetPlan, adminToggleQr } from "@/app/admin-actions";
import AdminDeleteUserButton from "@/components/AdminDeleteUserButton";
import StatusDot from "@/components/StatusDot";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function AdminUserPage({ params }) {
  const admin = await requireAdmin();
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      workspaces: {
        include: { qrcodes: { orderBy: { scanCount: "desc" } } },
      },
    },
  });
  if (!user) notFound();
  const ws = user.workspaces[0];
  const plan = planFor(ws);
  const totalScans = ws?.qrcodes.reduce((s, q) => s + q.scanCount, 0) ?? 0;

  return (
    <>
      <nav className="mb-4 text-xs text-faint">
        <Link href="/admin" className="hover:text-ink">Admin</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">{user.email}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name || user.email}</h1>
          <p className="mt-1 text-sm text-muted">
            {user.email} · joined{" "}
            {user.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile label="Dynamic QRs" value={`${ws?.qrcodes.length ?? 0} / ${plan.dynamicLimit}`} />
        <Tile label="Total scans" value={totalScans.toLocaleString("en-IN")} />
        <Tile label="Plan" value={plan.name} />
      </div>

      {/* plan management */}
      {ws && (
        <div className="card mt-6 max-w-xl p-6">
          <h2 className="text-sm font-semibold">Change plan</h2>
          <p className="mt-1 text-xs text-muted">
            Manual activation — use this after a Razorpay payment or for comped accounts.
          </p>
          <form action={adminSetPlan} className="mt-4 flex items-center gap-3">
            <input type="hidden" name="workspaceId" value={ws.id} />
            <select name="plan" defaultValue={ws.plan} className="field !w-44 !py-2 text-sm">
              {Object.entries(PLANS).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.name} — ₹{p.price}/mo · {p.dynamicLimit} QRs
                </option>
              ))}
            </select>
            <button className="btn btn-accent !py-2 text-sm">Apply</button>
          </form>
        </div>
      )}

      {/* their QR codes */}
      <h2 className="mt-10 text-lg font-semibold tracking-tight">QR codes</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-faint">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Short link</th>
              <th className="px-5 py-3 text-right font-medium">Scans</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(ws?.qrcodes ?? []).map((q) => (
              <tr key={q.id} className="hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{q.title}</p>
                  <p className="mt-0.5 max-w-sm truncate text-xs text-faint">→ {q.destination}</p>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs">
                  <a href={`${BASE}/r/${q.shortCode}`} target="_blank" rel="noreferrer" className="hover:text-accent-deep">
                    /r/{q.shortCode}
                  </a>
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">{q.scanCount.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3.5"><StatusDot status={q.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <form action={adminToggleQr}>
                    <input type="hidden" name="id" value={q.id} />
                    <button className="btn btn-ghost !px-3 !py-1 text-xs">
                      {q.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(ws?.qrcodes ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-faint">No dynamic codes</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* danger zone */}
      {user.id !== admin.id && (
        <div className="card mt-8 max-w-xl border-bad/30 p-6">
          <h2 className="text-sm font-semibold text-bad">Danger zone</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Deletes the user, their workspace, every QR code and all scan
            history. Printed codes stop redirecting immediately.
          </p>
          <div className="mt-3">
            <AdminDeleteUserButton userId={user.id} email={user.email} />
          </div>
        </div>
      )}
    </>
  );
}

function Tile({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}
