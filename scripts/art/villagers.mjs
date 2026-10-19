import { mirrorHalf } from './raster.mjs'
import { renderCharacter } from './character.mjs'
import { VILLAGER_PALETTES } from './palette.mjs'

/**
 * What makes one archetype read differently from another is what it wears or
 * carries, drawn over the shared body in `character.mjs`, so the silhouette
 * differs and colour is not the only thing telling them apart.
 */
const flip = (rows) => rows.map((r) => [...r].reverse().join(''))
const half = (rows) => rows.map(mirrorHalf)

const strawHat = half(['......oo', '....ooaa', '..ooaaaa', '.oAAaaaa', '.ooAAAAA'])
const cap = half(['.....ooo', '...occcc', '..occCcc', '..oCCCCC'])
const apron = {
  down: [13, half(['....owww', '....owWw', '....owww', '...owwww', '...owwWW'])],
  up: [14, half(['......ww', '......Ww'])],
  left: [
    13,
    ['...ow...........', '...oww..........', '...oww..........', '...owww.........', '...oWWW.........']
  ]
}
const bag = [
  '....nn..........',
  '.....nn.........',
  '......nn........',
  '.......nn...nnn.',
  '........nn.nNNn.',
  '...........nNNn.',
  '...........nnnn.'
]
const bandana = [5, half(['..occccc'])]

const OVERLAYS = {
  farmer: { down: [0, strawHat], up: [0, strawHat], left: [0, strawHat] },
  child: { down: [1, cap], up: [1, cap], left: [1, cap] },
  shopkeeper: apron,
  wanderer: {
    // Drawn as one overlay per view, so the bandana and the satchel travel together.
    down: [0, [...Array(5).fill('.'.repeat(16)), ...bandana[1], ...Array(7).fill('.'.repeat(16)), ...bag]],
    up: [0, [...Array(5).fill('.'.repeat(16)), ...bandana[1], ...Array(7).fill('.'.repeat(16)), ...flip(bag)]],
    left: [
      0,
      [
        ...Array(5).fill('.'.repeat(16)),
        '..occccccccccco.',
        ...Array(7).fill('.'.repeat(16)),
        '....n...........',
        '.....n..........',
        '......n...nnnn..',
        '.......n..nNNn..',
        '..........nNNn..',
        '..........nnnn..'
      ]
    ]
  }
}

for (const p of VILLAGER_PALETTES) {
  if (!OVERLAYS[p.archetype]) throw new Error(`villager palette "${p.name}": no overlay for "${p.archetype}"`)
}

export const villagerSheets = VILLAGER_PALETTES.map((p) => ({
  out: `src/assets/sprites/character/villager-${p.archetype}-${p.name}.png`,
  render: (out) => renderCharacter(p, out, OVERLAYS[p.archetype])
}))
