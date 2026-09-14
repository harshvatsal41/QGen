export function LogoMark({ className = "h-6 w-6", dark = false }) {
  // On dark surfaces the tile is white, so the inner cells must go dark.
  const cell = dark ? "#0e0e12" : "#fff";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor" />
      <rect x="5" y="5" width="6" height="6" rx="1.5" fill={cell} />
      <rect x="13" y="5" width="6" height="6" rx="1.5" fill={cell} fillOpacity="0.55" />
      <rect x="5" y="13" width="6" height="6" rx="1.5" fill={cell} fillOpacity="0.55" />
      <rect x="13" y="13" width="3" height="3" rx="1" fill={cell} />
      <rect x="16" y="16" width="3" height="3" rx="1" fill={cell} />
    </svg>
  );
}

export function Logo({ dark = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark dark={dark} className={`h-6 w-6 ${dark ? "text-white" : "text-ink"}`} />
      <span className={`text-[17px] font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        lumi<span className="text-accent">qgen</span>
      </span>
    </span>
  );
}
