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
  level: 0 | 1 | 2 | 3 | 4
}

export function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 6) return 3
  return 4
}

export function calculateTotalContributions(calendar: ContributionDay[]): number {
  return calendar.reduce((sum, day) => sum + day.count, 0)
}

export function calculateCurrentStreak(calendar: ContributionDay[]): number {
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

export function calculateLongestStreak(calendar: ContributionDay[]): number {
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

export function generateMockContributions(): ContributionDay[] {
  const contributions: ContributionDay[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
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

const GITHUB_USERNAME = 'rickyfrdy'
const CACHE_KEY = 'github-stats-cache'
const CACHE_DURATION = 5 * 60 * 1000

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached) as { data: GitHubStats; timestamp: number }
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed.data
      }
    }
  } catch {
    // ignore corrupt cache
  }

  const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
  if (!userResponse.ok) {
    throw new Error('Failed to fetch GitHub user data')
  }
  const userData = (await userResponse.json()) as { public_repos: number; followers: number }

  const contributionCalendar = generateMockContributions()

  const stats: GitHubStats = {
    totalContributions: calculateTotalContributions(contributionCalendar),
    currentStreak: calculateCurrentStreak(contributionCalendar),
    longestStreak: calculateLongestStreak(contributionCalendar),
    publicRepos: userData.public_repos,
    followers: userData.followers,
    contributionCalendar
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: stats, timestamp: Date.now() }))
  } catch {
    // ignore storage errors
  }

  return stats
}
