/**
 * The world's clock, read and never stored.
 *
 * Every function here takes the moment it is asked about as an argument rather
 * than reading `new Date()` itself, so a test can pin December at midnight and
 * the page passes the real now. Nothing is persisted: a visitor returning after
 * any interval sees the world as it is, with no resumed or stale state.
 *
 * Each source degrades on its own. No activity data means settled weather, an
 * undated project means a defined middle stage, and neither touches the season
 * or the hour.
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type TimeOfDay = 'day' | 'night'
export type Growth = 'seedling' | 'growing' | 'ripe'
export type Weather = 'clear' | 'cloudy' | 'rain' | 'settled'

export const SEASONS: readonly Season[] = ['spring', 'summer', 'autumn', 'winter']

/**
 * Meteorological seasons, northern calendar: March to May is spring. The
 * valley is a fiction with four seasons; Jakarta's wet and dry would give it
 * two, and a site that looked the same eight months running would not read as
 * changing with time at all.
 */
export function seasonOf(date: Date): Season {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

/** Day is 06:00 to 17:59 on the visitor's own clock. */
export function timeOfDay(date: Date): TimeOfDay {
  const hour = date.getHours()
  return hour >= 6 && hour < 18 ? 'day' : 'night'
}

const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000

/**
 * How grown a project's crop is, from the project's own date.
 *
 * Recent work is a seedling and work older than eighteen months is ripe. An
 * unparseable or future date gets `growing`: a defined stage rather than a
 * missing crop, and one that makes no claim about age in either direction.
 */
export function growthOf(projectDate: string | undefined, now: Date): Growth {
  if (!projectDate) return 'growing'
  const made = Date.parse(projectDate)
  if (Number.isNaN(made) || made > now.getTime()) return 'growing'
  const months = (now.getTime() - made) / MONTH_MS
  if (months < 6) return 'seedling'
  if (months < 18) return 'growing'
  return 'ripe'
}

/**
 * Weather from the last seven days of real contributions.
 *
 * A busy week is clear, a quiet one cloudy, a silent one rain. `null`, or a
 * calendar with no activity at all, means the activity could not be read, and
 * that is `settled`: fair weather that says nothing, never invented numbers
 * and never a broken sky.
 */
export function weatherFrom(
  days: readonly { date: string; count: number }[] | null,
  now: Date
): Weather {
  if (!days || days.length === 0) return 'settled'
  // A whole calendar of zeros is a source that cannot see the activity (a
  // public-only view of private work), not a year of silence. Rain on that
  // would be a claim the data does not support.
  if (days.every((d) => d.count === 0)) return 'settled'
  const since = now.getTime() - 7 * 24 * 60 * 60 * 1000
  const week = days
    .filter((d) => {
      const t = Date.parse(d.date)
      return t > since && t <= now.getTime()
    })
    .reduce((sum, d) => sum + d.count, 0)
  if (week >= 10) return 'clear'
  if (week > 0) return 'cloudy'
  return 'rain'
}
