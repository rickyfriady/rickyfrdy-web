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

/**
 * Background offset for a layer inside the scrolling world that should move at
 * `speed` times the camera's own speed. The world already moves by
 * `-cameraPx`, so the layer adds back the share it should not travel. Whole
 * pixels only, so a backdrop never sits on a half pixel and shimmers.
 */
export function parallaxShift(cameraPx: number, speed: number): number {
  return Math.round(cameraPx * (1 - speed))
}
