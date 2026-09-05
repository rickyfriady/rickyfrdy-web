import { atom } from 'nanostores'

/**
 * Interaction sound preference.
 *
 * Off on a first visit, always. Sound that plays before anyone asked for it is
 * the single fastest way to make someone close the tab.
 */
export const soundEnabled = atom<boolean>(false)

const STORAGE_KEY = 'sound'

export function setSoundEnabled(value: boolean): void {
  soundEnabled.set(value)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
  }
}

export function toggleSound(): void {
  setSoundEnabled(!soundEnabled.get())
}

export function initSound(): void {
  if (typeof window === 'undefined') return
  soundEnabled.set(localStorage.getItem(STORAGE_KEY) === 'on')
}
