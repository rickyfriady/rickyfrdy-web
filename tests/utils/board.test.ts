import { describe, expect, it } from 'vitest'
import {
  type BoardPost,
  type BoardProject,
  buildBoardCards,
  computeThreads,
  connectionCounts
} from '@/utils/board'

const projects: BoardProject[] = [
  { slug: 'singel', title: 'Singel APP', category: 'web-app', technologies: ['Vue 3', 'NestJS'] },
  { slug: 'aira', title: 'Aira', category: 'api', technologies: ['NestJS', 'PostgreSQL'] },
  { slug: 'kamila', title: 'Kamila', category: 'tool', technologies: ['Astro'] }
]

const posts: BoardPost[] = [
  { slug: 'nestjs-notes', title: 'NestJS notes', tags: ['nestjs'] },
  { slug: 'secret', title: 'Unfinished', tags: ['Vue 3'], draft: true }
]

describe('buildBoardCards()', () => {
  it('puts the subject at the origin so everything else rings outward from it', () => {
    const [first] = buildBoardCards(projects, posts, 'en')
    expect(first.id).toBe('subject')
    expect({ x: first.x, y: first.y }).toEqual({ x: 0, y: 0 })
  })

  it('represents every page, not just projects — that is what makes it a site index', () => {
    const kinds = new Set(buildBoardCards(projects, posts, 'en').map((c) => c.kind))
    expect(kinds).toEqual(new Set(['subject', 'exhibit', 'note', 'record']))
  })

  it('excludes drafts, matching every other listing on the site', () => {
    const ids = buildBoardCards(projects, posts, 'en').map((c) => c.id)
    expect(ids).toContain('note:nestjs-notes')
    expect(ids).not.toContain('note:secret')
  })

  it('localizes every destination for the id locale', () => {
    for (const card of buildBoardCards(projects, posts, 'id')) {
      expect(card.url.startsWith('/id')).toBe(true)
    }
  })

  it('is deterministic, so the board does not reshuffle between builds', () => {
    const a = buildBoardCards(projects, posts, 'en').map((c) => [c.id, c.x, c.y])
    const b = buildBoardCards(projects, posts, 'en').map((c) => [c.id, c.x, c.y])
    expect(a).toEqual(b)
  })

  it('gives every card a distinct position', () => {
    const cards = buildBoardCards(projects, posts, 'en')
    const seen = new Set(cards.map((c) => `${c.x},${c.y}`))
    expect(seen.size).toBe(cards.length)
  })

  it('carries a human-readable category rather than a raw slug', () => {
    const singel = buildBoardCards(projects, posts, 'en').find((c) => c.id === 'exhibit:singel')
    expect(singel?.category).toBe('Web App')
  })
})

describe('computeThreads()', () => {
  const cards = buildBoardCards(projects, posts, 'en')
  const threads = computeThreads(cards)

  it('joins two cards that share a technology', () => {
    const nestjs = threads.find((t) => t.from === 'exhibit:singel' && t.to === 'exhibit:aira')
    expect(nestjs?.shared).toEqual(['NestJS'])
  })

  it('joins across content types — the thing a flat grid cannot express', () => {
    const crossType = threads.find((t) => t.from.startsWith('exhibit:') && t.to.startsWith('note:'))
    expect(crossType).toBeDefined()
  })

  it('matches tags case-insensitively, so "NestJS" and "nestjs" connect', () => {
    const joined = threads.some(
      (t) =>
        (t.from === 'exhibit:aira' && t.to === 'note:nestjs-notes') ||
        (t.from === 'note:nestjs-notes' && t.to === 'exhibit:aira')
    )
    expect(joined).toBe(true)
  })

  it('leaves unrelated cards unconnected', () => {
    const kamila = threads.filter((t) => t.from === 'exhibit:kamila' || t.to === 'exhibit:kamila')
    expect(kamila).toEqual([])
  })

  it('never threads a card to itself or repeats a pair', () => {
    const pairs = threads.map((t) => [t.from, t.to].sort().join('|'))
    expect(new Set(pairs).size).toBe(pairs.length)
    expect(threads.every((t) => t.from !== t.to)).toBe(true)
  })

  it('produces nothing when no card carries tags', () => {
    expect(computeThreads(cards.filter((c) => c.tags.length === 0))).toEqual([])
  })
})

describe('connectionCounts()', () => {
  it('counts both endpoints, so the mobile stack keeps the relationship info', () => {
    const counts = connectionCounts([
      { from: 'a', to: 'b', shared: ['x'] },
      { from: 'a', to: 'c', shared: ['x'] }
    ])
    expect(counts).toEqual({ a: 2, b: 1, c: 1 })
  })

  it('omits cards with no connections rather than reporting zero', () => {
    expect(connectionCounts([])).toEqual({})
  })
})
