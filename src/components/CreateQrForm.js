"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createQr } from "@/app/actions";

export default function CreateQrForm() {
  const [state, formAction, pending] = useActionState(createQr, null);

  return (
    <form action={formAction} className="card max-w-xl space-y-5 p-7">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Destination URL</span>
        <input name="destination" type="text" required className="field" placeholder="https://yourwebsite.com/menu" />
        <span className="mt-1.5 block text-xs text-faint">
          Where the QR points today. You can change this any time — the printed code stays the same.
        </span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Title</span>
        <input name="title" type="text" className="field" placeholder="Restaurant table menu" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Campaign (optional)</span>
        <input name="campaign" type="text" className="field" placeholder="Summer 2026" />
      </label>

      {state?.error && (
        <p className="rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad">
          {state.error}{" "}
          {state.error.includes("Upgrade") && (
            <Link href="/dashboard/billing" className="font-medium underline">See plans</Link>
          )}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Creating…" : "Create dynamic QR"}
        </button>
        <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
