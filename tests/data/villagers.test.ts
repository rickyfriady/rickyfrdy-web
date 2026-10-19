import { describe, expect, it } from 'vitest'
import { collaborators } from '@/data/collaborators'
import { experiences } from '@/data/experience'
import { projects } from '@/data/projects'
import { npcs } from '@/data/quests'
import { rooms } from '@/data/rooms'
import { villagers } from '@/data/villagers'
import { canStand } from '@/utils/game/collision'
import { buildScene, sceneDestinations } from '@/utils/game/scene'

const posts = [
  { slug: 'microservices-with-nestjs', title: 'Microservices with NestJS', description: 'A post.' }
]

/** The only fields a villager may carry. A person has more, and that is the point. */
const ALLOWED = ['archetype', 'id', 'remarks', 'room', 'sheet', 'spots']

describe('villagers are not people the site represents', () => {
  it('carry no binding, title, quest, schedule or name', () => {
    for (const v of villagers) expect(Object.keys(v).sort(), v.id).toEqual(ALLOWED)
  })

  it('never share an id with a collaborator or a scheduled character', () => {
    const taken = new Set([
      ...npcs.map((n) => n.id),
      ...collaborators.flatMap((c) => [c.name, c.name.toLowerCase().replace(/\s+/g, '-')])
    ])
    for (const v of villagers) expect(taken.has(v.id), v.id).toBe(false)
  })

  it('are absent from the destination list and from every scene object', () => {
    const routes = ['/about', '/contact', '/projects', '/blog', '/experience', '/board'].map(
      (path) => ({ path, title: path, summary: path, place: path })
    )
    const scene = buildScene(
      rooms,
      { projects, posts, experiences, people: collaborators, routes },
      'en'
    )
    const text = JSON.stringify([sceneDestinations(scene), scene.flatMap((r) => r.objects)])
    for (const v of villagers) {
      expect(text.includes(v.id), v.id).toBe(false)
      for (const r of v.remarks) expect(text.includes(r.en), r.en).toBe(false)
    }
  })

  it('have remarks in both locales that say nothing about the owner, work or collaborators', () => {
    const forbidden = [
      ...collaborators.flatMap((c) => c.name.split(/\s+/)),
      ...projects.map((p) => p.title),
      'Ricki',
      'Pegadaian',
      'portfolio',
      'resume'
    ].filter((w) => w.length > 3)
    for (const v of villagers)
      for (const r of v.remarks) {
        expect(r.en.trim(), v.id).not.toBe('')
        expect(r.id.trim(), v.id).not.toBe('')
        for (const word of forbidden) {
          expect(
            `${r.en} ${r.id}`.toLowerCase().includes(word.toLowerCase()),
            `${v.id}: ${word}`
          ).toBe(false)
        }
      }
  })
})

describe('villager spots keep out of the way', () => {
  const roomOf = (id: string) => rooms.find((r) => r.id === id)

  it('are plain, standable ground: no road, prop, door or water', () => {
    for (const v of villagers) {
      const room = roomOf(v.room)
      expect(room, v.id).toBeDefined()
      for (const s of v.spots) {
        expect(canStand(room as never, s.x, s.y), `${v.id} ${s.x},${s.y}`).toBe(true)
        expect(room?.grid[s.y][s.x], `${v.id} ${s.x},${s.y}`).toMatch(/^[,."*FNu]$/)
      }
    }
  })

  it('never sit on an object, a door, an entry, a spawn or a scheduled spot', () => {
    const same = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.floor(a.x) === Math.floor(b.x) && Math.floor(a.y) === Math.floor(b.y)
    for (const v of villagers) {
      const room = roomOf(v.room)
      const reserved = [
        ...(room?.objects ?? []),
        ...(room?.doors ?? []),
        ...rooms.flatMap((r) => r.doors.filter((d) => d.to === v.room).map((d) => d.entry)),
        ...(room ? [room.spawn] : []),
        ...npcs.flatMap((n) =>
          n.schedule.flatMap((s) => ('room' in s && s.room === v.room ? [s] : []))
        )
      ]
      for (const s of v.spots)
        for (const r of reserved) expect(same(s, r as never), `${v.id} ${s.x},${s.y}`).toBe(false)
    }
  })

  it('leave every other spot clear: no two villagers share one', () => {
    const keys = villagers.flatMap((v) => v.spots.map((s) => `${v.room}:${s.x},${s.y}`))
    expect(new Set(keys).size).toBe(keys.length)
  })
})
