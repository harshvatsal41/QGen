"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { PLANS } from "@/lib/plans";
import { cacheDel } from "@/lib/cache";

export async function adminSetPlan(formData) {
  await requireAdmin();
  const workspaceId = String(formData.get("workspaceId") || "");
  const plan = String(formData.get("plan") || "");
  if (!PLANS[plan]) return;
  await db.workspace.update({ where: { id: workspaceId }, data: { plan } });
  revalidatePath("/admin", "layout");
}

export async function adminToggleQr(formData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const qr = await db.qRCode.findUnique({ where: { id } });
  if (!qr) return;
  await db.qRCode.update({
    where: { id },
    data: { status: qr.status === "active" ? "paused" : "active" },
  });
  cacheDel(qr.shortCode);
  revalidatePath("/admin", "layout");
}

export async function adminDeleteUser(formData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") || "");
  if (!userId || userId === admin.id) return; // never self-delete
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { workspaces: { include: { qrcodes: { select: { shortCode: true } } } } },
  });
  if (!user) return;
  await db.user.delete({ where: { id: userId } }); // cascades workspaces → QRs → scans
  for (const ws of user.workspaces) for (const qr of ws.qrcodes) cacheDel(qr.shortCode);
  revalidatePath("/admin", "layout");
  redirect("/admin");
}
