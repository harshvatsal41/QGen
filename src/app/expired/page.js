import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "This QR code is inactive",
  robots: { index: false },
};

export default function ExpiredPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">
        This QR code is currently inactive
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        The owner has paused this code, or it has expired. If you own this
        code, you can reactivate it from your dashboard.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard" className="btn btn-primary text-sm">Go to dashboard</Link>
        <Link href="/" className="btn btn-ghost text-sm">Create a QR code</Link>
      </div>
    </main>
  );
}
