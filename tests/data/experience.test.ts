import { describe, expect, it } from 'vitest'
import { education, experiences, projects, skillCategories } from '@/data/experience'

describe('experience data', () => {
  it('has at least one work experience', () => {
    expect(experiences.length).toBeGreaterThan(0)
  })

  it('each experience has required fields', () => {
    for (const exp of experiences) {
      expect(exp.role).toBeTruthy()
      expect(exp.company).toBeTruthy()
      expect(exp.period).toBeTruthy()
      expect(exp.bullets.length).toBeGreaterThan(0)
      expect(exp.stack.length).toBeGreaterThan(0)
    }
  })

  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('education has required fields', () => {
    expect(education.institution).toBeTruthy()
    expect(education.degree).toBeTruthy()
    expect(education.period).toBeTruthy()
    expect(education.gpa).toBeTruthy()
  })

  it('has at least one skill category', () => {
    expect(skillCategories.length).toBeGreaterThan(0)
  })

  it('each skill category has items', () => {
    for (const cat of skillCategories) {
      expect(cat.label).toBeTruthy()
      expect(cat.items.length).toBeGreaterThan(0)
    }
  })
})
