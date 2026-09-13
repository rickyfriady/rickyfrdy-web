import { readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { assetLicences, attributions } from '@/data/asset-licences'
import type { AssetLicence } from '@/models'

const ASSETS = resolve(__dirname, '../../src/assets')

/**
 * Every art file under either art path, relative to `src/assets/`. READMEs are
 * docs. Both paths are walked because both ship files to visitors, and a
 * sprite is no less licensed for being small.
 */
function artFiles(dir: string = ASSETS): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return artFiles(full)
    if (name.toLowerCase().endsWith('.md')) return []
    return [relative(ASSETS, full)]
  })
}

describe('art asset licences', () => {
  it('records every file that sits on an art path', () => {
    const recorded = new Set(assetLicences.map((e) => e.file))
    const unrecorded = artFiles().filter((f) => !recorded.has(f))
    // Named, not counted: the failure has to say which file to go and license.
    expect(unrecorded, `art asset(s) with no licence entry: ${unrecorded.join(', ')}`).toEqual([])
  })

  it('does not record files that are not there', () => {
    const present = new Set(artFiles())
    const orphaned = assetLicences.map((e) => e.file).filter((f) => !present.has(f))
    expect(orphaned, `licence entries with no file: ${orphaned.join(', ')}`).toEqual([])
  })

  it('requires source, licence, and attribution on third-party art', () => {
    for (const entry of attributions()) {
      // The union already enforces this at the type level; this catches an entry
      // widened with `as` or arriving from untyped JSON.
      const e = entry as Extract<AssetLicence, { source: string }>
      expect(e.source, `${e.file} has no source`).toBeTruthy()
      expect(e.licence, `${e.file} has no licence`).toBeTruthy()
      expect(e.attribution, `${e.file} has no attribution text`).toBeTruthy()
    }
  })

  it('never lists the same file twice', () => {
    const files = assetLicences.map((e) => e.file)
    expect(files).toEqual([...new Set(files)])
  })
})
