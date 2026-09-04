import { describe, expect, it } from 'vitest'
import { deriveStats, levelFor, MAX_LEVEL, MIN_LEVEL, parsePeriodYears } from '@/utils/game/stats'

const projects = [{ technologies: ['Vue 3', 'NestJS'] }, { technologies: ['NestJS', 'PostgreSQL'] }]

const experiences = [
  { stack: ['NestJS', 'PostgreSQL'], period: 'May 2023 – Present' },
  { stack: ['PHP'], period: 'Apr 2021 – Jul 2021' }
]

describe('parsePeriodYears()', () => {
  it('reads a start and end year', () => {
    expect(parsePeriodYears('Apr 2021 – Jul 2023', 2030)).toEqual([2021, 2023])
  })

  it('resolves Present to the year it is handed, never to the clock', () => {
    expect(parsePeriodYears('May 2023 – Present', 2026)).toEqual([2023, 2026])
    expect(parsePeriodYears('May 2023 – Present', 2031)).toEqual([2023, 2031])
  })

  it('handles a single year', () => {
    expect(parsePeriodYears('2020', 2026)).toEqual([2020, 2020])
  })
})

describe('levelFor()', () => {
  it('never leaves the declared range', () => {
    expect(levelFor(0, 0)).toBe(MIN_LEVEL)
    expect(levelFor(99, 99)).toBe(MAX_LEVEL)
  })
})

describe('deriveStats()', () => {
  it('is deterministic for identical input', () => {
    const a = deriveStats(projects, experiences, 2026)
    const b = deriveStats(projects, experiences, 2026)
    expect(a).toEqual(b)
  })

  it('bounds every level', () => {
    for (const stat of deriveStats(projects, experiences, 2026)) {
      expect(stat.level).toBeGreaterThanOrEqual(MIN_LEVEL)
      expect(stat.level).toBeLessThanOrEqual(MAX_LEVEL)
    }
  })

  it('counts every listing of a technology across both sources', () => {
    const nest = deriveStats(projects, experiences, 2026).find((s) => s.name === 'NestJS')
    expect(nest?.uses).toBe(3)
  })

  it('picks up a technology added to the source data with no manual stat edit', () => {
    const withNew = deriveStats([...projects, { technologies: ['Rust'] }], experiences, 2026, 99)
    expect(withNew.some((s) => s.name === 'Rust')).toBe(true)
  })

  it('rises with the year only because experience does, and stays pinned when the year is', () => {
    const at2026 = deriveStats(projects, experiences, 2026).find((s) => s.name === 'NestJS')
    const at2030 = deriveStats(projects, experiences, 2030).find((s) => s.name === 'NestJS')
    expect(at2030?.years).toBeGreaterThan(at2026?.years ?? 0)
    expect(deriveStats(projects, experiences, 2026)).toEqual(
      deriveStats(projects, experiences, 2026)
    )
  })
})
