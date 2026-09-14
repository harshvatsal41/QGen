"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export default function AuthForm({ mode, action }) {
  const [state, formAction, pending] = useActionState(action, null);
  const isSignup = mode === "signup";

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-5">
      <div className="dotgrid absolute inset-0" aria-hidden="true" />
      <div className="card rise relative w-full max-w-sm p-8 shadow-pop">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isSignup
            ? "3 free dynamic QR codes. No card needed."
            : "Log in to manage your QR codes."}
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          {isSignup && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Name</span>
              <input name="name" type="text" className="field" placeholder="Your name" autoComplete="name" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Email</span>
            <input name="email" type="email" required className="field" placeholder="you@company.com" autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Password</span>
            <input name="password" type="password" required minLength={isSignup ? 8 : undefined} className="field"
              placeholder={isSignup ? "8+ characters" : "Your password"}
              autoComplete={isSignup ? "new-password" : "current-password"} />
          </label>

          {state?.error && (
            <p className="rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary w-full">
            {pending ? "One moment…" : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isSignup ? (
            <>Already have an account? <Link href="/login" className="font-medium text-accent-deep hover:underline">Log in</Link></>
          ) : (
            <>New to lumiqgen? <Link href="/signup" className="font-medium text-accent-deep hover:underline">Create an account</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
