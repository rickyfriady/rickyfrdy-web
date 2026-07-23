import { describe, expect, it } from 'vitest'
import { buildCommands, type ContentItem, matchesQuery } from '@/utils/commands'

const posts: ContentItem[] = [
  { slug: 'hello-world', title: 'Hello World', tags: ['astro', 'typescript'] }
]
const projects: ContentItem[] = [
  { slug: 'singel-app', title: 'Singel APP', tags: ['vue', 'nestjs'] }
]

describe('buildCommands()', () => {
  it('includes the seven navigation commands', () => {
    const nav = buildCommands('en', posts, projects).filter((c) => c.group === 'navigation')
    expect(nav).toHaveLength(7)
    expect(nav.map((c) => c.href)).toContain('/about')
  })

  it('localizes navigation hrefs for the id locale', () => {
    const nav = buildCommands('id', posts, projects).filter((c) => c.group === 'navigation')
    const home = nav.find((c) => c.id === 'nav:/')
    const about = nav.find((c) => c.id === 'nav:/about')
    expect(home?.href).toBe('/id')
    expect(about?.href).toBe('/id/about')
  })

  it('translates labels per locale', () => {
    const en = buildCommands('en').find((c) => c.id === 'nav:/about')
    const id = buildCommands('id').find((c) => c.id === 'nav:/about')
    expect(en?.label).toBe('About')
    expect(id?.label).toBe('Tentang')
  })

  it('creates content commands with English routes and tags as keywords', () => {
    const content = buildCommands('id', posts, projects).filter((c) => c.group === 'content')
    const post = content.find((c) => c.id === 'post:hello-world')
    const project = content.find((c) => c.id === 'project:singel-app')
    expect(post?.href).toBe('/blog/hello-world')
    expect(project?.href).toBe('/projects/singel-app')
    expect(post?.keywords).toContain('typescript')
  })

  it('includes theme, lang, resume and copy actions', () => {
    const actions = buildCommands('en').filter((c) => c.group === 'actions')
    const kinds = actions.map((c) => c.kind)
    expect(kinds).toContain('toggle-theme')
    expect(kinds).toContain('switch-lang')
    expect(actions.find((c) => c.id === 'action:copy-email')?.value).toContain('@')
  })

  it('works with no content', () => {
    const cmds = buildCommands('en')
    expect(cmds.filter((c) => c.group === 'content')).toHaveLength(0)
    expect(cmds.length).toBeGreaterThan(0)
  })
})

describe('matchesQuery()', () => {
  const cmd = buildCommands('en', posts).find((c) => c.id === 'post:hello-world')
  if (!cmd) throw new Error('expected hello-world command')

  it('matches empty query', () => {
    expect(matchesQuery(cmd, '')).toBe(true)
    expect(matchesQuery(cmd, '   ')).toBe(true)
  })

  it('matches on label case-insensitively', () => {
    expect(matchesQuery(cmd, 'HELLO')).toBe(true)
  })

  it('matches on keywords', () => {
    expect(matchesQuery(cmd, 'astro')).toBe(true)
  })

  it('rejects non-matching query', () => {
    expect(matchesQuery(cmd, 'nonexistent')).toBe(false)
  })
})
