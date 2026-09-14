import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLANS, planFor } from "@/lib/plans";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = await requireUser();
  const workspace = user.workspaces[0];
  const plan = planFor(workspace);
  const used = await db.qRCode.count({ where: { workspaceId: workspace.id } });
  const pct = Math.min(100, Math.round((used / plan.dynamicLimit) * 100));

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-1 text-sm text-muted">Workspace: {workspace.name}</p>

      <div className="card mt-6 max-w-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-faint">Current plan</p>
            <p className="mt-1 text-2xl font-semibold">{plan.name}</p>
          </div>
          <p className="text-right">
            <span className="text-2xl font-semibold">₹{plan.price.toLocaleString("en-IN")}</span>
            <span className="text-sm text-faint">/mo</span>
          </p>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted">
            <span>Dynamic QR codes</span>
            <span className="tabular-nums">{used} / {plan.dynamicLimit}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper">
            <div className={`h-full rounded-full ${pct > 85 ? "bg-warn" : "bg-accent"}`} style={{ width: `${Math.max(2, pct)}%` }} />
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">Upgrade</h2>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Online checkout via Razorpay (UPI, cards, netbanking) is arriving
        shortly. Until then, write to us and we&apos;ll activate your plan the
        same day.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {Object.entries(PLANS)
          .filter(([key]) => key !== "free")
          .map(([key, p]) => (
            <div key={key} className={`card p-5 ${workspace.plan === key ? "ring-1 ring-accent" : ""}`}>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-xl font-semibold">₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal text-faint">/mo</span></p>
              <p className="mt-2 text-xs text-muted">{p.dynamicLimit.toLocaleString("en-IN")} dynamic QR codes</p>
              {workspace.plan === key ? (
                <p className="mt-4 text-xs font-medium text-accent-deep">Your current plan</p>
              ) : (
                <Link href="/contact" className="btn btn-ghost mt-4 w-full !py-2 text-xs">
                  Request {p.name}
                </Link>
              )}
            </div>
          ))}
      </div>
      <p className="mt-6 text-xs text-faint">
        See the full feature comparison on the <Link href="/pricing" className="underline">pricing page</Link>.
        Refunds are governed by our <Link href="/refund" className="underline">refund policy</Link>.
      </p>
    </>
  );
}
