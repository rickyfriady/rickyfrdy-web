import { type MutableRefObject, useMemo } from 'react'
import type { SceneVillager } from '@/utils/game/scene'
import { getSprite } from '@/utils/game/sprites'
import { remarkAt, villagerAt, villagerAtRest } from '@/utils/game/villagers'

interface Props {
  villagers: SceneVillager[]
  nowMs: number
  /** Reduced motion: stand at the first spot, never walk. */
  still: boolean
  tilePx: number
  scale: number
  /** Rendered wrappers by id, so the scene's frame loop can flag the one in earshot. */
  elements: MutableRefObject<Map<string, HTMLElement>>
}

/** Row of the sheet for a facing; right is the left row, mirrored. */
const ROW = { down: 0, up: 1, left: 2, right: 2 } as const
const FRAME_H = 24
const FRAME_W = 16
const FRAMES = 4

/**
 * Background villagers: scenery that walks.
 *
 * Decorative by contract. The whole layer is hidden from assistive technology,
 * none of it is focusable or interactive, and it is never part of what the
 * scene reports: a villager is not a person the site represents.
 */
export default function Villagers({ villagers, nowMs, still, tilePx, scale, elements }: Props) {
  return (
    <>
      {villagers.map((v) => (
        <Figure
          key={v.id}
          villager={v}
          nowMs={nowMs}
          still={still}
          tilePx={tilePx}
          scale={scale}
          elements={elements}
        />
      ))}
    </>
  )
}

function Figure({
  villager,
  nowMs,
  still,
  tilePx,
  scale,
  elements
}: Omit<Props, 'villagers'> & { villager: SceneVillager }) {
  const art = useMemo(() => getSprite(villager.sheet), [villager.sheet])
  const state = still ? villagerAtRest(villager) : villagerAt(villager, nowMs)
  const z = Math.floor((state.spot.y + 1) * 10)
  const frameH = FRAME_H * scale
  const mirrored = state.facing === 'right'

  return (
    <div
      ref={(el) => {
        if (el) elements.current.set(villager.id, el)
        else elements.current.delete(villager.id)
      }}
      aria-hidden="true"
      className="villager scene-object absolute"
      data-x={state.spot.x}
      data-y={state.spot.y}
      data-z={z}
      style={{
        width: tilePx,
        height: tilePx,
        zIndex: z,
        transform: `translate3d(${state.spot.x * tilePx}px, ${state.spot.y * tilePx}px, 0)`,
        transition: still ? 'none' : undefined
      }}
    >
      <span
        className="char-shadow absolute"
        style={{
          width: 10 * scale,
          height: 3 * scale,
          left: Math.round((tilePx - 10 * scale) / 2),
          top: tilePx - 2 * scale
        }}
      />
      {art.url && art.sheet ? (
        <div
          className={`pixel-sprite absolute ${state.moving ? 'villager-walk' : ''}`}
          style={{
            width: tilePx,
            height: frameH,
            left: 0,
            top: tilePx - frameH,
            backgroundImage: `url(${art.url})`,
            backgroundSize: `${art.sheet.width * scale}px ${art.sheet.height * scale}px`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `0px ${-ROW[state.facing] * frameH}px`,
            transform: mirrored ? 'scaleX(-1)' : undefined,
            ['--walk-end' as string]: `${-FRAMES * FRAME_W * scale}px`
          }}
        />
      ) : (
        <div
          className="sprite-fb pixel-sprite"
          data-kind="npc"
          style={{ ['--sprite-size' as string]: `${tilePx}px` }}
        />
      )}
      <span
        className="villager-remark absolute"
        style={{ left: tilePx / 2, top: tilePx - frameH - 4, maxWidth: tilePx * 5 }}
      >
        {remarkAt(villager, nowMs)}
      </span>
    </div>
  )
}
