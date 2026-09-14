"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { QR_TYPES } from "@/lib/qr-types";

const EC_LEVELS = ["L", "M", "Q", "H"];
const SIZES = [512, 1024, 2048];

// Everything here runs in the browser. Nothing the user types is ever sent
// to a server — that is a product promise, not an implementation detail.
export default function QRGenerator({ initialType = "url", compact = false }) {
  const [type, setType] = useState(QR_TYPES[initialType] ? initialType : "url");
  const [values, setValues] = useState({});
  const [fg, setFg] = useState("#101013");
  const [bg, setBg] = useState("#ffffff");
  const [ec, setEc] = useState("M");
  const [size, setSize] = useState(1024);
  const [logo, setLogo] = useState(null); // dataURL
  const [mode, setMode] = useState("static");
  const [toast, setToast] = useState("");
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const def = QR_TYPES[type];
  const payload = useMemo(() => {
    try {
      return def.build(values) || "";
    } catch {
      return "";
    }
  }, [def, values]);

  const effEc = logo ? "H" : ec; // a logo eats modules; force max correction

  // live render, debounced
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = setTimeout(async () => {
      if (!payload) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.height = 320;
        ctx.clearRect(0, 0, 320, 320);
        return;
      }
      try {
        await QRCode.toCanvas(canvas, payload, {
          width: 320,
          margin: 2,
          errorCorrectionLevel: effEc,
          color: { dark: fg, light: bg },
        });
        if (logo) await drawLogo(canvas, logo, bg);
      } catch {
        /* payload too long for the EC level — leave last good render */
      }
    }, 120);
    return () => clearTimeout(t);
  }, [payload, fg, bg, effEc, logo]);

  const setField = (name, v) => setValues((s) => ({ ...s, [name]: v }));

  const switchType = (slug) => {
    setType(slug);
    setValues({});
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const downloadPNG = useCallback(async () => {
    if (!payload) return;
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: effEc,
      color: { dark: fg, light: bg },
    });
    if (logo) await drawLogo(canvas, logo, bg);
    triggerDownload(canvas.toDataURL("image/png"), `lumiqgen-${type}.png`);
    flash("PNG downloaded");
  }, [payload, size, effEc, fg, bg, logo, type]);

  const downloadSVG = useCallback(async () => {
    if (!payload) return;
    let svg = await QRCode.toString(payload, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: effEc,
      color: { dark: fg, light: bg },
    });
    if (logo) svg = embedLogoInSvg(svg, logo, bg);
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    triggerDownload(url, `lumiqgen-${type}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    flash("SVG downloaded");
  }, [payload, effEc, fg, bg, logo, type]);

  const copyPNG = useCallback(async () => {
    if (!payload) return;
    try {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, payload, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: effEc,
        color: { dark: fg, light: bg },
      });
      if (logo) await drawLogo(canvas, logo, bg);
      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Copied to clipboard");
    } catch {
      flash("Copy not supported in this browser");
    }
  }, [payload, effEc, fg, bg, logo]);

  const onLogoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="card relative overflow-hidden p-5 shadow-pop sm:p-7">
      {/* static / dynamic toggle */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-line bg-paper p-1">
          {["static", "dynamic"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                mode === m ? "bg-ink text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="hidden text-xs text-faint sm:block">
          {mode === "static" ? "Free · no signup · never expires" : "Editable · tracked · 14-day free"}
        </span>
      </div>

      {mode === "dynamic" ? (
        <DynamicPitch type={type} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* left: type + form */}
          <div>
            {!compact && (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {Object.entries(QR_TYPES).map(([slug, t]) => (
                  <button
                    key={slug}
                    onClick={() => switchType(slug)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                      type === slug
                        ? "bg-accent-soft text-accent-deep ring-1 ring-accent/40"
                        : "text-muted hover:bg-paper hover:text-ink"
                    }`}
                  >
                    {t.short}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {def.fields.map((f) => (
                <Field key={`${type}:${f.name}`} f={f} value={values[f.name]} onChange={setField} />
              ))}
            </div>

            {/* customization */}
            <details className="group mt-6 rounded-xl border border-line bg-paper/60 open:bg-paper">
              <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-ink-soft">
                Customize design
                <svg className="h-4 w-4 text-faint transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </summary>
              <div className="grid gap-4 border-t border-line px-4 py-4 sm:grid-cols-2">
                <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                  Pattern color
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border border-line bg-white" />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                  Background
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border border-line bg-white" />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                  Error correction
                  <select value={effEc} disabled={!!logo} onChange={(e) => setEc(e.target.value)}
                    className="field !w-24 !py-1.5 text-sm">
                    {EC_LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
                  PNG size
                  <select value={size} onChange={(e) => setSize(Number(e.target.value))}
                    className="field !w-28 !py-1.5 text-sm">
                    {SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                  </select>
                </label>
                <div className="flex items-center justify-between gap-3 text-sm text-ink-soft sm:col-span-2">
                  <span>Center logo</span>
                  <div className="flex items-center gap-2">
                    {logo && (
                      <button onClick={() => { setLogo(null); if (fileRef.current) fileRef.current.value = ""; }}
                        className="text-xs text-bad hover:underline">
                        Remove
                      </button>
                    )}
                    <button onClick={() => fileRef.current?.click()} className="btn btn-ghost !py-1.5 !px-3 text-xs">
                      {logo ? "Change logo" : "Upload logo"}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onLogoPick} className="hidden" />
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* right: preview + downloads */}
          <div className="flex flex-col items-center">
            <div className="checker relative rounded-2xl border border-line p-3">
              <canvas ref={canvasRef} width={320} height={320} className="h-64 w-64 rounded-lg sm:h-72 sm:w-72" />
              {!payload && (
                <div className="absolute inset-3 flex items-center justify-center rounded-lg bg-white/90">
                  <p className="max-w-[180px] text-center text-sm text-faint">
                    Fill the form — your QR appears live
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              <button onClick={downloadPNG} disabled={!payload} className="btn btn-primary col-span-2">
                Download PNG
              </button>
              <button onClick={downloadSVG} disabled={!payload} className="btn btn-ghost text-sm">
                SVG
              </button>
              <button onClick={copyPNG} disabled={!payload} className="btn btn-ghost text-sm">
                Copy
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-faint">
              Generated in your browser · never uploaded · never expires
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className="rise absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-white shadow-pop">
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({ f, value, onChange }) {
  const v = value ?? (f.type === "select" ? f.default : f.type === "checkbox" ? false : "");
  if (f.type === "textarea") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">{f.label}</span>
        <textarea rows={3} className="field resize-none" placeholder={f.placeholder} value={v}
          onChange={(e) => onChange(f.name, e.target.value)} />
      </label>
    );
  }
  if (f.type === "select") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">{f.label}</span>
        <select className="field" value={v} onChange={(e) => onChange(f.name, e.target.value)}>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    );
  }
  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-2.5 text-sm text-ink-soft">
        <input type="checkbox" checked={!!v} onChange={(e) => onChange(f.name, e.target.checked)}
          className="h-4 w-4 rounded border-line accent-[var(--color-accent)]" />
        {f.label}
      </label>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{f.label}</span>
      <input type={f.type} inputMode={f.type === "number" ? "decimal" : undefined} className="field"
        placeholder={f.placeholder} value={v} onChange={(e) => onChange(f.name, e.target.value)} />
    </label>
  );
}

function DynamicPitch({ type }) {
  const rows = [
    ["Change the destination anytime — even after printing", true],
    ["Scan analytics: totals, devices, cities, time of day", true],
    ["Smart routing: iPhone vs Android, time of day, country", true],
    ["Campaign tracking with UTM, pause & resume", true],
  ];
  return (
    <div className="rise grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">
          The QR stays printed. The destination stays yours.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A dynamic QR encodes a short lumiqgen link instead of your raw URL. You
          can repoint it any time — swap the Monday menu for the Tuesday one —
          and see exactly who scanned, without reprinting anything.
        </p>
        <ul className="mt-5 space-y-2.5">
          {rows.map(([label]) => (
            <li key={label} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/signup?type=${type}`} className="btn btn-accent">
            Create a dynamic QR — free
          </Link>
          <span className="text-xs text-faint">3 free dynamic QRs · no card needed</span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xs rounded-2xl border border-line bg-paper p-5 font-mono text-[13px] leading-relaxed text-ink-soft shadow-lift">
          <p className="text-faint"># printed on the table tent</p>
          <p className="mt-1">lumiqgen → <span className="text-accent-deep">/r/Ab73Kx</span></p>
          <p className="mt-4 text-faint"># where it points today</p>
          <p className="mt-1">→ menu-monday.pdf</p>
          <p className="mt-4 text-faint"># one click later</p>
          <p className="mt-1">→ <span className="text-good">friday-special.pdf</span> ✓</p>
          <p className="mt-4 text-faint"># nothing reprinted</p>
        </div>
      </div>
    </div>
  );
}

async function drawLogo(canvas, dataUrl, bg) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      const s = canvas.width;
      const box = Math.round(s * 0.24);
      const pad = Math.round(box * 0.12);
      const x = (s - box) / 2;
      // white plate under the logo so the QR stays scannable
      roundRect(ctx, x - pad, x - pad, box + pad * 2, box + pad * 2, Math.round(box * 0.2));
      ctx.fillStyle = bg || "#fff";
      ctx.fill();
      ctx.drawImage(img, x, x, box, box);
      resolve();
    };
    img.onerror = resolve;
    img.src = dataUrl;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function embedLogoInSvg(svg, dataUrl, bg) {
  // qrcode's svg uses a 0 0 N N viewBox in module units; overlay a centered
  // plate + image sized at 24% of the code.
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!m) return svg;
  const n = Number(m[1]);
  const box = n * 0.24;
  const pad = box * 0.12;
  const x = (n - box) / 2;
  const overlay =
    `<rect x="${x - pad}" y="${x - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="${box * 0.2}" fill="${bg || "#fff"}"/>` +
    `<image href="${dataUrl}" x="${x}" y="${x}" width="${box}" height="${box}"/>`;
  return svg.replace("</svg>", overlay + "</svg>");
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
