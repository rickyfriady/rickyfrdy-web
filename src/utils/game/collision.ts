import type { Vec2 } from '@/models'

/** One tile in scene pixels, before the integer display scale is applied. */
export const TILE = 16

/**
 * The geometry helpers take the shape they actually read, not the full `Room`.
 * The scene passes rooms whose ids have been widened to strings at build time,
 * and there is no reason for collision to care what a room is called.
 */
export interface GridLike {
  grid: readonly string[]
}

export interface DoorLike {
  x: number
  y: number
}

export function roomSize(room: GridLike): { w: number; h: number } {
  return { w: room.grid[0]?.length ?? 0, h: room.grid.length }
}

/** Tile character at a coordinate; out of bounds reads as solid. */
export function tileAt(room: GridLike, x: number, y: number): string {
  if (y < 0 || y >= room.grid.length) return '#'
  const row = room.grid[y]
  if (x < 0 || x >= row.length) return '#'
  return row[x]
}

export function isWalkable(room: GridLike, x: number, y: number): boolean {
  const tile = tileAt(room, Math.floor(x), Math.floor(y))
  return tile === '.' || tile === '+'
}

/**
 * Whether a body of `size` tiles can stand with its top-left at (x, y).
 * All four corners are tested — checking only the centre lets a character
 * clip a wall with half its body.
 */
export function canStand(room: GridLike, x: number, y: number, size = 0.8): boolean {
  const e = 0.001
  return (
    isWalkable(room, x, y) &&
    isWalkable(room, x + size - e, y) &&
    isWalkable(room, x, y + size - e) &&
    isWalkable(room, x + size - e, y + size - e)
  )
}

/** Keeps a position inside the grid regardless of what movement asked for. */
export function clampToRoom(room: GridLike, pos: Vec2, size = 0.8): Vec2 {
  const { w, h } = roomSize(room)
  return {
    x: Math.min(Math.max(pos.x, 0), Math.max(0, w - size)),
    y: Math.min(Math.max(pos.y, 0), Math.max(0, h - size))
  }
}

/** The door on a tile, if any. */
export function doorAt<T extends DoorLike>(
  room: { doors: readonly T[] },
  x: number,
  y: number
): T | undefined {
  const tx = Math.floor(x)
  const ty = Math.floor(y)
  return room.doors.find((d) => d.x === tx && d.y === ty)
}
