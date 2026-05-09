import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'

describe('projects data', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.shortDescription).toBeTruthy()
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.year).toBeGreaterThan(2019)
      expect(['web-app', 'api', 'tool', 'open-source']).toContain(p.category)
    }
  })

  it('slugs are unique', () => {
    const slugs = projects.map((p) => p.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it('slugs are URL-safe (lowercase, hyphens only)', () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('featured projects exist', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThan(0)
  })
})
