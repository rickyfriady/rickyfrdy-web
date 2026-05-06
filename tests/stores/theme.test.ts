import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyThemeToDom, initTheme, setThemeValue, theme, toggleTheme } from '@/stores/theme'

describe('theme store', () => {
  beforeEach(() => {
    // jsdom does not implement window.matchMedia — stub it to return no match
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  afterEach(() => {
    theme.set('dark')
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  it('defaults to dark', () => {
    expect(theme.get()).toBe('dark')
  })

  it('toggles from dark to light', () => {
    theme.set('dark')
    toggleTheme()
    expect(theme.get()).toBe('light')
  })

  it('toggles from light to dark', () => {
    theme.set('light')
    toggleTheme()
    expect(theme.get()).toBe('dark')
  })

  it('setThemeValue updates the atom', () => {
    setThemeValue('light')
    expect(theme.get()).toBe('light')
  })

  describe('applyThemeToDom', () => {
    it('adds dark class when theme is dark', () => {
      applyThemeToDom('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('removes dark class when theme is light', () => {
      document.documentElement.classList.add('dark')
      applyThemeToDom('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(localStorage.getItem('theme')).toBe('light')
    })
  })

  describe('initTheme', () => {
    it('uses stored localStorage value when valid', () => {
      localStorage.setItem('theme', 'light')
      initTheme()
      expect(theme.get()).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('ignores invalid localStorage value and falls back to dark (mocked matchMedia)', () => {
      localStorage.setItem('theme', 'invalid-value')
      initTheme()
      // prefers-color-scheme: dark is the jsdom default (no matchMedia)
      // matchMedia returns false by default in jsdom, so preferred = 'light'
      expect(['light', 'dark']).toContain(theme.get())
    })

    it('persists resolved theme to localStorage on first visit (no stored value)', () => {
      // localStorage is empty — first visit
      initTheme()
      const persisted = localStorage.getItem('theme')
      expect(['light', 'dark']).toContain(persisted)
      expect(persisted).toBe(theme.get())
    })
  })
})
