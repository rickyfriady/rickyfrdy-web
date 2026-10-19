/**
 * Shared palette for hand-drawn world art.
 *
 * Outlines are a dark tint of the object's own hue, never #000: that is the
 * Gen 3 look this art is after, and it keeps a sprite from reading as a
 * cut-out on the warm valley ground. Each ramp is outline, shade, base,
 * highlight (three or four tones).
 */
export const OUTLINE = '#34262c'

export const SKIN = { shade: '#d99a6c', base: '#f2c394' }
export const EYE = '#2a1c1c'

/** Character slots. A letter in a drawing grid names a slot, not a colour. */
export const slots = (p) => ({
  o: OUTLINE,
  e: EYE,
  s: p.skin.base,
  S: p.skin.shade,
  h: p.hair.base,
  H: p.hair.high,
  t: p.shirt.base,
  T: p.shirt.shade,
  p: p.pants.base,
  P: p.pants.shade,
  b: p.boots.base,
  // Optional slots, drawn only by an archetype's overlay.
  ...(p.hat && { a: p.hat.base, A: p.hat.shade }),
  ...(p.cap && { c: p.cap.base, C: p.cap.shade }),
  ...(p.apron && { w: p.apron.base, W: p.apron.shade }),
  ...(p.leather && { n: p.leather.base, N: p.leather.shade })
})

const STRAW = { base: '#e0c070', shade: '#b89448' }
const LEATHER = { base: '#9a6a3c', shade: '#74502c' }
const APRON = { base: '#f0e8d8', shade: '#cfc3a6' }
const BOOTS = { base: '#6a4a2e' }
const skin = (base, shade) => ({ base, shade })

/**
 * Villagers: one body, many palettes. Each entry is an archetype (which decides
 * the overlay, so the silhouette differs) and a name for its colours. Adding an
 * entry here adds a sheet to the build and nothing else.
 */
export const VILLAGER_PALETTES = [
  {
    archetype: 'farmer',
    name: 'wheat',
    skin: skin('#e8b080', '#c88a60'),
    hair: { base: '#4a3022', high: '#6a4a32' },
    shirt: { base: '#c9a44a', shade: '#a08030' },
    pants: { base: '#5a78a8', shade: '#44608a' },
    boots: BOOTS,
    hat: STRAW
  },
  {
    archetype: 'farmer',
    name: 'sky',
    skin: skin('#b27a4e', '#8e5a38'),
    hair: { base: '#2c2420', high: '#463a32' },
    shirt: { base: '#9ab8c8', shade: '#7898aa' },
    pants: { base: '#6a5a4a', shade: '#524438' },
    boots: BOOTS,
    hat: STRAW
  },
  {
    archetype: 'child',
    name: 'peach',
    skin: skin('#f4cba0', '#dca47a'),
    hair: { base: '#b0703c', high: '#cc8c52' },
    shirt: { base: '#e8a0a0', shade: '#c07878' },
    pants: { base: '#8aa0c8', shade: '#6c84aa' },
    boots: BOOTS,
    cap: { base: '#8fc8d8', shade: '#68a0b0' }
  },
  {
    archetype: 'child',
    name: 'mint',
    skin: skin('#e8b080', '#c88a60'),
    hair: { base: '#3a2a22', high: '#58443a' },
    shirt: { base: '#a8d4b0', shade: '#82b08c' },
    pants: { base: '#c8a8d0', shade: '#a888b2' },
    boots: BOOTS,
    cap: { base: '#f0d078', shade: '#c8a850' }
  },
  {
    archetype: 'shopkeeper',
    name: 'plum',
    skin: skin('#f2c394', '#d99a6c'),
    hair: { base: '#3a2a22', high: '#58443a' },
    shirt: { base: '#9a6a8a', shade: '#784f6a' },
    pants: { base: '#4a4a5a', shade: '#383846' },
    boots: BOOTS,
    apron: APRON
  },
  {
    archetype: 'wanderer',
    name: 'dusk',
    skin: skin('#d9a070', '#b8805a'),
    hair: { base: '#a07038', high: '#c08c50' },
    shirt: { base: '#6a8a9a', shade: '#4a6a7a' },
    pants: { base: '#7a5a3a', shade: '#5e4228' },
    boots: BOOTS,
    cap: { base: '#d0583c', shade: '#a8402a' },
    leather: LEATHER
  }
]

export const HERO = {
  skin: SKIN,
  hair: { base: '#6b4428', high: '#8f6038' },
  shirt: { base: '#5a9a52', shade: '#3f7440' },
  pants: { base: '#4f6a9a', shade: '#3a5078' },
  boots: { base: '#7a5230' }
}

/**
 * Canopy ramps per season: high, base, shade, outline. Each season takes four
 * letters of its own so all four can share one sheet; the drawing uses
 * L m d o and is remapped per season.
 */
export const SEASONS = {
  spring: { chars: 'ABCD', hex: ['#a8d878', '#7ab84e', '#5a9a3c', '#2c4a2c'] },
  summer: { chars: 'EFGH', hex: ['#7cc060', '#4f9a48', '#3a7a3c', '#244a2c'] },
  autumn: { chars: 'IJKN', hex: ['#f0b050', '#d98030', '#b05a28', '#4a2a1c'] },
  winter: { chars: 'PQRS', hex: ['#f4f8fa', '#d0dde0', '#9fb4bc', '#4a5a68'] }
}

/** Props: wood, a green and cream check cloth, foliage. Outline is shared. */
export const PROPS = {
  o: OUTLINE,
  w: '#b07a44',
  W: '#845630',
  c: '#efe6c6',
  g: '#6aa860',
  G: '#4a8048',
  x: OUTLINE,
  z: '#c8704a',
  Z: '#9a4e32',
  f: '#f0c040',
  p: '#f6efe0',
  k: '#a89c94',
  K: '#7a6e68',
  y: '#9a6a3c',
  Y: '#74502c'
}
for (const { chars, hex } of Object.values(SEASONS)) {
  ;[...chars].forEach((ch, i) => {
    PROPS[ch] = hex[i]
  })
}

