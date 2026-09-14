// Hot-path cache for shortCode → QR row. In-memory LRU with a short TTL so
// destination edits propagate within a minute even without cross-instance
// invalidation. Swap the internals for Upstash Redis when scale demands it —
// the call sites only know get/set/del.

const MAX = 5000;
const TTL_MS = 60 * 1000;

const store = new Map(); // code → { value, at }

export function cacheGet(code) {
  const hit = store.get(code);
  if (!hit) return undefined;
  if (Date.now() - hit.at > TTL_MS) {
    store.delete(code);
    return undefined;
  }
  // refresh recency
  store.delete(code);
  store.set(code, hit);
  return hit.value;
}

export function cacheSet(code, value) {
  if (store.size >= MAX) store.delete(store.keys().next().value);
  store.set(code, { value, at: Date.now() });
}

export function cacheDel(code) {
  store.delete(code);
}
