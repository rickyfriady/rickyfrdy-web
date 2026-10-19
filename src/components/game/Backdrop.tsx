import type { Ref } from 'react'
import { getSprite } from '@/utils/game/sprites'
import type { Season } from '@/utils/game/time'

const SEASON_ROW: Record<Season, number> = { spring: 0, summer: 1, autumn: 2, winter: 3 }

/** Strip heights in source pixels, matching `scripts/art/backdrop.mjs`. */
const HILL = { w: 64, h: 24, sheetH: 96 }
const TREE = { w: 48, h: 16, sheetH: 64 }

const hills = getSprite('hills')
const treeline = getSprite('treeline')

interface Props {
  /** How many tile rows of horizon the room opens with. */
  rows: number
  /** Room width in tiles. */
  width: number
  tilePx: number
  scale: number
  season: Season
  hillsRef: Ref<HTMLDivElement>
  treesRef: Ref<HTMLDivElement>
}

/**
 * The sky, distant hills and a treeline, behind the horizon rows of the valley.
 *
 * The sky is CSS from the palette tokens, so it follows the season and the
 * hour with nothing stored. The hills and treeline are repeating pixel strips;
 * with their art missing each falls back to a flat band, so the scene is whole
 * with every file removed. All of it is decoration and hidden from assistive
 * technology.
 */
export default function Backdrop({
  rows,
  width,
  tilePx,
  scale,
  season,
  hillsRef,
  treesRef
}: Props) {
  if (rows <= 0) return null
  const row = SEASON_ROW[season]
  const strip = (art: typeof hills, spec: typeof HILL, flat: string) =>
    art.url
      ? {
          height: spec.h * scale,
          backgroundImage: `url(${art.url})`,
          backgroundSize: `${spec.w * scale}px ${spec.sheetH * scale}px`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: `0px ${-row * spec.h * scale}px`
        }
      : { height: (spec.h / 2) * scale, background: flat }

  return (
    <div
      aria-hidden="true"
      className="valley-sky absolute top-0 left-0 overflow-hidden"
      style={{ width: width * tilePx, height: rows * tilePx }}
    >
      <div
        ref={hillsRef}
        className="pixel-sprite absolute bottom-0 left-0 w-full"
        style={strip(
          hills,
          HILL,
          'color-mix(in oklch, var(--color-accent) 22%, var(--color-background))'
        )}
      />
      <div
        ref={treesRef}
        className="pixel-sprite absolute bottom-0 left-0 w-full"
        style={strip(
          treeline,
          TREE,
          'color-mix(in oklch, var(--color-accent) 50%, var(--color-background))'
        )}
      />
    </div>
  )
}
