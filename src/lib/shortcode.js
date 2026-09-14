import { customAlphabet } from "./nanoid";

// No 0/O/1/l/I — codes get read aloud and retyped from print.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

const gen = customAlphabet(ALPHABET, 7);

export function newShortCode() {
  return gen();
}
