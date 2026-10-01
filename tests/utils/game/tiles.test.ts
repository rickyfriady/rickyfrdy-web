import { describe, expect, it } from 'vitest'
import { rooms } from '@/data/rooms'
import { cellAt, passOf, TILES } from '@/utils/game/tiles'

const town = (index: number) => ({ sheet: 'town', index })

describe('autotiling', () => {
  // A 4x4 road with a notch cut out of its top-left corner:
  //   ,,,,
  //   ,===
  //   ====
  //   ====
  const grid = [',,,,,,', ',,,===', ',=====', ',=====', ',,,,,,']

  it('picks corners and edges from the four neighbours', () => {
    expect(cellAt(grid, 3, 1, 'summer').ground).toEqual([town(12)]) // top-left corner
    expect(cellAt(grid, 4, 1, 'summer').ground).toEqual([town(13)]) // top edge
    expect(cellAt(grid, 5, 1, 'summer').ground).toEqual([town(13)]) // runs off the map edge
    expect(cellAt(grid, 1, 2, 'summer').ground).toEqual([town(12)]) // lower corner of the notch
    expect(cellAt(grid, 1, 3, 'summer').ground).toEqual([town(36)]) // bottom-left
    expect(cellAt(grid, 3, 3, 'summer').ground).toEqual([town(37)]) // bottom edge
  })

  it('cuts an inner corner where only a diagonal neighbour is missing', () => {
    // (3,2): road on all four sides, but its north-west diagonal (2,1) is grass.
    expect(cellAt(grid, 3, 2, 'summer').ground).toEqual([town(39)])
  })

  it('treats the map edge as more of the same, so a road can run off it', () => {
    const edge = ['==', '==']
    expect(cellAt(edge, 0, 0, 'summer').ground).toEqual([town(25)])
  })

  it('splits a run into left, middle and right pieces', () => {
    const roof = ['RRR']
    expect(cellAt(roof, 0, 0, 'summer').ground).toEqual([town(64)])
    expect(cellAt(roof, 1, 0, 'summer').ground).toEqual([town(65)])
    expect(cellAt(roof, 2, 0, 'summer').ground).toEqual([town(66)])
  })

  it('gives a door the look of the wall it is set into', () => {
    expect(cellAt(['W+W'], 1, 0, 'summer').ground).toEqual([town(74)])
    expect(cellAt(['Q+Q'], 1, 0, 'summer').ground).toEqual([town(78)])
  })
})

describe('layers', () => {
  it('puts trees on the object layer with grass beneath, so they can be walked behind', () => {
    const cell = cellAt(['T'], 0, 0, 'summer')
    expect(cell.object).toBeDefined()
    expect(cell.ground).toEqual([town(0)])
  })

  it('puts roof eaves over the characters', () => {
    expect(cellAt(['r'], 0, 0, 'summer').overhead).toBeDefined()
  })

  it('changes trees and flowers with the season', () => {
    expect(cellAt(['T'], 0, 0, 'summer').object).not.toEqual(cellAt(['T'], 0, 0, 'autumn').object)
    expect(cellAt(['*'], 0, 0, 'spring').ground).not.toEqual(cellAt(['*'], 0, 0, 'winter').ground)
  })
})

describe('the vocabulary', () => {
  it('reads an unknown code as solid, so a typo walls off a tile rather than opening one', () => {
    expect(passOf('?')).toBe('solid')
  })

  it('knows every code used in every room', () => {
    for (const room of rooms) {
      for (const row of room.grid) {
        for (const ch of row) expect(TILES[ch], `"${ch}" in ${room.id}`).toBeDefined()
      }
    }
  })
})
