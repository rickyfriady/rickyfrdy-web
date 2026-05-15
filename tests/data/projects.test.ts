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

describe('projects data schema', () => {
  it('all projects have a non-empty role string', () => {
    projects.forEach((p) => {
      expect(typeof p.role).toBe('string')
      expect((p.role as string).length).toBeGreaterThan(0)
    })
  })

  it('all projects have a metrics array with at least 2 entries', () => {
    projects.forEach((p) => {
      expect(Array.isArray(p.metrics)).toBe(true)
      expect((p.metrics as unknown[]).length).toBeGreaterThanOrEqual(2)
    })
  })

  it('each metric has non-empty value and label strings', () => {
    projects.forEach((p) => {
      ;(p.metrics as { value: string; label: string }[]).forEach((m) => {
        expect(typeof m.value).toBe('string')
        expect(m.value.length).toBeGreaterThan(0)
        expect(typeof m.label).toBe('string')
        expect(m.label.length).toBeGreaterThan(0)
      })
    })
  })
})
