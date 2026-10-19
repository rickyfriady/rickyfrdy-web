import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * DESIGN.md: radius is 0. Named utilities (`rounded-xl`) resolve through the
 * zeroed `--radius-*` tokens, so they cannot round anything; an arbitrary length
 * (`rounded-b-[10px]`) skips the tokens and can. Those two doors are what this
 * guards. `var(...)` inside the brackets still goes through a token.
 */
const ROOT = resolve(__dirname, '../..')
const SRC = join(ROOT, 'src')
const CSS = readFileSync(join(SRC, 'styles/global.css'), 'utf8')

describe('radius is zero', () => {
  it('declares every --radius-* token as 0', () => {
    const nonZero = [...CSS.matchAll(/(--radius[\w-]*)\s*:\s*([^;]+);/g)]
      .filter((m) => !/^0(px|rem)?$/.test(m[2].trim()))
      .map((m) => `${m[1]}: ${m[2].trim()}`)
    expect(nonZero).toEqual([])
  })

  it('uses no arbitrary radius length in a utility class', () => {
    const found = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(astro|tsx?)$/.test(f))
      .flatMap((f) => {
        const source = readFileSync(join(SRC, f), 'utf8')
        return [...source.matchAll(/\brounded(?:-[a-z]{1,2})?-\[(?!var\()[^\]]+\]/g)].map(
          (m) =>
            `${relative(ROOT, join(SRC, f))}:${source.slice(0, m.index).split('\n').length}  ${m[0]}`
        )
      })
    expect(found).toEqual([])
  })
})
