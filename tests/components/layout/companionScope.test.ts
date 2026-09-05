import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The companion mounts on every route, so a stray document-wide query in it is
 * a site-wide bug. This mirrors the LangSwitcher regression test, which exists
 * because exactly that happened: a document-wide `[data-lang]` lookup painted
 * an unrelated component on an unrelated page.
 */
const SOURCE = readFileSync(
  resolve(__dirname, '../../../src/components/layout/CompanionCharacter.astro'),
  'utf8'
)

describe('CompanionCharacter DOM queries', () => {
  it('scopes every querySelector to its own root, never the document', () => {
    const lookups = [...SOURCE.matchAll(/(\w+)\.querySelector(?:All)?[<(]/g)].map((m) => ({
      full: m[0],
      receiver: m[1]
    }))
    expect(lookups.length).toBeGreaterThan(0)
    for (const { full, receiver } of lookups) {
      expect(receiver, `unscoped companion query: ${full}`).not.toBe('document')
    }
  })

  it('reaches for the document exactly once, to find its own root', () => {
    const byId = [...SOURCE.matchAll(/document\.getElementById\(/g)]
    expect(byId.length).toBeLessThanOrEqual(2)
  })
})

describe('CompanionCharacter hydration and input', () => {
  it('uses no client:* directive — it is on all 37 routes', () => {
    expect(SOURCE).not.toMatch(/client:(load|idle|visible|only|media)/)
  })

  it('lets pointer events through to the page beneath it', () => {
    expect(SOURCE).toContain('pointer-events-none')
  })

  it('registers no global key handler that could swallow a keystroke', () => {
    expect(SOURCE).not.toMatch(/addEventListener\(\s*'key(down|up|press)'/)
  })

  it('stops the loop when the tab is hidden', () => {
    expect(SOURCE).toContain('visibilitychange')
    expect(SOURCE).toContain('cancelAnimationFrame')
  })
})
