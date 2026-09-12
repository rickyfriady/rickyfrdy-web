/**
 * Date maths for the range picker, kept as pure functions over `YYYY-MM-DD`
 * strings so the component holds no calendar logic and the arithmetic is
 * testable without rendering.
 *
 * Every Date built here is UTC midnight. A local-midnight Date shifts by an
 * hour across a DST boundary, which is enough to make a day-difference divide
 * to 6.96 and round a week down to six nights.
 */

export type ISODate = string

const DAY_MS = 86_400_000

export const toISO = (d: Date): ISODate => d.toISOString().slice(0, 10)

export const fromISO = (iso: ISODate): Date => new Date(`${iso}T00:00:00Z`)

export function todayISO(now: Date = new Date()): ISODate {
  return toISO(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

export function addDays(iso: ISODate, n: number): ISODate {
  return toISO(new Date(fromISO(iso).getTime() + n * DAY_MS))
}

export function nightsBetween(from: ISODate, to: ISODate): number {
  return Math.round((fromISO(to).getTime() - fromISO(from).getTime()) / DAY_MS)
}

/** The same date if it already is a Friday, otherwise the next one. */
export function nextFriday(iso: ISODate): ISODate {
  return addDays(iso, (5 - fromISO(iso).getUTCDay() + 7) % 7)
}

/**
 * One month as a Monday-first grid: leading `null`s for the days that belong
 * to the previous month, then every day of this one. No trailing filler, so a
 * short month simply ends the last row early instead of showing dates the
 * picker would have to disable anyway.
 */
export function monthGrid(year: number, month: number): (ISODate | null)[] {
  const first = new Date(Date.UTC(year, month, 1))
  const lead = (first.getUTCDay() + 6) % 7
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length }, (_, i) => toISO(new Date(Date.UTC(year, month, i + 1))))
  ]
}

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC'
})
const monthYear = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
})
const full = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
})

export const formatDayMonth = (iso: ISODate) => dayMonth.format(fromISO(iso))
export const formatMonthYear = (iso: ISODate) => monthYear.format(fromISO(iso))
export const formatFull = (iso: ISODate) => full.format(fromISO(iso))
