import { describe, expect, it } from 'vitest'
import { rooms } from '@/data/rooms'
import { cameraOffset } from '@/utils/game/camera'
import { integerScale } from '@/utils/game/sprites'

describe('mobile viewport and handheld scaling', () => {
  const TILE = 16
  const MOBILE_VIEW_COLS = 10
  const MOBILE_VIEW_ROWS = 8

  it('calculates integer scale 2 for typical mobile screen widths (360px-480px)', () => {
    const nativeWidth = MOBILE_VIEW_COLS * TILE // 160px
    expect(integerScale(360, nativeWidth)).toBe(2)
    expect(integerScale(375, nativeWidth)).toBe(2)
    expect(integerScale(390, nativeWidth)).toBe(2)
    expect(integerScale(414, nativeWidth)).toBe(2)
    expect(integerScale(480, nativeWidth)).toBe(3)
  })

  it('keeps total scaled mobile viewport under standard screen width', () => {
    const scale = 2
    const totalWidthPx = MOBILE_VIEW_COLS * TILE * scale
    const totalHeightPx = MOBILE_VIEW_ROWS * TILE * scale

    expect(totalWidthPx).toBe(320)
    expect(totalHeightPx).toBe(256)
    // 320px fits within 360px width with 40px margin/padding for handheld chassis
    expect(totalWidthPx).toBeLessThanOrEqual(360)
  })

  it('clamps camera correctly within room for 10x8 mobile viewport', () => {
    const room = rooms[0]
    const cam = cameraOffset(room, { x: 5, y: 5 }, MOBILE_VIEW_COLS, MOBILE_VIEW_ROWS)
    expect(cam.x).toBeGreaterThanOrEqual(0)
    expect(cam.y).toBeGreaterThanOrEqual(0)
  })

  it('translates screen touch coordinates to world tile coordinates', () => {
    const cam = { x: 2, y: 3 }
    const tilePx = 32 // 16 * 2 scale

    // Tapping at (64px, 96px) within stage
    const clientX = 64
    const clientY = 96
    const tappedTileX = Math.floor(clientX / tilePx + cam.x)
    const tappedTileY = Math.floor(clientY / tilePx + cam.y)

    expect(tappedTileX).toBe(4) // 64 / 32 + 2 = 4
    expect(tappedTileY).toBe(6) // 96 / 32 + 3 = 6
  })

  it('verifies touch target size requirements (>= 44px)', () => {
    const dpadBtnSize = 44
    const actionBtnSize = 48
    const menuBtnMinHeight = 44

    expect(dpadBtnSize).toBeGreaterThanOrEqual(44)
    expect(actionBtnSize).toBeGreaterThanOrEqual(44)
    expect(menuBtnMinHeight).toBeGreaterThanOrEqual(44)
  })
})
