/**
 * Seeded randomness.
 *
 * `Math.random` would make encounters untestable and a lost fight
 * irreproducible. mulberry32 is five lines, needs no dependency, and gives
 * identical sequences for identical seeds, which is the entire requirement.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable 32-bit hash of a string, so a quest id can seed a run. */
export function seedFrom(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
