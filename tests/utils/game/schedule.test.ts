import { describe, expect, it } from 'vitest'
import { collaborators } from '@/data/collaborators'
import { npcs } from '@/data/quests'
import { rooms } from '@/data/rooms'
import type { ScheduleStop } from '@/models'
import { canStand } from '@/utils/game/collision'
import { usualSpot, whereIs } from '@/utils/game/schedule'

const hours = Array.from({ length: 24 }, (_, h) => h)

describe('whereIs()', () => {
  const schedule = [
    { from: 0, to: 9, away: 'out' },
    { from: 9, to: 17, room: 'workshop', x: 2, y: 2 },
    { from: 17, to: 24, away: 'out' }
  ]

  it('returns the same place for the same hour, every time', () => {
    for (const h of hours) expect(whereIs(schedule, h)).toBe(whereIs(schedule, h))
  })

  it('treats hours as [from, to)', () => {
    expect(whereIs(schedule, 8)).toHaveProperty('away')
    expect(whereIs(schedule, 9)).toHaveProperty('room', 'workshop')
    expect(whereIs(schedule, 17)).toHaveProperty('away')
  })

  it('wraps and floors any hour it is handed', () => {
    expect(whereIs(schedule, 33.7)).toBe(whereIs(schedule, 9))
    expect(whereIs(schedule, -1)).toBe(whereIs(schedule, 23))
  })

  it('finds the usual spot, where an absent character leaves a note', () => {
    expect(usualSpot(schedule)).toMatchObject({ room: 'workshop', x: 2, y: 2 })
  })
})

describe('the real roster', () => {
  it.each(
    npcs.map((npc) => [npc.id, npc] as const)
  )('%s has a place or a stated whereabouts for every hour of the day', (_id, npc) => {
    for (const h of hours) {
      const stop = npc.schedule.find((s) => h >= s.from && h < s.to)
      expect(stop, `${npc.id} at ${h}:00`).toBeDefined()
    }
  })

  it.each(
    npcs.map((npc) => [npc.id, npc] as const)
  )('%s only ever stands somewhere a body can stand', (_id, npc) => {
    for (const stop of npc.schedule as readonly ScheduleStop[]) {
      if (!('room' in stop)) continue
      const room = rooms.find((r) => r.id === stop.room)
      expect(room, stop.room).toBeDefined()
      if (room) expect(canStand(room, stop.x, stop.y), `${npc.id} in ${stop.room}`).toBe(true)
    }
  })

  it('is drawn from real collaborators only, never invented people', () => {
    const names = new Set(collaborators.map((c) => c.name))
    for (const npc of npcs) expect(names.has(npc.collaborator), npc.id).toBe(true)
  })
})
