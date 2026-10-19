import { toPng } from './raster.mjs'

/**
 * Two repeating strips for the horizon behind the valley: distant hills and a
 * treeline in front of them. Each is one row per season (spring, summer,
 * autumn, winter) so the page picks a row the way it picks a tile frame.
 *
 * Both are periodic, so the strip tiles with no seam. Distant things get no
 * dark outline: atmosphere softens them, and an outline would pull them
 * forward to the same plane as the trees you walk past.
 */
const SEASONS = ['spring', 'summer', 'autumn', 'winter']

const HILLS = {
  // light, base, dark
  spring: ['#bcd8a4', '#a2c88a', '#8ab474'],
  summer: ['#a4c88c', '#8ab876', '#74a462'],
  autumn: ['#dcb888', '#c8a070', '#b08858'],
  winter: ['#e6edf0', '#d2dce0', '#bcc8ce']
}
const TREES = {
  spring: ['#7ab868', '#5a9a4c', '#44803c'],
  summer: ['#5a9a4c', '#438040', '#306830'],
  autumn: ['#d08a48', '#b0682c', '#8c5020'],
  winter: ['#b4c4cc', '#94a8b2', '#7a909c']
}

const HILL = { w: 64, h: 24 }
const TREE = { w: 48, h: 16 }

function paint(spec, ramps, draw) {
  const rows = SEASONS.length
  const cells = Array.from({ length: spec.h * rows }, () => Array(spec.w).fill('.'))
  const colours = {}
  SEASONS.forEach((season, i) => {
    const [light, base, dark] = ramps[season]
    // Letters are per season so one sheet carries all four palettes.
    const L = 'abcd'[i]
    const B = 'efgh'[i]
    const D = 'ijkl'[i]
    colours[L] = light
    colours[B] = base
    colours[D] = dark
    draw((x, y, tone) => {
      if (x < 0 || x >= spec.w || y < 0 || y >= spec.h) return
      cells[i * spec.h + y][x] = { L, B, D }[tone]
    })
  })
  return { cells, colours }
}

/** Rolling hills: a periodic profile, lit along the ridge and shaded toward the base. */
function hills(put) {
  for (let x = 0; x < HILL.w; x++) {
    const t = (x / HILL.w) * Math.PI * 2
    const top = Math.round(HILL.h - 12 - 5 * Math.sin(t) - 3 * Math.sin(2 * t + 1))
    for (let y = top; y < HILL.h; y++) {
      put(x, y, y - top < 2 ? 'L' : y > HILL.h - 5 ? 'D' : 'B')
    }
  }
}

/** A row of round treetops standing on a strip of undergrowth. */
function treeline(put) {
  const crowns = [
    { cx: 6, r: 4 },
    { cx: 17, r: 5 },
    { cx: 30, r: 5 },
    { cx: 41, r: 4 }
  ]
  for (const { cx, r } of crowns) {
    const cy = TREE.h - 5 - r
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r + r / 2) continue
        const x = (((cx + dx) % TREE.w) + TREE.w) % TREE.w
        put(x, cy + dy, dy + dx < -r / 2 ? 'L' : dy > r / 3 ? 'D' : 'B')
      }
    }
  }
  for (let x = 0; x < TREE.w; x++) for (let y = TREE.h - 5; y < TREE.h; y++) put(x, y, 'D')
}

export const renderHills = async (out) => {
  const { cells, colours } = paint(HILL, HILLS, hills)
  await toPng(cells, colours, out)
}
export const renderTreeline = async (out) => {
  const { cells, colours } = paint(TREE, TREES, treeline)
  await toPng(cells, colours, out)
}
export const BACKDROP = { hill: HILL, tree: TREE, seasons: SEASONS }
