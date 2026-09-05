import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The language switcher used to query `[data-lang]` across the whole document
 * to find its own options. Other components carry that attribute too — the
 * projects grid root among them — so the switcher painted them with the
 * active-language highlight and, worse, attached a language-select click
 * handler to them.
 *
 * These assert the queries stay scoped, because the symptom (a stray tint on
 * an unrelated page) is nowhere near the cause.
 */
const SOURCE = readFileSync(
  resolve(__dirname, '../../../src/components/layout/LangSwitcher.astro'),
  'utf8'
)

describe('LangSwitcher DOM queries', () => {
  it('never queries [data-lang] document-wide', () => {
    expect(SOURCE).not.toMatch(/document\.querySelectorAll<[^>]*>\('\[data-lang\]'\)/)
    expect(SOURCE).not.toMatch(/document\.querySelectorAll\('\[data-lang\]'\)/)
  })

  it('scopes every [data-lang] lookup to the switcher', () => {
    // Capture the receiver as well, so `root.querySelectorAll(...)` is
    // distinguishable from `document.querySelectorAll(...)`.
    const lookups = [...SOURCE.matchAll(/(\w+)\.querySelectorAll<[^>]*>\((['"`])(.*?)\2\)/g)]
      .map((m) => ({ full: m[0], receiver: m[1], selector: m[3] }))
      .filter((l) => l.selector.includes('data-lang'))

    expect(lookups.length).toBeGreaterThan(0)
    for (const { full, receiver, selector } of lookups) {
      const scoped = selector.startsWith('#lang-switcher') || receiver !== 'document'
      expect(scoped, `unscoped [data-lang] query: ${full}`).toBe(true)
    }
  })
})

describe('elements that legitimately carry data-lang elsewhere', () => {
  it('projects grid still uses data-lang, so the scoping must hold', () => {
    // If this attribute ever moves, the regression it guards against changes
    // shape — the test should be revisited rather than silently passing.
    const grid = readFileSync(
      resolve(__dirname, '../../../src/components/projects/ProjectsGrid.astro'),
      'utf8'
    )
    expect(grid).toContain('data-lang={lang}')
  })
})
