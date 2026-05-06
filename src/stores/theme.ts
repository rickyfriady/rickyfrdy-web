import { atom } from 'nanostores'

export type Theme = 'light' | 'dark'

const VALID_THEMES: readonly Theme[] = ['light', 'dark']

export const theme = atom<Theme>('dark')

export function toggleTheme(): void {
  theme.set(theme.get() === 'dark' ? 'light' : 'dark')
}

export function setThemeValue(value: Theme): void {
  theme.set(value)
}

export function applyThemeToDom(value: Theme): void {
  if (typeof window === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
  localStorage.setItem('theme', value)
}

export function initTheme(): void {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('theme')
  const stored: Theme | null = VALID_THEMES.includes(raw as Theme) ? (raw as Theme) : null
  const preferred: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const resolved = stored ?? preferred
  theme.set(resolved)
  applyThemeToDom(resolved)
}
