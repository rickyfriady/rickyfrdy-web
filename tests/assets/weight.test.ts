import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { assetLicences, DEFAULT_MAX_BYTES } from '@/data/asset-licences'

const ILLUSTRATED = resolve(__dirname, '../../src/assets/illustrated')

describe('illustrated asset weight', () => {
  it('keeps every asset within its declared ceiling', () => {
    const over: string[] = []
    for (const entry of assetLicences) {
      const path = resolve(ILLUSTRATED, entry.file)
      if (!existsSync(path)) continue // the licences test owns the missing-file case
      const ceiling = ('maxBytes' in entry && entry.maxBytes) || DEFAULT_MAX_BYTES
      const bytes = statSync(path).size
      if (bytes > ceiling) over.push(`${entry.file} (${bytes}B > ${ceiling}B)`)
    }
    expect(over, `illustrated asset(s) over their ceiling: ${over.join(', ')}`).toEqual([])
  })

  it('declares a ceiling that is a positive number of bytes', () => {
    expect(DEFAULT_MAX_BYTES).toBeGreaterThan(0)
    for (const entry of assetLicences) {
      if ('maxBytes' in entry && entry.maxBytes !== undefined) {
        expect(entry.maxBytes, `${entry.file} declares a non-positive ceiling`).toBeGreaterThan(0)
      }
    }
  })
})
