import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Refund & Cancellation Policy",
  description: "lumiqgen's refund and cancellation policy for paid subscriptions billed via Razorpay.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <LegalShell title="Refund & Cancellation Policy" updated="14 September 2026">
      <h2>Free trial first</h2>
      <p>
        Every paid plan starts with a 14-day free trial, and the free tier
        includes 3 dynamic QR codes with no card required — so you can verify
        that lumiqgen fits your needs before paying anything.
      </p>

      <h2>Cancellation</h2>
      <p>
        You can cancel any subscription at any time from the billing page.
        Cancellation stops future charges; your plan remains active until the
        end of the period already paid for, after which dynamic codes enter a
        read-only grace period.
      </p>

      <h2>Refunds</h2>
      <ul>
        <li>
          <strong>First monthly payment:</strong> if lumiqgen does not work as
          described, write to us within 7 days of your first charge and we
          will refund it in full.
        </li>
        <li>
          <strong>Annual plans:</strong> refundable pro-rata for unused full
          months within the first 30 days of purchase.
        </li>
        <li>
          <strong>Renewals:</strong> renewal charges are not refundable, but
          you can cancel ahead of any renewal date.
        </li>
      </ul>
      <p>
        Approved refunds are processed to the original payment method via
        Razorpay within 5–7 working days.
      </p>

      <h2>How to request</h2>
      <p>
        Email us via the contact page from your account email with the payment
        reference. We reply to every refund request within 2 working days.
      </p>
    </LegalShell>
  );
}
