import { describe, expect, it } from 'vitest'
import {
  canMove,
  canStand,
  clampToRoom,
  doorAt,
  isWalkable,
  passAt,
  roomSize,
  tileAt
} from '@/utils/game/collision'
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

describe('ledges and trunks', () => {
  // Meadow on top, a ledge row, meadow below; a tree in the lower meadow.
  const cliff = { grid: [',,,,,', ',,,,,', 'vvvvv', ',,,,,', ',,T,,', ',,,,,'] }
  const down = { up: false, down: true, left: false, right: false }
  const up = { up: true, down: false, left: false, right: false }
  const right = { up: false, down: false, left: false, right: true }

  it('lets a body hop down off a ledge', () => {
    let pos = { x: 1.1, y: 1.1 }
    for (let i = 0; i < 40; i++) pos = stepPosition(cliff, pos, down, 16)
    expect(pos.y).toBeGreaterThan(3)
  })

  it('never lets a body climb back up one', () => {
    let pos = { x: 1.1, y: 3.1 }
    for (let i = 0; i < 40; i++) pos = stepPosition(cliff, pos, up, 16)
    expect(pos.y).toBeGreaterThanOrEqual(3)
  })

  it('refuses a sideways step onto a ledge the body is not already on', () => {
    const shelf = { grid: [',v,', ',v,', ',,,'] }
    expect(canMove(shelf, { x: 0.1, y: 0.1 }, { x: 0.3, y: 0.1 })).toBe(false)
  })

  it('makes a tree solid in its lower half only, so a body can stand behind the canopy', () => {
    expect(passAt(cliff, 2.5, 4.2)).toBe('walk')
    expect(passAt(cliff, 2.5, 4.7)).toBe('solid')
    // Body top at y 3.5, so its feet reach 4.3: into the tree's upper half, not its trunk.
    expect(canStand(cliff, 2.1, 3.5)).toBe(true)
    expect(canStand(cliff, 2.1, 4.0)).toBe(false)
  })

  it('still walks straight along open ground', () => {
    const after = stepPosition(cliff, { x: 0.1, y: 0.1 }, right, 50)
    expect(after.x).toBeGreaterThan(0.1)
  })
})

describe('corner correction', () => {
  // A wall with a one-tile door at x 2.
  const wall = { grid: [',,,,,', '##,##', ',,,,,'] }
  const up = { up: true, down: false, left: false, right: false }

  it('slides an off-centre body into a one-tile gap instead of stopping it dead', () => {
    let pos = { x: 2.4, y: 2.1 }
    for (let i = 0; i < 60; i++) pos = stepPosition(wall, pos, up, 16)
    expect(pos.y).toBeLessThan(1)
    // Released as soon as it fits, not dragged to the exact centre.
    expect(pos.x).toBeGreaterThanOrEqual(2)
    expect(pos.x).toBeLessThanOrEqual(2.2)
  })

  it('does not pull a body through a wall when no gap is near', () => {
    let pos = { x: 0.1, y: 2.1 }
    for (let i = 0; i < 60; i++) pos = stepPosition(wall, pos, up, 16)
    expect(pos.y).toBeGreaterThanOrEqual(2)
  })
})
