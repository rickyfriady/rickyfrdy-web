import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ContributionDay } from '@/utils/github'
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalContributions,
  fetchBuildTimeStats,
  fetchProxyStats,
  fetchRecentEvents,
  generateMockContributions,
  getContributionLevel,
  mapGraphQLLevel,
  mapProxyContributions
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

describe('mapGraphQLLevel()', () => {
  it('maps NONE to 0', () => expect(mapGraphQLLevel('NONE')).toBe(0))
  it('maps FIRST_QUARTILE to 1', () => expect(mapGraphQLLevel('FIRST_QUARTILE')).toBe(1))
  it('maps SECOND_QUARTILE to 2', () => expect(mapGraphQLLevel('SECOND_QUARTILE')).toBe(2))
  it('maps THIRD_QUARTILE to 3', () => expect(mapGraphQLLevel('THIRD_QUARTILE')).toBe(3))
  it('maps FOURTH_QUARTILE to 4', () => expect(mapGraphQLLevel('FOURTH_QUARTILE')).toBe(4))
  it('maps unknown strings to 0', () => expect(mapGraphQLLevel('UNKNOWN')).toBe(0))
})

describe('mapProxyContributions()', () => {
  it('maps proxy items to ContributionDay[]', () => {
    const result = mapProxyContributions([{ date: '2025-01-01', count: 3, level: 2 }])
    expect(result).toEqual([{ date: '2025-01-01', count: 3, level: 2 }])
  })
  it('slices to last 365 when given more than 365 items', () => {
    const input = Array.from({ length: 400 }, (_, i) => ({
      date: `2025-01-01`,
      count: i % 10,
      level: 0 as const
    }))
    expect(mapProxyContributions(input)).toHaveLength(365)
  })
  it('returns all items when fewer than 365', () => {
    const input = [{ date: '2025-01-01', count: 0, level: 0 as const }]
    expect(mapProxyContributions(input)).toHaveLength(1)
  })
})

describe('mockFallback via fetchBuildTimeStats(null)', () => {
  it('returns full GitHubStats shape when no token', async () => {
    const stats = await fetchBuildTimeStats(undefined)
    expect(stats).toHaveProperty('totalContributions')
    expect(stats).toHaveProperty('currentStreak')
    expect(stats).toHaveProperty('longestStreak')
    expect(stats).toHaveProperty('publicRepos', 12)
    expect(stats).toHaveProperty('followers', 0)
    expect(stats).toHaveProperty('following', 0)
    expect(stats).toHaveProperty('contributionCalendar')
    expect(stats).toHaveProperty('pinnedRepos')
    expect(stats).toHaveProperty('languages')
  })

  it('mock calendar has 365 days', async () => {
    const stats = await fetchBuildTimeStats(undefined)
    expect(stats.contributionCalendar).toHaveLength(365)
  })

  it('mock pinned repos contains expected entries', async () => {
    const stats = await fetchBuildTimeStats(undefined)
    expect(stats.pinnedRepos).toHaveLength(2)
    expect(stats.pinnedRepos[0].name).toBe('rickyfrdy-web')
    expect(stats.pinnedRepos[0].primaryLanguage?.name).toBe('TypeScript')
  })

  it('mock languages has top 5 entries', async () => {
    const stats = await fetchBuildTimeStats(undefined)
    expect(stats.languages).toHaveLength(5)
    expect(stats.languages[0].name).toBe('TypeScript')
    expect(stats.languages[0].percentage).toBe(68)
  })

  it('mock languages percentages sum to 100', async () => {
    const stats = await fetchBuildTimeStats(undefined)
    const total = stats.languages.reduce((s, l) => s + l.percentage, 0)
    expect(total).toBe(100)
  })
})

describe('fetchProxyStats()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('parses proxy response into GitHubStats', async () => {
    const mockDays = Array.from({ length: 365 }, (_, i) => ({
      date: `2025-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      count: Math.floor(Math.random() * 8),
      level: 0
    }))
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contributions: mockDays })
    } as Response)

    const stats = await fetchProxyStats()
    expect(stats.contributionCalendar).toHaveLength(365)
    expect(typeof stats.totalContributions).toBe('number')
    expect(typeof stats.currentStreak).toBe('number')
    expect(typeof stats.longestStreak).toBe('number')
    // Proxy returns 0 for these
    expect(stats.publicRepos).toBe(0)
    expect(stats.followers).toBe(0)
    expect(stats.pinnedRepos).toEqual([])
    expect(stats.languages).toEqual([])
  })

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403
    } as Response)
    await expect(fetchProxyStats()).rejects.toThrow('Proxy 403')
  })
})

describe('fetchRecentEvents()', () => {
  const mockEvents = [
    {
      id: '1',
      type: 'PushEvent',
      repo: {
        name: 'rickyfriady/some-repo',
        url: 'https://api.github.com/repos/rickyfriady/some-repo'
      },
      payload: { commits: [{ message: 'fix: resolve auth bug\n\nDetails here' }] },
      created_at: '2025-06-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'CreateEvent',
      repo: {
        name: 'rickyfriady/new-project',
        url: 'https://api.github.com/repos/rickyfriady/new-project'
      },
      payload: { ref_type: 'branch', ref: 'feat/foo' },
      created_at: '2025-06-14T08:00:00Z'
    },
    {
      id: '3',
      type: 'PullRequestEvent',
      repo: {
        name: 'rickyfriady/other-repo',
        url: 'https://api.github.com/repos/rickyfriady/other-repo'
      },
      payload: { action: 'opened', pull_request: { title: 'Add new feature' } },
      created_at: '2025-06-13T12:00:00Z'
    },
    {
      id: '4',
      type: 'WatchEvent',
      repo: {
        name: 'external/awesome-lib',
        url: 'https://api.github.com/repos/external/awesome-lib'
      },
      payload: {},
      created_at: '2025-06-12T09:00:00Z'
    },
    {
      id: '5',
      type: 'ForkEvent',
      repo: {
        name: 'rickyfriady/forked-repo',
        url: 'https://api.github.com/repos/rickyfriady/forked-repo'
      },
      payload: {},
      created_at: '2025-06-11T16:00:00Z'
    }
  ]

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('parses PushEvent correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[0].type).toBe('push')
    expect(events[0].message).toBe('fix: resolve auth bug')
    expect(events[0].repo).toBe('some-repo')
  })

  it('parses CreateEvent correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[1].type).toBe('create')
    expect(events[1].message).toBe('Created branch feat/foo')
  })

  it('parses PullRequestEvent correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[2].type).toBe('pr')
    expect(events[2].message).toBe('Add new feature')
  })

  it('parses WatchEvent as star type', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[3].type).toBe('star')
  })

  it('parses ForkEvent as fork type', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[4].type).toBe('fork')
  })

  it('strips owner prefix from repo name', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[0].repo).toBe('some-repo')
    expect(events[4].repo).toBe('forked-repo')
  })

  it('truncates commit message at first newline, max 72 chars', async () => {
    const longMsg = { ...mockEvents[0] }
    longMsg.payload.commits = [{ message: 'a'.repeat(100) }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([longMsg])
    } as Response)
    const events = await fetchRecentEvents()
    expect(events[0].message.length).toBeLessThanOrEqual(72)
  })

  it('returns at most 10 events', async () => {
    const manyEvents = Array.from({ length: 20 }, (_, i) => ({
      ...mockEvents[0],
      id: String(i),
      repo: { name: `rickyfriady/repo-${i}`, url: '' },
      payload: {}
    }))
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(manyEvents)
    } as Response)
    const events = await fetchRecentEvents()
    expect(events).toHaveLength(10)
  })

  it('returns empty array on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    const events = await fetchRecentEvents()
    expect(events).toEqual([])
  })

  it('returns empty array on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403
    } as Response)
    const events = await fetchRecentEvents()
    expect(events).toEqual([])
  })
})
