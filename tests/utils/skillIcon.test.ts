import { describe, expect, it } from 'vitest'
import { DRAWN_TECH_SPRITES, getSkillIconUrl, SKILL_ICON } from '@/utils/skillIcon'

describe('SKILL_ICON map', () => {
  it('maps TypeScript to ts', () => {
    expect(SKILL_ICON.TypeScript).toBe('ts')
  })

  it('maps Vue 3 to vue', () => {
    expect(SKILL_ICON['Vue 3']).toBe('vue')
  })

  it('maps React to react', () => {
    expect(SKILL_ICON.React).toBe('react')
  })

  it('maps NestJS to nestjs', () => {
    expect(SKILL_ICON.NestJS).toBe('nestjs')
  })

  it('maps PostgreSQL to postgres', () => {
    expect(SKILL_ICON.PostgreSQL).toBe('postgres')
  })

  it('maps Docker to docker', () => {
    expect(SKILL_ICON.Docker).toBe('docker')
  })

  it('handles alternative names for same tech', () => {
    expect(SKILL_ICON['Vue.js']).toBe('vue')
    expect(SKILL_ICON.ReactJS).toBe('react')
    expect(SKILL_ICON['Express.js']).toBe('express')
  })
})

describe('getSkillIconUrl()', () => {
  it('resolves a known tech to its drawn sprite, or nothing if not drawn yet', () => {
    // Icons are now local sprites drawn one at a time, not a remote service.
    // A mapped tech resolves to a sprite URL only once that sprite exists;
    // until then call sites fall back to a text tag, so undefined is correct.
    const url = getSkillIconUrl('TypeScript')
    if (DRAWN_TECH_SPRITES.includes('ts')) {
      expect(url).toBeTruthy()
      expect(url).not.toContain('skillicons.dev')
    } else {
      expect(url).toBeUndefined()
    }
  })

  it('never points at the removed external icon service', () => {
    for (const tech of Object.keys(SKILL_ICON)) {
      expect(getSkillIconUrl(tech) ?? '').not.toContain('skillicons.dev')
    }
  })

  it('returns undefined for unknown tech', () => {
    expect(getSkillIconUrl('Crontab')).toBeUndefined()
    expect(getSkillIconUrl('SFTP')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getSkillIconUrl('')).toBeUndefined()
  })
})
