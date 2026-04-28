import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export interface GitHubStats {
  totalContributions: number
  currentStreak: number
  longestStreak: number
  publicRepos: number
  followers: number
  contributionCalendar: ContributionDay[]
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4 // 0 = no contributions, 4 = highest
}

const GITHUB_USERNAME = 'rickyfrdy'
const CACHE_KEY = 'github-stats-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useGitHub() {
  const stats = ref<GitHubStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Cache with timestamp
  const cachedData = useStorage<{ data: GitHubStats; timestamp: number } | null>(CACHE_KEY, null)

  async function fetchGitHubStats() {
    loading.value = true
    error.value = null

    try {
      // Check cache first
      if (cachedData.value) {
        const age = Date.now() - cachedData.value.timestamp
        if (age < CACHE_DURATION) {
          stats.value = cachedData.value.data
          loading.value = false
          return
        }
      }

      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)

      if (!userResponse.ok) {
        throw new Error('Failed to fetch GitHub user data')
      }

      const userData = await userResponse.json()

      // Generate contribution calendar (last 365 days)
      const contributionCalendar = generateMockContributions()

      const githubStats: GitHubStats = {
        totalContributions: calculateTotalContributions(contributionCalendar),
        currentStreak: calculateCurrentStreak(contributionCalendar),
        longestStreak: calculateLongestStreak(contributionCalendar),
        publicRepos: userData.public_repos,
        followers: userData.followers,
        contributionCalendar
      }

      stats.value = githubStats

      // Update cache
      cachedData.value = {
        data: githubStats,
        timestamp: Date.now()
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'

      // Use cached data if available
      if (cachedData.value) {
        stats.value = cachedData.value.data
      }
    } finally {
      loading.value = false
    }
  }

  // Generate mock contribution data
  // In production, you'd use GitHub GraphQL API for real data
  function generateMockContributions(): ContributionDay[] {
    const contributions: ContributionDay[] = []
    const today = new Date()

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Generate realistic contribution pattern
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // More contributions on weekdays
      const baseCount = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8)

      const count = Math.random() > 0.3 ? baseCount : 0

      contributions.push({
        date: date.toISOString().split('T')[0],
        count,
        level: getContributionLevel(count)
      })
    }

    return contributions
  }

  function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 4) return 2
    if (count <= 6) return 3
    return 4
  }

  function calculateTotalContributions(calendar: ContributionDay[]): number {
    return calendar.reduce((sum, day) => sum + day.count, 0)
  }

  function calculateCurrentStreak(calendar: ContributionDay[]): number {
    let streak = 0
    for (let i = calendar.length - 1; i >= 0; i--) {
      if (calendar[i].count > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  function calculateLongestStreak(calendar: ContributionDay[]): number {
    let maxStreak = 0
    let currentStreak = 0

    for (const day of calendar) {
      if (day.count > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    return maxStreak
  }

  return {
    stats,
    loading,
    error,
    fetchGitHubStats
  }
}
