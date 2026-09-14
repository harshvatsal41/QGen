import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of lumiqgen's free QR generator and paid dynamic QR services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="14 September 2026">
      <p>
        These terms govern your use of lumiqgen, a service of Luminara Software
        Solutions. By using the site you accept them.
      </p>

      <h2>The free service</h2>
      <p>
        Static QR generation is provided free of charge, without an account,
        for personal and commercial use. Codes you generate are yours; we
        claim no rights over them and impose no watermark or expiry. The free
        service is provided &quot;as is&quot; without warranty.
      </p>

      <h2>Paid subscriptions</h2>
      <p>
        Dynamic QR codes, analytics and related features are provided under
        paid plans billed in advance via Razorpay. Plan limits (such as the
        number of dynamic codes) are enforced by the software. If a
        subscription lapses, dynamic codes enter a grace period in read-only
        mode before deactivation, so printed material is not broken without
        warning.
      </p>

      <h2>Acceptable use</h2>
      <p>You may not use lumiqgen to create or redirect codes that point to:</p>
      <ul>
        <li>phishing, credential harvesting, or malware</li>
        <li>content that is illegal under Indian law</li>
        <li>deceptive impersonation of another business or person</li>
      </ul>
      <p>
        We scan destinations against safety databases and may suspend codes or
        accounts that violate these rules, with notice where practicable.
        Anyone can report an abusive code via our contact page.
      </p>

      <h2>Service continuity</h2>
      <p>
        We aim for the redirect service to be continuously available and
        engineer it to fail rarely and recover fast. We are not liable for
        indirect or consequential losses; our total liability is capped at the
        fees you paid us in the preceding three months.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms; material changes will be announced by email
        to account holders. Continued use after a change constitutes
        acceptance. These terms are governed by the laws of India.
      </p>
    </LegalShell>
  );
}
