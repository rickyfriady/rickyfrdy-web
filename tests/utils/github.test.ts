import { describe, expect, it } from 'vitest'
import type { ContributionDay } from '@/utils/github'
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalContributions,
  generateMockContributions,
  getContributionLevel
} from '@/utils/github'

describe('getContributionLevel', () => {
  it('returns 0 for zero contributions', () => {
    expect(getContributionLevel(0)).toBe(0)
  })

  it('returns 1 for 1-2 contributions', () => {
    expect(getContributionLevel(1)).toBe(1)
    expect(getContributionLevel(2)).toBe(1)
  })

  it('returns 2 for 3-4 contributions', () => {
    expect(getContributionLevel(3)).toBe(2)
    expect(getContributionLevel(4)).toBe(2)
  })

  it('returns 3 for 5-6 contributions', () => {
    expect(getContributionLevel(5)).toBe(3)
    expect(getContributionLevel(6)).toBe(3)
  })

  it('returns 4 for 7+ contributions', () => {
    expect(getContributionLevel(7)).toBe(4)
    expect(getContributionLevel(20)).toBe(4)
  })
})

describe('calculateTotalContributions', () => {
  it('returns 0 for empty calendar', () => {
    expect(calculateTotalContributions([])).toBe(0)
  })

  it('sums all contribution counts', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 3, level: 2 },
      { date: '2025-01-02', count: 0, level: 0 },
      { date: '2025-01-03', count: 5, level: 3 }
    ]
    expect(calculateTotalContributions(calendar)).toBe(8)
  })
})

describe('calculateCurrentStreak', () => {
  it('returns 0 when last day has no contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 5, level: 3 },
      { date: '2025-01-02', count: 0, level: 0 }
    ]
    expect(calculateCurrentStreak(calendar)).toBe(0)
  })

  it('counts consecutive days from the end with contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 0, level: 0 },
      { date: '2025-01-02', count: 3, level: 2 },
      { date: '2025-01-03', count: 5, level: 3 },
      { date: '2025-01-04', count: 2, level: 1 }
    ]
    expect(calculateCurrentStreak(calendar)).toBe(3)
  })

  it('returns 0 for empty calendar', () => {
    expect(calculateCurrentStreak([])).toBe(0)
  })
})

describe('calculateLongestStreak', () => {
  it('returns 0 for empty calendar', () => {
    expect(calculateLongestStreak([])).toBe(0)
  })

  it('finds longest run of days with contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 2, level: 1 },
      { date: '2025-01-02', count: 2, level: 1 },
      { date: '2025-01-03', count: 0, level: 0 },
      { date: '2025-01-04', count: 1, level: 1 },
      { date: '2025-01-05', count: 3, level: 2 },
      { date: '2025-01-06', count: 4, level: 2 },
      { date: '2025-01-07', count: 2, level: 1 }
    ]
    expect(calculateLongestStreak(calendar)).toBe(4)
  })

  it('handles all-zero calendar', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 0, level: 0 },
      { date: '2025-01-02', count: 0, level: 0 }
    ]
    expect(calculateLongestStreak(calendar)).toBe(0)
  })
})

describe('generateMockContributions', () => {
  it('returns exactly 365 entries', () => {
    const result = generateMockContributions()
    expect(result).toHaveLength(365)
  })

  it('each entry has date, count, and level', () => {
    const result = generateMockContributions()
    for (const day of result) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof day.count).toBe('number')
      expect([0, 1, 2, 3, 4]).toContain(day.level)
    }
  })

  it('level matches count via getContributionLevel', () => {
    const result = generateMockContributions()
    for (const day of result) {
      expect(day.level).toBe(getContributionLevel(day.count))
    }
  })
})
