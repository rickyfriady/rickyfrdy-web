import { villagers } from '@/data/villagers'
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
/**
 * A 16x24 character drawn by `scripts/art/character.mjs`: down, up and left
 * rows of four frames each. Right is the left row mirrored at render time, so
 * it has no row. Frame 0 of each row is the idle pose.
 */
const characterSheet = (id: string) =>
  ({
    id,
    frameWidth: 16,
    frameHeight: 24,
    width: 64,
    height: 72,
    animations: {
      'walk-down': { from: 0, to: 3 },
      'walk-up': { from: 4, to: 7 },
      'walk-left': { from: 8, to: 11 },
      'idle-down': { from: 0, to: 0 },
      'idle-up': { from: 4, to: 4 },
      'idle-left': { from: 8, to: 8 }
    },
    frameDuration: 160
  }) satisfies SpriteSheet

/** One sheet per distinct villager look; two villagers may share one. */
const villagerSheetIds = [...new Set(villagers.map((v) => v.sheet))]

export const spriteSheets = [
  characterSheet('hero-walk'),
  ...villagerSheetIds.map(characterSheet),
  {
    /**
     * The companion. Cut from the Petdex source by
     * `scripts/cut-companion-sheet.mjs`, which is where the frame choice and
     * the sizing live.
     *
     * One row, and frames that are taller than they are wide. Both are why the
     * renderer had to stop assuming square frames in four directional rows:
     * every frame of the source faces the viewer, so travel direction is the
     * horizontal mirror rather than a second set of art.
     */
    id: 'companion-pet',
    frameWidth: 42,
    frameHeight: 48,
    width: 168,
    height: 48,
    animations: {
      walk: { from: 0, to: 3 }
    },
    frameDuration: 140
  }
] satisfies SpriteSheet[]

export const spriteSheetById: Record<string, SpriteSheet> = Object.fromEntries(
  spriteSheets.map((sheet) => [sheet.id, sheet])
)
