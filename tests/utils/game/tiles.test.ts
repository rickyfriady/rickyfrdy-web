import { describe, expect, it } from 'vitest'
import { rooms } from '@/data/rooms'
import { cellAt, horizonRows, passOf, surfaceOf, TILES } from '@/utils/game/tiles'

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

describe('props', () => {
  it('a table is solid, sorts with characters and stands on grass', () => {
    expect(passOf('M')).toBe('solid')
    const cell = cellAt([',M,'], 1, 0, 'summer')
    expect(cell.object).toEqual({ sheet: 'props', index: 0 })
    expect(cell.ground).toEqual([town(0)])
  })
})

describe('the two-cell tree', () => {
  const seasons = ['spring', 'summer', 'autumn', 'winter'] as const

  it('the trunk blocks its lower half and sorts with characters', () => {
    expect(passOf('y')).toBe('trunk')
    expect(cellAt([',y,'], 1, 0, 'spring').object).toEqual({ sheet: 'props', index: 12 })
    expect(cellAt([',y,'], 1, 0, 'winter').object).toEqual({ sheet: 'props', index: 15 })
  })

  it('the crown is walkable and drawn over the player, so they can stand behind it', () => {
    expect(passOf('Y')).toBe('walk')
    const cell = cellAt([',Y,'], 1, 0, 'summer')
    expect(cell.overhead).toBeDefined()
    expect(cell.object).toBeUndefined()
    expect(cell.sway).toBe(true)
  })

  it('the crown changes colour with the season, one row of the sheet per season', () => {
    const rows = seasons.map((s) => cellAt([',Y,'], 1, 0, s).overhead)
    expect(rows.map((f) => f?.index)).toEqual([24, 36, 48, 60])
  })

  it('nothing else sways', () => {
    expect(cellAt([',T,'], 1, 0, 'summer').sway).toBeUndefined()
    expect(cellAt([',r,'], 1, 0, 'summer').sway).toBeUndefined()
  })
})

describe('the prop vocabulary', () => {
  const furniture = ['M', 'h', 'B', 'V', 'P', 'K']
  const ornaments = ['F', 'N', 'u']

  it('every named prop exists: table, chair, bench, vase, pot, barrel, a second tree', () => {
    const names = Object.values(TILES).map((t) => t.name)
    for (const name of ['round table', 'chair', 'bench', 'flower vase', 'plant pot', 'barrel']) {
      expect(names, name).toContain(name)
    }
    expect(names).toContain('trunk')
    expect(names).toContain('crown')
  })

  it('furniture blocks and sorts with characters', () => {
    for (const ch of furniture) {
      expect(passOf(ch), ch).toBe('solid')
      expect(cellAt([`,${ch},`], 1, 0, 'summer').object, ch).toBeDefined()
    }
  })

  it('ornaments are walkable ground and never interactive', () => {
    for (const ch of ornaments) {
      expect(passOf(ch), ch).toBe('walk')
      const cell = cellAt([`,${ch},`], 1, 0, 'summer')
      expect(cell.object, ch).toBeUndefined()
      expect(cell.overhead, ch).toBeUndefined()
      expect(cell.ground.length, ch).toBe(2)
    }
  })

  it('a bench is as long as its run, with its own end pieces', () => {
    const row = [',BBB,']
    const frames = [1, 2, 3].map((x) => cellAt(row, x, 0, 'summer').object?.index)
    expect(frames).toEqual([2, 3, 4])
  })

  it('an unknown character is still solid', () => {
    expect(passOf('@')).toBe('solid')
  })
})

describe('horizonRows()', () => {
  it('counts the leading rows that are nothing but horizon', () => {
    expect(horizonRows(['^^^^', '^^^^', 'TTTT', ',,,,'])).toBe(2)
    expect(horizonRows(['TTTT', '^^^^'])).toBe(0)
    expect(horizonRows([])).toBe(0)
  })

  it('draws nothing and blocks, so the backdrop shows through', () => {
    expect(passOf('^')).toBe('solid')
    expect(cellAt(['^'], 0, 0, 'summer')).toEqual({ ground: [], kind: 'sky' })
  })

  it('the valley opens with three rows and no interior has any', () => {
    expect(horizonRows(rooms[0].grid)).toBe(3)
    for (const room of rooms.slice(1)) expect(horizonRows(room.grid), room.id).toBe(0)
  })
})

describe('surfaceOf()', () => {
  it('rings on a path, boards, stairs and a doorway; muffled on everything else', () => {
    for (const ch of '=.S+') expect(surfaceOf(ch), ch).toBe('path')
    for (const ch of ',"*Fu') expect(surfaceOf(ch), ch).toBe('grass')
  })
})
