import type { Vec2 } from '@/models'
import type { Facing } from './sprites'

/** A villager picks a spot, stays put for a slot, then may move to another. */
export const SLOT_MS = 8000
/** How long a move shows walking frames before the villager settles. */
export const MOVE_MS = 1200

/** FNV-1a: a small stable hash, so the same id and slot always choose the same spot. */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const slotOf = (nowMs: number) => Math.floor(nowMs / SLOT_MS)
/** Only what the clock needs, so the scene can pass villagers with remarks already localized. */
export interface Wanderer {
  id: string
  spots: Vec2[]
}

const spotOf = (v: Wanderer, slot: number) => v.spots[hash(`${v.id}:${slot}`) % v.spots.length]

/** Dominant axis of travel; horizontal wins a tie. */
function facingBetween(from: Vec2, to: Vec2): Facing {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (dx === 0 && dy === 0) return 'down'
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'left' : 'right'
  return dy < 0 ? 'up' : 'down'
}

export interface VillagerState {
  spot: Vec2
  moving: boolean
  facing: Facing
}

/**
 * Where a villager is, and whether it is walking there, as a pure function of
 * the clock. Nothing is stored and nothing is simulated, the same way a
 * scheduled character's place is a lookup of the hour.
 */
export function villagerAt(villager: Wanderer, nowMs: number): VillagerState {
  const slot = slotOf(nowMs)
  const spot = spotOf(villager, slot)
  const from = spotOf(villager, slot - 1)
  const travelled = from.x !== spot.x || from.y !== spot.y
  return {
    spot,
    moving: travelled && nowMs % SLOT_MS < MOVE_MS,
    facing: facingBetween(from, spot)
  }
}

/** The remark on offer in this slot. Chosen by the clock, so it is stable while you read it. */
export function remarkAt<R>(villager: Wanderer & { remarks: R[] }, nowMs: number): R {
  const { remarks } = villager
  return remarks[hash(`${villager.id}:remark:${slotOf(nowMs)}`) % remarks.length]
}

/** A villager standing at its first spot, for a visitor who asked for less motion. */
export function villagerAtRest(villager: Wanderer): VillagerState {
  return { spot: villager.spots[0], moving: false, facing: 'down' }
}
