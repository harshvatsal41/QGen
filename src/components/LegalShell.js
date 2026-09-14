import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export default function LegalShell({ title, updated, children }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {updated && <p className="mt-2 text-sm text-faint">Last updated: {updated}</p>}
        <div className="prose-lumi mt-8 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:text-ink-soft [&_li]:leading-relaxed">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
