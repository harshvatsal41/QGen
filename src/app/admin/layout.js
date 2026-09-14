import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { logout } from "@/app/actions";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-night text-white">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="Admin home">
              <Logo dark />
            </Link>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-3 py-1.5 text-sm text-white/60 hover:text-white">
              My dashboard
            </Link>
            <span className="hidden text-xs text-white/40 sm:block">{admin.email}</span>
            <form action={logout}>
              <button className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
                Log out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
