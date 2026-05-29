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

export function mapGraphQLLevel(level: string): 0 | 1 | 2 | 3 | 4 {
  const map: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4
  }
  return map[level] ?? 0
}

interface ProxyDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function mapProxyContributions(contributions: ProxyDay[]): ContributionDay[] {
  return contributions.slice(-365).map((d) => ({
    date: d.date,
    count: d.count,
    level: d.level
  }))
}

const GITHUB_USERNAME = 'rickyfrdy'

const GRAPHQL_URL = 'https://api.github.com/graphql'

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

function mockFallback(): GitHubStats {
  const contributionCalendar = generateMockContributions()
  return {
    totalContributions: calculateTotalContributions(contributionCalendar),
    currentStreak: calculateCurrentStreak(contributionCalendar),
    longestStreak: calculateLongestStreak(contributionCalendar),
    publicRepos: 0,
    followers: 0,
    contributionCalendar
  }
}

export async function fetchBuildTimeStats(token: string | undefined): Promise<GitHubStats> {
  if (!token) return mockFallback()

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: { username: GITHUB_USERNAME }
      })
    })
    if (!res.ok) throw new Error(`GraphQL ${res.status}`)

    const json = (await res.json()) as {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number
              weeks: Array<{
                contributionDays: Array<{
                  date: string
                  contributionCount: number
                  contributionLevel: string
                }>
              }>
            }
          }
        }
      }
    }

    const cal = json.data.user.contributionsCollection.contributionCalendar
    const contributionCalendar: ContributionDay[] = cal.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: mapGraphQLLevel(d.contributionLevel)
      }))

    return {
      totalContributions: cal.totalContributions,
      currentStreak: calculateCurrentStreak(contributionCalendar),
      longestStreak: calculateLongestStreak(contributionCalendar),
      publicRepos: 0,
      followers: 0,
      contributionCalendar
    }
  } catch {
    return mockFallback()
  }
}

const PROXY_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`

export async function fetchProxyStats(): Promise<GitHubStats> {
  const res = await fetch(PROXY_URL)
  if (!res.ok) throw new Error(`Proxy ${res.status}`)
  const json = (await res.json()) as { contributions: ProxyDay[] }
  const contributionCalendar = mapProxyContributions(json.contributions)
  return {
    totalContributions: calculateTotalContributions(contributionCalendar),
    currentStreak: calculateCurrentStreak(contributionCalendar),
    longestStreak: calculateLongestStreak(contributionCalendar),
    publicRepos: 0,
    followers: 0,
    contributionCalendar
  }
}
