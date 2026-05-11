import { useCallback, useEffect, useState } from 'react'
import type { ContributionDay, GitHubStats } from '@/utils/github'
import { fetchGitHubStats } from '@/utils/github'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getColorClass(level: number): string {
  const colors: Record<number, string> = {
    0: 'bg-muted/30',
    1: 'bg-accent/30',
    2: 'bg-accent/50',
    3: 'bg-accent/70',
    4: 'bg-accent'
  }
  return colors[level] ?? colors[0]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function groupByWeek(calendar: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7))
  }
  return weeks
}

export default function GitHubHeatmap() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGitHubStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const weeks = stats ? groupByWeek(stats.contributionCalendar) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted">Consistency and commitment to continuous learning</p>
        </div>
        {stats && (
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-accent text-2xl font-bold">{stats.totalContributions}</div>
              <div className="text-muted">Total Contributions</div>
            </div>
            <div>
              <div className="text-accent text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-muted">Current Streak</div>
            </div>
            <div>
              <div className="text-accent text-2xl font-bold">{stats.longestStreak}</div>
              <div className="text-muted">Longest Streak</div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="bg-muted/30 h-4 w-full rounded" />
          <div className="bg-muted/30 h-32 w-full rounded" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-500">Failed to load GitHub data: {error}</p>
          <button type="button" onClick={load} className="text-accent mt-2 text-sm hover:underline">
            Try again
          </button>
        </div>
      )}

      {!loading && stats && (
        <div className="overflow-x-auto pb-4 scrollbar-none">
          <div className="inline-block min-w-full">
            <div className="text-muted mb-2 flex pl-8 text-xs">
              {MONTHS.map((month) => (
                <div key={month} className="flex-none" style={{ width: `${100 / 12}%` }}>
                  {month}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              <div className="text-muted flex flex-col justify-around gap-1 pr-2 text-xs">
                <div>Mon</div>
                <div>Wed</div>
                <div>Fri</div>
              </div>

              <div className="flex gap-1">
                {weeks.map((week) => (
                  <div key={week[0]?.date ?? week.length} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`${getColorClass(day.level)} hover:ring-accent h-3 w-3 cursor-pointer rounded-sm transition-all hover:scale-125 hover:ring-2`}
                        title={`${day.count} contributions on ${formatDate(day.date)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-muted mt-4 flex items-center gap-2 text-xs">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`${getColorClass(level)} h-3 w-3 rounded-sm`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="text-center">
          <a
            href="https://github.com/rickyfrdy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent inline-flex items-center gap-2 text-sm hover:underline"
          >
            View full profile on GitHub
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
