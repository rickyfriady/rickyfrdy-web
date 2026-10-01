import type { Vec2 } from '@/models'
import { type Pass, passOf } from './tiles'

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

/**
 * How a point may be passed, with the sub-tile rule applied: a tree trunk is
 * solid only in the lower half of its tile, so the upper half is walkable
 * ground a character can stand on behind the canopy.
 */
export function passAt(room: GridLike, x: number, y: number): Exclude<Pass, 'trunk'> {
  const pass = passOf(tileAt(room, Math.floor(x), Math.floor(y)))
  if (pass === 'trunk') return y - Math.floor(y) >= 0.5 ? 'solid' : 'walk'
  return pass
}

/** Freely walkable. A ledge is not: you can land on one, not start on one. */
export function isWalkable(room: GridLike, x: number, y: number): boolean {
  return passAt(room, x, y) === 'walk'
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

/**
 * Whether a body can move from `from` to `to`.
 *
 * Solid tiles block. A ledge admits a body only moving down, or one already
 * overlapping that same ledge tile, so a character can walk along a ledge it
 * has dropped onto but can never climb back up one from below or step onto
 * one sideways.
 */
export function canMove(room: GridLike, from: Vec2, to: Vec2, size = 0.8): boolean {
  const e = 0.001
  const corners = (p: Vec2) => [
    { x: p.x, y: p.y },
    { x: p.x + size - e, y: p.y },
    { x: p.x, y: p.y + size - e },
    { x: p.x + size - e, y: p.y + size - e }
  ]
  const occupied = new Set(corners(from).map((c) => `${Math.floor(c.x)},${Math.floor(c.y)}`))
  for (const corner of corners(to)) {
    const pass = passAt(room, corner.x, corner.y)
    if (pass === 'solid') return false
    if (pass === 'ledge') {
      const key = `${Math.floor(corner.x)},${Math.floor(corner.y)}`
      if (to.y <= from.y && !occupied.has(key)) return false
    }
  }
  return true
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
