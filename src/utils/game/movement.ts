import type { Vec2 } from '@/models'
import { canMove, clampToRoom, type GridLike } from './collision'

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

const BODY = 0.8

/**
 * Corner correction. Walking straight at a one-tile gap (a door, a gap in a
 * fence) with the body a little off-centre would otherwise stop dead against
 * the frame. If a centred position within half a tile sideways would let the
 * move through, slide toward it at walking speed instead.
 */
function nudge(room: GridLike, pos: Vec2, axis: 'x' | 'y', step: number, speed: number): number {
  const along = axis === 'x' ? 'y' : 'x'
  const inset = (1 - BODY) / 2
  const tiles = [Math.floor(pos[axis]), Math.floor(pos[axis] + BODY)]
  for (const t of tiles) {
    const centred = t + inset
    const offset = centred - pos[axis]
    if (Math.abs(offset) > 0.5 || offset === 0) continue
    const from = { ...pos, [axis]: centred }
    const to = { ...from, [along]: from[along] + step }
    if (canMove(room, pos, from) && canMove(room, from, to)) {
      return pos[axis] + Math.sign(offset) * Math.min(Math.abs(offset), speed)
    }
  }
  return pos[axis]
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
  if (stepX !== 0) {
    if (canMove(room, next, { x: next.x + stepX, y: next.y })) next.x += stepX
    else if (stepY === 0) next.y = nudge(room, next, 'y', stepX, Math.abs(stepX))
  }
  if (stepY !== 0) {
    if (canMove(room, next, { x: next.x, y: next.y + stepY })) next.y += stepY
    else if (stepX === 0) next.x = nudge(room, next, 'x', stepY, Math.abs(stepY))
  }
  return clampToRoom(room, next)
}
