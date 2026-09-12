import { describe, expect, it } from 'vitest'
import {
  addDays,
  formatDayMonth,
  monthGrid,
  nextFriday,
  nightsBetween,
  todayISO
} from '../../src/utils/dateRange'

describe('dateRange', () => {
  it('lays September 2026 out Monday-first with one leading blank', () => {
    const grid = monthGrid(2026, 8)
    expect(grid).toHaveLength(31)
    expect(grid[0]).toBeNull()
    expect(grid[1]).toBe('2026-09-01')
    expect(grid.at(-1)).toBe('2026-09-30')
  })

  it('starts February on the right weekday in a leap year', () => {
    const grid = monthGrid(2028, 1)
    expect(grid.filter(Boolean)).toHaveLength(29)
    expect(grid[0]).toBeNull()
    expect(grid[1]).toBe('2028-02-01')
    expect(grid.at(-1)).toBe('2028-02-29')
  })

  it('crosses month and year boundaries', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('counts a week as seven nights across a DST change', () => {
    expect(nightsBetween('2026-03-25', '2026-04-01')).toBe(7)
    expect(nightsBetween('2026-10-22', '2026-10-29')).toBe(7)
    expect(nightsBetween('2026-09-05', '2026-09-08')).toBe(3)
  })

  it('keeps a Friday and advances any other day to the next one', () => {
    expect(nextFriday('2026-09-04')).toBe('2026-09-04')
    expect(nextFriday('2026-09-05')).toBe('2026-09-11')
    expect(nextFriday('2026-09-11')).toBe('2026-09-11')
  })

  it('reads today from local parts, not from a UTC shift', () => {
    expect(todayISO(new Date(2026, 8, 11, 0, 30))).toBe('2026-09-11')
    expect(todayISO(new Date(2026, 8, 11, 23, 30))).toBe('2026-09-11')
  })

  it('formats a day without drifting a date backwards', () => {
    expect(formatDayMonth('2026-09-05')).toBe('5 Sept')
  })
})
