import type { SpriteSheet } from '@/models'

/**
 * Animated sprite sheets — and only animated sheets.
 *
 * A static sprite is registered by the existence of its file, exactly as
 * `src/assets/sprites/README.md` describes and `src/utils/skillIcon.ts`
 * already implements: there is no list to keep in sync. Frame size and timing
 * are the one thing that genuinely cannot be read off an image, so an animated
 * sheet — and nothing else — declares them here.
 *
 * `width` / `height` are the sheet's expected pixel dimensions. When the real
 * file lands they are checked against it, so a sheet drawn at the wrong size
 * fails at build with its id named rather than rendering a shifted frame.
 */
export const spriteSheets = [
  {
    id: 'hero-walk',
    frameWidth: 32,
    frameHeight: 32,
    width: 128,
    height: 128,
    // Idle is each direction's first frame, so there is nothing extra to draw.
    animations: {
      'walk-down': { from: 0, to: 3 },
      'walk-left': { from: 4, to: 7 },
      'walk-right': { from: 8, to: 11 },
      'walk-up': { from: 12, to: 15 }
    },
    frameDuration: 140
  }
] satisfies SpriteSheet[]

export const spriteSheetById: Record<string, SpriteSheet> = Object.fromEntries(
  spriteSheets.map((sheet) => [sheet.id, sheet])
)
