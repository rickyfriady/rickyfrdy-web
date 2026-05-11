import { describe, expect, it } from 'vitest'
import { skillGroups } from '@/data/skills'

describe('skills data', () => {
  it('has 4 skill groups', () => {
    expect(skillGroups).toHaveLength(4)
  })

  it('each group has a label and at least one skill', () => {
    for (const group of skillGroups) {
      expect(group.label).toBeTruthy()
      expect(group.skills.length).toBeGreaterThan(0)
    }
  })

  it('each skill has name and icon', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.name).toBeTruthy()
        expect(skill.icon).toBeTruthy()
      }
    }
  })

  it('icon values are valid skillicons.dev slugs (no spaces, lowercase)', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.icon).toMatch(/^[a-z0-9]+$/)
      }
    }
  })
})
