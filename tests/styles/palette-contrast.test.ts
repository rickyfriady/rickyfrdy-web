import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guards the valley palette's WCAG conformance directly against the real
 * tokens in `global.css`, so changing a colour can never silently break AA.
 *
 * Roles are split deliberately: `accent` is text/interactive (needs 4.5:1),
 * while `thread` and `sun` are non-text graphics (need 3:1). No sunny colour
 * clears 4.5:1 as text on cream, which is why `sun` exists at all.
 */

const CSS = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf8')

type Oklch = [L: number, C: number, H: number]

function block(source: string, opener: string): string {
  const start = source.indexOf(opener)
  if (start === -1) throw new Error(`block not found: ${opener}`)
  const from = start + opener.length
  let depth = 1
  for (let i = from; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) return source.slice(from, i)
  }
  throw new Error(`unterminated block: ${opener}`)
}

function tokens(scope: string): Record<string, Oklch> {
  const out: Record<string, Oklch> = {}
  const re = /--color-([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g
  for (const m of scope.matchAll(re)) {
    out[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])]
  }
  return out
}

function oklchToSrgb([L, C, H]: Oklch): [number, number, number] {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ]
  return lin.map((v) => {
    const x = Math.min(1, Math.max(0, v))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  }) as [number, number, number]
}

// Machado et al. 2009 dichromacy matrices at full severity, in linear sRGB.
const CVD = {
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881]
  ],
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998]
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039]
  ]
} as const

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** OKLab distance between two colours as a dichromat sees them. */
function cvdDistance(a: Oklch, b: Oklch, matrix: readonly (readonly number[])[]): number {
  const lab = (o: Oklch) => {
    const lin = oklchToSrgb(o).map(toLinear)
    const [r, g, bl] = matrix.map((row) =>
      Math.min(1, Math.max(0, row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]))
    )
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * bl)
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * bl)
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * bl)
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    ]
  }
  const [x, y] = [lab(a), lab(b)]
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: Oklch, b: Oklch): number {
  const [x, y] = [luminance(oklchToSrgb(a)), luminance(oklchToSrgb(b))]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/**
 * `color-mix(in oklch, a pct%, b)`: lightness and chroma blend linearly, hue
 * along the shorter arc. Enough to reproduce the sky gradient from its tokens.
 */
function mix(a: Oklch, pct: number, b: Oklch): Oklch {
  const t = pct / 100
  let dh = b[2] - a[2]
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  return [a[0] * t + b[0] * (1 - t), a[1] * t + b[1] * (1 - t), (a[2] + dh * (1 - t) + 360) % 360]
}

/** The two stops of `valley-sky`, read from the stylesheet so the test follows the CSS. */
const skyStops = [
  ...block(CSS, '@utility valley-sky {').matchAll(
    /color-mix\(in oklch, var\(--color-sun\) (\d+)%, var\(--color-background\)\)/g
  )
].map((m) => Number(m[1]))

type Rgb = [number, number, number]

const rgbContrast = (a: Rgb, b: Rgb) => {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/** The strongest the light through the canopy ever gets, read from the stylesheet. */
const ambientBlock = CSS.slice(
  CSS.indexOf('Ambient: wind, light'),
  CSS.indexOf('@utility game-hud')
)
const SHAFT_MAX = Math.max(
  ...[...ambientBlock.matchAll(/opacity:\s*([\d.]+)/g)].map((m) => Number(m[1]))
)
const SHAFT_MIX = Number(
  CSS.match(/--shaft:\s*color-mix\(in oklch, var\(--color-sun\) (\d+)%, white\)/)?.[1]
)

/**
 * What the ground looks like with a shaft over it at full strength:
 * `mix-blend-mode: screen`, composited at the shaft's own opacity.
 */
function underShaft(sun: Oklch, ground: Oklch): Rgb {
  const white: Oklch = [1, 0, sun[2]]
  const shaft = oklchToSrgb(mix(sun, SHAFT_MIX, white))
  const base = oklchToSrgb(ground)
  return base.map((g, i) => {
    const screened = 1 - (1 - g) * (1 - shaft[i])
    return g + SHAFT_MAX * (screened - g)
  }) as Rgb
}

const themeBlock = block(CSS, '@theme {')
const darkBlock = block(CSS, '.dark {')
// The world palette is scoped to the playable route and is promotable site-wide
// by moving one class, so it has to clear the same bar as the two it can cover.
const worldBlock = block(CSS, '.world.dark {')
const light = tokens(themeBlock)
const dark = { ...light, ...tokens(darkBlock) } // dark inherits anything it does not override
const world = { ...dark, ...tokens(worldBlock) } // world inherits thread, which it never overrides
// Seasons by day. Night is the world block itself, whatever the season, so
// these four plus `world` cover every season at both times of day.
const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const
const seasonBlocks = Object.fromEntries(
  SEASONS.map((season) => [
    season,
    block(CSS, `.world[data-time='day'][data-season='${season}'] {`)
  ])
) as Record<(typeof SEASONS)[number], string>
const seasons: [string, Record<string, Oklch>][] = SEASONS.map((season) => [
  `${season} day`,
  { ...world, ...tokens(seasonBlocks[season]) }
])

const TEXT_ROLES = ['foreground', 'muted', 'accent', 'accent-hover'] as const
const GRAPHIC_ROLES = ['thread', 'border', 'sun'] as const
// `secondary` joined the grounds when the play scene started using it as its
// floor: text now sits on it, so it has to clear the same bar as the others.
const GROUNDS = ['background', 'surface', 'secondary'] as const

const palettes: [string, Record<string, Oklch>][] = [
  ['light', light],
  ['dark', dark],
  ['world', world],
  ...seasons
]

describe.each(palettes)('%s theme', (_name, palette) => {
  it('defines every role the stylesheet relies on', () => {
    for (const role of [...TEXT_ROLES, ...GRAPHIC_ROLES, ...GROUNDS]) {
      expect(palette[role], `--color-${role} missing`).toBeDefined()
    }
  })

  it.each(
    TEXT_ROLES.flatMap((role) => GROUNDS.map((ground) => [role, ground] as const))
  )('%s on %s meets AA text contrast (4.5:1)', (role, ground) => {
    expect(contrast(palette[role], palette[ground])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(
    GRAPHIC_ROLES.flatMap((role) => GROUNDS.map((ground) => [role, ground] as const))
  )('%s on %s meets non-text contrast (3:1)', (role, ground) => {
    expect(contrast(palette[role], palette[ground])).toBeGreaterThanOrEqual(3)
  })

  // Nothing sits on the valley's sky today, but a label or panel that drifts
  // over it must still be readable, so both ends of the gradient are held to
  // the same bar as any other ground.
  it.each(
    TEXT_ROLES.flatMap((role) => [0, 1].map((stop) => [role, stop] as const))
  )('%s over the valley sky (stop %i) meets AA text contrast (4.5:1)', (role, stop) => {
    // The sky exists only inside `.world`, so the plain light and dark themes have none.
    if (_name === 'light' || _name === 'dark') return
    expect(skyStops).toHaveLength(2)
    const sky = mix(palette.sun, skyStops[stop], palette.background)
    expect(contrast(palette[role], sky)).toBeGreaterThanOrEqual(4.5)
  })

  // The light is capped at a few percent, but "a few percent" is a claim, so
  // the worst case is computed: full strength, over each ground, under each text role.
  it.each(
    TEXT_ROLES.flatMap((role) => GROUNDS.map((ground) => [role, ground] as const))
  )('%s on %s still meets 4.5:1 under a light shaft at full strength', (role, ground) => {
    if (_name === 'light' || _name === 'dark') return
    expect(Number.isFinite(SHAFT_MAX) && SHAFT_MAX > 0 && SHAFT_MAX <= 0.16).toBe(true)
    expect(Number.isFinite(SHAFT_MIX)).toBe(true)
    expect(
      rgbContrast(oklchToSrgb(palette[role]), underShaft(palette.sun, palette[ground]))
    ).toBeGreaterThanOrEqual(4.5)
  })

  // Red thread against a green accent is exactly the pair red-green
  // colourblindness collapses. 0.08 in OKLab is roughly four just-noticeable
  // differences; a light accent at L 0.44 scored 0.008 for protanopes.
  it.each(Object.entries(CVD))('keeps thread and accent apart under %s', (_cvd, matrix) => {
    expect(cvdDistance(palette.thread, palette.accent, matrix)).toBeGreaterThan(0.08)
  })
})

describe('retired palettes', () => {
  it('drops the CASE FILE and old world accents', () => {
    for (const value of ['oklch(0.48 0.160 30)', 'oklch(0.68 0.150 30)', 'oklch(0.82 0.140 88)']) {
      expect(CSS).not.toContain(value)
    }
  })

  it('never brings back the blue (hue 220) or the old green (hue 160) accent', () => {
    for (const palette of [light, dark, world]) {
      expect([220, 160]).not.toContain(palette.accent[2])
    }
  })
})

describe('world palette', () => {
  /**
   * Without this, an empty or mis-parsed world block would inherit every dark
   * value and the contrast suite above would pass while testing nothing.
   */
  it('actually overrides the roles it claims, rather than silently inheriting', () => {
    const overridden = tokens(worldBlock)
    for (const role of [
      'background',
      'foreground',
      'muted',
      'border',
      'secondary',
      'surface',
      'accent',
      'sun'
    ]) {
      expect(overridden[role], `--color-${role} missing from the world block`).toBeDefined()
      expect(overridden[role]).not.toEqual(dark[role])
    }
  })

  it('leaves the thread alone, so the attention marker survives the palette', () => {
    expect(tokens(worldBlock).thread).toBeUndefined()
    expect(world.thread).toEqual(light.thread)
  })

  it('keeps the thread separated from the green accent by hue', () => {
    const gap = Math.abs(world.accent[2] - world.thread[2])
    expect(gap).toBeGreaterThan(30)
  })

  it('is declared after .dark, so it still wins when both land on <html>', () => {
    expect(CSS.indexOf('.world.dark {')).toBeGreaterThan(CSS.indexOf('.dark {'))
  })
})

describe('seasons', () => {
  it.each(SEASONS)('%s never touches the thread', (season) => {
    expect(tokens(seasonBlocks[season]).thread).toBeUndefined()
  })

  it.each(SEASONS)('%s is a designed palette of its own, not a copy', (season) => {
    const own = tokens(seasonBlocks[season])
    expect(own.background).toBeDefined()
    for (const other of SEASONS) {
      if (other !== season)
        expect(own.background).not.toEqual(tokens(seasonBlocks[other]).background)
    }
  })
})

describe('thread', () => {
  it('is theme-constant — declared once, never overridden in .dark', () => {
    expect(tokens(darkBlock).thread).toBeUndefined()
    expect(dark.thread).toEqual(light.thread)
  })

  it('is the only saturated colour, so it reads as the attention marker', () => {
    const chroma = (r: string) => light[r]?.[1] ?? 0
    for (const role of ['background', 'surface', 'secondary', 'border', 'foreground', 'muted']) {
      expect(chroma(role), `--color-${role} should stay near-neutral`).toBeLessThan(0.05)
    }
    expect(light.thread[1]).toBeGreaterThan(0.15)
  })
})

describe('pixel identity tokens', () => {
  it('zeroes every radius token so nothing renders rounded', () => {
    const radii = [...themeBlock.matchAll(/--radius-[\w-]+:\s*([^;]+);/g)].map((m) => m[1].trim())
    expect(radii.length).toBeGreaterThan(0)
    for (const value of radii) expect(value).toBe('0')
  })

  it('neutralises rounded-full, which Tailwind 4 hardcodes rather than tokenises', () => {
    expect(CSS).toMatch(/\.rounded-full\s*\{\s*border-radius:\s*0;/)
  })

  it('uses stepped motion for the site easing tokens', () => {
    for (const token of ['--ease-out-quart', '--ease-out-expo', '--ease-spring']) {
      expect(themeBlock).toMatch(new RegExp(`${token}:\\s*steps\\(`))
    }
  })

  it('pins the spacing grid to 4px', () => {
    expect(themeBlock).toMatch(/--spacing:\s*0\.25rem/)
  })
})
