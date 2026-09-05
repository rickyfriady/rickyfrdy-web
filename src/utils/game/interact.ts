import type { Vec2 } from '@/models'
import type { Direction } from './movement'

/** Tiles. Roughly one and a half tiles — arm's reach, not across the room. */
export const INTERACT_RANGE = 1.6

/**
 * The nearest object the player is actually facing.
 *
 * Facing matters: standing between two shelves and pressing interact must open
 * the one you are looking at, not whichever happens to be marginally closer.
 * Nothing in range returns null, and the caller does nothing — pressing
 * interact at thin air is a no-op, never an error.
 */
export function nearestFacing<T extends { x: number; y: number }>(
  objects: readonly T[],
  pos: Vec2,
  facing: Direction,
  range = INTERACT_RANGE
): T | null {
  let best: T | null = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (const object of objects) {
    const dx = object.x - pos.x
    const dy = object.y - pos.y
    const distance = Math.hypot(dx, dy)
    if (distance > range) continue
    if (facing === 'up' && dy > 0.5) continue
    if (facing === 'down' && dy < -0.5) continue
    if (facing === 'left' && dx > 0.5) continue
    if (facing === 'right' && dx < -0.5) continue
    if (distance < bestDistance) {
      best = object
      bestDistance = distance
    }
  }

  return best
}
