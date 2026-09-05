import type { Stat } from '@/models'
import { SKILL_ICON } from '@/utils/skillIcon'

/**
 * Player stats derived from real data.
 *
 * `skills.ts` carries only `{ name, icon }` — no proficiency field anywhere in
 * the codebase. Any level invented on top of that would be a number a recruiter
 * could read as a claim, backed by nothing. So a level is a bounded function of
 * two signals that genuinely exist: how many projects and experience entries
 * list the technology, and the span of years it appears across.
 *
 * The current year is a *parameter*, not a clock read. `'Present'` otherwise
 * makes the derivation depend on build date and impossible to pin in a test.
 *
 * Names are canonicalised through the existing `SKILL_ICON` map before counting.
 * The source data spells the same technology several ways — `Vue 3`, `Vue.js`,
 * `Vue` — and counting those separately splits one technology's evidence three
 * ways, which pushes the work the site actually leads with off the sheet.
 */
export const MAX_LEVEL = 10
export const MIN_LEVEL = 1

export interface StatProject {
  technologies: string[]
}

export interface StatExperience {
  stack: string[]
  /** e.g. `'May 2023 – Present'` or `'2020'`. */
  period: string
}

/** First and last 4-digit year in a period string; `Present` is the given year. */
export function parsePeriodYears(period: string, currentYear: number): [number, number] {
  const years = (period.match(/\d{4}/g) ?? []).map(Number)
  if (years.length === 0) return [currentYear, currentYear]
  const start = years[0]
  const end = /present|sekarang/i.test(period) ? currentYear : years[years.length - 1]
  return [start, Math.max(start, end)]
}

/** Same technology, one entry. Falls back to the name when no alias is known. */
export function canonicalKey(name: string, aliases: Record<string, string> = SKILL_ICON): string {
  return aliases[name] ?? name.trim().toLowerCase()
}

export function levelFor(uses: number, years: number): number {
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, 1 + uses + Math.floor(years)))
}

/**
 * Deterministic: same input, same output, every time. Sorted by level then
 * name so the sheet does not reshuffle between builds.
 */
export function deriveStats(
  projects: readonly StatProject[],
  experiences: readonly StatExperience[],
  currentYear: number,
  // Eight, not six: PHP and CodeIgniter are legitimately in the current stack
  // (they are the legacy being migrated away from) and score high on years, so
  // a six-row sheet showed only those and hid the work the site leads with.
  // Widening the window is honest; reweighting the formula to get a nicer
  // answer would not be.
  limit = 8,
  aliases: Record<string, string> = SKILL_ICON
): Stat[] {
  interface Bucket {
    names: Map<string, number>
    uses: number
    span?: [number, number]
  }
  const buckets = new Map<string, Bucket>()

  const record = (name: string, range?: [number, number]) => {
    const key = canonicalKey(name, aliases)
    const bucket: Bucket = buckets.get(key) ?? { names: new Map<string, number>(), uses: 0 }
    bucket.uses += 1
    bucket.names.set(name, (bucket.names.get(name) ?? 0) + 1)
    if (range) {
      bucket.span = bucket.span
        ? [Math.min(bucket.span[0], range[0]), Math.max(bucket.span[1], range[1])]
        : range
    }
    buckets.set(key, bucket)
  }

  for (const project of projects) {
    for (const tech of project.technologies) record(tech)
  }

  for (const entry of experiences) {
    const range = parsePeriodYears(entry.period, currentYear)
    for (const tech of entry.stack) record(tech, range)
  }

  const stats: Stat[] = [...buckets.values()].map((bucket) => {
    // The spelling used most often wins, alphabetical on a tie, so the label is
    // stable across builds rather than dependent on iteration order.
    const name = [...bucket.names.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )[0][0]
    const years = bucket.span ? bucket.span[1] - bucket.span[0] + 1 : 0
    return { name, uses: bucket.uses, years, level: levelFor(bucket.uses, years) }
  })

  stats.sort((a, b) => b.level - a.level || b.uses - a.uses || a.name.localeCompare(b.name))
  return stats.slice(0, limit)
}
