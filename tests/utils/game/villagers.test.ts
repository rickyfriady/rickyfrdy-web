import { describe, expect, it } from 'vitest'
import { villagers } from '@/data/villagers'
import { MOVE_MS, remarkAt, SLOT_MS, villagerAt, villagerAtRest } from '@/utils/game/villagers'

const farmer = villagers[0]
const sameSpot = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  a.x === b.x && a.y === b.y

describe('villagerAt()', () => {
  it('is the same place for the same time', () => {
    for (const v of villagers) expect(villagerAt(v, 1_234_567)).toEqual(villagerAt(v, 1_234_567))
  })

  it('is always one of the authored spots', () => {
    for (const v of villagers)
      for (let slot = 0; slot < 200; slot++) {
        const { spot } = villagerAt(v, slot * SLOT_MS + 3000)
        expect(
          v.spots.some((s) => sameSpot(s, spot)),
          `${v.id} slot ${slot}`
        ).toBe(true)
      }
  })

  it('holds still for the whole of a slot once it has arrived', () => {
    const base = 40 * SLOT_MS
    const a = villagerAt(farmer, base + MOVE_MS + 10).spot
    const b = villagerAt(farmer, base + SLOT_MS - 10).spot
    expect(a).toEqual(b)
  })

  it('walks only at the start of a slot, and only when the spot changed', () => {
    for (let slot = 1; slot < 100; slot++) {
      const start = villagerAt(farmer, slot * SLOT_MS + 5)
      const prev = villagerAt(farmer, (slot - 1) * SLOT_MS + SLOT_MS - 5).spot
      expect(start.moving).toBe(!sameSpot(prev, start.spot))
      expect(villagerAt(farmer, slot * SLOT_MS + MOVE_MS + 1).moving).toBe(false)
    }
  })

  it('faces the way it travelled, and rests facing down when it did not move', () => {
    const moved = Array.from({ length: 60 }, (_, i) => villagerAt(farmer, (i + 1) * SLOT_MS))
    expect(new Set(moved.map((s) => s.facing)).size).toBeGreaterThan(1)
    for (const s of moved) expect(['up', 'down', 'left', 'right']).toContain(s.facing)
  })

  it('stands at its first spot, still, for reduced motion', () => {
    expect(villagerAtRest(farmer)).toEqual({ spot: farmer.spots[0], moving: false, facing: 'down' })
  })
})

describe('remarkAt()', () => {
  it('is stable within a slot, so a remark does not change while it is read', () => {
    const t = 7 * SLOT_MS
    expect(remarkAt(farmer, t + 1)).toBe(remarkAt(farmer, t + SLOT_MS - 1))
  })

  it('is always one of the villager’s own remarks', () => {
    for (const v of villagers) expect(v.remarks).toContain(remarkAt(v, 123_456))
  })
})
