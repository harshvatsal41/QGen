import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions";
import { Logo } from "@/components/Logo";
import { isAdminEmail } from "@/lib/admin";

export const metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" aria-label="Dashboard home">
              <Logo />
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-paper hover:text-ink">
                QR codes
              </Link>
              <Link href="/dashboard/billing" className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-paper hover:text-ink">
                Billing
              </Link>
              {isAdminEmail(user.email) && (
                <Link href="/admin" className="rounded-lg px-3 py-1.5 text-sm font-medium text-accent-deep hover:bg-accent-soft">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-faint sm:block">{user.email}</span>
            <form action={logout}>
              <button className="btn btn-ghost !px-3 !py-1.5 text-xs">Log out</button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
