import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * DESIGN.md: easing is `steps()`, never a curve, and reduced motion is honoured
 * throughout. Both rules drifted while nothing enforced them, so this scans the
 * source. Tailwind's `ease-*` utilities are allowed: global.css remaps their
 * tokens to `steps()`. The CSS keywords of the same name are not remapped.
 */
const ROOT = resolve(__dirname, '../..')
const SRC = join(ROOT, 'src')

const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
  .filter((f) => /\.(css|astro|tsx?)$/.test(f))
  .map((f) => join(SRC, f))

/** Blank out comments but keep newlines, so reported line numbers stay true. */
function stripComments(source: string): string {
  const blank = (m: string) => m.replace(/[^\n]/g, ' ')
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/(^|[^:'"\\])\/\/.*$/gm, (m, lead: string) => lead + blank(m.slice(lead.length)))
}

const lineOf = (source: string, index: number) => source.slice(0, index).split('\n').length

/** A bare easing keyword, not part of a custom property such as `--ease-out`. */
const CURVE = /(?<![-\w])ease(?:-in|-out|-in-out)?(?![-\w])|cubic-bezier\(/

function offences(pattern: RegExp, judge: (m: RegExpMatchArray) => boolean): string[] {
  const found: string[] = []
  for (const file of files) {
    const source = stripComments(readFileSync(file, 'utf8'))
    for (const m of source.matchAll(pattern)) {
      if (judge(m)) {
        found.push(
          `${relative(ROOT, file)}:${lineOf(source, m.index ?? 0)}  ${m[0].replace(/\s+/g, ' ').trim()}`
        )
      }
    }
  }
  return found
}

describe('motion is stepped', () => {
  it('uses no easing curve in a CSS transition or animation declaration', () => {
    const declaration =
      /(?:transition|animation)(?:-timing-function|TimingFunction)?\s*:\s*['"`]?([^;}"'`]+)/g
    expect(offences(declaration, (m) => CURVE.test(m[1]))).toEqual([])
  })

  it('uses no easing curve in a transition set from a script', () => {
    const assignment = /\.transition\s*=\s*(['"`])(.*?)\1/g
    expect(offences(assignment, (m) => CURVE.test(m[2]))).toEqual([])
  })

  it('gives GSAP and motion only steps(), linear or none', () => {
    const ease = /\b(?:ease|easing)\s*:\s*(?:(['"`])([^'"`]+)\1|\[)/g
    const allowed = (value: string | undefined) =>
      value !== undefined && (/^(none|linear)$/.test(value) || value.startsWith('steps('))
    expect(offences(ease, (m) => !allowed(m[2]))).toEqual([])
  })

  it('uses no spring physics', () => {
    expect(offences(/type\s*:\s*['"`]spring['"`]/g, () => true)).toEqual([])
  })

  // GSAP's default ease is `power1.out`, a curve, so a tween that names no ease
  // is eased. A curve can also arrive through a variable (`const ease = '…'`).
  const gsapFiles = files.filter((f) => /from\s+['"]gsap['"]/.test(readFileSync(f, 'utf8')))

  it('names an ease on every GSAP tween', () => {
    const missing: string[] = []
    for (const file of gsapFiles) {
      const source = stripComments(readFileSync(file, 'utf8'))
      for (const m of source.matchAll(/(?:\bgsap|\))\s*\.(?:to|from|fromTo)\(/g)) {
        let i = (m.index ?? 0) + m[0].length
        for (let depth = 1; depth > 0 && i < source.length; i++) {
          if (source[i] === '(') depth++
          else if (source[i] === ')') depth--
        }
        const call = source.slice(m.index, i)
        if (!/\bease\s*(:|[,}])/.test(call))
          missing.push(`${relative(ROOT, file)}:${lineOf(source, m.index ?? 0)}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('names no GSAP curve anywhere in a file that uses GSAP', () => {
    const curve =
      /['"`]((?:power\d|back|elastic|bounce|circ|expo|sine|quad|cubic|quart|quint|strong)\.\w+|ease(?:In|Out|InOut))/
    const found = gsapFiles.flatMap((file) => {
      const source = stripComments(readFileSync(file, 'utf8'))
      return source
        .split('\n')
        .flatMap((line, i) =>
          curve.test(line) ? [`${relative(ROOT, file)}:${i + 1}  ${line.trim()}`] : []
        )
    })
    expect(found).toEqual([])
  })
})

describe('reduced motion is honoured', () => {
  it('checks prefers-reduced-motion in every file that animates with a library', () => {
    const missing = files
      .filter((file) => {
        const source = readFileSync(file, 'utf8')
        return (
          /from\s+['"](gsap|motion)['"]/.test(source) && !source.includes('prefers-reduced-motion')
        )
      })
      .map((file) => relative(ROOT, file))
    expect(missing).toEqual([])
  })
})
