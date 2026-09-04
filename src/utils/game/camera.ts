import type { Vec2 } from '@/models'
import { type GridLike, roomSize } from './collision'

/**
 * Camera offset in tiles, clamped to the room.
 *
 * A room narrower than the viewport is centred rather than pinned to a corner,
 * because a clamp alone would leave dead space on one side only.
 */
export function cameraOffset(room: GridLike, focus: Vec2, viewW: number, viewH: number): Vec2 {
  const { w, h } = roomSize(room)
  return {
    x: axis(focus.x, viewW, w),
    y: axis(focus.y, viewH, h)
  }
}

function axis(focus: number, view: number, extent: number): number {
  if (view >= extent) return (extent - view) / 2
  return Math.min(Math.max(focus - view / 2, 0), extent - view)
}
