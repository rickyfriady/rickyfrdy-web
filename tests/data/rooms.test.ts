import { describe, expect, it } from 'vitest'
import { collaborators } from '@/data/collaborators'
import { experiences } from '@/data/experience'
import { projects } from '@/data/projects'
import { quests } from '@/data/quests'
import { rooms } from '@/data/rooms'
import { canStand, isWalkable, roomSize } from '@/utils/game/collision'
import { buildScene, sceneDestinations } from '@/utils/game/scene'

const posts = [
  {
    slug: 'microservices-with-nestjs',
    title: 'Microservices with NestJS',
    description: 'A post.'
  }
]

const sources = { projects, posts, experiences, people: collaborators }

describe('room grids', () => {
  it('has rectangular grids', () => {
    for (const room of rooms) {
      const width = room.grid[0].length
      for (const row of room.grid) expect(row.length, room.id).toBe(width)
    }
  })

  it('spawns the player somewhere they can actually stand', () => {
    for (const room of rooms) {
      expect(canStand(room, room.spawn.x, room.spawn.y), room.id).toBe(true)
    }
  })

  it('places every object inside the room', () => {
    for (const room of rooms) {
      const { w, h } = roomSize(room)
      for (const object of room.objects) {
        expect(object.x, `${room.id}/${object.id}`).toBeGreaterThanOrEqual(0)
        expect(object.y, `${room.id}/${object.id}`).toBeGreaterThanOrEqual(0)
        expect(object.x).toBeLessThan(w)
        expect(object.y).toBeLessThan(h)
      }
    }
  })
})

describe('doors', () => {
  it('links every door to a room that exists', () => {
    const ids = new Set(rooms.map((r) => r.id))
    for (const room of rooms) {
      for (const door of room.doors) expect(ids.has(door.to), `${room.id}→${door.to}`).toBe(true)
    }
  })

  it('sits on a door tile and lands on a walkable entry point', () => {
    for (const room of rooms) {
      for (const door of room.doors) {
        expect(room.grid[door.y][door.x], `${room.id} door tile`).toBe('+')
        const target = rooms.find((r) => r.id === door.to)
        if (!target) throw new Error(`${room.id} door points at missing room ${door.to}`)
        expect(isWalkable(target, door.entry.x, door.entry.y), `${room.id}→${door.to}`).toBe(true)
      }
    }
  })

  it('leaves no room unreachable from the first one', () => {
    const seen = new Set([rooms[0].id])
    const queue = [rooms[0]]
    while (queue.length) {
      const room = queue.shift()
      if (!room) break
      for (const door of room.doors) {
        if (seen.has(door.to)) continue
        seen.add(door.to)
        const next = rooms.find((r) => r.id === door.to)
        if (next) queue.push(next)
      }
    }
    expect(seen.size).toBe(rooms.length)
  })
})

describe('buildScene()', () => {
  it('resolves every object slug to real content', () => {
    expect(() => buildScene(rooms, sources, 'en')).not.toThrow()
    for (const room of buildScene(rooms, sources, 'en')) {
      for (const object of room.objects) {
        expect(object.title.length, object.id).toBeGreaterThan(0)
        expect(object.summary.length, object.id).toBeGreaterThan(0)
      }
    }
  })

  it('reads the title from the source data rather than a copy in the room', () => {
    const renamed = projects.map((p) =>
      p.slug === 'kamila' ? { ...p, title: 'Renamed In Source' } : p
    )
    const scene = buildScene(rooms, { ...sources, projects: renamed }, 'en')
    const object = scene.flatMap((r) => r.objects).find((o) => o.slug === 'kamila')
    expect(object?.title).toBe('Renamed In Source')
  })

  it('fails loudly, naming the slug, when an object points at nothing', () => {
    const broken = [
      {
        ...rooms[0],
        objects: [{ ...rooms[0].objects[0], binding: { kind: 'project' as const, slug: 'ghost' } }]
      }
    ]
    expect(() => buildScene(broken, sources, 'en')).toThrow(/ghost/)
  })

  it('localizes the experience destination but leaves case studies English-only', () => {
    const scene = buildScene(rooms, sources, 'id')
    const objects = scene.flatMap((r) => r.objects)
    expect(objects.find((o) => o.kind === 'experience')?.href).toBe('/id/experience')
    expect(objects.find((o) => o.kind === 'project')?.href).toMatch(/^\/projects\//)
  })
})

describe('destinations', () => {
  it('exposes a link for every non-NPC object', () => {
    const scene = buildScene(rooms, sources, 'en')
    const destinations = sceneDestinations(scene)
    const linkable = scene.flatMap((r) => r.objects).filter((o) => o.kind !== 'npc')
    expect(destinations).toHaveLength(linkable.length)
  })

  it('reaches every project in the portfolio, so the game hides nothing', () => {
    const destinations = sceneDestinations(buildScene(rooms, sources, 'en'))
    for (const project of projects) {
      expect(
        destinations.some((d) => d.slug === project.slug),
        project.slug
      ).toBe(true)
    }
  })
})

describe('quests never gate content', () => {
  it('only ever names destinations that are reachable without any progress', () => {
    const destinations = sceneDestinations(buildScene(rooms, sources, 'en')).map((d) => d.href)
    for (const quest of quests) {
      if (!quest.destination) continue
      expect(destinations.includes(quest.destination), quest.id).toBe(true)
    }
  })
})
