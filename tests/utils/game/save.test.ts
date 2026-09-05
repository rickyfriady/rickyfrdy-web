import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearSave,
  initialSave,
  parseSave,
  readSave,
  SAVE_KEY,
  type StorageLike,
  writeSave
} from '@/utils/game/save'

function memoryStorage(
  seed: Record<string, string> = {}
): StorageLike & { data: Record<string, string> } {
  const data = { ...seed }
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v
    },
    removeItem: (k) => {
      delete data[k]
    }
  }
}

/** A browser with site data blocked throws on access, it does not return null. */
const hostileStorage: StorageLike = {
  getItem() {
    throw new Error('SecurityError')
  },
  setItem() {
    throw new Error('SecurityError')
  },
  removeItem() {
    throw new Error('SecurityError')
  }
}

describe('parseSave()', () => {
  it('returns a clean state for absent data', () => {
    expect(parseSave(null)).toEqual(initialSave())
  })

  it('returns a clean state for malformed JSON rather than throwing', () => {
    expect(() => parseSave('{ not json')).not.toThrow()
    expect(parseSave('{ not json')).toEqual(initialSave())
  })

  it('returns a clean state for an unrecognised version', () => {
    expect(parseSave(JSON.stringify({ version: 99, companionDismissed: true }))).toEqual(
      initialSave()
    )
  })

  it('drops non-string events instead of trusting the stored shape', () => {
    const raw = JSON.stringify({
      version: 1,
      companionDismissed: false,
      quests: {},
      events: ['a', 7, null]
    })
    expect(parseSave(raw).events).toEqual(['a'])
  })
})

describe('round trip', () => {
  let storage: ReturnType<typeof memoryStorage>
  beforeEach(() => {
    storage = memoryStorage()
  })

  it('writes and reads back the same save', () => {
    const save = { ...initialSave(), companionDismissed: true, events: ['inspect:kamila'] }
    writeSave(save, storage)
    expect(storage.data[SAVE_KEY]).toBeDefined()
    expect(readSave(storage)).toEqual(save)
  })

  it('clears the key', () => {
    writeSave(initialSave(), storage)
    clearSave(storage)
    expect(storage.data[SAVE_KEY]).toBeUndefined()
    expect(readSave(storage)).toEqual(initialSave())
  })
})

describe('storage that throws', () => {
  it('never propagates the failure — the page must keep working', () => {
    expect(() => readSave(hostileStorage)).not.toThrow()
    expect(readSave(hostileStorage)).toEqual(initialSave())
    expect(() => writeSave(initialSave(), hostileStorage)).not.toThrow()
    expect(() => clearSave(hostileStorage)).not.toThrow()
  })

  it('treats a missing storage the same way', () => {
    expect(readSave(null)).toEqual(initialSave())
    expect(() => writeSave(initialSave(), null)).not.toThrow()
  })
})
