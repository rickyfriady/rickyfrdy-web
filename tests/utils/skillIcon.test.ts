import { describe, expect, it } from 'vitest'
import { getSkillIconUrl, SKILL_ICON } from '@/utils/skillIcon'

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
  it('returns full URL for known tech', () => {
    expect(getSkillIconUrl('TypeScript')).toBe('https://skillicons.dev/icons?i=ts')
  })

  it('returns undefined for unknown tech', () => {
    expect(getSkillIconUrl('Crontab')).toBeUndefined()
    expect(getSkillIconUrl('SFTP')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getSkillIconUrl('')).toBeUndefined()
  })
})
