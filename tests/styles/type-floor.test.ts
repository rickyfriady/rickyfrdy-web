import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Nothing the landing page renders is set below 11px (pixel-design-system).
 * The page's files are found by walking imports from the two index pages, so a
 * new component joins the check by being used, not by being listed. Other
 * routes are out of scope for now; about a hundred small sizes remain there.
 */
const ROOT = resolve(__dirname, '../..')
const FLOOR_PX = 11
const ROOT_PX = 16

function renderTree(entries: string[]): string[] {
  const seen = new Set<string>()
  const queue = entries.map((e) => join(ROOT, e))
  while (queue.length > 0) {
    const file = queue.pop() as string
    if (seen.has(file)) continue
    seen.add(file)
    const source = readFileSync(file, 'utf8')
    for (const m of source.matchAll(/from\s+['"]((?:@\/components|\.{1,2}\/)[^'"]+)['"]/g)) {
      const base = m[1].startsWith('@/')
        ? join(ROOT, 'src', m[1].slice(2))
        : resolve(dirname(file), m[1])
      const found = [base, `${base}.astro`, `${base}.tsx`, `${base}.ts`].find(
        (c) => existsSync(c) && /\.(astro|tsx?)$/.test(c)
      )
      if (found) queue.push(found)
    }
  }
  return [...seen]
}

const toPx = (value: number, unit: string) => (unit === 'rem' ? value * ROOT_PX : value)

const files = renderTree(['src/pages/index.astro', 'src/pages/id/index.astro'])
const CSS = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8')

describe('landing page type floor', () => {
  it('walks the real render tree', () => {
    expect(files.some((f) => f.endsWith('PlayScene.tsx'))).toBe(true)
    expect(files.some((f) => f.endsWith('MobileBottomNav.astro'))).toBe(true)
  })

  it('sets no arbitrary text size below 11px', () => {
    const found: string[] = []
    for (const file of files) {
      const source = readFileSync(file, 'utf8')
      for (const m of source.matchAll(/text-\[(\d*\.?\d+)(px|rem)\]/g)) {
        if (toPx(Number(m[1]), m[2]) < FLOOR_PX) {
          found.push(
            `${relative(ROOT, file)}:${source.slice(0, m.index).split('\n').length}  ${m[0]}`
          )
        }
      }
    }
    expect(found).toEqual([])
  })

  it('uses no utility that sets a font size below 11px', () => {
    const used = files.map((f) => readFileSync(f, 'utf8')).join('\n')
    const found: string[] = []
    for (const m of CSS.matchAll(/@utility ([\w-]+) \{([^}]*)\}/g)) {
      const size = m[2].match(/font-size:\s*(\d*\.?\d+)(px|rem)/)
      if (
        size &&
        toPx(Number(size[1]), size[2]) < FLOOR_PX &&
        new RegExp(`\\b${m[1]}\\b`).test(used)
      ) {
        found.push(`@utility ${m[1]}: ${size[0]}`)
      }
    }
    expect(found).toEqual([])
  })
})
