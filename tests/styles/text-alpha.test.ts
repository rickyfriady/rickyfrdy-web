import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * palette-contrast.test.ts holds every text token to 4.5:1, but a text colour
 * made by fading the foreground toward transparent never passes through a token,
 * so that test cannot see it. The bottom nav's labels did exactly that and read
 * at 2.3:1. Text uses a colour role; fades stay for borders and other graphics.
 */
const ROOT = resolve(__dirname, '../..')
const SRC = join(ROOT, 'src')
const FADE = String.raw`color-mix\(in oklch, var\(--color-foreground\) \d+%, transparent\)`

describe('text is never a faded foreground', () => {
  it('sets no text colour by fading the foreground toward transparent', () => {
    const asText = new RegExp(
      String.raw`(?:(?<![-\w])color\s*:\s*|\.color\s*=\s*['"\x60]|=\s*['"\x60])${FADE}`,
      'g'
    )
    const found = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(astro|tsx?|css)$/.test(f))
      .flatMap((f) => {
        const source = readFileSync(join(SRC, f), 'utf8')
        return [...source.matchAll(asText)].map(
          (m) => `${relative(ROOT, join(SRC, f))}:${source.slice(0, m.index).split('\n').length}`
        )
      })
    expect(found).toEqual([])
  })
})
