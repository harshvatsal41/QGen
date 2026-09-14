// Smart QR destination resolution: device → schedule → geo → default → stored URL.
// Pure function so it is trivially testable.

export function classifyDevice(ua = "") {
  const s = ua.toLowerCase();
  if (/ipad|iphone|ipod/.test(s)) return "ios";
  if (/android/.test(s)) return "android";
  return "desktop";
}

// minutesNow is minutes since midnight in the QR owner's audience timezone.
// v1 assumes IST (UTC+5:30) — the Indian-first default; per-QR timezone is a
// column away when needed.
export function resolveDestination(qr, { ua = "", country = null, now = new Date() } = {}) {
  const rules = qr.rules || null;
  if (!rules) return qr.destination;

  if (rules.device) {
    const d = classifyDevice(ua);
    if (rules.device[d]) return rules.device[d];
  }

  if (Array.isArray(rules.schedule) && rules.schedule.length) {
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][ist.getUTCDay()];
    const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
    for (const slot of rules.schedule) {
      if (!slot?.url) continue;
      if (Array.isArray(slot.days) && slot.days.length && !slot.days.includes(day)) continue;
      const from = toMinutes(slot.from ?? "00:00");
      const to = toMinutes(slot.to ?? "24:00");
      const inWindow =
        from <= to ? minutes >= from && minutes < to : minutes >= from || minutes < to; // overnight window
      if (inWindow) return slot.url;
    }
  }

  if (rules.geo && country && rules.geo[country]) return rules.geo[country];

  return rules.default || qr.destination;
}

function toMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
