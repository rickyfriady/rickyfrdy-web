import { describe, expect, it } from 'vitest'
import { canStand, clampToRoom, doorAt, isWalkable, roomSize, tileAt } from '@/utils/game/collision'
import { MAX_STEP_MS, stepPosition } from '@/utils/game/movement'

const room = {
  grid: ['#####', '#...#', '#.#.+', '#...#', '#####'],
  doors: [{ x: 4, y: 2, to: 'archive', entry: { x: 1, y: 2 } }]
}

describe('tile lookup', () => {
  it('reads the grid by coordinate', () => {
    expect(tileAt(room, 1, 1)).toBe('.')
    expect(tileAt(room, 2, 2)).toBe('#')
    expect(tileAt(room, 4, 2)).toBe('+')
  })

  it('reads out of bounds as solid, so nothing can walk off the grid', () => {
    expect(tileAt(room, -1, 1)).toBe('#')
    expect(tileAt(room, 1, 99)).toBe('#')
  })

  it('treats floor and door tiles as walkable and walls as not', () => {
    expect(isWalkable(room, 1, 1)).toBe(true)
    expect(isWalkable(room, 4, 2)).toBe(true)
    expect(isWalkable(room, 2, 2)).toBe(false)
  })
})

describe('canStand()', () => {
  it('rejects a position whose body overlaps a wall even when its origin does not', () => {
    // Origin is on open floor, but the body's right edge reaches into (2,2).
    expect(isWalkable(room, 1.9, 2)).toBe(true)
    expect(canStand(room, 1.9, 2)).toBe(false)
  })
})

describe('clampToRoom()', () => {
  it('keeps a position inside the grid whatever it is handed', () => {
    const { w, h } = roomSize(room)
    expect(clampToRoom(room, { x: -9, y: -9 })).toEqual({ x: 0, y: 0 })
    const far = clampToRoom(room, { x: 999, y: 999 })
    expect(far.x).toBeCloseTo(w - 0.8)
    expect(far.y).toBeCloseTo(h - 0.8)
  })
})

describe('doorAt()', () => {
  it('finds the door on a tile and nothing on a plain one', () => {
    expect(doorAt(room, 4.3, 2.4)?.to).toBe('archive')
    expect(doorAt(room, 1, 1)).toBeUndefined()
  })
})

describe('no tunnelling', () => {
  it('respects collision across a frame delta long enough to cross the wall', () => {
    // A 10-second stall would move the character ~42 tiles in one step if the
    // delta were integrated unclamped. This is the backgrounded-tab case.
    const start = { x: 1, y: 1 }
    const after = stepPosition(
      room,
      start,
      { up: false, down: false, left: false, right: true },
      10_000
    )
    expect(canStand(room, after.x, after.y)).toBe(true)
    expect(after.x).toBeLessThan(3)
  })

  it('caps the step at MAX_STEP_MS regardless of how long the frame took', () => {
    const input = { up: false, down: false, left: false, right: true }
    const capped = stepPosition(room, { x: 1, y: 1 }, input, MAX_STEP_MS)
    const absurd = stepPosition(room, { x: 1, y: 1 }, input, 60_000)
    expect(absurd.x).toBeCloseTo(capped.x, 6)
  })
})
