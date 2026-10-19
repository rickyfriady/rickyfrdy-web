import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'

/**
 * The recruiter's first screen has to carry the proof (PRODUCT.md principle 1):
 * the employer, both tiers, and numbers. Every number the hero cites must be one
 * the project data already records, so the line can never drift into invention.
 */
const PAGES = ['src/pages/index.astro', 'src/pages/id/index.astro']

const recorded = projects
  .flatMap((p) => [
    p.shortDescription,
    p.fullDescription,
    p.keyMetric,
    ...p.metrics.map((m) => `${m.value} ${m.label}`)
  ])
  .join('\n')

const source = (file: string) => readFileSync(resolve(__dirname, '../..', file), 'utf8')

function heroParagraph(file: string): { classes: string; line: string } {
  const match = source(file).match(
    /<p class="([^"]*\bmt-6\b[^"]*)"[^>]*data-hero-reveal>([\s\S]*?)<\/p>/
  )
  if (!match) throw new Error(`no hero paragraph in ${file}`)
  return { classes: match[1], line: match[2].replace(/\s+/g, ' ').trim() }
}

/** The hero section: from the page's first <section> to its close. */
const heroSection = (file: string) => {
  const s = source(file)
  const start = s.indexOf('<section')
  return s.slice(start, s.indexOf('</section>', start))
}

describe.each(PAGES)('hero proof line in %s', (file) => {
  const { classes, line } = heroParagraph(file)

  it('reads as primary text, not a caption', () => {
    expect(classes).toMatch(/\btext-foreground\b/)
    expect(classes).not.toMatch(/\btext-muted\b/)
    expect(classes).toMatch(/\btext-(lg|xl|2xl)\b/)
  })

  it('has no ruled pattern behind it', () => {
    expect(heroSection(file)).not.toMatch(/paper-grid/)
  })

  it('names the employer', () => {
    expect(line).toContain('PT. Pegadaian')
  })

  it('claims both tiers', () => {
    expect(line).toMatch(/Module Federation/)
    expect(line).toMatch(/microservice/i)
  })

  it('cites only numbers the project data records', () => {
    const numbers = line.match(/\d+\+?/g) ?? []
    expect(numbers.length).toBeGreaterThan(0)
    for (const n of numbers) expect(recorded, `unrecorded number ${n}`).toContain(n)
  })
})
