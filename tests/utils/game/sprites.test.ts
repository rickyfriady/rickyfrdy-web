import { describe, expect, it } from 'vitest'
import { spriteSheets } from '@/data/sprites'
import type { SpriteSheet } from '@/models'
import {
  animationFrame,
  assertSheetFits,
  buildSpriteMap,
  characterPose,
  fallbackKind,
  frameOffset,
  getSprite,
  integerScale,
  sheetCapacity,
  spriteKey
} from '@/utils/game/sprites'

const sheet: SpriteSheet = {
  id: 'hero-walk',
  frameWidth: 32,
  frameHeight: 32,
  width: 128,
  height: 128,
  animations: {
    'walk-down': { from: 0, to: 3 },
    'walk-up': { from: 12, to: 15 }
  },
  frameDuration: 100
}

describe('spriteKey()', () => {
  it('keys by file name, matching the tech-icon convention', () => {
    expect(spriteKey('../assets/sprites/character/hero-walk.png')).toBe('hero-walk')
    expect(spriteKey('shelf.png')).toBe('shelf')
  })
})

describe('buildSpriteMap()', () => {
  it('accepts a bare URL string', () => {
    expect(buildSpriteMap({ '/a/shelf.png': '/_astro/shelf.hash.png' })).toEqual({
      shelf: { url: '/_astro/shelf.hash.png' }
    })
  })

  it('accepts image metadata and keeps the real dimensions', () => {
    const map = buildSpriteMap({ '/a/hero-walk.png': { src: '/x.png', width: 128, height: 128 } })
    expect(map['hero-walk']).toEqual({ url: '/x.png', width: 128, height: 128 })
  })

  it('ignores a module it does not understand instead of breaking the build', () => {
    expect(buildSpriteMap({ '/a/weird.png': 42 })).toEqual({})
  })

  it('registers a static sprite from its file alone, with no declaration', () => {
    expect(Object.keys(buildSpriteMap({ '/a/npc-laura.png': '/x.png' }))).toEqual(['npc-laura'])
  })
})

describe('frame maths', () => {
  it('reports how many frames fit', () => {
    expect(sheetCapacity(sheet)).toEqual({ perRow: 4, total: 16 })
  })

  it('offsets by row and column', () => {
    expect(frameOffset(sheet, 0)).toEqual({ x: 0, y: 0 })
    expect(frameOffset(sheet, 3)).toEqual({ x: -96, y: 0 })
    expect(frameOffset(sheet, 4)).toEqual({ x: 0, y: -32 })
    expect(frameOffset(sheet, 15)).toEqual({ x: -96, y: -96 })
  })

  it('cycles exactly the frames an animation declares', () => {
    expect(animationFrame(sheet, 'walk-up', 0)).toBe(12)
    expect(animationFrame(sheet, 'walk-up', 150)).toBe(13)
    expect(animationFrame(sheet, 'walk-up', 450)).toBe(12)
  })

  it('returns null for an animation that was never declared', () => {
    expect(animationFrame(sheet, 'moonwalk', 0)).toBeNull()
  })
})

describe('assertSheetFits()', () => {
  it('accepts a sheet whose frames fit', () => {
    expect(() => assertSheetFits(sheet)).not.toThrow()
  })

  it('fails loudly, naming the sprite, when a declared frame cannot fit', () => {
    const tooTall = { ...sheet, height: 64 }
    expect(() => assertSheetFits(tooTall)).toThrow(/hero-walk/)
  })

  it('fails when the real image does not match the declaration', () => {
    expect(() => assertSheetFits(sheet, { url: '/x.png', width: 64, height: 64 })).toThrow(
      /hero-walk.*128x128.*64x64/
    )
  })

  it('says nothing about dimensions it cannot see', () => {
    expect(() => assertSheetFits(sheet, { url: '/x.png' })).not.toThrow()
  })
})

describe('integerScale()', () => {
  it('floors a fractional scale', () => {
    expect(integerScale(500, 240)).toBe(2)
    expect(integerScale(719, 240)).toBe(2)
    expect(integerScale(720, 240)).toBe(3)
  })

  it('never returns less than 1, so a sprite is never scaled away', () => {
    expect(integerScale(10, 240)).toBe(1)
    expect(integerScale(Number.NaN, 240)).toBe(1)
    expect(integerScale(240, 0)).toBe(1)
  })
})

describe('fallbackKind()', () => {
  it('maps sprite ids to a drawn shape so nothing renders blank', () => {
    expect(fallbackKind('hero-walk')).toBe('actor')
    expect(fallbackKind('npc-laura')).toBe('npc')
    expect(fallbackKind('door')).toBe('door')
    expect(fallbackKind('shelf')).toBe('object')
  })
})

describe('declared character sheets', () => {
  it('every declared sheet fits its real image, or getSprite throws naming it', () => {
    for (const declared of spriteSheets) {
      expect(() => getSprite(declared.id), declared.id).not.toThrow()
    }
  })

  it('hero-walk has a walk and an idle for each drawn direction', () => {
    const hero = spriteSheets.find((s) => s.id === 'hero-walk') as SpriteSheet
    for (const dir of ['down', 'up', 'left']) {
      expect(hero.animations[`walk-${dir}`], dir).toBeDefined()
      expect(hero.animations[`idle-${dir}`], dir).toBeDefined()
    }
  })

  it('a mis-sized fixture fails with the sprite id', () => {
    const wrong = {
      ...sheet,
      id: 'hero-walk',
      width: 64,
      height: 48,
      frameWidth: 16,
      frameHeight: 24
    }
    expect(() => assertSheetFits(wrong, { url: '/x.png', width: 64, height: 72 })).toThrow(
      /hero-walk/
    )
  })
})

describe('characterPose()', () => {
  const hero = spriteSheets.find((s) => s.id === 'hero-walk') as SpriteSheet & {
    animations: Record<string, { from: number; to: number }>
  }
  const d = hero.frameDuration

  it('stands on frame 0 of the facing row when not moving', () => {
    expect(characterPose(hero, 'down', false, 0).frame).toBe(0)
    expect(characterPose(hero, 'up', false, 500).frame).toBe(4)
    expect(characterPose(hero, 'left', false, 0).frame).toBe(8)
  })

  it('mirrors the left row for right, and nothing else', () => {
    expect(characterPose(hero, 'right', false, 0)).toEqual({ frame: 8, mirror: true })
    expect(characterPose(hero, 'left', false, 0).mirror).toBe(false)
    expect(characterPose(hero, 'down', false, 0).mirror).toBe(false)
  })

  it('steps at once when movement starts, then cycles neutral, foot, neutral, foot', () => {
    const frames = [0, 1, 2, 3, 4].map((i) => characterPose(hero, 'down', true, i * d).frame)
    expect(frames).toEqual([1, 2, 3, 0, 1])
  })

  it('walks the row it faces', () => {
    expect(characterPose(hero, 'up', true, 0).frame).toBeGreaterThanOrEqual(4)
    expect(characterPose(hero, 'up', true, 0).frame).toBeLessThanOrEqual(7)
    expect(characterPose(hero, 'right', true, 0).frame).toBeGreaterThanOrEqual(8)
  })

  it('returns to idle the moment movement stops', () => {
    expect(characterPose(hero, 'down', true, d).frame).not.toBe(0)
    expect(characterPose(hero, 'down', false, d).frame).toBe(0)
  })
})
