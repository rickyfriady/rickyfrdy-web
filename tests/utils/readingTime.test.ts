import { describe, expect, it } from 'vitest'
import { readingTime } from '@/utils/readingTime'

describe('readingTime()', () => {
  it('returns "1 min read" for empty string', () => {
    expect(readingTime('')).toBe('1 min read')
  })

  it('returns "1 min read" for a 200-word body', () => {
    const body = Array(200).fill('word').join(' ')
    expect(readingTime(body)).toBe('1 min read')
  })

  it('returns "2 min read" for a 201-word body', () => {
    const body = Array(201).fill('word').join(' ')
    expect(readingTime(body)).toBe('2 min read')
  })

  it('returns "5 min read" for a 1000-word body', () => {
    const body = Array(1000).fill('word').join(' ')
    expect(readingTime(body)).toBe('5 min read')
  })
})
