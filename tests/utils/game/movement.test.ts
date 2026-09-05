import { describe, expect, it } from 'vitest'
import { directionOf, stepPosition, WALK_SPEED } from '@/utils/game/movement'

/** Wide open room: this is about integration, not collision. */
const room = {
  grid: Array.from({ length: 20 }, (_, y) =>
    y === 0 || y === 19 ? '#'.repeat(20) : `#${'.'.repeat(18)}#`
  )
}

const right = { up: false, down: false, left: false, right: true }

function simulate(frames: number, frameMs: number) {
  let pos = { x: 5, y: 5 }
  for (let i = 0; i < frames; i++) pos = stepPosition(room, pos, right, frameMs)
  return pos
}

describe('frame-rate independence', () => {
  it('travels the same distance in one second at 60 fps and at 120 fps', () => {
    const at60 = simulate(60, 1000 / 60)
    const at120 = simulate(120, 1000 / 120)
    expect(Math.abs(at60.x - at120.x)).toBeLessThan(0.1)
  })

  it('covers roughly the declared speed in one second', () => {
    const after = simulate(60, 1000 / 60)
    expect(after.x - 5).toBeCloseTo(WALK_SPEED, 1)
  })
})

describe('diagonal movement', () => {
  it('is not faster than orthogonal movement', () => {
    const straight = stepPosition(room, { x: 5, y: 5 }, right, 100)
    const diagonal = stepPosition(
      room,
      { x: 5, y: 5 },
      { up: false, down: true, left: false, right: true },
      100
    )
    const straightDistance = Math.hypot(straight.x - 5, straight.y - 5)
    const diagonalDistance = Math.hypot(diagonal.x - 5, diagonal.y - 5)
    expect(diagonalDistance).toBeCloseTo(straightDistance, 5)
  })
})

describe('directionOf()', () => {
  it('reports the facing for each key and null when nothing is held', () => {
    expect(directionOf({ up: true, down: false, left: false, right: false })).toBe('up')
    expect(directionOf({ up: false, down: false, left: true, right: false })).toBe('left')
    expect(directionOf({ up: false, down: false, left: false, right: false })).toBeNull()
  })
})

describe('negative and absent deltas', () => {
  it('never moves backwards on a negative delta', () => {
    const after = stepPosition(room, { x: 5, y: 5 }, right, -500)
    expect(after.x).toBe(5)
  })
})
