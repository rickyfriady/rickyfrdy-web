/**
 * Cuts the companion's walk cycle out of the Petdex source sheet.
 *
 * The source is 1.6 MB of 72 frames at 192x208, and the companion draws four
 * of them 48 px tall on every route. Shipping the original would put the whole
 * sheet behind every page to animate a twentieth of it, so the committed sheet
 * is cut and scaled here and the source stays outside the repository.
 *
 * Run after changing which frames the walk uses:
 *   node scripts/cut-companion-sheet.mjs
 */
import { mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

const SOURCE = join(homedir(), '.petdex/pets/nickel-file-ledger/spritesheet.webp')
const OUT_DIR = 'src/assets/sprites/character'
const OUT = join(OUT_DIR, 'companion-pet.png')

// The source grid, measured from the empty gutters between cells rather than
// assumed: 8 columns x 9 rows of 192x208.
const CELL_W = 192
const CELL_H = 208

// Row 3 is the walk: four frames, feet alternating, one arm swinging. Every
// row faces the viewer, so there is no direction to choose here.
const ROW = 3
const FRAMES = 4

// The drawn content inside each cell, so the committed sheet is not mostly
// transparent padding. Shared across the four frames, which is what keeps them
// aligned with each other.
const CONTENT = { left: 9, top: 5, width: 173, height: 198 }

// 48 px tall clears the 64 px container with the actor's 12 px offset. The
// width follows the content's aspect rather than being squared off, because a
// squashed mascot is the tell that a sprite was resized carelessly.
const FRAME_H = 48
const FRAME_W = Math.round((CONTENT.width * FRAME_H) / CONTENT.height)

const frames = await Promise.all(
  Array.from({ length: FRAMES }, (_, i) =>
    sharp(SOURCE)
      .extract({
        left: i * CELL_W + CONTENT.left,
        top: ROW * CELL_H + CONTENT.top,
        width: CONTENT.width,
        height: CONTENT.height,
      })
      // lanczos3, not nearest: the source is soft-shaded with anti-aliased
      // edges, and nearest at this fractional ratio drops half the shading
      // into jagged noise. The sheet is authored at its render size, so the
      // browser never resamples it again on a 1x display.
      .resize(FRAME_W, FRAME_H, { kernel: 'lanczos3', fit: 'fill' })
      .png()
      .toBuffer()
  )
)

await mkdir(OUT_DIR, { recursive: true })
const { size } = await sharp({
  create: {
    width: FRAME_W * FRAMES,
    height: FRAME_H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(frames.map((input, i) => ({ input, left: i * FRAME_W, top: 0 })))
  .png({ palette: true })
  .toFile(OUT)

console.log(`${OUT}: ${FRAME_W * FRAMES}x${FRAME_H}, frame ${FRAME_W}x${FRAME_H}, ${size} bytes`)
