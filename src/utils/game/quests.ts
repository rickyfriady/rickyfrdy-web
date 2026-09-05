import { collaborators } from '@/data/collaborators'
import { npcs, quests } from '@/data/quests'
import type { Collaborator, Npc, Quest, QuestState } from '@/models'

/**
 * Quest state is *derived* from the observed event set, never stored as its
 * own mutable machine.
 *
 * That makes every transition total by construction: an unknown event simply
 * matches no condition, a duplicate completion recomputes to `complete`, and
 * there is no path where a malformed event can throw or strand a quest in a
 * state nothing can leave.
 *
 * Quests never gate content. Every project, article, and route they mention is
 * reachable by ordinary navigation with zero progress.
 */
export function questState(
  quest: Quest,
  events: readonly string[],
  all: readonly Quest[] = quests
): QuestState {
  const seen = new Set(events)
  if (quest.completedBy.every((e) => seen.has(e))) return 'complete'
  if (quest.requires) {
    const parent = all.find((q) => q.id === quest.requires)
    if (parent && questState(parent, events, all) !== 'complete') return 'locked'
  }
  if (seen.has(`talk:${quest.npcId}`) || quest.completedBy.some((e) => seen.has(e))) return 'active'
  return 'available'
}

export function questStates(
  events: readonly string[],
  all: readonly Quest[] = quests
): Record<string, QuestState> {
  const out: Record<string, QuestState> = {}
  for (const quest of all) out[quest.id] = questState(quest, events, all)
  return out
}

/** Appends an event. Anything that is not a non-empty string is ignored. */
export function applyEvent(events: readonly string[], event: unknown): string[] {
  if (typeof event !== 'string' || event.length === 0) return [...events]
  if (events.includes(event)) return [...events]
  return [...events, event]
}

/** The quest an NPC is currently offering, if any. */
export function activeQuestFor(
  npcId: string,
  events: readonly string[],
  all: readonly Quest[] = quests
): Quest | undefined {
  const mine = all.filter((q) => q.npcId === npcId)
  return (
    mine.find((q) => questState(q, events, all) === 'active') ??
    mine.find((q) => questState(q, events, all) === 'available') ??
    mine[0]
  )
}

/** NPC identity, read from the collaborators data rather than duplicated. */
export function resolveNpc(
  id: string,
  people: readonly Collaborator[] = collaborators,
  roster: readonly Npc[] = npcs
): Collaborator | undefined {
  const npc = roster.find((n) => n.id === id)
  if (!npc) return undefined
  return people.find((p) => p.name === npc.collaborator)
}
