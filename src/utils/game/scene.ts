import type { Collaborator, Room, RoomObject } from '@/models'
import { resolveNpc } from './quests'

/**
 * Resolves room objects to the real content they point at, at build time.
 *
 * Room data carries `{ kind, slug }` and nothing else. Titles and summaries
 * live in `projects.ts`, the blog collection, and `experience.ts` — copying
 * them into the room would mean a retitled project keeps its old name inside
 * the game until someone happens to notice.
 *
 * An unresolvable slug throws with the slug named. Dropping it silently is how
 * a build stays green while the page is missing half its content.
 */
export interface SceneObject {
  id: string
  x: number
  y: number
  sprite: string
  kind: RoomObject['binding']['kind']
  slug: string
  title: string
  summary: string
  href?: string
}

export interface SceneDoor {
  x: number
  y: number
  to: string
  entry: { x: number; y: number }
}

export interface SceneRoom {
  id: string
  name: string
  grid: string[]
  spawn: { x: number; y: number }
  objects: SceneObject[]
  doors: SceneDoor[]
}

export interface SceneSources {
  projects: readonly { slug: string; title: string; shortDescription: string }[]
  posts: readonly { slug: string; title: string; description: string }[]
  experiences: readonly { company: string; role: string; period: string; bullets: string[] }[]
  people?: readonly Collaborator[]
}

function localize(path: string, lang: 'en' | 'id'): string {
  if (lang !== 'id') return path
  return path === '/' ? '/id' : `/id${path}`
}

export function buildScene(
  rooms: readonly Room[],
  sources: SceneSources,
  lang: 'en' | 'id'
): SceneRoom[] {
  return rooms.map((room) => ({
    id: room.id,
    name: room.name[lang],
    grid: [...room.grid],
    spawn: { ...room.spawn },
    doors: room.doors.map((d) => ({ x: d.x, y: d.y, to: d.to, entry: { ...d.entry } })),
    objects: room.objects.map((object) => resolveObject(object, sources, lang))
  }))
}

function resolveObject(object: RoomObject, sources: SceneSources, lang: 'en' | 'id'): SceneObject {
  const base = { id: object.id, x: object.x, y: object.y, sprite: object.sprite }
  const { kind, slug } = object.binding

  if (kind === 'project') {
    const project = sources.projects.find((p) => p.slug === slug)
    if (!project) throw new Error(`Room object "${object.id}" points at unknown project "${slug}"`)
    return {
      ...base,
      kind,
      slug,
      title: project.title,
      summary: project.shortDescription,
      // Case-study routes are English-only, matching the command palette.
      href: `/projects/${slug}`
    }
  }

  if (kind === 'post') {
    const post = sources.posts.find((p) => p.slug === slug)
    if (!post) throw new Error(`Room object "${object.id}" points at unknown post "${slug}"`)
    return {
      ...base,
      kind,
      slug,
      title: post.title,
      summary: post.description,
      href: `/blog/${slug}`
    }
  }

  if (kind === 'experience') {
    const entry = sources.experiences.find((e) => e.company === slug)
    if (!entry) throw new Error(`Room object "${object.id}" points at unknown employer "${slug}"`)
    return {
      ...base,
      kind,
      slug,
      title: `${entry.role} · ${entry.company}`,
      summary: `${entry.period} — ${entry.bullets[0] ?? ''}`,
      href: localize('/experience', lang)
    }
  }

  const person = resolveNpc(slug, sources.people)
  if (!person) throw new Error(`Room object "${object.id}" points at unknown NPC "${slug}"`)
  return {
    ...base,
    kind,
    slug,
    title: person.name,
    summary: `${person.role} · ${person.company}`
  }
}

/** Every destination the scene exposes, for the always-present HTML list. */
export function sceneDestinations(rooms: readonly SceneRoom[]): SceneObject[] {
  return rooms.flatMap((room) => room.objects).filter((object) => object.href)
}
