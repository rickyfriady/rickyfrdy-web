import type { Encounter, EncounterResult, EncounterTurn } from '@/models'
import { mulberry32, seedFrom } from './random'

/**
 * Turn-based encounters.
 *
 * Opponents are abstract engineering obstacles. No real person, employer, or
 * competitor is ever an opponent, and nothing here depicts violence — this is
 * a page recruiters read.
 *
 * Every encounter is skippable and none is punitive: losing clears no progress
 * and makes no destination unreachable, because no destination is behind one.
 */
export const MAX_TURNS = 8

export const opponents = [
  {
    id: 'race-condition',
    opponent: { en: 'Race Condition', id: 'Race Condition' },
    hp: 24,
    maxTurns: MAX_TURNS
  },
  {
    id: 'flaky-test',
    opponent: { en: 'Flaky Test', id: 'Test Rapuh' },
    hp: 18,
    maxTurns: MAX_TURNS
  },
  {
    id: 'p99-latency',
    opponent: { en: 'p99 Latency', id: 'Latensi p99' },
    hp: 30,
    maxTurns: MAX_TURNS
  }
] satisfies Encounter[]

export const moves = [
  { id: 'type-check', base: 3 },
  { id: 'write-test', base: 2 },
  { id: 'read-log', base: 4 }
] as const

/** Damage is a function of level, move, and the seeded stream — never the clock. */
export function damageFor(playerLevel: number, moveIndex: number, roll: number): number {
  const move = moves[((moveIndex % moves.length) + moves.length) % moves.length]
  const swing = Math.floor(roll * 3)
  return Math.max(1, move.base + Math.floor(playerLevel / 2) + swing)
}

/**
 * Plays an encounter to its end. Bounded by `maxTurns` with a declared timeout
 * outcome, so it terminates for any input rather than relying on the numbers
 * happening to work out.
 */
export function runEncounter(
  encounter: Encounter,
  playerLevel: number,
  seed: string,
  chooseMove: (turn: number) => number = (turn) => turn % moves.length
): EncounterResult {
  const rand = mulberry32(seedFrom(seed))
  const turns: EncounterTurn[] = []
  let hp = encounter.hp

  for (let turn = 1; turn <= encounter.maxTurns && hp > 0; turn++) {
    const moveIndex = chooseMove(turn - 1)
    const damage = damageFor(playerLevel, moveIndex, rand())
    hp = Math.max(0, hp - damage)
    turns.push({ turn, move: moves[moveIndex % moves.length].id, damage, opponentHp: hp })
  }

  return { outcome: hp === 0 ? 'won' : 'timeout', turns }
}
