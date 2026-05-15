import { describe, expect, it } from 'vitest'
import { t } from '@/i18n/ui'

describe('t()', () => {
  it('returns the correct label for a known key', () => {
    expect(t('en', 'case.back')).toBe('← Projects')
    expect(t('en', 'case.overview')).toBe('Overview')
    expect(t('en', 'case.live')).toBe('View Live Demo')
    expect(t('en', 'case.github')).toBe('View on GitHub')
  })

  it('returns all 11 keys without error', () => {
    const keys = [
      'case.back', 'case.role', 'case.overview', 'case.impact',
      'case.problem', 'case.solution', 'case.highlights',
      'case.live', 'case.github', 'case.prev', 'case.next',
    ] as const
    keys.forEach((key) => {
      expect(typeof t('en', key)).toBe('string')
      expect(t('en', key).length).toBeGreaterThan(0)
    })
  })
})
