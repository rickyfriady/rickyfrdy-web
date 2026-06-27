import { useCallback, useRef } from 'react'
import type { ContributionDay, GitHubStats } from '@/models'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

function getLevelPattern(level: number): string {
  switch (level) {
    case 0:
      return 'none'
    case 1:
      return 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)'
    case 2:
      return 'repeating-linear-gradient(45deg, transparent, transparent 1px, currentColor 1px, currentColor 3px)'
    case 3:
      return 'linear-gradient(45deg, currentColor 25%, transparent 25%)'
    case 4:
      return 'linear-gradient(45deg, currentColor 50%, transparent 50%)'
    default:
      return 'none'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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
  const stats = initialStats
  const tableRef = useRef<HTMLTableElement>(null)

  const weeks = groupByWeek(stats.contributionCalendar)
  const monthLabels = alignMonthLabels(weeks)

  const statItems = [
    { label: 'Contributions', value: stats.totalContributions },
    { label: 'Current Streak', value: stats.currentStreak },
    { label: 'Longest Streak', value: stats.longestStreak },
    ...(stats.publicRepos > 0 ? [{ label: 'Repos', value: stats.publicRepos }] : []),
    ...(stats.followers > 0 ? [{ label: 'Followers', value: stats.followers }] : [])
  ]

  // Arrow-key navigation within the table grid
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableCellElement>, weekIdx: number, dayIdx: number) => {
      const arrows: Record<string, [number, number]> = {
        ArrowRight: [weekIdx + 1, dayIdx],
        ArrowLeft: [weekIdx - 1, dayIdx],
        ArrowDown: [weekIdx, dayIdx + 1],
        ArrowUp: [weekIdx, dayIdx - 1]
      }
      const target = arrows[e.key]
      if (!target) return
      e.preventDefault()
      const [nw, nd] = target
      if (nw < 0 || nw >= weeks.length || nd < 0 || nd > 6) return
      const cell = tableRef.current?.querySelector<HTMLElement>(
        `[data-week="${nw}"][data-day="${nd}"]`
      )
      cell?.focus()
    },
    [weeks.length]
  )

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 md:p-6">
      {/* Stats strip */}
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {statItems.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <span className="text-accent font-mono text-lg md:text-xl font-bold tabular-nums leading-none">
              {item.value}
            </span>
            <span className="text-muted font-mono text-[9px] uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap table */}
      <div className="overflow-x-auto pb-3 scrollbar-none">
        <table
          ref={tableRef}
          aria-label="GitHub contribution heatmap"
          className="border-separate"
          style={{ borderSpacing: '2px' }}
        >
          <caption className="sr-only">
            GitHub contributions over the past year — use arrow keys to navigate cells
          </caption>

          {/* Month column headers */}
          <thead>
            <tr>
              {/* Empty corner cell above day-of-week labels */}
              <td aria-hidden="true" className="w-8" />
              {monthLabels.map((m) => (
                <th
                  key={m.label}
                  scope="col"
                  colSpan={m.span}
                  className="text-left font-mono text-[9px] font-medium uppercase tracking-wider text-muted pb-1.5"
                  style={{ width: `${m.span * 14}px` }}
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 7 rows = Sun–Sat */}
            {DAY_LABELS.map((day, dayIdx) => (
              <tr key={day}>
                {/* Row header: day label (only Mon/Wed/Fri visible) */}
                <th
                  scope="row"
                  className={`pr-2 font-mono text-[8px] font-medium uppercase tracking-wider text-muted/60 text-right${
                    dayIdx % 2 === 0 ? ' invisible' : ''
                  }`}
                  aria-label={day}
                >
                  {day.slice(0, 3)}
                </th>

                {weeks.map((week, weekIdx) => {
                  const d = week[dayIdx]
                  if (!d) {
                    return (
                      <td
                        key={`pad-${day}-col${weeks[weekIdx]?.[0]?.date ?? weekIdx}`}
                        aria-hidden="true"
                        className="h-[10px] w-[10px] md:h-[10px] md:w-[10px]"
                      />
                    )
                  }
                  return (
                    <td
                      key={d.date}
                      data-week={weekIdx}
                      data-day={dayIdx}
                      tabIndex={weekIdx === 0 && dayIdx === 0 ? 0 : -1}
                      aria-label={`${d.count} contribution${d.count !== 1 ? 's' : ''} on ${formatDate(d.date)}`}
                      title={`${d.count} contributions on ${formatDate(d.date)}`}
                      onKeyDown={(e) => handleKeyDown(e, weekIdx, dayIdx)}
                      className={`${getColorClass(d.level)} h-[12px] w-[12px] md:h-[10px] md:w-[10px] cursor-default rounded-[2px] transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:scale-125 hover:scale-125 hover:ring-2 hover:ring-accent`}
                      style={{ backgroundImage: getLevelPattern(d.level) }}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-2 text-[9px] text-muted/60" aria-hidden="true">
          <span>Less</span>
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`${getColorClass(level)} h-[10px] w-[10px] rounded-[2px]`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 border-t border-border/40 pt-3 text-center">
        <a
          href="https://github.com/rickyfriady"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          aria-label="View GitHub profile"
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View GitHub Profile
        </a>
      </div>
    </div>
  )
}
