import { atom } from 'nanostores'
import type { GameSave, QuestState } from '@/models'
import { clearSave, initialSave, readSave, writeSave } from '@/utils/game/save'

/**
 * Game state shared between the vanilla companion script and the `/play`
 * React island. They cannot share React state — the companion is deliberately
 * not an island — so a store is the one thing both can read.
 *
 * Shaped after `src/stores/sound.ts`: atoms, explicit setters, one `init*`.
 */
export const companionDismissed = atom<boolean>(false)
export const questProgress = atom<Record<string, QuestState>>({})
export const gameEvents = atom<string[]>([])

function snapshot(): GameSave {
  return {
    version: 1,
    companionDismissed: companionDismissed.get(),
    quests: questProgress.get(),
    events: gameEvents.get()
  }
}

function apply(save: GameSave): void {
  companionDismissed.set(save.companionDismissed)
  questProgress.set(save.quests)
  gameEvents.set(save.events)
}

export function initGame(): void {
  if (typeof window === 'undefined') return
  apply(readSave())
}

export function setCompanionDismissed(value: boolean): void {
  companionDismissed.set(value)
  writeSave(snapshot())
}

export function toggleCompanion(): void {
  setCompanionDismissed(!companionDismissed.get())
}

export function setQuestProgress(quests: Record<string, QuestState>): void {
  questProgress.set(quests)
  writeSave(snapshot())
}

/** Records a scene event (`inspect:<slug>`, `talk:<npc>`) once. */
export function recordEvent(event: string): void {
  const events = gameEvents.get()
  if (events.includes(event)) return
  gameEvents.set([...events, event])
  writeSave(snapshot())
}

/** Clears progress but leaves the companion where the visitor put it. */
export function resetGame(): void {
  const dismissed = companionDismissed.get()
  clearSave()
  apply({ ...initialSave(), companionDismissed: dismissed })
  writeSave(snapshot())
}
