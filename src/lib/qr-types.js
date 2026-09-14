// The QR type registry. Isomorphic and dependency-free: the client generator
// uses `fields` + `build` to render forms and encode payloads entirely in the
// browser; the /qr/[type] pages use `seo` to render the guide + FAQ surface.

function esc(s) {
  // WIFI/vCard escaping per spec: backslash first, then the specials.
  return String(s).replace(/\\/g, "\\\\").replace(/([;,:"'])/g, "\\$1");
}

function digits(s) {
  return String(s).replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

export const QR_TYPES = {
  url: {
    label: "Website URL",
    short: "URL",
    fields: [
      {
        name: "url",
        label: "Website URL",
        type: "url",
        placeholder: "https://yourwebsite.com",
        required: true,
      },
    ],
    build: (v) => {
      let u = (v.url || "").trim();
      if (u && !/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
      return u;
    },
    seo: {
      title: "Free QR Code Generator for URLs — No Signup, No Watermark",
      description:
        "Create a free QR code for any website link. Renders instantly in your browser, downloads as PNG or SVG, never expires. No account needed.",
      h1: "QR code for a website URL",
      intro:
        "Paste any link and get a print-ready QR code in seconds. The code is generated entirely in your browser — nothing is uploaded, nothing expires, and there is no watermark. Download it as a PNG for social media and documents, or as an SVG that stays razor-sharp at any print size, from a business card to a billboard.",
      body: [
        "A URL QR code simply encodes your link in a machine-readable pattern. When someone points their phone camera at it, the phone offers to open the link — no app required on any modern iPhone or Android device. Because the URL is encoded directly in the pattern, a static code like this will keep working forever, no matter what happens to any QR service, including ours.",
        "Two practical tips make the difference between a QR code that gets scanned and one that gets ignored. First, size: print at least 2 × 2 cm for close-range scans (tables, packaging) and roughly 1/10 of the scanning distance for posters — a code meant to be scanned from 3 metres should be about 30 cm wide. Second, contrast: dark pattern on a light background scans dramatically better than the reverse, and never place the code over a busy photo.",
        "One caution before you send anything to print: a static code's destination is fixed forever. If the link might ever change — a menu, a price list, a campaign page — use a dynamic QR code instead. The printed pattern then points at a short redirect you control, so you can update the destination any time without reprinting, and you see exactly how many people scanned, on what device, and where.",
      ],
      faqs: [
        {
          q: "Is this QR code generator really free?",
          a: "Yes. Static QR codes are free, unlimited, and require no account. They never expire, carry no watermark, and we never see the data — generation happens entirely in your browser.",
        },
        {
          q: "Will my QR code expire?",
          a: "No. A static QR code encodes your URL directly in the pattern, so it works forever and does not depend on any service — including ours.",
        },
        {
          q: "PNG or SVG — which should I download?",
          a: "Use PNG for screens, documents and quick sharing. Use SVG for print: it is a vector format that stays perfectly sharp at any size, which professional printers prefer.",
        },
        {
          q: "Can I change the link after printing?",
          a: "Not with a static code — the URL is baked into the pattern. If you need an editable destination, create a dynamic QR code: the print stays the same while you change where it points, and you get scan analytics on top.",
        },
      ],
    },
  },

  whatsapp: {
    label: "WhatsApp",
    short: "WhatsApp",
    fields: [
      {
        name: "phone",
        label: "WhatsApp number (with country code)",
        type: "tel",
        placeholder: "+91 98765 43210",
        required: true,
      },
      {
        name: "message",
        label: "Pre-filled message (optional)",
        type: "textarea",
        placeholder: "Hi! I want to know more about your product.",
      },
    ],
    build: (v) => {
      const num = digits(v.phone || "").replace(/^\+/, "");
      if (!num) return "";
      const msg = (v.message || "").trim();
      return `https://wa.me/${num}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
    },
    seo: {
      title: "WhatsApp QR Code Generator — Free, With Pre-filled Message",
      description:
        "Create a free QR code that opens a WhatsApp chat with your number, with a pre-filled message. Perfect for storefronts, packaging and visiting cards. No signup.",
      h1: "QR code for WhatsApp chat",
      intro:
        "One scan, and your customer is inside a WhatsApp chat with you — with the first message already typed. Enter your number with country code, optionally set the opening message, and download the code. It works with both WhatsApp and WhatsApp Business.",
      body: [
        "For most Indian businesses, WhatsApp is the storefront. A WhatsApp QR code removes every step between interest and conversation: no saving your contact, no typing a number, no finding you on search. The customer scans, taps send, and you have a lead with their number attached.",
        "The pre-filled message is the underrated half of this tool. Set it to something that tells you where the scan came from — \"Hi! I saw your stall at the Sunday market\" or \"I'd like to book a table\" — and every incoming chat carries its own context. You can print different codes with different messages on your menu, your packaging, and your visiting card, and know instantly which one is working.",
        "Place the code where the buying decision happens: the shop counter, the last panel of your packaging, the bottom of an invoice, a table tent. Add a one-line call to action above it — \"Scan to order on WhatsApp\" converts far better than a bare code.",
      ],
      faqs: [
        {
          q: "Does the customer need my number saved?",
          a: "No. The QR encodes a wa.me link that opens a chat with your number directly, whether or not you are in their contacts.",
        },
        {
          q: "Does it work with WhatsApp Business?",
          a: "Yes. wa.me links open in whichever WhatsApp app is installed — personal or Business.",
        },
        {
          q: "What number format should I use?",
          a: "Full international format: country code plus number, e.g. +919876543210 for an Indian number. Spaces and dashes are fine — we strip them automatically.",
        },
        {
          q: "Can I change the message after printing?",
          a: "With this free static code, no — it is fixed in the pattern. A dynamic QR code lets you change both the number and the message any time, and shows you how many people scanned.",
        },
      ],
    },
  },

  upi: {
    label: "UPI Payment",
    short: "UPI",
    fields: [
      {
        name: "vpa",
        label: "UPI ID (VPA)",
        type: "text",
        placeholder: "yourname@okhdfcbank",
        required: true,
      },
      { name: "name", label: "Payee name", type: "text", placeholder: "Sharma General Store", required: true },
      { name: "amount", label: "Amount in ₹ (optional — leave blank to let payer enter)", type: "number", placeholder: "499" },
      { name: "note", label: "Payment note (optional)", type: "text", placeholder: "Order #123" },
    ],
    build: (v) => {
      const pa = (v.vpa || "").trim();
      const pn = (v.name || "").trim();
      if (!pa || !pn) return "";
      const p = new URLSearchParams({ pa, pn });
      if (v.amount) p.set("am", String(v.amount));
      if (v.note) p.set("tn", v.note.trim());
      p.set("cu", "INR");
      return `upi://pay?${p.toString()}`;
    },
    seo: {
      title: "UPI QR Code Generator — Free Payment QR for Any UPI ID",
      description:
        "Generate a free UPI QR code for your UPI ID. Works with GPay, PhonePe, Paytm and every UPI app. Optional fixed amount. Print it at your counter — no signup.",
      h1: "UPI payment QR code",
      intro:
        "Enter your UPI ID and name, and get a payment QR that works with Google Pay, PhonePe, Paytm, BHIM and every other UPI app. Fix the amount for a specific product, or leave it blank so customers enter their own at the counter.",
      body: [
        "This generates a standard upi://pay code — the exact format every UPI app understands. Scanning it opens the payment screen with your UPI ID and name pre-filled, so the customer only confirms the amount and pays. There is no intermediary and no charge: money moves directly through UPI to the account behind your VPA.",
        "Leave the amount blank for a general counter QR, or create separate fixed-amount codes for your best-selling items — a fixed-amount code removes one more step and one more chance of a typo. The payment note field is useful for reconciliation: set it to a counter number or product name and it appears in your transaction statement.",
        "Double-check your UPI ID before printing — send yourself ₹1 through the code first. A wrong VPA either fails outright or, worse, pays a stranger. And print big: payment QRs get scanned in a hurry, at an angle, in bad light. 6 × 6 cm at the counter is a sensible minimum.",
      ],
      faqs: [
        {
          q: "Which apps can scan this UPI QR?",
          a: "All of them — Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and any bank's UPI app. The code uses the standard UPI deep-link format defined by NPCI.",
        },
        {
          q: "Is there any fee per payment?",
          a: "No. This is a direct UPI code — payments go straight to your linked bank account. We never touch the money and there is no middleman.",
        },
        {
          q: "Should I fix the amount?",
          a: "Fix it for a specific product or fee (fewer taps, no typos). Leave it blank for a general storefront QR where amounts vary.",
        },
        {
          q: "Is it safe to display my UPI ID publicly?",
          a: "A UPI ID can only receive money when someone actively pays it — it cannot be used to pull money from your account. Never share your UPI PIN; that is the only credential that authorises payments.",
        },
      ],
    },
  },

  wifi: {
    label: "Wi-Fi",
    short: "Wi-Fi",
    fields: [
      { name: "ssid", label: "Network name (SSID)", type: "text", placeholder: "CafeLuminara_5G", required: true },
      { name: "password", label: "Password", type: "text", placeholder: "supersecret123" },
      {
        name: "security",
        label: "Security",
        type: "select",
        options: [
          { value: "WPA", label: "WPA / WPA2 / WPA3" },
          { value: "WEP", label: "WEP (legacy)" },
          { value: "nopass", label: "Open network (no password)" },
        ],
        default: "WPA",
      },
      { name: "hidden", label: "Hidden network", type: "checkbox" },
    ],
    build: (v) => {
      const ssid = (v.ssid || "").trim();
      if (!ssid) return "";
      const sec = v.security || "WPA";
      const parts = [`T:${sec === "nopass" ? "nopass" : sec}`, `S:${esc(ssid)}`];
      if (sec !== "nopass" && v.password) parts.push(`P:${esc(v.password)}`);
      if (v.hidden) parts.push("H:true");
      return `WIFI:${parts.join(";")};;`;
    },
    seo: {
      title: "WiFi QR Code Generator — Free, Guests Connect in One Scan",
      description:
        "Create a free WiFi QR code. Guests scan and connect — no typing the password. Works on iPhone and Android. Perfect for cafés, offices, and homes.",
      h1: "QR code for Wi-Fi access",
      intro:
        "Stop spelling out your Wi-Fi password. Enter the network name and password, print the code, and guests connect with a single scan — the phone joins the network automatically on both iPhone and Android.",
      body: [
        "The code uses the standard WIFI: format that both iOS and Android understand natively through the camera app. Scanning shows a \"Join network\" prompt; one tap and the device is connected. Your password is encoded in the pattern itself, not stored on any server — this page generates everything locally in your browser.",
        "For cafés and waiting rooms this is a quiet quality-of-life upgrade: frame a small card at each table and staff never dictate the password again. For offices, pair it with a guest network so visitors get internet without touching your internal LAN. At home, stick one inside a kitchen cupboard for houseguests.",
        "If you rotate your Wi-Fi password (a good habit for guest networks), remember every printed static code dies with the old password. Either laminate-and-replace, or keep the password stable for the guest SSID specifically.",
      ],
      faqs: [
        {
          q: "Does it work on iPhone?",
          a: "Yes. iOS 11+ and effectively all Android versions in use recognise Wi-Fi QR codes straight from the camera app — no extra app needed.",
        },
        {
          q: "Is my Wi-Fi password uploaded anywhere?",
          a: "No. The code is generated entirely in your browser; the password never leaves your device. Refresh the page and it is gone.",
        },
        {
          q: "Which security type should I pick?",
          a: "Almost certainly WPA — it covers WPA, WPA2 and WPA3, which is what any router from the last decade uses. WEP exists only for very old hardware; pick Open only for a network with no password.",
        },
        {
          q: "What if I change my Wi-Fi password?",
          a: "Printed static codes stop working — the old password is baked in. Print a fresh code, or keep a stable password on a separate guest network.",
        },
      ],
    },
  },

  "google-review": {
    label: "Google Review",
    short: "Review",
    fields: [
      {
        name: "placeId",
        label: "Google Place ID (or paste your full review link)",
        type: "text",
        placeholder: "ChIJN1t_tDeuEmsRUsoyG83frY4",
        required: true,
      },
    ],
    build: (v) => {
      const raw = (v.placeId || "").trim();
      if (!raw) return "";
      if (/^https?:\/\//i.test(raw)) return raw;
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(raw)}`;
    },
    seo: {
      title: "Google Review QR Code Generator — Free, Straight to 5 Stars",
      description:
        "Create a free QR code that opens your Google review form directly. Customers scan and rate — no searching. Boost reviews for your restaurant, clinic, or store.",
      h1: "QR code for Google reviews",
      intro:
        "The single biggest reason happy customers don't leave a review is friction: open Google, find the business, find the button. This code deletes all of it — one scan opens your review form with the stars ready to tap. Paste your Google Place ID, or simply paste the review link Google gave you.",
      body: [
        "To find your Place ID: open Google's Place ID finder (search \"Google Place ID finder\"), type your business name, and copy the ID that appears on the map pin. Alternatively, in your Google Business Profile dashboard, use \"Ask for reviews\" to copy your short review link and paste that here instead — both work identically.",
        "Where you put the code decides how many reviews you get. The moment of peak goodwill is right after a good experience: the bill folder, the payment counter, the delivery package, the checkout screen. A small card that says \"Loved it? A review takes 20 seconds\" above the code consistently outperforms a bare QR.",
        "One rule worth knowing: Google's policies prohibit offering incentives for reviews and prohibit selectively steering only happy customers to the form (\"review gating\"). Put the code in front of everyone — genuine volume is what moves your rating and your local search ranking.",
      ],
      faqs: [
        {
          q: "Where do I find my Google Place ID?",
          a: "Search the web for \"Google Place ID finder\", open Google's own finder tool, type your business name and copy the ID. Or copy the review short-link from your Google Business Profile's \"Ask for reviews\" button and paste that here instead.",
        },
        {
          q: "Does the customer need the Google Maps app?",
          a: "No. The link opens the review form in the browser or the Maps app, whichever the phone prefers. They do need to be signed in to a Google account to post a review — which almost every Android user already is.",
        },
        {
          q: "Can I offer a discount for reviews?",
          a: "No — Google's review policies prohibit incentivised reviews, and enforcement can mean losing all your reviews. Make it effortless instead; that is what this code does.",
        },
        {
          q: "Can I track how many people scanned?",
          a: "Not with a static code. A dynamic QR code gives you scan counts, times and devices — useful for testing whether the counter card or the bill insert works better.",
        },
      ],
    },
  },

  vcard: {
    label: "Contact card (vCard)",
    short: "vCard",
    fields: [
      { name: "firstName", label: "First name", type: "text", placeholder: "Harsh", required: true },
      { name: "lastName", label: "Last name", type: "text", placeholder: "Vatsal" },
      { name: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
      { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
      { name: "org", label: "Company", type: "text", placeholder: "Luminara Software Solutions" },
      { name: "title", label: "Job title", type: "text", placeholder: "Founder" },
      { name: "website", label: "Website", type: "url", placeholder: "https://company.com" },
    ],
    build: (v) => {
      if (!(v.firstName || "").trim()) return "";
      const fn = [v.firstName, v.lastName].filter(Boolean).join(" ").trim();
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${esc(v.lastName || "")};${esc(v.firstName || "")};;;`,
        `FN:${esc(fn)}`,
      ];
      if (v.org) lines.push(`ORG:${esc(v.org)}`);
      if (v.title) lines.push(`TITLE:${esc(v.title)}`);
      if (v.phone) lines.push(`TEL;TYPE=CELL:${digits(v.phone)}`);
      if (v.email) lines.push(`EMAIL:${(v.email || "").trim()}`);
      if (v.website) lines.push(`URL:${(v.website || "").trim()}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    },
    seo: {
      title: "vCard QR Code Generator — Free Digital Business Card QR",
      description:
        "Create a free QR code that saves your full contact card in one scan — name, number, email, company. Put it on your visiting card and never be retyped again.",
      h1: "QR code for your contact card",
      intro:
        "Scan → \"Add to contacts\" → done. This code packs your name, number, email, company and website into a standard vCard that every phone understands. Print it on the back of your visiting card, your email signature, or your conference badge.",
      body: [
        "A paper visiting card ends its life in a drawer; the details on it get retyped into a phone maybe one time in ten, usually with typos. A vCard QR flips that: the scan opens the phone's native \"new contact\" screen with every field already filled — spelling, country code, company name, all exactly as you wrote them here.",
        "Everything is encoded offline into the pattern itself. There is no profile page, no server, and nothing to expire — the code keeps working even if we disappear. The trade-off is the same as any static code: printed details can't be edited later, so if your number changes, the card needs a reprint.",
        "Keep the vCard lean. Every extra field makes the QR pattern denser and slightly harder to scan at small sizes — name, one number, one email, company and website is the sweet spot for a business-card-sized print.",
      ],
      faqs: [
        {
          q: "Does it work on both iPhone and Android?",
          a: "Yes. vCard (VCF) is the universal contact format — both camera apps recognise it and offer to save the contact directly.",
        },
        {
          q: "Is my contact information stored on your servers?",
          a: "No. The vCard is generated in your browser and encoded straight into the QR pattern. We never see it.",
        },
        {
          q: "Why does my QR look dense?",
          a: "A vCard carries much more data than a URL, so the pattern has more modules. Keep fields minimal and print at 2.5 cm or larger for reliable scanning on a business card.",
        },
        {
          q: "Can I update my details after printing?",
          a: "Not on a static vCard — the data lives in the pattern. If your details change often, point a dynamic QR at a contact page you control instead.",
        },
      ],
    },
  },

  email: {
    label: "Email",
    short: "Email",
    fields: [
      { name: "to", label: "To (email address)", type: "email", placeholder: "hello@company.com", required: true },
      { name: "subject", label: "Subject (optional)", type: "text", placeholder: "Enquiry" },
      { name: "body", label: "Body (optional)", type: "textarea", placeholder: "Hi, I'd like to know more about…" },
    ],
    build: (v) => {
      const to = (v.to || "").trim();
      if (!to) return "";
      const p = new URLSearchParams();
      if (v.subject) p.set("subject", v.subject);
      if (v.body) p.set("body", v.body);
      const qs = p.toString().replace(/\+/g, "%20");
      return `mailto:${to}${qs ? `?${qs}` : ""}`;
    },
    seo: {
      title: "Email QR Code Generator — Free, Opens a Pre-written Email",
      description:
        "Create a free QR code that opens a new email to your address with subject and body pre-filled. Great for support, feedback and enquiries. No signup.",
      h1: "QR code for email",
      intro:
        "One scan opens the phone's mail app with your address, subject line, and even the message body already filled in. Perfect for support desks, feedback requests, and print materials where typing an address is one step too many.",
      body: [
        "The code encodes a standard mailto: link, which every phone hands to its default mail app. Pre-filling the subject is the practical superpower here: set it to something sortable — \"Feedback — Store #12\" or \"Warranty claim\" — and your inbox filters can route scanned enquiries automatically.",
        "Use it on product packaging (\"Problem? Scan to email support\"), on invoices, at reception desks, and on service vehicles. For audiences that live on WhatsApp, consider a WhatsApp QR instead — response rates are typically higher — and keep email QR for formal or documented communication.",
      ],
      faqs: [
        {
          q: "Which mail app opens?",
          a: "Whatever the phone has set as default — Gmail, Apple Mail, Outlook. The mailto: standard is universal.",
        },
        {
          q: "Can I pre-fill the message?",
          a: "Yes — both subject and body. The person can still edit everything before sending.",
        },
        {
          q: "Is anything stored on your servers?",
          a: "No. The code is generated locally in your browser and the address is encoded only in the pattern.",
        },
      ],
    },
  },

  sms: {
    label: "SMS",
    short: "SMS",
    fields: [
      { name: "phone", label: "Phone number", type: "tel", placeholder: "+91 98765 43210", required: true },
      { name: "message", label: "Pre-filled message (optional)", type: "textarea", placeholder: "JOIN" },
    ],
    build: (v) => {
      const num = digits(v.phone || "");
      if (!num) return "";
      return `SMSTO:${num}:${v.message || ""}`;
    },
    seo: {
      title: "SMS QR Code Generator — Free, Opens a Pre-typed Text Message",
      description:
        "Create a free QR code that opens the SMS app with your number and message pre-typed. Ideal for keyword opt-ins and offline campaigns. No signup needed.",
      h1: "QR code for SMS",
      intro:
        "Scanning opens the messaging app with your number and message ready to send. The classic use is keyword opt-in — \"Text JOIN to subscribe\" becomes a single scan-and-send.",
      body: [
        "SMS QR codes shine where internet is unreliable or the audience skews away from smartphapps — an SMS goes through on any signal. They are also the cheapest bridge from print to a database you own: a keyword arriving at your number is a subscription event with a phone number attached.",
        "Keep the pre-filled message to a single short keyword. People will send exactly what you pre-type, so make it something your system can parse unambiguously.",
      ],
      faqs: [
        {
          q: "Does the person get charged?",
          a: "Standard SMS rates from their carrier apply, exactly as if they typed the message themselves. Most Indian plans include unlimited SMS.",
        },
        {
          q: "Can the message be edited before sending?",
          a: "Yes — the scan only pre-fills the compose screen. Nothing sends until they press send.",
        },
        {
          q: "iPhone and Android both?",
          a: "Yes, the SMSTO format is recognised by both camera apps.",
        },
      ],
    },
  },

  phone: {
    label: "Phone call",
    short: "Call",
    fields: [
      { name: "phone", label: "Phone number", type: "tel", placeholder: "+91 98765 43210", required: true },
    ],
    build: (v) => {
      const num = digits(v.phone || "");
      return num ? `tel:${num}` : "";
    },
    seo: {
      title: "Phone Call QR Code Generator — Free, One Scan to Dial",
      description:
        "Create a free QR code that dials your number in one scan. For service stickers, vehicles, and shopfronts. No signup, no watermark.",
      h1: "QR code for a phone call",
      intro:
        "The simplest QR there is: scan, and the phone's dialler opens with your number ready to call. Put it on service stickers, delivery vehicles, shop shutters, and anywhere \"call us\" is the action you want.",
      body: [
        "A tel: QR removes the misdial problem entirely — the number arrives in the dialler exactly as you encoded it, country code included. For emergency or service contexts (water purifier stickers, lift maintenance plates, tow services), that reliability is the whole point.",
        "Always encode the full international format (+91…). It works for every caller, including visitors with foreign SIMs, and survives being scanned abroad.",
      ],
      faqs: [
        {
          q: "Does scanning start the call immediately?",
          a: "No — it opens the dialler with the number filled in; the person taps the call button. Phones never auto-dial from a QR, by design.",
        },
        {
          q: "What number format should I use?",
          a: "Full international format with country code, e.g. +919876543210. It works everywhere and removes ambiguity.",
        },
      ],
    },
  },

  text: {
    label: "Plain text",
    short: "Text",
    fields: [
      {
        name: "text",
        label: "Text",
        type: "textarea",
        placeholder: "Any text up to ~1,000 characters…",
        required: true,
      },
    ],
    build: (v) => (v.text || "").trim(),
    seo: {
      title: "Text QR Code Generator — Free, Encode Any Plain Text",
      description:
        "Create a free QR code containing any plain text — serial numbers, asset tags, notes, codes. Generated in your browser, downloads as PNG or SVG.",
      h1: "QR code for plain text",
      intro:
        "Encode any text directly into a QR pattern — no link, no internet needed to read it. Scanning simply displays the text. Useful for serial numbers, asset tags, equipment instructions, and offline data.",
      body: [
        "Because the text lives in the pattern itself, a text QR works with zero connectivity — in a warehouse basement or on a mountainside. That makes it the standard choice for asset tagging, inventory labels and machine-readable serials.",
        "Capacity is finite: a QR code can hold up to roughly 3 KB, but practical scanning comfort drops past a few hundred characters as the pattern gets dense. Keep it short, or raise the error-correction level and print larger if you must encode more.",
      ],
      faqs: [
        {
          q: "How much text fits in a QR code?",
          a: "Technically up to ~4,000 alphanumeric characters, but density makes long codes hard to scan. Under 300 characters is comfortable at normal print sizes.",
        },
        {
          q: "Does reading the code need internet?",
          a: "No. The text is decoded entirely on the phone — no network involved.",
        },
      ],
    },
  },
};

export const QR_TYPE_SLUGS = Object.keys(QR_TYPES);

export function getType(slug) {
  return QR_TYPES[slug] || null;
}
