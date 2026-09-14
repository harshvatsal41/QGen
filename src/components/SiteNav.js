import Link from "next/link";
import { Logo } from "./Logo";
import { getSessionUserId } from "@/lib/auth";

export default async function SiteNav() {
  const userId = await getSessionUserId();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="lumiqgen home">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/#types" className="hidden px-3 py-2 text-sm text-muted hover:text-ink sm:block">
            QR types
          </Link>
          <Link href="/pricing" className="px-3 py-2 text-sm text-muted hover:text-ink">
            Pricing
          </Link>
          {userId ? (
            <Link href="/dashboard" className="btn btn-primary !py-2 !px-4 text-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-sm text-muted hover:text-ink">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary !py-2 !px-4 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
