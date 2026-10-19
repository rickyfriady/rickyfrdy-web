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

  it('reaches for the document only for its own root, its data, and the column it walks beside', () => {
    // `main-content` is read for its position (the gutter's width), never written.
    const ids = [...SOURCE.matchAll(/document\.getElementById\('([\w-]+)'\)/g)].map((m) => m[1])
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(['companion', 'companion-data', 'main-content']).toContain(id)
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

describe('CompanionCharacter dismissal', () => {
  const MARKUP = SOURCE.slice(0, SOURCE.indexOf('<script'))

  /** The markup of the element whose opening tag starts at `start`, by counting divs. */
  function elementAt(start: number): string {
    const re = /<div\b|<\/div>/g
    re.lastIndex = start
    let depth = 0
    for (let m = re.exec(MARKUP); m; m = re.exec(MARKUP)) {
      depth += m[0] === '</div>' ? -1 : 1
      if (depth === 0) return MARKUP.slice(start, m.index + m[0].length)
    }
    throw new Error('unbalanced companion markup')
  }

  it('puts no focusable element inside an aria-hidden element', () => {
    for (const m of MARKUP.matchAll(/aria-hidden="true"/g)) {
      const start = MARKUP.lastIndexOf('<div', m.index)
      expect(elementAt(start)).not.toMatch(/<(button|a|input)\b|tabindex="0"/)
    }
  })

  it('gives the dismiss control an accessible name', () => {
    expect(MARKUP).toMatch(
      /<button[^>]*data-dismiss[^>]*aria-label=|<button[^>]*aria-label=[^>]*data-dismiss/
    )
  })

  it('keeps the dismiss control in the tab order', () => {
    expect(MARKUP).not.toMatch(/tabindex="-1"/)
  })
})
