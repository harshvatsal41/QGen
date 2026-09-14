import { notFound } from "next/navigation";
import { requireUser } from "./auth";

// Admins are declared via the ADMIN_EMAILS env var (comma-separated).
// No schema change, and the list is controlled from Railway variables.
export function isAdminEmail(email) {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes((email || "").toLowerCase());
}

// notFound (not redirect) so /admin does not reveal its existence to
// non-admin users — they see the same 404 as any bad URL.
export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) notFound();
  return user;
}
