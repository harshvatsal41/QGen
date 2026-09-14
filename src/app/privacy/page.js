import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Privacy Policy",
  description: "How lumiqgen handles your data: what we collect, what we never see, and how scan analytics work.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="14 September 2026">
      <p>
        lumiqgen is operated by Luminara Software Solutions (&quot;we&quot;, &quot;us&quot;). This policy
        explains what data we collect, why, and what we deliberately do not
        collect. It applies to lumiqgen users and to people who scan lumiqgen
        dynamic codes.
      </p>

      <h2>Free static QR codes: we see nothing</h2>
      <p>
        Static QR codes are generated entirely in your browser. The URL,
        Wi-Fi password, UPI ID, contact card or message you type is encoded
        into the QR pattern locally on your device and is never transmitted to
        our servers, never stored, and never seen by us. Close the tab and it
        is gone.
      </p>

      <h2>Account data</h2>
      <p>
        When you create an account we store your email address, your name if
        you provide one, and a salted hash of your password (we cannot read
        your password). We use your email to operate your account — login,
        receipts, and service notices. We do not sell personal data.
      </p>

      <h2>Scan analytics on dynamic QR codes</h2>
      <p>
        When someone scans a dynamic lumiqgen code, our redirect service
        processes the request and records, for the code owner&apos;s analytics:
      </p>
      <ul>
        <li>timestamp of the scan</li>
        <li>device class, operating system and browser family (derived from the user-agent)</li>
        <li>country and city (derived from the IP address at request time; the IP address itself is <strong>not stored</strong> — it is used to resolve an approximate location and for abuse prevention, then discarded)</li>
        <li>the referring page, if any</li>
      </ul>
      <p>
        Scanners are not individually identified: we do not build profiles of
        people who scan codes, and we set no advertising or tracking cookies
        on the redirect path.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a single session cookie to keep you logged in to your
        dashboard. Public tool pages may show advertising served by Google
        AdSense, which may use cookies as described in Google&apos;s own policies;
        you can control ad personalisation in your Google settings.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        Raw scan events are retained for up to 12 months and then aggregated
        or deleted. You can delete any QR code — its scan history is deleted
        with it — and you can request full account deletion at any time by
        writing to us; we honour such requests within 30 days, consistent
        with India&apos;s Digital Personal Data Protection Act, 2023.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy question or request, contact us via the details on our
        contact page. We respond to every request.
      </p>
    </LegalShell>
  );
}
