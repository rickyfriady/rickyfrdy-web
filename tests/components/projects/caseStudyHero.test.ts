import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The case-study hero was drawn for the old dark-only look: white text over a
 * cream overlay in the light theme, and every item hidden in the markup until
 * a script that skips reduced motion revealed it. Run 7's walkthrough found
 * both. Text takes theme tokens; the script, not the markup, sets any start state.
 */
const HERO = readFileSync(
  resolve(__dirname, '../../../src/components/projects/CaseStudyHero.astro'),
  'utf8'
)
const PAGE = readFileSync(resolve(__dirname, '../../../src/pages/projects/[slug].astro'), 'utf8')

describe('CaseStudyHero', () => {
  it('sets no text in a fixed white that ignores the theme', () => {
    expect(HERO).not.toMatch(/text-white/)
  })

  it('hides nothing in its markup, so it reads without scripts', () => {
    expect(HERO).not.toMatch(/opacity\s*:\s*0/)
  })

  it('animates hero items from a start state the script sets', () => {
    expect(PAGE).toMatch(/gsap\.from\(heroItems/)
    expect(PAGE).not.toMatch(/gsap\.to\(heroItems/)
  })
})

/**
 * Run 8 found the Impact grid below the hero shipping `opacity-0` and counter
 * zeros in its markup, so without scripts, or under reduced motion, the proof
 * numbers were blank, and italic pixel digits read "5+" as "S+".
 */
const METRICS = readFileSync(
  resolve(__dirname, '../../../src/components/projects/MetricCounters.astro'),
  'utf8'
)

describe('MetricCounters', () => {
  it('ships its grid visible', () => {
    expect(METRICS).not.toMatch(/data-metric-grid[^>]*opacity-0|opacity-0[^>]*data-metric-grid/)
  })

  it('renders the real value in the markup, not a counter start', () => {
    expect(METRICS).toMatch(/>\s*\{metric\.value\}\s*</)
  })

  it('never counts a number up through values that were not recorded', () => {
    expect(METRICS).not.toMatch(/onUpdate|counter\.val/)
  })

  it('sets the numbers upright', () => {
    expect(METRICS).not.toMatch(/\bitalic\b/)
  })
})
