import type { Vec2 } from '@/models'
import { canStand, clampToRoom, type GridLike } from './collision'

/** Tiles per second. */
export const WALK_SPEED = 4.2

/**
 * The longest simulation step ever taken, in milliseconds.
 *
 * A backgrounded tab, a sleeping laptop, or a slow first paint can hand the
 * loop a delta of several seconds. Integrating that in one step moves the
 * character further than a wall is thick, and it walks straight through.
 * Clamping costs one line and removes the entire class of bug.
 */
export const MAX_STEP_MS = 50

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface MoveInput {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export function directionOf(input: MoveInput): Direction | null {
  if (input.up) return 'up'
  if (input.down) return 'down'
  if (input.left) return 'left'
  if (input.right) return 'right'
  return null
}

/**
 * Time-integrated step. Speed is identical at 60 Hz and 120 Hz because the
 * delta does the work, not the frame count.
 *
 * Axes resolve separately so that walking into a corner slides along the wall
 * instead of stopping dead — the difference between "solid" and "sticky".
 */
export function stepPosition(room: GridLike, pos: Vec2, input: MoveInput, deltaMs: number): Vec2 {
  const dt = Math.min(Math.max(deltaMs, 0), MAX_STEP_MS) / 1000
  let dx = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  let dy = (input.down ? 1 : 0) - (input.up ? 1 : 0)
  if (dx !== 0 && dy !== 0) {
    // Normalise, or diagonal travel is 1.41x faster than orthogonal.
    const inv = Math.SQRT1_2
    dx *= inv
    dy *= inv
  }
  const next = { ...pos }
  const stepX = dx * WALK_SPEED * dt
  const stepY = dy * WALK_SPEED * dt
  if (stepX !== 0 && canStand(room, next.x + stepX, next.y)) next.x += stepX
  if (stepY !== 0 && canStand(room, next.x, next.y + stepY)) next.y += stepY
  return clampToRoom(room, next)
}
