import { randomBytes } from "crypto";

// Minimal nanoid-style generator over a custom alphabet, crypto-random,
// modulo-bias-free via rejection sampling.
export function customAlphabet(alphabet, size) {
  const mask = (2 << Math.floor(Math.log2(alphabet.length - 1))) - 1;
  return () => {
    let id = "";
    while (id.length < size) {
      const bytes = randomBytes(size * 2);
      for (let i = 0; i < bytes.length && id.length < size; i++) {
        const idx = bytes[i] & mask;
        if (idx < alphabet.length) id += alphabet[idx];
      }
    }
    return id;
  };
}
