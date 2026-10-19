import { assertGrid, blit, canvas, mirrorHalf, toPng } from './raster.mjs'
import { slots } from './palette.mjs'

/**
 * A 16x24 character, three views (down, up, left) of four frames each.
 *
 * Head and torso are drawn once per view; legs are placed per frame, so a step
 * is a leg change and a one pixel dip rather than a redraw. Facing right is the
 * left row mirrored at render time, so it is not drawn here.
 */
export const W = 16
export const H = 24
const FRAMES = 4

const front = [
  '........',
  '.....ooo',
  '...ooHHh',
  '..ohhHHh',
  '..ohhhhh',
  '..ohhhhh',
  '..ohhhss',
  '..ohsess',
  '..ohsess',
  '..ohssss',
  '...oSSSS',
  '....oooo',
  '...otttt',
  '..ottttt',
  '..otTttt',
  '..osTttt',
  '...oTTTT',
  '...opppp'
].map(mirrorHalf)

const back = [
  '........',
  '.....ooo',
  '...ooHHh',
  '..ohhHHh',
  '..ohhhhh',
  '..ohhhhh',
  '..ohhhhh',
  '..ohhhhh',
  '..ohhhhh',
  '..ohhhhh',
  '...ohhhh',
  '....oooo',
  '...otttt',
  '..ottttt',
  '..otTttt',
  '..otTttt',
  '...oTTTT',
  '...opppp'
].map(mirrorHalf)

const left = [
  '................',
  '....oooooooo....',
  '...ohhhhhhhho...',
  '..ohhHHhhhhhho..',
  '..ohhhhhhhhhho..',
  '..osshhhhhhhho..',
  '..ossessshhhho..',
  '..ossessshhhho..',
  '..osssssshhhho..',
  '...osssssshho...',
  '....oSSShhho....',
  '....oooooooo....',
  '....ottttto.....',
  '...ottttttto....',
  '...ottttttto....',
  '...ottssttto....',
  '...oTTTTTTTo....',
  '...oppppppo.....'
]

// Front and back legs are two 5-wide columns side by side. Each name is a leg
// row: pants, boot, sole, or nothing (a raised foot).
const LEG = { P: 'opppo', B: 'obbbo', O: 'ooooo', E: '.....' }
const legRow = (l, r) => `...${LEG[l]}${LEG[r]}...`

const frontLegs = {
  stand: ['PP', 'PP', 'PP', 'BB', 'BB', 'OO'].map(([l, r]) => legRow(l, r)),
  stepL: ['PP', 'PP', 'BB', 'BO', 'OE'].map(([l, r]) => legRow(l, r)),
  stepR: ['PP', 'PP', 'BB', 'OB', 'EO'].map(([l, r]) => legRow(l, r))
}

// Side legs are drawn one at a time and overlapped, so a stride is a gap
// between two columns. `end` is the row the sole lands on.
const sideLeg = (end) => [
  { y: end - 5, rows: ['oppo.', 'oppo.', 'oppo.'] },
  { y: end - 2, rows: ['obbbo', 'obbbo', 'ooooo'] }
]
function placeSideLeg(c, x, end) {
  for (const part of sideLeg(end)) blit(c, part.rows, x, part.y)
}

function frame(view, kind, overlay) {
  const c = canvas(W, H)
  const step = kind !== 'stand'
  const dip = step ? 1 : 0
  blit(c, view === 'down' ? front : view === 'up' ? back : left, 0, dip)
  if (view === 'left') {
    if (kind === 'stand') {
      placeSideLeg(c, 5, 23)
    } else {
      // The forward leg lands on the floor; the trailing leg's sole is a row up.
      const fwd = kind === 'stepL' ? 3 : 8
      const back = kind === 'stepL' ? 8 : 3
      placeSideLeg(c, back, 22)
      placeSideLeg(c, fwd, 23)
    }
    stamp(c, overlay?.left, dip)
    return c
  }
  const legs = (view === 'down' || view === 'up' ? frontLegs : null)[kind]
  blit(c, legs, 0, H - legs.length)
  stamp(c, overlay?.[view], dip)
  return c
}

/** An overlay is `[y, rows]`: drawn over the body at that row, riding the step dip. */
function stamp(c, part, dip) {
  if (part) blit(c, part[1], 0, part[0] + dip)
}

const ORDER = ['stand', 'stepL', 'stand', 'stepR']
const VIEWS = ['down', 'up', 'left']

/** Writes the 64x72 sheet: one row per view, four frames across. */
export async function renderCharacter(palette, out, overlay) {
  const sheet = canvas(W * FRAMES, H * VIEWS.length)
  VIEWS.forEach((view, row) =>
    ORDER.forEach((kind, col) => {
      const f = frame(view, kind, overlay)
      assertGrid(`${out} ${view}/${kind}`, f.map((r) => r.join('')), W, H)
      blit(sheet, f.map((r) => r.join('')), col * W, row * H)
    })
  )
  await toPng(sheet, slots(palette), out)
}
