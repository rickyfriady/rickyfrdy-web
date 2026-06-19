export interface GitHubStats {
  totalContributions: number
  currentStreak: number
  longestStreak: number
  publicRepos: number
  followers: number
  following: number
  contributionCalendar: ContributionDay[]
  pinnedRepos: PinnedRepo[]
  languages: LanguageStat[]
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface PinnedRepo {
  name: string
  description: string | null
  url: string
  stars: number
  forks: number
  primaryLanguage: { name: string; color: string } | null
  topics: string[]
}

export interface LanguageStat {
  name: string
  color: string
  percentage: number
}

export interface RecentEvent {
  id: string
  type: 'push' | 'create' | 'pr' | 'star' | 'fork' | 'other'
  repo: string
  repoUrl: string
  message: string
  date: string
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

const GITHUB_USERNAME = 'rickyfriady'

const GRAPHQL_URL = 'https://api.github.com/graphql'

const FULL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      followers { totalCount }
      following { totalCount }
      repositories(first: 1, isFork: false) { totalCount }
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
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
            repositoryTopics(first: 3) {
              nodes { topic { name } }
            }
          }
        }
      }
      repositories(
        first: 10
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
        privacy: PUBLIC
      ) {
        nodes {
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
    }
  }
`

/** Aggregate language bytes across repos and return top 5 as percentages */
function aggregateLanguages(
  repos: Array<{
    languages: {
      edges: Array<{ size: number; node: { name: string; color: string } }>
    }
  }>
): LanguageStat[] {
  const totals = new Map<string, { bytes: number; color: string }>()
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name)
      totals.set(edge.node.name, {
        bytes: (existing?.bytes ?? 0) + edge.size,
        color: edge.node.color
      })
    }
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 5)
  const total = sorted.reduce((s, [, v]) => s + v.bytes, 0)
  if (total === 0) return []
  return sorted.map(([name, { bytes, color }]) => ({
    name,
    color: color ?? '#64748b',
    percentage: Math.round((bytes / total) * 100)
  }))
}

function mockFallback(): GitHubStats {
  const contributionCalendar = generateMockContributions()
  return {
    totalContributions: calculateTotalContributions(contributionCalendar),
    currentStreak: calculateCurrentStreak(contributionCalendar),
    longestStreak: calculateLongestStreak(contributionCalendar),
    publicRepos: 12,
    followers: 0,
    following: 0,
    contributionCalendar,
    pinnedRepos: [
      {
        name: 'rickyfrdy-web',
        description: 'Personal portfolio built with Astro, Tailwind, GSAP, and Framer Motion.',
        url: 'https://github.com/rickyfriady/rickyfrdy-web',
        stars: 2,
        forks: 0,
        primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
        topics: ['astro', 'tailwind', 'portfolio']
      },
      {
        name: 'nestjs-factory-microservices',
        description: 'NestJS microservices with Factory pattern for loan product management.',
        url: 'https://github.com/rickyfriady/nestjs-factory-microservices',
        stars: 4,
        forks: 1,
        primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
        topics: ['nestjs', 'microservices', 'factory-pattern']
      }
    ],
    languages: [
      { name: 'TypeScript', color: '#3178c6', percentage: 68 },
      { name: 'Vue', color: '#41b883', percentage: 15 },
      { name: 'CSS', color: '#563d7c', percentage: 9 },
      { name: 'JavaScript', color: '#f1e05a', percentage: 5 },
      { name: 'Shell', color: '#89e051', percentage: 3 }
    ]
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
        query: FULL_QUERY,
        variables: { username: GITHUB_USERNAME }
      })
    })
    if (!res.ok) throw new Error(`GraphQL ${res.status}`)

    const json = (await res.json()) as {
      data: {
        user: {
          followers: { totalCount: number }
          following: { totalCount: number }
          repositories: {
            totalCount: number
            nodes: Array<{
              languages: {
                edges: Array<{ size: number; node: { name: string; color: string } }>
              }
            }>
          }
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
          pinnedItems: {
            nodes: Array<{
              name: string
              description: string | null
              url: string
              stargazerCount: number
              forkCount: number
              primaryLanguage: { name: string; color: string } | null
              repositoryTopics: {
                nodes: Array<{ topic: { name: string } }>
              }
            }>
          }
        }
      }
    }

    const u = json.data.user
    const cal = u.contributionsCollection.contributionCalendar
    const contributionCalendar: ContributionDay[] = cal.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: mapGraphQLLevel(d.contributionLevel)
      }))

    const pinnedRepos: PinnedRepo[] = u.pinnedItems.nodes.map((r) => ({
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stargazerCount,
      forks: r.forkCount,
      primaryLanguage: r.primaryLanguage,
      topics: r.repositoryTopics.nodes.map((t) => t.topic.name)
    }))

    const languages = aggregateLanguages(u.repositories.nodes)

    return {
      totalContributions: cal.totalContributions,
      currentStreak: calculateCurrentStreak(contributionCalendar),
      longestStreak: calculateLongestStreak(contributionCalendar),
      publicRepos: u.repositories.totalCount,
      followers: u.followers.totalCount,
      following: u.following.totalCount,
      contributionCalendar,
      pinnedRepos,
      languages
    }
  } catch {
    return mockFallback()
  }
}

const PROXY_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`
const REST_BASE = 'https://api.github.com'

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
    following: 0,
    contributionCalendar,
    pinnedRepos: [],
    languages: []
  }
}

/** Fetch recent public events — no auth required (60 req/hr) */
export async function fetchRecentEvents(): Promise<RecentEvent[]> {
  try {
    const res = await fetch(`${REST_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=15`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (!res.ok) throw new Error(`Events ${res.status}`)

    const raw = (await res.json()) as Array<{
      id: string
      type: string
      repo: { name: string; url: string }
      payload: {
        ref?: string
        ref_type?: string
        action?: string
        commits?: Array<{ message: string }>
        pull_request?: { title: string }
      }
      created_at: string
    }>

    return raw.slice(0, 10).map((e) => {
      let type: RecentEvent['type'] = 'other'
      let message = ''

      if (e.type === 'PushEvent') {
        type = 'push'
        const msg = e.payload.commits?.[0]?.message ?? ''
        message = msg.split('\n')[0].slice(0, 72)
      } else if (e.type === 'CreateEvent') {
        type = 'create'
        message = `Created ${e.payload.ref_type ?? 'branch'} ${e.payload.ref ?? ''}`
      } else if (e.type === 'PullRequestEvent') {
        type = 'pr'
        message = e.payload.pull_request?.title ?? 'Pull request'
      } else if (e.type === 'WatchEvent') {
        type = 'star'
        message = 'Starred repo'
      } else if (e.type === 'ForkEvent') {
        type = 'fork'
        message = 'Forked repo'
      } else {
        message = e.type.replace('Event', '')
      }

      return {
        id: e.id,
        type,
        repo: e.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
        repoUrl: `https://github.com/${e.repo.name}`,
        message,
        date: e.created_at
      }
    })
  } catch {
    return []
  }
}
