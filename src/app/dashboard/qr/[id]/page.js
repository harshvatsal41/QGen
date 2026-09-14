import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toggleQrStatus } from "@/app/actions";
import EditQrForm from "@/components/EditQrForm";
import ShortQrPanel from "@/components/ShortQrPanel";
import DeleteQrButton from "@/components/DeleteQrButton";
import StatusDot from "@/components/StatusDot";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function QrDetailPage({ params }) {
  const { id } = await params;
  const user = await requireUser();
  const workspace = user.workspaces[0];

  const qr = await db.qRCode.findUnique({ where: { id } });
  if (!qr || qr.workspaceId !== workspace.id) notFound();

  const shortUrl = `${BASE}/r/${qr.shortCode}`;

  return (
    <>
      <nav className="mb-4 text-xs text-faint">
        <Link href="/dashboard" className="hover:text-ink">QR codes</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">{qr.title}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{qr.title}</h1>
          <div className="mt-1.5 flex items-center gap-3 text-sm text-muted">
            <StatusDot status={qr.status} />
            <span className="tabular-nums">{qr.scanCount.toLocaleString("en-IN")} scans</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/qr/${qr.id}/analytics`} className="btn btn-primary !py-2 text-sm">
            View analytics
          </Link>
          <form action={toggleQrStatus}>
            <input type="hidden" name="id" value={qr.id} />
            <button className="btn btn-ghost !py-2 text-sm">
              {qr.status === "active" ? "Pause" : "Activate"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <EditQrForm qr={{ id: qr.id, destination: qr.destination, title: qr.title, campaign: qr.campaign, rules: qr.rules }} />
        <div className="space-y-4">
          <ShortQrPanel shortUrl={shortUrl} />
          <div className="card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">Danger zone</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Deleting removes the redirect permanently — any printed copies go dead.
            </p>
            <div className="mt-3">
              <DeleteQrButton id={qr.id} title={qr.title} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
