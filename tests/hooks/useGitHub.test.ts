import { useGitHub } from '@/hooks/useGitHub'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useGitHub', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          public_repos: 42,
          followers: 7
        })
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('fetches and maps GitHub stats', async () => {
    const github = useGitHub()

    await github.fetchGitHubStats()

    expect(github.error.value).toBeNull()
    expect(github.loading.value).toBe(false)
    expect(github.stats.value).not.toBeNull()
    expect(github.stats.value?.publicRepos).toBe(42)
    expect(github.stats.value?.followers).toBe(7)
    expect(github.stats.value?.contributionCalendar).toHaveLength(365)
  })
})
