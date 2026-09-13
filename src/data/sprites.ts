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
/*
 * `hero-walk` was registered here from the day the pipeline was built and its
 * PNG was never drawn, so the only thing it ever rendered was the drawn floor.
 * It is retired rather than left in place: a registration for a file nobody
 * intends to draw is a claim the sheet-dimension guard can never check.
 * `tests/utils/game/sprites.test.ts` builds its own fixtures and is unaffected.
 */
export const spriteSheets = [
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
