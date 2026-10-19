import { describe, expect, it } from 'vitest'
import { npcs } from '@/data/quests'
import { rooms } from '@/data/rooms'

/** Every character that is a prop rather than terrain. */
const PROPS = new Set('MhBVPKFNuYy')

const at = (roomId: string, x: number, y: number) =>
  rooms.find((r) => r.id === roomId)?.grid[Math.floor(y)]?.[Math.floor(x)]

describe('props never cover a place the player must reach', () => {
  it('leaves every object cell clear', () => {
    for (const room of rooms)
      for (const o of room.objects)
        expect(PROPS.has(at(room.id, o.x, o.y) ?? ''), `${room.id}/${o.id}`).toBe(false)
  })

  it('leaves every door, and the spot a visitor lands on, clear', () => {
    for (const room of rooms)
      for (const d of room.doors) {
        expect(PROPS.has(at(room.id, d.x, d.y) ?? ''), `${room.id} door`).toBe(false)
        expect(PROPS.has(at(d.to, d.entry.x, d.entry.y) ?? ''), `${d.to} entry`).toBe(false)
      }
  })

  it('leaves every spawn and every scheduled spot clear', () => {
    for (const room of rooms)
      expect(PROPS.has(at(room.id, room.spawn.x, room.spawn.y) ?? ''), `${room.id} spawn`).toBe(
        false
      )
    for (const npc of npcs)
      for (const stop of npc.schedule)
        if ('room' in stop && stop.room)
          expect(PROPS.has(at(stop.room, stop.x, stop.y) ?? ''), `${npc.id} ${stop.from}h`).toBe(
            false
          )
  })

  it('actually dresses the valley and each interior', () => {
    for (const room of rooms) {
      const used = room.grid
        .join('')
        .split('')
        .filter((c) => PROPS.has(c))
      expect(used.length, room.id).toBeGreaterThan(0)
    }
  })
})
