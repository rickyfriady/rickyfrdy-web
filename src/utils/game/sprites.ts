import { spriteSheetById } from '@/data/sprites'
import type { Sprite, SpriteSheet } from '@/models'

/**
 * Sprite resolution.
 *
 * Art is discovered from the directory itself, keyed by file name — the same
 * convention `src/utils/skillIcon.ts` uses for tech icons. Nothing here needs
 * art to exist: every sprite has a drawn fallback built from the theme tokens,
 * so the game is fully playable with an empty sprite directory, and dropping a
 * correctly named PNG in later replaces the fallback with no code change.
 */

export interface SpriteArt {
  url: string
  /** Real image dimensions when the loader can see them. */
  width?: number
  height?: number
}

/** Fallback shapes, drawn in CSS from tokens so they follow light/dark. */
export type FallbackKind = 'actor' | 'npc' | 'object' | 'door'

/** `../assets/sprites/character/hero-walk.png` → `hero-walk` */
export function spriteKey(path: string): string {
  const file = path.slice(path.lastIndexOf('/') + 1)
  const dot = file.lastIndexOf('.')
  return dot === -1 ? file : file.slice(0, dot)
}

/**
 * Build the sprite map from a glob result. Accepts either a bare URL string
 * (`query: '?url'`) or Astro's image metadata, so the same map works whether
 * the module graph hands back a URL or a `{ src, width, height }` object.
 */
export function buildSpriteMap(modules: Record<string, unknown>): Record<string, SpriteArt> {
  const map: Record<string, SpriteArt> = {}
  for (const [path, mod] of Object.entries(modules)) {
    if (typeof mod === 'string') {
      map[spriteKey(path)] = { url: mod }
      continue
    }
    if (mod && typeof mod === 'object' && 'src' in mod) {
      const meta = mod as { src: string; width?: number; height?: number }
      map[spriteKey(path)] = { url: meta.src, width: meta.width, height: meta.height }
    }
    // Anything else is ignored: an unknown file must not break the build.
  }
  return map
}

/** How many whole frames fit in the sheet's declared dimensions. */
export function sheetCapacity(sheet: SpriteSheet): { perRow: number; total: number } {
  const perRow = Math.floor(sheet.width / sheet.frameWidth)
  const rows = Math.floor(sheet.height / sheet.frameHeight)
  return { perRow, total: perRow * rows }
}

/**
 * Fails loudly, naming the sprite id.
 *
 * A frame offset that is silently one row out is exactly the class of bug that
 * survives type-checking, unit tests, and a green build, and is only ever
 * caught by looking at the running page.
 */
export function assertSheetFits(sheet: SpriteSheet, art?: SpriteArt): void {
  const { total } = sheetCapacity(sheet)
  for (const [name, range] of Object.entries(sheet.animations)) {
    if (range.from < 0 || range.to < range.from) {
      throw new Error(`Sprite sheet "${sheet.id}": animation "${name}" has an empty frame range`)
    }
    if (range.to >= total) {
      throw new Error(
        `Sprite sheet "${sheet.id}": animation "${name}" declares frame ${range.to}, but ${sheet.frameWidth}x${sheet.frameHeight} frames fit only ${total} times in ${sheet.width}x${sheet.height}`
      )
    }
  }
  if (art?.width !== undefined && art.height !== undefined) {
    if (art.width !== sheet.width || art.height !== sheet.height) {
      throw new Error(
        `Sprite sheet "${sheet.id}": declared ${sheet.width}x${sheet.height} but the image is ${art.width}x${art.height}`
      )
    }
  }
}

/** Background offset for a frame index, in unscaled sprite pixels. */
export function frameOffset(sheet: SpriteSheet, index: number): { x: number; y: number } {
  const { perRow, total } = sheetCapacity(sheet)
  const safe = total > 0 ? ((index % total) + total) % total : 0
  return {
    x: 0 - (safe % perRow) * sheet.frameWidth,
    y: 0 - Math.floor(safe / perRow) * sheet.frameHeight
  }
}

/** Frame index for an animation at a point in time, or null if undeclared. */
export function animationFrame(
  sheet: SpriteSheet,
  animation: string,
  elapsedMs: number
): number | null {
  const range = sheet.animations[animation]
  if (!range) return null
  const length = range.to - range.from + 1
  const step = Math.floor(Math.max(0, elapsedMs) / sheet.frameDuration)
  return range.from + (step % length)
}

/**
 * Integer-only scaling. A fractional factor resamples the sprite and every
 * hard pixel edge turns to mush, so the factor is floored — never below 1,
 * because a sprite scaled to zero is an invisible one.
 */
export function integerScale(availablePx: number, naturalPx: number): number {
  if (!Number.isFinite(availablePx) || !Number.isFinite(naturalPx) || naturalPx <= 0) return 1
  return Math.max(1, Math.floor(availablePx / naturalPx))
}

/** Which drawn shape stands in for a sprite that has no art. */
export function fallbackKind(id: string): FallbackKind {
  if (id.startsWith('npc-')) return 'npc'
  if (id.startsWith('hero')) return 'actor'
  if (id === 'door') return 'door'
  return 'object'
}

/**
 * Art discovered from the sprite directories.
 *
 * Empty today: `src/assets/sprites/` holds drawing specs and no images yet, so
 * every sprite renders its fallback. That is the intended state, not a broken
 * one — the pipeline was built this way so implementation is never blocked on
 * the art.
 */
const SPRITE_ART: Record<string, SpriteArt> = buildSpriteMap(
  import.meta.glob('../../assets/sprites/**/*.png', { eager: true, import: 'default' })
)

/** Sprite ids that have drawn art. Exported for coverage reporting. */
export const DRAWN_SPRITES: readonly string[] = Object.keys(SPRITE_ART).sort()

export function getSprite(id: string): Sprite {
  const art = SPRITE_ART[id]
  const sheet = spriteSheetById[id]
  if (sheet) assertSheetFits(sheet, art)
  return { id, url: art?.url, sheet }
}
