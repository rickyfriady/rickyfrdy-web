// @vitest-environment node
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { spriteSheets } from '@/data/sprites'
import { villagers } from '@/data/villagers'
import { HERO, slots } from '../../scripts/art/palette.mjs'

const CHARACTER_DIR = resolve(__dirname, '../../src/assets/sprites/character')

/** Pixel art is fully opaque or fully transparent; anything between is anti-aliasing. */
async function alphaValues(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const seen = new Set<number>()
  for (let i = 3; i < data.length; i += info.channels) seen.add(data[i])
  return { seen, width: info.width, height: info.height }
}

describe('hand-drawn character sheets', () => {
  const drawn = spriteSheets.filter((s) => s.id.endsWith('-walk') || s.id.startsWith('villager-'))

  it('declares at least the hero', () => {
    expect(drawn.map((s) => s.id)).toContain('hero-walk')
  })

  for (const sheet of drawn) {
    it(`${sheet.id} matches its declared size`, async () => {
      const { width, height } = await alphaValues(resolve(CHARACTER_DIR, `${sheet.id}.png`))
      expect({ width, height }).toEqual({ width: sheet.width, height: sheet.height })
    })

    it(`${sheet.id} has no anti-aliased pixels`, async () => {
      const { seen } = await alphaValues(resolve(CHARACTER_DIR, `${sheet.id}.png`))
      expect(
        [...seen].every((a) => a === 0 || a === 255),
        `alpha values: ${[...seen]}`
      ).toBe(true)
    })
  }
})

describe('character ground shadow', () => {
  it('is not in the sheet: every opaque pixel is a palette slot', async () => {
    const { data, info } = await sharp(resolve(CHARACTER_DIR, 'hero-walk.png'))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const allowed = new Set(
      Object.values(slots(HERO) as Record<string, string>).map((h) => h.toLowerCase())
    )
    const hex = (i: number) =>
      `#${[0, 1, 2].map((k) => data[i + k].toString(16).padStart(2, '0')).join('')}`
    for (let i = 0; i < data.length; i += info.channels) {
      if (data[i + 3] === 0) continue
      expect(allowed.has(hex(i)), `unexpected colour ${hex(i)}`).toBe(true)
    }
  })

  it('is hard-edged CSS: no blur and no radius', () => {
    const css = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf8')
    const block = css.match(/@utility char-shadow \{[^}]*\}/)?.[0] ?? ''
    expect(block).toContain('clip-path')
    expect(block).not.toMatch(/blur|border-radius|radial-gradient|filter/)
  })
})

describe('tile sheets drawn here', () => {
  it('props.png is the size SHEETS says it is', async () => {
    const { SHEETS } = await import('@/utils/game/tiles')
    const { width, height } = await alphaValues(
      resolve(__dirname, '../../src/assets/sprites/tiles/props.png')
    )
    expect({ width, height }).toEqual({
      width: SHEETS.props.cols * 16,
      height: SHEETS.props.rows * 16
    })
  })
})

describe('ambient motion styles', () => {
  it('canopy sway is stepped and never eased', () => {
    const css = readFileSync(resolve(__dirname, '../../src/styles/global.css'), 'utf8')
    const block = css.match(/@utility canopy-sway \{[\s\S]*?\n\}/)?.[0] ?? ''
    expect(block).toContain('steps(4')
    expect(block).not.toMatch(/cubic-bezier|ease/)
    expect(block).toContain('prefers-reduced-motion')
  })
})

describe('villager sheets', () => {
  it('has a drawn sheet for every look a villager uses', () => {
    for (const v of villagers) {
      expect(() => statSync(resolve(CHARACTER_DIR, `${v.sheet}.png`)), v.sheet).not.toThrow()
    }
  })

  it('stays tiny: under 2 KB a sheet', () => {
    for (const v of villagers) {
      const { size } = statSync(resolve(CHARACTER_DIR, `${v.sheet}.png`))
      expect(size, v.sheet).toBeLessThan(2048)
    }
  })

  it('is generated one sheet per palette, so a palette needs no new drawing', async () => {
    const { VILLAGER_PALETTES } = await import('../../scripts/art/palette.mjs')
    const { villagerSheets } = await import('../../scripts/art/villagers.mjs')
    expect(villagerSheets).toHaveLength(VILLAGER_PALETTES.length)
    expect(new Set(villagerSheets.map((s: { out: string }) => s.out)).size).toBe(
      villagerSheets.length
    )
  })
})
