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
