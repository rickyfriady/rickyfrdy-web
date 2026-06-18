import { useEffect, useState } from 'react'
import type { ContributionDay, GitHubStats } from '@/utils/github'
import { fetchProxyStats } from '@/utils/github'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getColorClass(level: number): string {
  const colors: Record<number, string> = {
    0: 'bg-muted/20',
    1: 'bg-accent/25',
    2: 'bg-accent/45',
    3: 'bg-accent/65',
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

function alignMonthLabels(weeks: ContributionDay[][]): { label: string; span: number }[] {
  const labels: { label: string; span: number }[] = []
  let currentMonth = ''
  let span = 0
  for (const week of weeks) {
    const midDay = week[Math.min(week.length - 1, 3)]
    if (!midDay) continue
    const month = MONTHS[new Date(midDay.date).getMonth()]
    if (month === currentMonth) {
      span++
    } else {
      if (currentMonth) labels.push({ label: currentMonth, span })
      currentMonth = month
      span = 1
    }
  }
  if (currentMonth && span > 0) labels.push({ label: currentMonth, span })
  return labels
}

interface Props {
  initialStats: GitHubStats
}

export default function GitHubHeatmap({ initialStats }: Props) {
  const [stats, setStats] = useState<GitHubStats>(initialStats)

  useEffect(() => {
    fetchProxyStats()
      .then(setStats)
      .catch(() => {})
  }, [])

  const weeks = groupByWeek(stats.contributionCalendar)
  const monthLabels = alignMonthLabels(weeks)

  const statItems = [
    { label: 'Contributions', value: stats.totalContributions },
    { label: 'Current Streak', value: stats.currentStreak },
    { label: 'Longest Streak', value: stats.longestStreak },
    ...(stats.publicRepos > 0 ? [{ label: 'Repos', value: stats.publicRepos }] : []),
    ...(stats.followers > 0 ? [{ label: 'Followers', value: stats.followers }] : [])
  ]

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5 md:p-6">
      {/* Stats strip */}
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2">
        {statItems.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="text-accent font-mono text-xl font-bold tabular-nums leading-none">
              {item.value}
            </span>
            <span className="text-muted font-mono text-[10px] uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-3 scrollbar-none">
        <div className="inline-block min-w-full">
          {/* Month labels — aligned to week columns */}
          <div className="mb-1.5 flex pl-8 text-[10px] font-medium uppercase tracking-wider text-muted">
            {monthLabels.map((m) => (
              <div
                key={m.label}
                className="flex-none text-left"
                style={{ width: `${m.span * 16}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {/* Day-of-week labels */}
            <div className="flex flex-col justify-around gap-[3px] pr-2 text-[9px] font-medium uppercase tracking-wider text-muted/60">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week) => (
                <div key={week[0]?.date ?? 'empty'} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`${getColorClass(day.level)} hover:ring-accent h-[13px] w-[13px] cursor-pointer rounded-[3px] transition-all hover:scale-125 hover:ring-2`}
                      title={`${day.count} contributions on ${formatDate(day.date)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-muted/60">
            <span>Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`${getColorClass(level)} h-[13px] w-[13px] rounded-[3px]`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-5 border-t border-border/40 pt-4 text-center">
        <a
          href="https://github.com/rickyfrdy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View GitHub Profile
        </a>
      </div>
    </div>
  )
}
