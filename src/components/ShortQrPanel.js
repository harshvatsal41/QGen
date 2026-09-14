"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

// Renders the printable QR for a dynamic code's short link, with downloads.
export default function ShortQrPanel({ shortUrl }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shortUrl, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#101013", light: "#ffffff" },
      });
    }
  }, [shortUrl]);

  const download = async (format) => {
    if (format === "png") {
      const c = document.createElement("canvas");
      await QRCode.toCanvas(c, shortUrl, { width: 1024, margin: 2, errorCorrectionLevel: "M" });
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "lumiqgen-dynamic.png";
      a.click();
    } else {
      const svg = await QRCode.toString(shortUrl, { type: "svg", margin: 2, errorCorrectionLevel: "M" });
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "lumiqgen-dynamic.svg";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="card flex flex-col items-center p-6">
      <div className="rounded-xl border border-line p-2">
        <canvas ref={canvasRef} width={220} height={220} className="h-52 w-52 rounded-lg" />
      </div>
      <button onClick={copy} className="mt-4 rounded-lg bg-paper px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:bg-accent-soft">
        {copied ? "Copied ✓" : shortUrl.replace(/^https?:\/\//, "")}
      </button>
      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <button onClick={() => download("png")} className="btn btn-primary !py-2 text-sm">PNG</button>
        <button onClick={() => download("svg")} className="btn btn-ghost !py-2 text-sm">SVG</button>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        This exact pattern never changes.
        <br />
        Print once, repoint forever.
      </p>
    </div>
  );
}
