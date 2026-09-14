import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the lumiqgen team — support, billing, abuse reports and partnership enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalShell title="Contact us">
      <p>
        lumiqgen is built and operated by <strong>Luminara Software Solutions</strong>.
        We read everything.
      </p>

      <h2>Support &amp; billing</h2>
      <p>
        Email <a className="text-accent-deep underline" href="mailto:dev.harshvatsal@gmail.com">dev.harshvatsal@gmail.com</a> from
        your account email with your question or payment reference. We aim to
        respond within one working day.
      </p>

      <h2>Report an abusive QR code</h2>
      <p>
        If a lumiqgen short link (qgen.luminaraconsulting.co/r/…) is redirecting somewhere
        deceptive or harmful, email the same address with the short code and
        what you found. Abuse reports are reviewed with priority and verified
        codes are suspended.
      </p>

      <h2>Partnerships</h2>
      <p>
        Print shops, packaging vendors and agencies: we love working with the
        people who put QR codes into the physical world. Write to us and tell
        us what you print.
      </p>
    </LegalShell>
  );
}
