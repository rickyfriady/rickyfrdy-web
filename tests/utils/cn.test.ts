import { describe, expect, it } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates tailwind conflicts (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })
})
