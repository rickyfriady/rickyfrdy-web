import { describe, expect, it } from 'vitest'
import { formatCategory, truncate } from '@/utils/ogCard'

describe('truncate()', () => {
  it('returns the string unchanged when under the limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('returns the string unchanged when exactly at the limit', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates with ellipsis when over the limit', () => {
    expect(truncate('hello world', 5)).toBe('hell…')
  })

  it('truncates a 110-char string to 100 chars including ellipsis', () => {
    const result = truncate('a'.repeat(110), 100)
    expect(result).toHaveLength(100)
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('formatCategory()', () => {
  it('formats web-app', () => expect(formatCategory('web-app')).toBe('Web App'))
  it('formats api', () => expect(formatCategory('api')).toBe('API'))
  it('formats tool', () => expect(formatCategory('tool')).toBe('Tool'))
  it('formats open-source', () => expect(formatCategory('open-source')).toBe('Open Source'))
  it('passes through unknown categories unchanged', () => {
    expect(formatCategory('other')).toBe('other')
  })
})
