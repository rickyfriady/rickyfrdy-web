import { describe, expect, it } from 'vitest'
import { localizePath, t } from '@/i18n/ui'

describe('t()', () => {
  it('returns the correct label for a known key', () => {
    expect(t('en', 'case.back')).toBe('← Projects')
    expect(t('en', 'case.overview')).toBe('Overview')
    expect(t('en', 'case.live')).toBe('View Live Demo')
    expect(t('en', 'case.github')).toBe('View on GitHub')
  })

  it('returns all 11 keys without error', () => {
    const keys = [
      'case.back',
      'case.role',
      'case.overview',
      'case.impact',
      'case.problem',
      'case.solution',
      'case.highlights',
      'case.live',
      'case.github',
      'case.prev',
      'case.next'
    ] as const
    keys.forEach((key) => {
      expect(typeof t('en', key)).toBe('string')
      expect(t('en', key).length).toBeGreaterThan(0)
    })
  })
})

describe('localizePath()', () => {
  it('maps the home page to /id', () => {
    expect(localizePath('/', 'id')).toBe('/id')
  })

  it('prefixes any other page', () => {
    expect(localizePath('/about', 'id')).toBe('/id/about')
  })

  it('leaves English paths alone', () => {
    expect(localizePath('/about', 'en')).toBe('/about')
    expect(localizePath('/', 'en')).toBe('/')
  })
})
