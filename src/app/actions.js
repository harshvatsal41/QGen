"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { newShortCode } from "@/lib/shortcode";
import { planFor } from "@/lib/plans";
import { cacheDel } from "@/lib/cache";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- auth ----------

export async function signup(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists. Log in instead." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      workspaces: { create: { name: name ? `${name}'s workspace` : "My workspace" } },
    },
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Wrong email or password." };
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

// ---------- dynamic QR CRUD ----------

async function requireWorkspace() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return { user, workspace: user.workspaces[0] };
}

function normalizeUrl(raw) {
  let u = String(raw || "").trim();
  if (!u) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!["http:", "https:", "upi:", "tel:", "mailto:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function createQr(prevState, formData) {
  const { workspace } = await requireWorkspace();
  const plan = planFor(workspace);

  const count = await db.qRCode.count({ where: { workspaceId: workspace.id } });
  if (count >= plan.dynamicLimit) {
    return {
      error: `Your ${plan.name} plan includes ${plan.dynamicLimit} dynamic QR codes. Upgrade to add more.`,
    };
  }

  const destination = normalizeUrl(formData.get("destination"));
  if (!destination) return { error: "Enter a valid destination URL." };
  const title = String(formData.get("title") || "").trim() || "Untitled QR";
  const campaign = String(formData.get("campaign") || "").trim() || null;

  const qr = await db.qRCode.create({
    data: {
      shortCode: newShortCode(),
      workspaceId: workspace.id,
      type: "url",
      mode: "dynamic",
      destination,
      title,
      campaign,
    },
  });
  revalidatePath("/dashboard");
  redirect(`/dashboard/qr/${qr.id}`);
}

async function ownedQr(id, workspaceId) {
  const qr = await db.qRCode.findUnique({ where: { id } });
  if (!qr || qr.workspaceId !== workspaceId) return null;
  return qr;
}

export async function updateQr(prevState, formData) {
  const { workspace } = await requireWorkspace();
  const id = String(formData.get("id") || "");
  const qr = await ownedQr(id, workspace.id);
  if (!qr) return { error: "QR code not found." };

  const destination = normalizeUrl(formData.get("destination"));
  if (!destination) return { error: "Enter a valid destination URL." };
  const title = String(formData.get("title") || "").trim() || qr.title;
  const campaign = String(formData.get("campaign") || "").trim() || null;

  // smart rules — all optional
  const ios = normalizeUrl(formData.get("rule_ios"));
  const android = normalizeUrl(formData.get("rule_android"));
  const schedUrl = normalizeUrl(formData.get("rule_sched_url"));
  const schedFrom = String(formData.get("rule_sched_from") || "").trim();
  const schedTo = String(formData.get("rule_sched_to") || "").trim();

  let rules = null;
  const device = {};
  if (ios) device.ios = ios;
  if (android) device.android = android;
  if (Object.keys(device).length || (schedUrl && schedFrom && schedTo)) {
    rules = { default: destination };
    if (Object.keys(device).length) rules.device = device;
    if (schedUrl && schedFrom && schedTo) {
      rules.schedule = [{ from: schedFrom, to: schedTo, url: schedUrl }];
    }
  }

  await db.qRCode.update({
    where: { id },
    data: { destination, title, campaign, rules: rules === null ? Prisma.DbNull : rules },
  });
  cacheDel(qr.shortCode);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/qr/${id}`);
  return { ok: true };
}

export async function toggleQrStatus(formData) {
  const { workspace } = await requireWorkspace();
  const id = String(formData.get("id") || "");
  const qr = await ownedQr(id, workspace.id);
  if (!qr) return;
  await db.qRCode.update({
    where: { id },
    data: { status: qr.status === "active" ? "paused" : "active" },
  });
  cacheDel(qr.shortCode);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/qr/${id}`);
}

export async function deleteQr(formData) {
  const { workspace } = await requireWorkspace();
  const id = String(formData.get("id") || "");
  const qr = await ownedQr(id, workspace.id);
  if (!qr) return;
  await db.qRCode.delete({ where: { id } });
  cacheDel(qr.shortCode);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
