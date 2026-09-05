import type { GameSave } from '@/models'

/**
 * Saved game progress.
 *
 * One versioned key, JSON, and every storage access wrapped. A browser that
 * blocks site data — private mode, a locked-down corporate profile — throws on
 * `localStorage` access itself, not just on read, so an unguarded getItem is
 * enough to take the whole page down. The game is allowed to lose progress; it
 * is not allowed to break the page it lives on.
 */
export const SAVE_KEY = 'rw:game:v1'
export const SAVE_VERSION = 1

/** The subset of the Storage API this module uses, so tests can pass a stub. */
export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function initialSave(): GameSave {
  return { version: SAVE_VERSION, companionDismissed: false, quests: {}, events: [] }
}

/**
 * Pure parse. Absent, malformed, or wrong-version data yields a clean initial
 * state rather than an exception — a corrupt save must never be a dead page.
 */
export function parseSave(raw: string | null): GameSave {
  if (!raw) return initialSave()
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return initialSave()
  }
  if (typeof value !== 'object' || value === null) return initialSave()
  const save = value as Partial<GameSave>
  if (save.version !== SAVE_VERSION) return initialSave()
  return {
    version: SAVE_VERSION,
    companionDismissed: save.companionDismissed === true,
    quests: typeof save.quests === 'object' && save.quests !== null ? { ...save.quests } : {},
    events: Array.isArray(save.events) ? save.events.filter((e) => typeof e === 'string') : []
  }
}

/** `localStorage` if it is reachable at all, otherwise null. */
export function browserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readSave(storage: StorageLike | null = browserStorage()): GameSave {
  if (!storage) return initialSave()
  try {
    return parseSave(storage.getItem(SAVE_KEY))
  } catch {
    return initialSave()
  }
}

export function writeSave(save: GameSave, storage: StorageLike | null = browserStorage()): void {
  if (!storage) return
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    /* Storage full or blocked — the session keeps playing from memory. */
  }
}

export function clearSave(storage: StorageLike | null = browserStorage()): void {
  if (!storage) return
  try {
    storage.removeItem(SAVE_KEY)
  } catch {
    /* Nothing to do; the in-memory reset below is what the player sees. */
  }
}
