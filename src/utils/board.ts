import type { Lang } from '@/i18n/ui'
import { t } from '@/i18n/ui'
import type { BoardCard, BoardThread } from '@/models'

/** Minimal project shape the board needs, decoupled from the full model. */
export interface BoardProject {
  slug: string
  title: string
  category: string
  technologies: string[]
}

/** Minimal post shape the board needs, decoupled from content collections. */
export interface BoardPost {
  slug: string
  title: string
  tags?: string[]
  draft?: boolean
}

const CATEGORY_LABEL: Record<string, string> = {
  'web-app': 'Web App',
  api: 'API',
  tool: 'Tool',
  'open-source': 'Open Source'
}

function localize(path: string, lang: Lang): string {
  if (lang !== 'id') return path
  return path === '/' ? '/id' : `/id${path}`
}

/**
 * Deterministic scatter.
 *
 * Positions must be stable across builds — a board that reshuffles on every
 * deploy is disorienting, and it would make the layout impossible to test.
 * So this is an index-driven spiral rather than anything random: the subject
 * sits at the origin and everything else rings outward, alternating sides so
 * related cards do not all pile up in one quadrant.
 */
function scatter(index: number): { x: number; y: number } {
  const ring = Math.floor(index / 6) + 1
  const slot = index % 6
  const angle = (slot / 6) * Math.PI * 2 + ring * 0.6
  const radius = 260 * ring
  return {
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius * 0.72)
  }
}

/**
 * Every page becomes a card, not just projects — that is what makes the board
 * the real site index and lets a thread say "this article explains the
 * architecture used in that project", which a grid cannot state.
 */
export function buildBoardCards(
  projects: BoardProject[],
  posts: BoardPost[],
  lang: Lang
): BoardCard[] {
  const cards: BoardCard[] = [
    {
      id: 'subject',
      title: t(lang, 'case.about'),
      category: t(lang, 'case.file'),
      tags: [],
      url: localize('/about', lang),
      kind: 'subject',
      x: 0,
      y: 0
    }
  ]

  let i = 0
  for (const p of projects) {
    cards.push({
      id: `exhibit:${p.slug}`,
      title: p.title,
      category: CATEGORY_LABEL[p.category] ?? p.category,
      tags: p.technologies,
      url: localize(`/projects/${p.slug}`, lang),
      kind: 'exhibit',
      ...scatter(i++)
    })
  }

  // Drafts never reach the board, matching every other listing on the site.
  for (const post of posts.filter((p) => !p.draft)) {
    cards.push({
      id: `note:${post.slug}`,
      title: post.title,
      category: t(lang, 'case.blog'),
      tags: post.tags ?? [],
      url: localize(`/blog/${post.slug}`, lang),
      kind: 'note',
      ...scatter(i++)
    })
  }

  for (const [key, path] of [
    ['case.experience', '/experience'],
    ['case.now', '/now'],
    ['case.changelog', '/changelog'],
    ['case.dashboard', '/dashboard'],
    ['case.ask', '/ask']
  ] as const) {
    cards.push({
      id: `record:${path}`,
      title: t(lang, key),
      category: t(lang, 'case.file'),
      tags: [],
      url: localize(path, lang),
      kind: 'record',
      ...scatter(i++)
    })
  }

  return cards
}

/** Normalised for comparison so "Vue 3" and "vue 3" count as the same tag. */
const norm = (tag: string) => tag.trim().toLowerCase()

/**
 * A thread joins two cards that share at least one tag. This is the whole
 * point of the board: a grid can only say "here is a list", threads say which
 * work is related and how.
 */
export function computeThreads(cards: BoardCard[]): BoardThread[] {
  const threads: BoardThread[] = []
  for (let a = 0; a < cards.length; a++) {
    for (let b = a + 1; b < cards.length; b++) {
      const left = new Set(cards[a].tags.map(norm))
      const shared = cards[b].tags.filter((tag) => left.has(norm(tag)))
      if (shared.length > 0) {
        threads.push({ from: cards[a].id, to: cards[b].id, shared })
      }
    }
  }
  return threads
}

/**
 * How many other cards a card is joined to.
 *
 * Threads are not drawn on small viewports — they would be unreadable — so the
 * mobile stack shows this count as text instead. The relationship information
 * survives even though the presentation cannot.
 */
export function connectionCounts(threads: BoardThread[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const { from, to } of threads) {
    counts[from] = (counts[from] ?? 0) + 1
    counts[to] = (counts[to] ?? 0) + 1
  }
  return counts
}
