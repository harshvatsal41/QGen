"use client";

import { useActionState } from "react";
import { updateQr } from "@/app/actions";

export default function EditQrForm({ qr }) {
  const [state, formAction, pending] = useActionState(updateQr, null);
  const rules = qr.rules || {};
  const sched = Array.isArray(rules.schedule) ? rules.schedule[0] : null;

  return (
    <form action={formAction} className="card space-y-5 p-7">
      <input type="hidden" name="id" value={qr.id} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Destination URL</span>
        <input name="destination" type="text" required defaultValue={qr.destination} className="field" />
        <span className="mt-1.5 block text-xs text-faint">
          Change it any time — printed codes pick up the new destination within a minute.
        </span>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Title</span>
          <input name="title" type="text" defaultValue={qr.title} className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Campaign</span>
          <input name="campaign" type="text" defaultValue={qr.campaign || ""} className="field" placeholder="Optional" />
        </label>
      </div>

      <details className="group rounded-xl border border-line bg-paper/60 open:bg-paper" open={!!qr.rules}>
        <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-ink-soft">
          <span>
            Smart routing
            <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-deep">
              {qr.rules ? "ON" : "optional"}
            </span>
          </span>
          <svg className="h-4 w-4 text-faint transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </summary>
        <div className="space-y-4 border-t border-line px-4 py-4">
          <p className="text-xs leading-relaxed text-muted">
            One printed code, different destinations by device or time of day.
            Leave any field blank to skip that rule; everything else falls back
            to the destination above.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">iPhone / iPad opens…</span>
              <input name="rule_ios" type="text" defaultValue={rules.device?.ios || ""} className="field !text-sm" placeholder="https://apps.apple.com/…" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">Android opens…</span>
              <input name="rule_android" type="text" defaultValue={rules.device?.android || ""} className="field !text-sm" placeholder="https://play.google.com/…" />
            </label>
          </div>
          <div className="grid items-end gap-3 sm:grid-cols-[110px_110px_1fr]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">From (IST)</span>
              <input name="rule_sched_from" type="time" defaultValue={sched?.from || ""} className="field !text-sm" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">To (IST)</span>
              <input name="rule_sched_to" type="time" defaultValue={sched?.to || ""} className="field !text-sm" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-soft">…opens this URL instead</span>
              <input name="rule_sched_url" type="text" defaultValue={sched?.url || ""} className="field !text-sm" placeholder="https://wa.me/91…" />
            </label>
          </div>
        </div>
      </details>

      {state?.error && <p className="rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-good/10 px-3 py-2 text-sm text-good">Saved. Live within a minute.</p>}

      <button type="submit" disabled={pending} className="btn btn-accent">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
