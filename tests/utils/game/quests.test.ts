import { describe, expect, it } from 'vitest'
import type { Quest } from '@/models'
import {
  activeQuestFor,
  applyEvent,
  questState,
  questStates,
  resolveNpc
} from '@/utils/game/quests'

const first: Quest = {
  id: 'first',
  npcId: 'npc-a',
  title: { en: 'First', id: 'Pertama' },
  passages: [{ en: 'go', id: 'pergi' }],
  completedBy: ['inspect:one', 'inspect:two']
}

const second: Quest = {
  id: 'second',
  npcId: 'npc-b',
  requires: 'first',
  title: { en: 'Second', id: 'Kedua' },
  passages: [{ en: 'then', id: 'lalu' }],
  completedBy: ['inspect:three']
}

const all = [first, second]

describe('questState()', () => {
  it('starts available with no progress', () => {
    expect(questState(first, [], all)).toBe('available')
  })

  it('is locked while its prerequisite is unfinished', () => {
    expect(questState(second, [], all)).toBe('locked')
  })

  it('becomes active on talking to its NPC', () => {
    expect(questState(first, ['talk:npc-a'], all)).toBe('active')
  })

  it('becomes active on partial progress', () => {
    expect(questState(first, ['inspect:one'], all)).toBe('active')
  })

  it('completes only when every condition is met', () => {
    expect(questState(first, ['inspect:one'], all)).toBe('active')
    expect(questState(first, ['inspect:one', 'inspect:two'], all)).toBe('complete')
  })

  it('unlocks its dependant once the prerequisite completes', () => {
    expect(questState(second, ['inspect:one', 'inspect:two'], all)).toBe('available')
  })
})

describe('idempotence', () => {
  it('stays complete when the completion event arrives twice', () => {
    const events = applyEvent(
      applyEvent(['inspect:one', 'inspect:two'], 'inspect:two'),
      'inspect:two'
    )
    expect(questState(first, events, all)).toBe('complete')
    expect(events.filter((e) => e === 'inspect:two')).toHaveLength(1)
  })
})

describe('unknown and malformed events', () => {
  it('leaves every state unchanged and never throws', () => {
    const before = questStates([], all)
    expect(() => applyEvent([], 'nothing:matches')).not.toThrow()
    expect(questStates(applyEvent([], 'nothing:matches'), all)).toEqual(before)
  })

  it('ignores values that are not non-empty strings', () => {
    expect(applyEvent(['a'], undefined)).toEqual(['a'])
    expect(applyEvent(['a'], 42)).toEqual(['a'])
    expect(applyEvent(['a'], '')).toEqual(['a'])
  })
})

describe('activeQuestFor()', () => {
  it('prefers an in-progress quest over an untouched one', () => {
    expect(activeQuestFor('npc-a', ['talk:npc-a'], all)?.id).toBe('first')
  })

  it('returns undefined for an NPC with no quests', () => {
    expect(activeQuestFor('npc-nobody', [], all)).toBeUndefined()
  })
})

describe('resolveNpc()', () => {
  const people = [{ name: 'Ada L', role: 'Engineer', company: 'Somewhere' }]
  const roster = [{ id: 'npc-ada', collaborator: 'Ada L', questIds: [] }]

  it('reads identity from the collaborators data', () => {
    expect(resolveNpc('npc-ada', people, roster)?.role).toBe('Engineer')
  })

  it('returns undefined rather than inventing a person', () => {
    expect(resolveNpc('npc-missing', people, roster)).toBeUndefined()
  })
})
