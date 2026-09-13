import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEFAULT_MAX_BYTES } from '@/data/asset-licences'
import { spriteSheetById } from '@/data/sprites'
import { frameOffset, sheetCapacity } from '@/utils/game/sprites'

/**
 * `CompanionCharacter.astro` animates the sheet with two lines of inline
 * arithmetic rather than importing `frameOffset`, because that module eagerly
 * globs every sprite and the companion mounts on all 37 routes. The price of
 * not importing the helper is that the sheet has to keep the shape the inline
 * version assumes, which is what these tests hold it to.
 */
const sheet = spriteSheetById['companion-pet']
const FILE = resolve(__dirname, '../../src/assets/sprites/character/companion-pet.png')

describe('companion sheet', () => {
  it('is registered', () => {
    expect(sheet, 'companion-pet is not in spriteSheets').toBeDefined()
  })

  it('is a single row, which is what lets the renderer skip the row index', () => {
    const { perRow, total } = sheetCapacity(sheet)
    expect(total).toBe(perRow)
    expect(sheet.height).toBe(sheet.frameHeight)
  })

  it('puts every frame at a zero vertical offset', () => {
    // The bug this replaced offset vertically by frameWidth, which was only
    // ever correct while frames were square. These are 42x48.
    for (let i = 0; i < sheetCapacity(sheet).total; i++) {
      expect(frameOffset(sheet, i).y, `frame ${i} is off its row`).toBe(0)
    }
  })

  it('steps horizontally by exactly one frame', () => {
    expect(frameOffset(sheet, 0).x).toBe(0)
    expect(frameOffset(sheet, 1).x).toBe(-sheet.frameWidth)
    expect(frameOffset(sheet, 3).x).toBe(-3 * sheet.frameWidth)
  })

  it('wraps rather than running off the end', () => {
    const { total } = sheetCapacity(sheet)
    expect(frameOffset(sheet, total)).toEqual(frameOffset(sheet, 0))
  })

  it('declares a walk whose frames all exist in the sheet', () => {
    const walk = sheet.animations.walk
    expect(walk, 'no walk animation declared').toBeDefined()
    expect(walk.from).toBeGreaterThanOrEqual(0)
    expect(walk.to).toBeLessThan(sheetCapacity(sheet).total)
  })

  it('has non-square frames, so the aspect was not squashed on the way in', () => {
    expect(sheet.frameWidth).not.toBe(sheet.frameHeight)
  })

  it('ships a file that matches its declared size and stays small', () => {
    expect(existsSync(FILE), 'companion-pet.png is missing').toBe(true)
    const bytes = statSync(FILE).size
    // The source it was cut from is 1.6 MB. The point of the cut is that the
    // committed sheet is nothing like that, on every page.
    expect(bytes).toBeLessThan(DEFAULT_MAX_BYTES)
    expect(bytes).toBeLessThan(50_000)
  })
})
