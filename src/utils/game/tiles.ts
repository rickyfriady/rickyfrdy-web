import type { Season } from './time'

/**
 * The tile vocabulary: what each character in a room's grid means.
 *
 * A grid is still authored as rows of characters, but a character now names a
 * *kind* of ground, not a picture. Edges and corners are picked from the
 * neighbours at render time (autotiling), so a pond or a path is authored as a
 * blob of `~` or `=` and never as a hand-placed corner piece. That is what lets
 * string grids survive valley scale: moving a pond's edge is one character.
 *
 * Unknown characters are solid. A typo in a map should wall off a tile, never
 * open a hole in one.
 */

/**
 * How a body may pass through a tile.
 * - `walk`: freely.
 * - `solid`: never.
 * - `ledge`: one way, downwards only. A body can hop down off it but not climb
 *   back up, which is the one rule the old binary walkable check could not say.
 * - `trunk`: solid in its lower half only, so a character can step into the top
 *   of a tree's tile and be drawn behind the canopy.
 */
export type Pass = 'walk' | 'solid' | 'ledge' | 'trunk'

/** Where a tile draws: under the characters, sorted with them, or over them. */
export type Layer = 'ground' | 'object' | 'overhead'

export type SheetId = 'town' | 'farm' | 'water'

/** Frames per row and rows per sheet, matching the files in `assets/sprites/tiles/`. */
export const SHEETS: Record<SheetId, { cols: number; rows: number }> = {
  town: { cols: 12, rows: 11 },
  farm: { cols: 12, rows: 11 },
  water: { cols: 3, rows: 3 }
}

export interface Frame {
  sheet: SheetId
  index: number
}

export interface GridLike {
  grid: readonly string[]
}

interface Context {
  grid: readonly string[]
  x: number
  y: number
  season: Season
}

interface TileDef {
  name: string
  pass: Pass
  layer: Layer
  /** Ground drawn beneath a tile whose art has transparent pixels. */
  under?: string
  frame: (ctx: Context) => Frame
}

const town = (index: number): Frame => ({ sheet: 'town', index })
const farm = (index: number): Frame => ({ sheet: 'farm', index })
const water = (index: number): Frame => ({ sheet: 'water', index })

/** Out of bounds counts as "same kind", so a path or a pond runs off the map edge cleanly. */
function sameAt(ctx: Context, dx: number, dy: number, group: string): boolean {
  const row = ctx.grid[ctx.y + dy]
  if (row === undefined) return true
  const ch = row[ctx.x + dx]
  if (ch === undefined) return true
  return group.includes(ch)
}

/**
 * Nine-slice autotiling over the four cardinal neighbours, with optional inner
 * corners for a blob that is concave at a diagonal.
 *
 * `frames` is `[tl, t, tr, l, c, r, bl, b, br]`; `inner` is `[nw, ne, sw, se]`,
 * each the notch a missing diagonal neighbour cuts into an otherwise full tile.
 */
export function nineSlice(
  ctx: Context,
  group: string,
  frames: readonly Frame[],
  inner?: readonly Frame[]
): Frame {
  const n = sameAt(ctx, 0, -1, group)
  const s = sameAt(ctx, 0, 1, group)
  const w = sameAt(ctx, -1, 0, group)
  const e = sameAt(ctx, 1, 0, group)
  if (!n && !w) return frames[0]
  if (!n && !e) return frames[2]
  if (!s && !w) return frames[6]
  if (!s && !e) return frames[8]
  if (!n) return frames[1]
  if (!s) return frames[7]
  if (!w) return frames[3]
  if (!e) return frames[5]
  if (inner) {
    if (!sameAt(ctx, -1, -1, group)) return inner[0]
    if (!sameAt(ctx, 1, -1, group)) return inner[1]
    if (!sameAt(ctx, -1, 1, group)) return inner[2]
    if (!sameAt(ctx, 1, 1, group)) return inner[3]
  }
  return frames[4]
}

/**
 * Left, middle or right piece of a horizontal run: roofs, walls, fences.
 * Unlike ground, a run ends at the map edge: a roof does not continue off it.
 */
export function rowSlice(ctx: Context, group: string, frames: readonly [Frame, Frame, Frame]) {
  const at = (dx: number) => {
    const ch = ctx.grid[ctx.y]?.[ctx.x + dx]
    return ch !== undefined && group.includes(ch)
  }
  const w = at(-1)
  const e = at(1)
  if (!w && e) return frames[0]
  if (w && !e) return frames[2]
  return frames[1]
}

const PATH = [12, 13, 14, 24, 25, 26, 36, 37, 38].map(town)
const PATH_INNER = [39, 40, 41, 42].map(town)
const WATER = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(water)
const FLOOR = [96, 97, 98, 108, 109, 110, 120, 121, 122].map(town)
const WOOD_WALL = '+DW'
const STONE_WALL = '+DQ'

/** A door takes the look of the wall it is set into. */
function doorFrame(ctx: Context, open: boolean): Frame {
  const beside = (ctx.grid[ctx.y]?.[ctx.x - 1] ?? '') + (ctx.grid[ctx.y]?.[ctx.x + 1] ?? '')
  if (beside.includes('W')) return town(open ? 74 : 85)
  if (beside.includes('Q')) return town(open ? 78 : 89)
  return town(open ? 125 : 89)
}

const byseason = (frames: Record<Season, Frame>) => (ctx: Context) => frames[ctx.season]

export const TILES: Record<string, TileDef> = {
  // Interiors
  '.': { name: 'floor', pass: 'walk', layer: 'ground', frame: (c) => nineSlice(c, '.', FLOOR) },
  '#': { name: 'wall', pass: 'solid', layer: 'ground', frame: () => town(126) },
  '+': { name: 'door', pass: 'walk', layer: 'ground', frame: (c) => doorFrame(c, true) },
  D: { name: 'closed door', pass: 'solid', layer: 'ground', frame: (c) => doorFrame(c, false) },

  // Open ground
  ',': { name: 'grass', pass: 'walk', layer: 'ground', frame: () => town(0) },
  '"': { name: 'grass tuft', pass: 'walk', layer: 'ground', frame: () => town(1) },
  '*': {
    name: 'flower',
    pass: 'walk',
    layer: 'ground',
    // Flowers are a spring and summer thing; the rest of the year the same
    // tile reads as rough grass.
    frame: byseason({ spring: town(2), summer: town(2), autumn: town(1), winter: town(1) })
  },
  '=': {
    name: 'path',
    pass: 'walk',
    layer: 'ground',
    frame: (c) => nineSlice(c, '=', PATH, PATH_INNER)
  },
  S: { name: 'stairs', pass: 'walk', layer: 'ground', frame: () => town(43) },
  '~': { name: 'water', pass: 'solid', layer: 'ground', frame: (c) => nineSlice(c, '~', WATER) },
  C: { name: 'cliff', pass: 'solid', layer: 'ground', frame: () => town(126) },
  v: { name: 'ledge', pass: 'ledge', layer: 'ground', under: ',', frame: () => town(81) },
  '%': { name: 'crop plot', pass: 'solid', layer: 'ground', frame: () => farm(1) },
  f: {
    name: 'fence',
    pass: 'solid',
    layer: 'ground',
    under: ',',
    frame: (c) => rowSlice(c, 'f', [town(44), town(45), town(46)])
  },

  // Things tall enough to walk behind
  T: {
    name: 'tree',
    pass: 'trunk',
    layer: 'object',
    under: ',',
    frame: byseason({ spring: town(16), summer: town(16), autumn: town(15), winter: farm(14) })
  },
  o: { name: 'bush', pass: 'trunk', layer: 'object', under: ',', frame: () => town(5) },

  // Buildings: the roof's top row overhangs the ground north of the walls, so a
  // character walking along the back of a house passes under the eave.
  r: {
    name: 'roof eave',
    pass: 'walk',
    layer: 'overhead',
    under: ',',
    frame: (c) => rowSlice(c, 'r', [town(52), town(53), town(54)])
  },
  R: {
    name: 'roof',
    pass: 'solid',
    layer: 'ground',
    frame: (c) => rowSlice(c, 'R', [town(64), town(65), town(66)])
  },
  W: {
    name: 'timber wall',
    pass: 'solid',
    layer: 'ground',
    frame: (c) => rowSlice(c, WOOD_WALL, [town(72), town(73), town(75)])
  },
  g: {
    name: 'slate eave',
    pass: 'walk',
    layer: 'overhead',
    under: ',',
    frame: (c) => rowSlice(c, 'g', [town(48), town(49), town(50)])
  },
  G: {
    name: 'slate roof',
    pass: 'solid',
    layer: 'ground',
    frame: (c) => rowSlice(c, 'G', [town(60), town(61), town(62)])
  },
  Q: {
    name: 'stone wall',
    pass: 'solid',
    layer: 'ground',
    frame: (c) => rowSlice(c, STONE_WALL, [town(76), town(77), town(79)])
  }
}

export function tileDef(ch: string): TileDef | undefined {
  return TILES[ch]
}

export function passOf(ch: string): Pass {
  return TILES[ch]?.pass ?? 'solid'
}

/** Everything drawn in one cell, bottom to top. */
export interface Cell {
  ground: Frame[]
  object?: Frame
  overhead?: Frame
  /** What the ground does, for the flat stand-in drawn when a sheet is missing. */
  kind: 'walk' | 'solid' | 'water' | 'door'
}

function kindOf(ch: string, def: TileDef): Cell['kind'] {
  if (ch === '+') return 'door'
  if (ch === '~') return 'water'
  return def.pass === 'solid' && def.layer === 'ground' ? 'solid' : 'walk'
}

/**
 * Resolve one cell to its frames. Pure: the same grid, position and season
 * always give the same cell, which is what makes autotiling testable.
 */
export function cellAt(grid: readonly string[], x: number, y: number, season: Season): Cell {
  const ch = grid[y]?.[x] ?? '#'
  const def = TILES[ch] ?? TILES['#']
  const ctx = { grid, x, y, season }
  const underFrame = def.under ? TILES[def.under].frame({ ...ctx }) : undefined
  const own = def.frame(ctx)
  const kind = kindOf(ch, def)
  if (def.layer === 'object') return { ground: underFrame ? [underFrame] : [], object: own, kind }
  if (def.layer === 'overhead')
    return { ground: underFrame ? [underFrame] : [], overhead: own, kind }
  return { ground: underFrame ? [underFrame, own] : [own], kind }
}
