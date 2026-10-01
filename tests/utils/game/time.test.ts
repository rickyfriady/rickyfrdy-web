import { describe, expect, it } from 'vitest'
import { growthOf, seasonOf, timeOfDay, weatherFrom } from '@/utils/game/time'

const at = (iso: string) => new Date(iso)

describe('seasonOf()', () => {
  it.each([
    ['2026-03-01T00:00:00', 'spring'],
    ['2026-05-31T23:00:00', 'spring'],
    ['2026-06-01T00:00:00', 'summer'],
    ['2026-09-01T00:00:00', 'autumn'],
    ['2026-11-30T12:00:00', 'autumn'],
    ['2026-12-01T00:00:00', 'winter'],
    ['2026-02-28T12:00:00', 'winter']
  ])('%s is %s', (iso, season) => {
    expect(seasonOf(at(iso))).toBe(season)
  })
})

describe('timeOfDay()', () => {
  it.each([
    ['2026-07-01T05:59:00', 'night'],
    ['2026-07-01T06:00:00', 'day'],
    ['2026-07-01T17:59:00', 'day'],
    ['2026-07-01T18:00:00', 'night']
  ])('%s is %s', (iso, time) => {
    expect(timeOfDay(at(iso))).toBe(time)
  })
})

describe('growthOf()', () => {
  const now = at('2026-09-30T12:00:00')

  it('makes recent work a seedling and old work ripe, so age is visible', () => {
    expect(growthOf('2026-08-01', now)).toBe('seedling')
    expect(growthOf('2025-09-01', now)).toBe('growing')
    expect(growthOf('2020-09-01', now)).toBe('ripe')
  })

  it('gives an undated, unparseable or future project a defined stage instead of no crop', () => {
    expect(growthOf(undefined, now)).toBe('growing')
    expect(growthOf('not a date', now)).toBe('growing')
    expect(growthOf('2030-01-01', now)).toBe('growing')
  })
})

describe('weatherFrom()', () => {
  const now = at('2026-09-30T12:00:00')
  const week = (counts: number[]) =>
    counts.map((count, i) => ({ date: `2026-09-${String(24 + i).padStart(2, '0')}`, count }))
  const history = [{ date: '2026-01-10', count: 4 }]

  it('reads the last seven days: busy is clear, quiet is cloudy, silent is rain', () => {
    expect(weatherFrom([...history, ...week([3, 3, 3, 3, 0, 0, 0])], now)).toBe('clear')
    expect(weatherFrom([...history, ...week([1, 0, 2, 0, 0, 0, 0])], now)).toBe('cloudy')
    expect(weatherFrom([...history, ...week([0, 0, 0, 0, 0, 0, 0])], now)).toBe('rain')
  })

  it('renders settled weather when the source is unavailable, never an error', () => {
    expect(weatherFrom(null, now)).toBe('settled')
    expect(weatherFrom([], now)).toBe('settled')
  })

  it('treats a calendar with no activity at all as unreadable, not as a year of rain', () => {
    expect(weatherFrom(week([0, 0, 0, 0, 0, 0, 0]), now)).toBe('settled')
  })

  it('ignores days after now, which a calendar for the whole year can contain', () => {
    expect(weatherFrom([...history, { date: '2026-10-05', count: 50 }], now)).toBe('rain')
  })
})
