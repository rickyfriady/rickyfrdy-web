import { assertGrid, blit, canvas, toPng } from './raster.mjs'
import { PROPS, SEASONS } from './palette.mjs'
import { mirrorHalf } from './raster.mjs'

/**
 * The props sheet: 16x16 frames, 12 across, 6 down (192x96).
 *
 * Row 0 is furniture and ornaments, row 1 tree trunks by season, rows 2 to 5
 * the tree canopies by season with four sway frames each. A drawing is placed by
 * frame index, so adding a prop is one entry and the sheet size never moves.
 */
const COLS = 12
const ROWS = 6
const T = 16

// Round table with a checked cloth over a wood top, on two legs. Drawn 12 rows
// tall and dropped to the foot of its cell.
const table = [
  '....oooooooo....',
  '..oowwwwwwwwoo..',
  '.owwcgcgcgcgwwo.',
  '.owcgcgcgcgcgwo.',
  '.owgcgcgcgcgcwo.',
  '.owwcgcgcgcgwwo.',
  '..oowwwwwwwwoo..',
  '...oWWWWWWWWo...',
  '....oooooooo....',
  '...oWo....oWo...',
  '...oWo....oWo...',
  '...ooo....ooo...'
]

// Chair, front view: slatted back, seat, four legs' worth of two.
const chair = [
  '....oooooooo....',
  '....owWwwWwo....',
  '....owWwwWwo....',
  '....owWwwWwo....',
  '...oooooooooo...',
  '...owwwwwwwwo...',
  '...oWWWWWWWWo...',
  '...oooooooooo...',
  '....oWo..oWo....',
  '....oWo..oWo....',
  '....ooo..ooo....'
]

// A bench is three cells so it can be any length: left end, middle, right end.
const benchTop = [
  'oooooooooooooooo',
  'owwwwwwwwwwwwwwo',
  'oWWWWWWWWWWWWWWo',
  'oooooooooooooooo',
  'owwwwwwwwwwwwwwo',
  'oWWWWWWWWWWWWWWo',
  'oooooooooooooooo'
]
const none = '.'.repeat(T)
const benchLeft = [...benchTop, '.oWo............', '.oWo............', '.ooo............']
const benchMid = [...benchTop, none, none, none]
const benchRight = [...benchTop, '............oWo.', '............oWo.', '............ooo.']

// A vase with a sunflower.
const vase = [
  '......ooooo.....',
  '.....offfffo....',
  '.....ofWWWfo....',
  '.....offfffo....',
  '......ooGoo.....',
  '.......oGo......',
  '......ozzzo.....',
  '.....ozzzzzo....',
  '.....ozzZZzo....',
  '.....ozzZZzo....',
  '......ozZZo.....',
  '.......ooo......'
]

// A potted bush on a clay pot.
const pot = [
  '....oooo',
  '..ooggGg',
  '..oggggG',
  '..oggGgg',
  '...oggGg',
  '....oooo',
  '...ozzzz',
  '....ozzz',
  '....ozZZ',
  '....ozZZ',
  '.....ooo'
].map(mirrorHalf)

const barrel = [
  '....oooo',
  '...owwww',
  '...oWWWW',
  '...owwww',
  '...owwww',
  '...oWWWW',
  '...owwww',
  '....oooo'
].map(mirrorHalf)

/** Stamp small shapes onto an empty cell: the ground ornaments are scattered, not drawn whole. */
function scatter(shapes) {
  const c = canvas(T, T)
  for (const { rows, x, y } of shapes) blit(c, rows, x, y)
  return c.map((r) => r.join(''))
}
const bloom = ['.p.', 'pfp', '.p.']
const pebble = ['.ooo.', 'okkKo', '.ooo.']
const blades = ['G.G.G', '.GGG.']

const flowerPatch = scatter([
  { rows: bloom, x: 2, y: 3 },
  { rows: bloom, x: 10, y: 2 },
  { rows: bloom, x: 6, y: 9 },
  { rows: bloom, x: 12, y: 11 },
  { rows: blades, x: 1, y: 12 }
])
const stones = scatter([
  { rows: pebble, x: 2, y: 4 },
  { rows: pebble, x: 9, y: 8 },
  { rows: ['.oo.', 'okKo', '.oo.'], x: 4, y: 11 }
])
const tuft = scatter([
  { rows: blades, x: 2, y: 5 },
  { rows: blades, x: 9, y: 10 }
])

// The tree is two cells. The crown cell holds the top of the foliage and is the
// part that sways; the trunk cell holds the last rows of foliage, then the
// trunk. The crown leans by less the lower it is and not at all on its last
// row, so it meets the static foliage in the trunk cell with no seam.
const CROWN_TOP = 2
const canopy = [
  ...Array(CROWN_TOP).fill('.'.repeat(T)),
  ...[
    '.....ooo',
    '....oLLm',
    '...oLLmm',
    '..oLLmmm',
    '..oLmmmm',
    '.oLLmmmm',
    '.ommmmmm',
    '.ommmdmm',
    '.ommmmmd',
    '.ommmmdd',
    '.ommdmdd',
    '.ommmddd',
    '.omdmddd',
    '.ommdddd'
  ].map(mirrorHalf)
]

const foliageFoot = ['.omddmdd', '..oddmdd', '...oddmd', '.....ooo'].map(mirrorHalf)
const trunk = [
  ...foliageFoot,
  ...Array(7).fill('......xyYx......'),
  '.....xyyYYx.....',
  '....xyyyYYYx....',
  '....xxxxxxxx....',
  '................',
  '................'
]

/** Wind: rest, lean right, rest, lean left. The foot stays rooted. */
const LEAN = [0, 2, 0, -2]
function swayed(frame) {
  return canopy.map((row, y) => {
    const raw = Math.round((LEAN[frame] * (T - 1 - y)) / (T - 1 - CROWN_TOP))
    const first = row.search(/[^.]/)
    const last = row.length - 1 - [...row].reverse().join('').search(/[^.]/)
    if (first === -1) return row
    // A wide row has less room, so it leans less rather than being cut off.
    const shift = Math.max(-first, Math.min(T - 1 - last, raw))
    if (shift === 0) return row
    return shift > 0 ? '.'.repeat(shift) + row.slice(0, T - shift) : row.slice(-shift) + '.'.repeat(-shift)
  })
}

function remap(rows, chars) {
  const to = { L: chars[0], m: chars[1], d: chars[2], o: chars[3] }
  return rows.map((row) => [...row].map((ch) => to[ch] ?? ch).join(''))
}

const DRAWINGS = {
  0: table,
  1: chair,
  2: benchLeft,
  3: benchMid,
  4: benchRight,
  5: vase,
  6: pot,
  7: barrel,
  8: flowerPatch,
  9: stones,
  10: tuft,
  ...Object.fromEntries(
    Object.values(SEASONS).flatMap(({ chars }, season) => [
      [COLS + season, remap(trunk, chars)],
      ...LEAN.map((_, frame) => [(2 + season) * COLS + frame, remap(swayed(frame), chars)])
    ])
  )
}

export async function renderProps(out) {
  const sheet = canvas(COLS * T, ROWS * T)
  for (const [index, rows] of Object.entries(DRAWINGS)) {
    // The table is drawn short and dropped to the foot of its cell; the rest are full height.
    const padded =
      rows.length === T
        ? rows
        : [...Array(T - rows.length - 1).fill('.'.repeat(T)), ...rows, '.'.repeat(T)]
    assertGrid(`${out} frame ${index}`, padded, T, T)
    blit(sheet, padded, (index % COLS) * T, Math.floor(index / COLS) * T)
  }
  await toPng(sheet, PROPS, out)
}
