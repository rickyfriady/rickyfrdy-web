/**
 * Renders the hand-drawn world art from the drawings in `scripts/art/` to PNG.
 *
 * The PNGs are committed, so a build never runs this. Run it after changing a
 * drawing:
 *   node scripts/build-world-art.mjs
 */
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { renderHills, renderTreeline } from './art/backdrop.mjs'
import { renderCharacter } from './art/character.mjs'
import { HERO } from './art/palette.mjs'
import { renderProps } from './art/props.mjs'
import { villagerSheets } from './art/villagers.mjs'

/** Each entry: `{ out, render }`, where `render(out)` writes one PNG. */
const SHEETS = [
  {
    out: 'src/assets/sprites/character/hero-walk.png',
    render: (out) => renderCharacter(HERO, out)
  },
  { out: 'src/assets/sprites/tiles/props.png', render: renderProps },
  { out: 'src/assets/sprites/backdrop/hills.png', render: renderHills },
  { out: 'src/assets/sprites/backdrop/treeline.png', render: renderTreeline },
  ...villagerSheets
]

for (const sheet of SHEETS) {
  await mkdir(dirname(sheet.out), { recursive: true })
  await sheet.render(sheet.out)
  console.log(`wrote ${sheet.out}`)
}
console.log(`${SHEETS.length} sheet(s) rendered`)
