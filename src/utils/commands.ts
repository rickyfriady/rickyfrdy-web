import { type Lang, t } from '@/i18n/ui'

export type CommandGroup = 'navigation' | 'actions' | 'content'
export type CommandKind =
  | 'navigate'
  | 'toggle-theme'
  | 'switch-lang'
  | 'copy'
  | 'toggle-companion'
  | 'reset-game'

export interface Command {
  /** Stable unique id */
  id: string
  label: string
  /** Extra searchable terms (tags, aliases) joined for substring matching */
  keywords: string
  group: CommandGroup
  kind: CommandKind
  /** Navigation target (navigate kind) */
  href?: string
  /** Value to copy (copy kind) */
  value?: string
}

/** Minimal shape needed to build a content command, decoupled from collections. */
export interface ContentItem {
  slug: string
  title: string
  tags?: string[]
}

const EMAIL = 'friadi.ricki@gmail.com'
const GITHUB_URL = 'https://github.com/rickyfriady'
const LINKEDIN_URL = 'https://www.linkedin.com/in/rickifriadi'

/** Prefix a root-relative path with the /id locale segment when needed. */
function localizeHref(path: string, lang: Lang): string {
  if (lang !== 'id') return path
  return path === '/' ? '/id' : `/id${path}`
}

/**
 * `alias` exists for the two in-fiction page names. Their labels are evocative
 * but tell you nothing about what the page is, so the plain words someone would
 * actually type are added as searchable terms instead of renaming the page.
 */
const NAV_ITEMS = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.experience', path: '/experience' },
  { key: 'nav.dashboard', path: '/dashboard' },
  { key: 'nav.resume', path: '/resume' },
  { key: 'nav.projects', path: '/projects' },
  { key: 'case.board', path: '/board', alias: 'board map connections graph papan peta' },
  {
    key: 'case.play',
    path: '/play',
    alias: 'play game rpg character walk main permainan karakter'
  },
  {
    key: 'case.arcade',
    path: '/arcade',
    alias: 'experiments lab playground shader demo eksperimen'
  },
  { key: 'nav.contact', path: '/contact' }
] as const

function navCommands(lang: Lang): Command[] {
  return NAV_ITEMS.map((item) => ({
    id: `nav:${item.path}`,
    label: t(lang, item.key),
    keywords: 'alias' in item ? `${item.path} ${item.alias}` : item.path,
    group: 'navigation',
    kind: 'navigate',
    href: localizeHref(item.path, lang)
  }))
}

function actionCommands(lang: Lang): Command[] {
  return [
    {
      id: 'action:ask',
      label: t(lang, 'cmdk.action.ask'),
      keywords: 'ask ai search question tanya cari',
      group: 'actions',
      kind: 'navigate',
      href: localizeHref('/ask', lang)
    },
    {
      id: 'action:theme',
      label: t(lang, 'cmdk.action.theme'),
      keywords: 'theme dark light mode tema',
      group: 'actions',
      kind: 'toggle-theme'
    },
    {
      id: 'action:lang',
      label: t(lang, 'cmdk.action.lang'),
      keywords: 'language locale english indonesia bahasa',
      group: 'actions',
      kind: 'switch-lang'
    },
    {
      id: 'action:play',
      label: t(lang, 'cmdk.action.play'),
      keywords: 'play game rpg walk explore main permainan',
      group: 'actions',
      kind: 'navigate',
      href: localizeHref('/play', lang)
    },
    {
      id: 'action:companion',
      label: t(lang, 'cmdk.action.companion'),
      keywords: 'companion character mascot hide show karakter sembunyikan',
      group: 'actions',
      kind: 'toggle-companion'
    },
    {
      id: 'action:reset-game',
      label: t(lang, 'cmdk.action.reset'),
      keywords: 'reset game progress clear atur ulang progres hapus',
      group: 'actions',
      kind: 'reset-game'
    },
    {
      id: 'action:resume',
      label: t(lang, 'cmdk.action.resume'),
      keywords: 'cv pdf download unduh',
      group: 'actions',
      kind: 'navigate',
      href: localizeHref('/resume.pdf', lang)
    },
    {
      id: 'action:copy-email',
      label: t(lang, 'cmdk.action.copyEmail'),
      keywords: `email ${EMAIL}`,
      group: 'actions',
      kind: 'copy',
      value: EMAIL
    },
    {
      id: 'action:copy-github',
      label: t(lang, 'cmdk.action.copyGithub'),
      keywords: 'github git repo',
      group: 'actions',
      kind: 'copy',
      value: GITHUB_URL
    },
    {
      id: 'action:copy-linkedin',
      label: t(lang, 'cmdk.action.copyLinkedin'),
      keywords: 'linkedin social',
      group: 'actions',
      kind: 'copy',
      value: LINKEDIN_URL
    }
  ]
}

function contentCommands(posts: ContentItem[], projects: ContentItem[]): Command[] {
  const postCmds: Command[] = posts.map((p) => ({
    id: `post:${p.slug}`,
    label: p.title,
    keywords: `blog post ${(p.tags ?? []).join(' ')}`,
    group: 'content',
    kind: 'navigate',
    href: `/blog/${p.slug}`
  }))
  const projectCmds: Command[] = projects.map((p) => ({
    id: `project:${p.slug}`,
    label: p.title,
    keywords: `project case study ${(p.tags ?? []).join(' ')}`,
    group: 'content',
    kind: 'navigate',
    href: `/projects/${p.slug}`
  }))
  return [...projectCmds, ...postCmds]
}

/**
 * Build the full command list for the palette. Pure and build-time safe.
 * Content routes are English-only (no localized slug pages exist).
 */
export function buildCommands(
  lang: Lang,
  posts: ContentItem[] = [],
  projects: ContentItem[] = []
): Command[] {
  return [...navCommands(lang), ...actionCommands(lang), ...contentCommands(posts, projects)]
}

/** Case-insensitive substring match over label + keywords. */
export function matchesQuery(command: Command, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return `${command.label} ${command.keywords}`.toLowerCase().includes(q)
}
