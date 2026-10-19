import { describe, expect, it } from 'vitest'
import { cameraOffset, parallaxShift } from '@/utils/game/camera'

const room = { grid: Array.from({ length: 12 }, () => '.'.repeat(20)) }
const VIEW_W = 15
const VIEW_H = 10

describe('cameraOffset()', () => {
  it('follows the focus when it is away from the edges', () => {
    const cam = cameraOffset(room, { x: 10, y: 6 }, VIEW_W, VIEW_H)
    expect(cam.x).toBeCloseTo(10 - VIEW_W / 2)
    expect(cam.y).toBeCloseTo(6 - VIEW_H / 2)
  })

  it('clamps at the near edges so nothing outside the room is shown', () => {
    const cam = cameraOffset(room, { x: 0, y: 0 }, VIEW_W, VIEW_H)
    expect(cam).toEqual({ x: 0, y: 0 })
  })

  it('clamps at the far edges', () => {
    const cam = cameraOffset(room, { x: 20, y: 12 }, VIEW_W, VIEW_H)
    expect(cam.x).toBeCloseTo(20 - VIEW_W)
    expect(cam.y).toBeCloseTo(12 - VIEW_H)
  })

  it('centres a room smaller than the viewport instead of pinning it to a corner', () => {
    const small = { grid: Array.from({ length: 4 }, () => '.'.repeat(5)) }
    const cam = cameraOffset(small, { x: 2, y: 2 }, VIEW_W, VIEW_H)
    expect(cam.x).toBeCloseTo((5 - VIEW_W) / 2)
    expect(cam.y).toBeCloseTo((4 - VIEW_H) / 2)
  })
})

describe('parallaxShift()', () => {
  it('a layer at camera speed needs no shift, and a fixed one cancels the whole camera', () => {
    expect(parallaxShift(200, 1)).toBe(0)
    expect(parallaxShift(200, 0)).toBe(200)
  })

  it('a far layer moves less than a near one', () => {
    // Net travel on screen is the world's own -camera plus the shift.
    const net = (speed: number) => Math.abs(-200 + parallaxShift(200, speed))
    expect(net(0.25)).toBeLessThan(net(0.5))
    expect(net(0.5)).toBeLessThan(net(1))
  })

  it('is always whole pixels', () => {
    for (const cam of [0, 1, 33, 97, 481])
      for (const speed of [0.25, 0.5, 0.7])
        expect(Number.isInteger(parallaxShift(cam, speed))).toBe(true)
  })
})
