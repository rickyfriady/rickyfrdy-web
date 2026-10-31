import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { stackGroups } from '@/data/stack'
import { t } from '@/i18n/ui'

/** The single line the grouping replaced. Grouping may reorder, never add or drop. */
const PREVIOUS = [
  'Vue 3',
  'React',
  'Astro',
  'TypeScript',
  'Tailwind',
  'NestJS',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'Express',
  'Microservices',
  'Module Federation',
  'Zod',
  'Docker',
  'GitLab CI'
]

describe('landing Stack groups', () => {
  it('lists exactly the previous technologies, each once', () => {
    const items = stackGroups.flatMap((g) => g.items)
    expect([...items].sort()).toEqual([...PREVIOUS].sort())
  })

  it('names three groups in both locales', () => {
    expect(stackGroups).toHaveLength(3)
    for (const lang of ['en', 'id'] as const)
      for (const g of stackGroups) expect(t(lang, g.label)).toBeTruthy()
  })

  it('is what both landing pages render', () => {
    for (const page of ['index.astro', 'id/index.astro']) {
      const source = readFileSync(resolve(__dirname, '../../src/pages', page), 'utf8')
      expect(source).toMatch(/stackGroups\.map/)
    }
  })
})
