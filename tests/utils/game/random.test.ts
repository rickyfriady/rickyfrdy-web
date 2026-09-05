import { describe, expect, it } from 'vitest'
import { damageFor, moves, opponents, runEncounter } from '@/utils/game/encounter'
import { mulberry32, seedFrom } from '@/utils/game/random'

describe('mulberry32()', () => {
  it('produces the same sequence for the same seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('produces a different sequence for a different seed', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)())
  })

  it('stays in [0, 1)', () => {
    const rand = mulberry32(seedFrom('race-condition'))
    for (let i = 0; i < 200; i++) {
      const value = rand()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('seedFrom()', () => {
  it('is stable for the same string', () => {
    expect(seedFrom('case-review:3')).toBe(seedFrom('case-review:3'))
    expect(seedFrom('case-review:3')).not.toBe(seedFrom('case-review:4'))
  })
})

describe('encounters', () => {
  const opponent = opponents[0]

  it('gives an identical turn sequence and outcome for an identical seed', () => {
    const a = runEncounter(opponent, 8, 'seed-1')
    const b = runEncounter(opponent, 8, 'seed-1')
    expect(a).toEqual(b)
  })

  it('always terminates within the declared turn cap', () => {
    for (const target of opponents) {
      // Level 1 is the weakest possible player, the slowest case there is.
      const result = runEncounter(target, 1, `${target.id}:worst`)
      expect(result.turns.length).toBeLessThanOrEqual(target.maxTurns)
      expect(['won', 'timeout']).toContain(result.outcome)
    }
  })

  it('resolves to the declared timeout outcome rather than running on', () => {
    const stubborn = { ...opponent, hp: 10_000 }
    const result = runEncounter(stubborn, 1, 'never-wins')
    expect(result.outcome).toBe('timeout')
    expect(result.turns).toHaveLength(stubborn.maxTurns)
  })

  it('never deals less than one damage, so no turn is wasted', () => {
    for (let move = 0; move < moves.length; move++) {
      expect(damageFor(1, move, 0)).toBeGreaterThanOrEqual(1)
    }
  })

  it('keeps every opponent an abstract obstacle, not a person or a company', () => {
    for (const target of opponents) {
      expect(target.opponent.en).toMatch(/condition|test|latency/i)
    }
  })
})
