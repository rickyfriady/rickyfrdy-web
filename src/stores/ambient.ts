import { atom } from 'nanostores'

/**
 * Ambient audio: the valley's background loop, wind, birdsong and footsteps.
 *
 * Its own preference, separate from the interaction sounds in `sound.ts`. That
 * toggle was agreed to for ticks and stamps; reusing it would start music for
 * anyone who said yes to a click. Off on a first visit, always.
 */
export const ambientEnabled = atom<boolean>(false)
export const ambientVolume = atom<number>(0.5)

const ENABLED_KEY = 'ambient'
const VOLUME_KEY = 'ambientVolume'

const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.5)

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private mode or a full quota: the preference holds for this page only.
  }
}

export function setAmbientEnabled(value: boolean): void {
  ambientEnabled.set(value)
  if (typeof window !== 'undefined') store(ENABLED_KEY, value ? 'on' : 'off')
}

export function setAmbientVolume(value: number): void {
  const v = clamp(value)
  ambientVolume.set(v)
  if (typeof window !== 'undefined') store(VOLUME_KEY, String(v))
}

export function initAmbient(): void {
  if (typeof window === 'undefined') return
  try {
    ambientEnabled.set(localStorage.getItem(ENABLED_KEY) === 'on')
    const saved = localStorage.getItem(VOLUME_KEY)
    ambientVolume.set(saved === null ? 0.5 : clamp(Number(saved)))
  } catch {
    ambientEnabled.set(false)
  }
}
