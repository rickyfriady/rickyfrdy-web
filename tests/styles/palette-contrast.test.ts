import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guards the CASE FILE palette's WCAG conformance directly against the real
 * tokens in `global.css`, so changing a colour can never silently break AA.
 *
 * Roles are split deliberately: `accent` is text/interactive (needs 4.5:1),
 * while `thread` is a non-text graphic (needs 3:1). No single red clears 4.5:1
 * as text against both a dark wood ground and a light paper ground.
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

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: Oklch, b: Oklch): number {
  const [x, y] = [luminance(oklchToSrgb(a)), luminance(oklchToSrgb(b))]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const themeBlock = block(CSS, '@theme {')
const darkBlock = block(CSS, '.dark {')
// The world palette is scoped to the playable route and is promotable site-wide
// by moving one class, so it has to clear the same bar as the two it can cover.
const worldBlock = block(CSS, '.world.dark {')
const light = tokens(themeBlock)
const dark = { ...light, ...tokens(darkBlock) } // dark inherits anything it does not override
const world = { ...dark, ...tokens(worldBlock) } // world inherits thread, which it never overrides

const TEXT_ROLES = ['foreground', 'muted', 'accent', 'accent-hover'] as const
const GRAPHIC_ROLES = ['thread', 'border'] as const
// `secondary` joined the grounds when the play scene started using it as its
// floor: text now sits on it, so it has to clear the same bar as the others.
const GROUNDS = ['background', 'surface', 'secondary'] as const

describe.each([
  ['light', light],
  ['dark', dark],
  ['world', world]
])('%s theme', (_name, palette) => {
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
      'accent'
    ]) {
      expect(overridden[role], `--color-${role} missing from the world block`).toBeDefined()
      expect(overridden[role]).not.toEqual(dark[role])
    }
  })

  it('leaves the thread alone, so the attention marker survives the palette', () => {
    expect(tokens(worldBlock).thread).toBeUndefined()
    expect(world.thread).toEqual(light.thread)
  })

  it('keeps the thread separated from the gold accent by hue', () => {
    const gap = Math.abs(world.accent[2] - world.thread[2])
    expect(gap).toBeGreaterThan(30)
  })

  it('is declared after .dark, so it still wins when both land on <html>', () => {
    expect(CSS.indexOf('.world.dark {')).toBeGreaterThan(CSS.indexOf('.dark {'))
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
