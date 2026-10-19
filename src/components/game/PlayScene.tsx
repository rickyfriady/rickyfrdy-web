import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { QuestState, Stat } from '@/models'
import { gameEvents, initGame, recordEvent, resetGame } from '@/stores/game'
import { ambient } from '@/utils/ambient'
import { resolveById } from '@/utils/game/assets'
import { cameraOffset, parallaxShift } from '@/utils/game/camera'
import { doorAt, roomSize, surfaceUnder, TILE } from '@/utils/game/collision'
import { nearestFacing } from '@/utils/game/interact'
import { type Direction, type MoveInput, stepPosition } from '@/utils/game/movement'
import { questStates } from '@/utils/game/quests'
import type { SceneNpc, SceneObject, SceneRoom, SceneVillager } from '@/utils/game/scene'
import { usualSpot, whereIs } from '@/utils/game/schedule'
import {
  characterPose,
  fallbackKind,
  frameOffset,
  getSprite,
  integerScale
} from '@/utils/game/sprites'
import { cellAt, type Frame, horizonRows } from '@/utils/game/tiles'
import { growthOf, seasonOf, timeOfDay, type Weather } from '@/utils/game/time'
import { playSound } from '@/utils/sound'
import Ambient from './Ambient'
import Backdrop from './Backdrop'
import { framesStyle, hasSheet, parseTileSprite, swayVars } from './TileArt'
import { useAmbientAudio } from './useAmbientAudio'
import Villagers from './Villagers'

/** Viewport in tiles — deliberately smaller than a room, so the camera works. */
const VIEW_W = 15
const VIEW_H = 10
const BODY = 0.8
/* Tailwind's `md`. Kept as one constant so the mount gate and the `hidden
   md:block` wrapper in play.astro cannot drift apart. */
const WIDE_ENOUGH = '(min-width: 48rem)'

export interface ScenePlayer {
  name: string
  role: string
  stats: Stat[]
}

export interface SceneQuest {
  id: string
  npcId: string
  requires?: string
  title: string
  passages: string[]
  completedBy: string[]
  destination?: string
}

interface Props {
  rooms: SceneRoom[]
  npcs: SceneNpc[]
  /** Fictional background villagers: scenery, never listed anywhere. */
  villagers?: SceneVillager[]
  quests: SceneQuest[]
  player: ScenePlayer
  labels: Record<string, string>
  /** Derived at build time from real activity; `settled` when it was unavailable. */
  weather: Weather
  allowMobileHandheld?: boolean
}

type Panel = 'none' | 'journal' | 'sheet'

/** A room object, or a character placed by the hour, or the note left when one is away. */
type Placed = Omit<SceneObject, 'kind'> & { kind: SceneObject['kind'] | 'note' }

const CROP_FRAME: Record<ReturnType<typeof growthOf>, Frame> = {
  seedling: { sheet: 'farm', index: 40 },
  growing: { sheet: 'farm', index: 41 },
  ripe: { sheet: 'farm', index: 42 }
}

/** The player's directional sheet. Without its art the single-angle sprite takes over. */
const HERO = getSprite('hero-walk')

/** Stacking order for anything standing in the world: its bottom edge, in tenths of a tile. */
const depth = (bottom: number) => Math.floor(bottom * 10)

interface Dialogue {
  title: string
  passages: string[]
  href?: string
  linkLabel?: string
}

/**
 * The `/play` island.
 *
 * React owns everything that changes on a human timescale — which dialogue is
 * open, the journal, the encounter turn. The movement loop does not go through
 * React at all: position lives in a ref and the frame writes `transform`
 * straight to the node. `setState` at 120 Hz is the standard way this becomes
 * janky, and it is avoidable in about ten lines.
 */
/**
 * One object's art: illustrated if a file exists for its slug, the pixel sprite
 * if one does, the drawn stand-in otherwise.
 *
 * The precedence itself lives in `resolveById`, shared with `AssetImage` — this
 * only renders the answer. A failed load is handled here with React's own
 * `onError` rather than the document-level listener the Astro component ships,
 * because that listener is not guaranteed to be present on a route that mounts
 * only this island.
 *
 * The image is decorative: the object's name is already rendered as text
 * directly beneath it, so a screen reader loses nothing when art replaces the
 * stand-in.
 */
function ObjectArt({
  sprite,
  tilePx,
  frame
}: {
  sprite: string
  tilePx: number
  /** A tile-sheet frame to draw instead of a sprite file. */
  frame?: Frame | null
}) {
  const [failed, setFailed] = useState(false)
  const asset = useMemo(() => resolveById(sprite), [sprite])
  // A sheet frame draws from the sheet; with the sheet missing it takes the
  // same drawn stand-in as any sprite with no art.
  if (frame && hasSheet(frame.sheet)) {
    return (
      <div
        aria-hidden="true"
        style={{ width: tilePx, height: tilePx, ...framesStyle([frame], tilePx) }}
      />
    )
  }
  const floor = (
    <div
      className="sprite-fb pixel-sprite"
      aria-hidden="true"
      data-kind={fallbackKind(sprite)}
      style={{ ['--sprite-size' as string]: `${tilePx}px` }}
    />
  )

  if (frame || failed || asset.path === 'fallback' || !asset.url) return floor

  return (
    <img
      src={asset.url}
      srcSet={asset.srcset}
      alt=""
      aria-hidden="true"
      decoding="async"
      width={tilePx}
      height={tilePx}
      className={asset.path === 'illustrated' ? 'illustrated-art' : 'pixel-sprite'}
      style={{ width: tilePx, height: tilePx }}
      onError={() => setFailed(true)}
    />
  )
}

export default function PlayScene({
  rooms,
  npcs,
  villagers = [],
  quests,
  player,
  labels,
  weather,
  allowMobileHandheld = false
}: Props) {
  /* Read once: a visitor who asked for less motion gets a still scene, and the
     destination list below the stage is the interaction path. */
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  /* Below `md` the scene adapts to handheld mode if allowMobileHandheld is true. */
  const [wide, setWide] = useState(
    () => typeof window === 'undefined' || window.matchMedia(WIDE_ENOUGH).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(WIDE_ENOUGH)
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const isOperable = wide || allowMobileHandheld
  const isHandheld = !wide && allowMobileHandheld
  const viewCols = isHandheld ? 10 : VIEW_W
  const viewRows = isHandheld ? 8 : VIEW_H

  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '')
  const [dialogue, setDialogue] = useState<Dialogue | null>(null)
  const [passage, setPassage] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [panel, setPanel] = useState<Panel>('none')
  const [events, setEvents] = useState<string[]>([])
  const [scale, setScale] = useState(2)
  /* Read at mount and re-read each minute, never stored: the hour moves the
     characters and the date sets the season. */
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  const season = seasonOf(now)
  const hour = now.getHours()

  /* Villagers read the clock twice a second. A timer, not a frame loop, and not
     started at all for a visitor who asked for less motion or when not operable. */
  const [villagerNow, setVillagerNow] = useState(() => Date.now())
  useEffect(() => {
    if (reduced || !isOperable || villagers.length === 0) return
    const timer = window.setInterval(() => setVillagerNow(Date.now()), 500)
    return () => window.clearInterval(timer)
  }, [reduced, isOperable, villagers.length])
  const villagerEls = useRef(new Map<string, HTMLElement>())

  const stageRef = useRef<HTMLDivElement>(null)
  const audio = useAmbientAudio({ stageRef, allowed: !reduced && isOperable })
  const worldRef = useRef<HTMLDivElement>(null)
  const hillsRef = useRef<HTMLDivElement>(null)
  const treesRef = useRef<HTMLDivElement>(null)
  const actorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const keysRef = useRef<MoveInput>({ up: false, down: false, left: false, right: false })
  const facingRef = useRef<Direction>('down')
  const rafRef = useRef(0)
  const dialogueOpenRef = useRef(false)

  const room = useMemo(() => rooms.find((r) => r.id === roomId) ?? rooms[0], [rooms, roomId])
  const horizon = useMemo(() => horizonRows(room?.grid ?? []), [room])
  const roomVillagers = useMemo(
    () => villagers.filter((v) => v.room === room?.id),
    [villagers, room]
  )

  /* Everything that can be approached in this room at this hour: its objects,
     the characters scheduled here, and a note for anyone who usually is but is
     away. Crops take their frame from the project's own date. */
  const placed = useMemo<Placed[]>(() => {
    if (!room) return []
    const people: Placed[] = []
    for (const npc of npcs) {
      const stop = whereIs(npc.schedule, hour)
      if ('room' in stop) {
        if (stop.room !== room.id) continue
        people.push({
          id: npc.id,
          x: stop.x,
          y: stop.y,
          sprite: npc.sprite,
          kind: 'npc',
          slug: npc.id,
          title: npc.title,
          summary: npc.summary
        })
        continue
      }
      const usual = usualSpot(npc.schedule)
      if (usual?.room !== room.id) continue
      people.push({
        id: `${npc.id}-note`,
        x: usual.x,
        y: usual.y,
        sprite: 'tile:town:83',
        kind: 'note',
        slug: npc.id,
        title: npc.title,
        summary: stop.away
      })
    }
    return [...room.objects, ...people]
  }, [room, npcs, hour])

  /* Tiles resolve once per room and season, never in the frame loop. */
  const cells = useMemo(() => {
    if (!room) return []
    const { w, h } = roomSize(room)
    return Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => cellAt(room.grid, x, y, season))
    )
  }, [room, season])
  const movingRef = useRef(false)
  const movingSinceRef = useRef(0)
  const spriteRef = useRef<HTMLDivElement>(null)
  const poseRef = useRef('')
  const lastStepRef = useRef(-1)
  const states = useMemo(() => questStates(events, quests.map(toQuest)), [events, quests])
  const tilePx = TILE * scale

  dialogueOpenRef.current = dialogue !== null

  /* Restore saved progress once, then mirror the store into React state. */
  useEffect(() => {
    initGame()
    setEvents(gameEvents.get())
    return gameEvents.subscribe((next) => setEvents([...next]))
  }, [])

  /* Integer scale only: a fractional factor resamples every sprite to mush. */
  useEffect(() => {
    const measure = () => {
      const containerWidth =
        stageRef.current?.parentElement?.clientWidth ??
        (isHandheld ? 10 * TILE * 2 : VIEW_W * TILE * 2)
      const nativeWidth = viewCols * TILE
      setScale(Math.max(1, Math.min(3, integerScale(containerWidth, nativeWidth))))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isHandheld, viewCols])

  const paint = useCallback(() => {
    if (!room) return
    const pos = posRef.current
    const cam = cameraOffset(room, { x: pos.x + BODY / 2, y: pos.y + BODY / 2 }, viewCols, viewRows)
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${-Math.round(cam.x * tilePx)}px, ${-Math.round(cam.y * tilePx)}px, 0)`
    }
    // Far layers travel less than the camera. Under reduced motion they stay put.
    if (!reduced) {
      const camPx = Math.round(cam.x * tilePx)
      if (hillsRef.current)
        hillsRef.current.style.backgroundPositionX = `${parallaxShift(camPx, 0.25)}px`
      if (treesRef.current)
        treesRef.current.style.backgroundPositionX = `${parallaxShift(camPx, 0.5)}px`
    }
    // A villager within a step and a half of the player says its piece.
    for (const el of villagerEls.current.values()) {
      const dx = Number(el.dataset.x) + 0.5 - (pos.x + BODY / 2)
      const dy = Number(el.dataset.y) + 0.5 - (pos.y + BODY / 2)
      const near = dx * dx + dy * dy < 2.25 ? '1' : '0'
      if (el.dataset.near === near) continue
      el.dataset.near = near
      el.style.zIndex = near === '1' ? '9000' : (el.dataset.z ?? '')
    }
    if (actorRef.current) {
      const x = Math.round(pos.x * tilePx)
      const y = Math.round(pos.y * tilePx)
      actorRef.current.style.zIndex = String(depth(pos.y + BODY))
      if (HERO.sheet && HERO.url && spriteRef.current) {
        // The dip is drawn into the stepping frames, so the body is not bobbed here.
        const pose = characterPose(
          HERO.sheet,
          facingRef.current,
          movingRef.current,
          performance.now() - movingSinceRef.current
        )
        // A foot comes down on the second and fourth frames of the cycle, once each.
        const column = pose.frame % 4
        if (!movingRef.current || (column !== 1 && column !== 3)) lastStepRef.current = -1
        else if (lastStepRef.current !== pose.frame) {
          lastStepRef.current = pose.frame
          ambient.footstep(surfaceUnder(room, pos.x + BODY / 2, pos.y + BODY - 0.05))
        }
        const key = `${pose.frame}${pose.mirror}${scale}`
        if (key !== poseRef.current) {
          poseRef.current = key
          const offset = frameOffset(HERO.sheet, pose.frame)
          spriteRef.current.style.backgroundPosition = `${offset.x * scale}px ${offset.y * scale}px`
          spriteRef.current.style.transform = pose.mirror ? 'scaleX(-1)' : ''
        }
        actorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        return
      }
      // No directional sheet: a two-frame bob, and the single-angle art mirrors for left.
      const bob = movingRef.current && Math.floor(performance.now() / 160) % 2 === 1 ? -scale : 0
      const flip = facingRef.current === 'left' ? ' scaleX(-1)' : ''
      actorRef.current.style.transform = `translate3d(${x}px, ${y + bob}px, 0)${flip}`
    }
  }, [room, tilePx, scale, reduced, viewCols, viewRows])

  /* Spawn on room change; a door has already set the entry point if we came
     through one, so only a genuinely unplaced character gets moved. */
  useEffect(() => {
    if (!room) return
    if (posRef.current.x === 0 && posRef.current.y === 0) {
      posRef.current = { ...room.spawn }
    }
    paint()
  }, [room, paint])

  /* The loop. Under reduced motion it never starts at all. */
  useEffect(() => {
    if (reduced || !isOperable || !room) return
    let last = 0
    const frame = (now: number) => {
      const delta = last ? now - last : 0
      last = now
      if (!dialogueOpenRef.current) {
        const keys = keysRef.current
        const wasMoving = movingRef.current
        movingRef.current = keys.up || keys.down || keys.left || keys.right
        if (movingRef.current && !wasMoving) movingSinceRef.current = performance.now()
        posRef.current = stepPosition(room, posRef.current, keys, delta)
        const door = doorAt(room, posRef.current.x + BODY / 2, posRef.current.y + BODY / 2)
        if (door) {
          // One step: the character is never in neither room.
          posRef.current = { ...door.entry }
          keysRef.current = { up: false, down: false, left: false, right: false }
          setRoomId(door.to)
          playSound('drawer')
          return
        }
      }
      paint()
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [room, reduced, isOperable, paint])

  /* Character-by-character reveal, skipped entirely under reduced motion. */
  const text = dialogue?.passages[passage] ?? ''
  useEffect(() => {
    if (!dialogue) return
    if (reduced) {
      setRevealed(text.length)
      return
    }
    setRevealed(0)
    const timer = window.setInterval(() => {
      setRevealed((n) => {
        if (n >= text.length) {
          window.clearInterval(timer)
          return n
        }
        return n + 2
      })
    }, 16)
    return () => window.clearInterval(timer)
  }, [dialogue, text, reduced])

  const openDialogue = useCallback((next: Dialogue) => {
    setDialogue(next)
    setPassage(0)
    playSound('drawer')
  }, [])

  const closeDialogue = useCallback(() => {
    setDialogue(null)
    setPassage(0)
    stageRef.current?.focus()
  }, [])

  const advance = useCallback(() => {
    if (!dialogue) return
    if (revealed < text.length) {
      setRevealed(text.length)
      return
    }
    if (passage < dialogue.passages.length - 1) {
      setPassage((n) => n + 1)
      playSound('tick')
      return
    }
    closeDialogue()
  }, [dialogue, revealed, text, passage, closeDialogue])

  const interact = useCallback(() => {
    if (!room) return
    const target = nearestFacing(placed, posRef.current, facingRef.current)
    if (!target) return // Nothing in reach: silence, not an error.
    if (target.kind === 'note') {
      openDialogue({ title: target.title, passages: [target.summary] })
      return
    }
    if (target.kind === 'npc') {
      recordEvent(`talk:${target.slug}`)
      const quest = quests.find((q) => q.npcId === target.slug)
      openDialogue({
        title: `${target.title}, ${target.summary}`,
        passages: quest ? quest.passages : [target.summary],
        href: quest?.destination,
        linkLabel: labels.open
      })
      return
    }
    recordEvent(`inspect:${target.slug}`)
    openDialogue({
      title: target.title,
      passages: [target.summary],
      href: target.href,
      linkLabel: labels.open
    })
  }, [room, placed, quests, labels.open, openDialogue])

  const setKey = (event: React.KeyboardEvent, down: boolean): boolean => {
    const keys = keysRef.current
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        keys.up = down
        if (down) facingRef.current = 'up'
        return true
      case 's':
      case 'S':
      case 'ArrowDown':
        keys.down = down
        if (down) facingRef.current = 'down'
        return true
      case 'a':
      case 'A':
      case 'ArrowLeft':
        keys.left = down
        if (down) facingRef.current = 'left'
        return true
      case 'd':
      case 'D':
      case 'ArrowRight':
        keys.right = down
        if (down) facingRef.current = 'right'
        return true
      default:
        return false
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (dialogue) closeDialogue()
      else if (panel !== 'none') setPanel('none')
      return
    }
    if (event.key === 'e' || event.key === 'E' || event.key === 'Enter') {
      event.preventDefault()
      dialogue ? advance() : interact()
      return
    }
    if (event.key === 'q' || event.key === 'Q') {
      setPanel((p) => (p === 'journal' ? 'none' : 'journal'))
      return
    }
    if (event.key === 'c' || event.key === 'C') {
      setPanel((p) => (p === 'sheet' ? 'none' : 'sheet'))
      return
    }
    // Arrows are consumed so the page does not scroll out from under the scene.
    if (setKey(event, true) && event.key.startsWith('Arrow')) event.preventDefault()
  }

  const onKeyUp = (event: React.KeyboardEvent) => {
    setKey(event, false)
  }

  /* A key held while the window loses focus would otherwise stay held forever. */
  const clearKeys = useCallback(() => {
    keysRef.current = { up: false, down: false, left: false, right: false }
  }, [])

  useEffect(() => {
    window.addEventListener('blur', clearKeys)
    return () => window.removeEventListener('blur', clearKeys)
  }, [clearKeys])

  /* Touch moves one direction at a time — a thumb cannot hold two. */
  const holdDirection = (direction: Direction, down: boolean) => {
    keysRef.current = { up: false, down: false, left: false, right: false }
    if (down) {
      keysRef.current[direction] = true
      facingRef.current = direction
    }
  }

  const onCanvasPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dialogueOpenRef.current) {
      advance()
      return
    }

    const stage = stageRef.current
    if (!stage || !room) return
    stage.focus()

    const rect = stage.getBoundingClientRect()
    const clientX = event.clientX - rect.left
    const clientY = event.clientY - rect.top

    // Convert pixel coordinates within stage to tile coordinates
    const cam = cameraOffset(
      room,
      { x: posRef.current.x + BODY / 2, y: posRef.current.y + BODY / 2 },
      viewCols,
      viewRows
    )
    const tappedTileX = Math.floor(clientX / tilePx + cam.x)
    const tappedTileY = Math.floor(clientY / tilePx + cam.y)

    // Check if user tapped directly on an NPC or placed object
    const targetObject = placed.find(
      (obj) => Math.round(obj.x) === tappedTileX && Math.round(obj.y) === tappedTileY
    )

    if (targetObject) {
      const dx = targetObject.x - posRef.current.x
      const dy = targetObject.y - posRef.current.y
      if (Math.abs(dx) > Math.abs(dy)) {
        facingRef.current = dx > 0 ? 'right' : 'left'
      } else {
        facingRef.current = dy > 0 ? 'down' : 'up'
      }
      if (dx * dx + dy * dy <= 4) {
        interact()
        return
      }
    }

    // Step toward the tapped tile
    const currentX = posRef.current.x
    const currentY = posRef.current.y
    const diffX = tappedTileX - currentX
    const diffY = tappedTileY - currentY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      const dir: Direction = diffX > 0 ? 'right' : 'left'
      holdDirection(dir, true)
      setTimeout(() => holdDirection(dir, false), 150)
    } else if (Math.abs(diffY) > 0.2) {
      const dir: Direction = diffY > 0 ? 'down' : 'up'
      holdDirection(dir, true)
      setTimeout(() => holdDirection(dir, false), 150)
    }
  }

  if (!room) return null

  if (!isOperable) return null

  return (
    <div
      className={
        isHandheld
          ? 'handheld-chassis pixel-frame relative mx-auto flex w-full max-w-sm flex-col gap-3 bg-surface p-3 border-4 border-border shadow-md'
          : 'flex flex-col gap-3'
      }
    >
      {/* Handheld top status header */}
      {isHandheld && (
        <div className="flex items-center justify-between border-b-2 border-border px-1 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 animate-pulse bg-accent" aria-hidden="true" />
            <span className="font-display text-[0.65rem] tracking-widest uppercase text-muted">
              VALLEY · POCKET
            </span>
          </div>
          <span className="font-mono text-[0.6rem] text-muted">{room.name}</span>
        </div>
      )}

      {/* Desktop HUD */}
      {!isHandheld && (
        <div className="game-hud">
          <span>{room.name}</span>
          <span className="flex gap-2">
            <button type="button" className="menu-cursor px-2" onClick={() => setPanel('journal')}>
              [Q] {labels.journal}
            </button>
            <button type="button" className="menu-cursor px-2" onClick={() => setPanel('sheet')}>
              [C] {labels.sheet}
            </button>
          </span>
        </div>
      )}

      {/* Screen container */}
      <div
        className={
          isHandheld
            ? 'handheld-bezel flex flex-col items-center justify-center border-4 border-border bg-background p-1 shadow-inner'
            : ''
        }
      >
        <div
          ref={stageRef}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the scene is a keyboard surface; focus can always leave it with Tab, and the destination list below is the non-keyboard path.
          tabIndex={0}
          role="application"
          aria-label={labels.sceneName}
          className="game-stage relative mx-auto overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          style={{ width: viewCols * tilePx, height: viewRows * tilePx, touchAction: 'none' }}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={clearKeys}
          onPointerDown={onCanvasPointerDown}
        >
          {/* Every layer below is decorative: the destination list outside the
            stage carries the same content as text. */}
          <div
            ref={worldRef}
            className="absolute top-0 left-0 will-change-transform"
            aria-hidden="true"
          >
            <Backdrop
              rows={horizon}
              width={room.grid[0]?.length ?? 0}
              tilePx={tilePx}
              scale={scale}
              season={season}
              hillsRef={hillsRef}
              treesRef={treesRef}
            />

            {/* Ground: one node per tile, resolved once per room and season. */}
            {cells.map((row, y) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: in a tile grid the index IS the identity — row 3 is always row 3, and the list never reorders.
              <div key={`${room.id}-${y}`} className="flex" style={{ height: tilePx }}>
                {row.map((cell, x) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: same — a tile's coordinate is its identity.
                    key={`${room.id}-${y}-${x}`}
                    className="block"
                    style={{
                      width: tilePx,
                      height: tilePx,
                      ...framesStyle(cell.ground, tilePx, cell.kind)
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Objects: trees, things, people. Sorted by their bottom edge, so a
              character standing north of a tree is drawn behind it. */}
            {cells.flatMap((row, y) =>
              row.map((cell, x) =>
                cell.object ? (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: coordinate identity, as above.
                    key={`o-${room.id}-${y}-${x}`}
                    className="absolute block"
                    style={{
                      left: x * tilePx,
                      top: y * tilePx,
                      width: tilePx,
                      height: tilePx,
                      zIndex: depth(y + 1),
                      ...framesStyle([cell.object], tilePx, 'solid')
                    }}
                  />
                ) : null
              )
            )}

            {placed.map((object) => (
              <div
                key={object.id}
                className="scene-object absolute flex flex-col items-center"
                style={{
                  width: tilePx,
                  zIndex: depth(object.y + 1),
                  transform: `translate3d(${object.x * tilePx}px, ${object.y * tilePx}px, 0)`,
                  transition: reduced ? 'none' : undefined
                }}
              >
                <ObjectArt
                  sprite={object.sprite}
                  tilePx={tilePx}
                  frame={
                    object.sprite === 'crop'
                      ? CROP_FRAME[growthOf(object.date, now)]
                      : parseTileSprite(object.sprite)
                  }
                />
                {/* Two tiles wide at most, so neighbours two apart never overlap;
                  the full title is in the dialogue and the destination list. */}
                <span
                  className="scene-label mt-1 truncate font-mono text-[0.5rem] uppercase"
                  style={{ maxWidth: tilePx * 2 - 4 }}
                >
                  {object.place ?? object.title}
                </span>
              </div>
            ))}

            <Villagers
              villagers={roomVillagers}
              nowMs={villagerNow}
              still={reduced}
              tilePx={tilePx}
              scale={scale}
              elements={villagerEls}
            />

            {/* The ref stays on the positioned wrapper so the loop keeps mutating one
              element's transform; the art inside resolves like every other slot. */}
            <div ref={actorRef} className="absolute top-0 left-0 will-change-transform">
              {HERO.sheet && HERO.url ? (
                <>
                  <span
                    aria-hidden="true"
                    className="char-shadow absolute"
                    style={{
                      width: 10 * scale,
                      height: 3 * scale,
                      left: Math.round((BODY * tilePx - 10 * scale) / 2),
                      top: Math.round(BODY * tilePx - 2 * scale)
                    }}
                  />
                  <div
                    ref={spriteRef}
                    aria-hidden="true"
                    className="pixel-sprite absolute"
                    style={{
                      width: tilePx,
                      height: 24 * scale,
                      left: Math.round((BODY * tilePx - tilePx) / 2),
                      top: Math.round(BODY * tilePx - 24 * scale),
                      backgroundImage: `url(${HERO.url})`,
                      backgroundSize: `${HERO.sheet.width * scale}px ${HERO.sheet.height * scale}px`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </>
              ) : (
                <ObjectArt sprite="hero" tilePx={Math.round(BODY * tilePx)} />
              )}
            </div>

            {/* Overhead: roof eaves drawn over anyone walking behind a building. */}
            {cells.flatMap((row, y) =>
              row.map((cell, x) =>
                cell.overhead ? (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: coordinate identity, as above.
                    key={`h-${room.id}-${y}-${x}`}
                    className={
                      cell.sway && !reduced ? 'canopy-sway absolute block' : 'absolute block'
                    }
                    style={{
                      left: x * tilePx,
                      top: y * tilePx,
                      width: tilePx,
                      height: tilePx,
                      zIndex: 10_000,
                      ...framesStyle([cell.overhead], tilePx),
                      ...(cell.sway && !reduced ? swayVars(cell.overhead, x, y, tilePx) : {})
                    }}
                  />
                ) : null
              )
            )}
          </div>

          {/* Wind and light over the valley. Not mounted for a visitor who asked for
            less motion, below `md`, or indoors, so there is nothing to stop. */}
          {!reduced && isOperable && horizon > 0 && (
            <Ambient
              season={season}
              night={timeOfDay(now) === 'night'}
              scale={scale}
              viewW={viewCols * TILE}
              viewH={viewRows * TILE}
            />
          )}

          {/* Night and weather are a change of state, not an animation: a veil
            over the stage chosen once from the clock and the week's activity. */}
          <div className="scene-sky" data-weather={weather} aria-hidden="true" />
        </div>
      </div>

      {/* Controls: Desktop vs Handheld */}
      {!isHandheld && (
        <>
          <p className="text-muted text-center font-mono text-[0.65rem]">{labels.controls}</p>
          {audio.supported && !reduced && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="dpad-key px-3"
                aria-pressed={audio.enabled}
                onClick={() => audio.setEnabled(!audio.enabled)}
              >
                {audio.enabled ? labels.ambientOn : labels.ambientOff}
              </button>
              <input
                type="range"
                className="ambient-range"
                min={0}
                max={100}
                step={5}
                value={Math.round(audio.volume * 100)}
                aria-label={labels.ambientVolume}
                onChange={(e) => audio.setVolume(Number(e.target.value) / 100)}
              />
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            {(['left', 'up', 'down', 'right'] as Direction[]).map((direction) => (
              <button
                key={direction}
                type="button"
                className="dpad-key"
                aria-label={labels[`dir_${direction}`] ?? direction}
                onPointerDown={() => holdDirection(direction, true)}
                onPointerUp={() => holdDirection(direction, false)}
                onPointerLeave={() => holdDirection(direction, false)}
              >
                {{ up: '▲', down: '▼', left: '◀', right: '▶' }[direction]}
              </button>
            ))}
            <button
              type="button"
              className="dpad-key px-3"
              onClick={() => (dialogue ? advance() : interact())}
            >
              {labels.interact}
            </button>
          </div>
        </>
      )}

      {/* Handheld Gamepad Controls (Mobile) */}
      {isHandheld && (
        <div className="mt-2 flex flex-col gap-3 px-1">
          <div className="flex items-center justify-between">
            {/* 4-way D-Pad */}
            <fieldset
              className="dpad-cross relative h-32 w-32 select-none"
              style={{ touchAction: 'none' }}
              aria-label="Directional controls"
            >
              <button
                type="button"
                aria-label={labels.dir_up ?? 'Up'}
                className="absolute top-0 left-11 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm active:bg-accent active:text-background"
                onPointerDown={(e) => {
                  e.preventDefault()
                  holdDirection('up', true)
                }}
                onPointerUp={() => holdDirection('up', false)}
                onPointerCancel={() => holdDirection('up', false)}
                onPointerLeave={() => holdDirection('up', false)}
              >
                ▲
              </button>
              <button
                type="button"
                aria-label={labels.dir_left ?? 'Left'}
                className="absolute top-11 left-0 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm active:bg-accent active:text-background"
                onPointerDown={(e) => {
                  e.preventDefault()
                  holdDirection('left', true)
                }}
                onPointerUp={() => holdDirection('left', false)}
                onPointerCancel={() => holdDirection('left', false)}
                onPointerLeave={() => holdDirection('left', false)}
              >
                ◀
              </button>
              <div
                className="absolute top-11 left-11 h-11 w-11 border-border bg-secondary"
                aria-hidden="true"
              />
              <button
                type="button"
                aria-label={labels.dir_right ?? 'Right'}
                className="absolute top-11 right-0 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm active:bg-accent active:text-background"
                onPointerDown={(e) => {
                  e.preventDefault()
                  holdDirection('right', true)
                }}
                onPointerUp={() => holdDirection('right', false)}
                onPointerCancel={() => holdDirection('right', false)}
                onPointerLeave={() => holdDirection('right', false)}
              >
                ▶
              </button>
              <button
                type="button"
                aria-label={labels.dir_down ?? 'Down'}
                className="absolute bottom-0 left-11 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm active:bg-accent active:text-background"
                onPointerDown={(e) => {
                  e.preventDefault()
                  holdDirection('down', true)
                }}
                onPointerUp={() => holdDirection('down', false)}
                onPointerCancel={() => holdDirection('down', false)}
                onPointerLeave={() => holdDirection('down', false)}
              >
                ▼
              </button>
            </fieldset>

            {/* Action Buttons (B & A) */}
            <div className="flex items-center gap-3 pr-2">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Back or cancel (B)"
                  className="flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm font-bold shadow-sm active:bg-accent active:text-background"
                  onClick={() => {
                    if (dialogue) closeDialogue()
                    else if (panel !== 'none') setPanel('none')
                    playSound('drawer')
                  }}
                >
                  B
                </button>
                <span className="mt-1 font-mono text-[0.6rem] uppercase text-muted">Back</span>
              </div>
              <div className="-translate-y-3 flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Action or interact (A)"
                  className="flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-border bg-secondary font-mono text-sm font-bold shadow-sm active:bg-accent active:text-background"
                  onClick={() => {
                    if (dialogue) advance()
                    else interact()
                    playSound('drawer')
                  }}
                >
                  A
                </button>
                <span className="mt-1 font-mono text-[0.6rem] uppercase text-muted">Act</span>
              </div>
            </div>
          </div>

          {/* Menu / Secondary Controls (SELECT & START) */}
          <div className="flex w-full items-center justify-center gap-6 border-t border-border/40 pt-2">
            <button
              type="button"
              aria-label={labels.journal}
              className="group flex min-h-[44px] flex-col items-center justify-center px-3"
              onClick={() => {
                setPanel((p) => (p === 'journal' ? 'none' : 'journal'))
                playSound('drawer')
              }}
            >
              <span className="block h-3 w-10 border border-border bg-secondary group-active:bg-accent" />
              <span className="mt-1 font-mono text-[0.55rem] tracking-wider uppercase text-muted">
                SELECT
              </span>
            </button>
            <button
              type="button"
              aria-label={labels.sheet}
              className="group flex min-h-[44px] flex-col items-center justify-center px-3"
              onClick={() => {
                setPanel((p) => (p === 'sheet' ? 'none' : 'sheet'))
                playSound('drawer')
              }}
            >
              <span className="block h-3 w-10 border border-border bg-secondary group-active:bg-accent" />
              <span className="mt-1 font-mono text-[0.55rem] tracking-wider uppercase text-muted">
                START
              </span>
            </button>
            {audio.supported && !reduced && (
              <button
                type="button"
                aria-pressed={audio.enabled}
                className="group flex min-h-[44px] flex-col items-center justify-center px-2"
                onClick={() => audio.setEnabled(!audio.enabled)}
              >
                <span
                  className={`block h-3 w-3 border border-border ${
                    audio.enabled ? 'bg-accent' : 'bg-secondary'
                  }`}
                />
                <span className="mt-1 font-mono text-[0.55rem] tracking-wider uppercase text-muted">
                  {audio.enabled ? 'MUTE' : 'SOUND'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dialogue */}
      {dialogue && (
        // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: pointer shortcut only — E/Enter and the button below are the keyboard path.
        <div
          className="game-dialogue mx-auto w-full max-w-2xl cursor-pointer select-none"
          onClick={advance}
        >
          <p className="font-display text-base">▸ {dialogue.title}</p>
          <p className="mt-2 min-h-[3rem] text-sm leading-relaxed">{text.slice(0, revealed)}</p>
          <div className="mt-3 flex flex-wrap gap-4 font-mono text-[0.65rem]">
            <button
              type="button"
              className="menu-cursor"
              onClick={(e) => {
                e.stopPropagation()
                advance()
              }}
            >
              [E / A] {passage < dialogue.passages.length - 1 ? labels.next : labels.close}
            </button>
            {dialogue.href && (
              <a
                className="menu-cursor text-accent"
                href={dialogue.href}
                onClick={(e) => e.stopPropagation()}
              >
                {dialogue.linkLabel} →
              </a>
            )}
            <button
              type="button"
              className="menu-cursor"
              onClick={(e) => {
                e.stopPropagation()
                closeDialogue()
              }}
            >
              [ESC / B] {labels.close}
            </button>
          </div>
        </div>
      )}

      {panel === 'journal' && (
        <section
          className="evidence-panel mx-auto w-full max-w-2xl p-4"
          aria-label={labels.journal}
        >
          <h2 className="font-display text-lg">{labels.journal}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {quests.map((quest) => (
              <li key={quest.id} className="text-sm">
                <span className="text-foreground">{quest.title}</span>{' '}
                <span className="text-muted font-mono text-[0.65rem]">
                  , {labels[`state_${states[quest.id] as QuestState}`]}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-4 font-mono text-[0.65rem]">
            <button
              type="button"
              className="menu-cursor text-accent"
              onClick={() => {
                if (window.confirm(labels.resetConfirm)) resetGame()
              }}
            >
              {labels.reset}
            </button>
            <button type="button" className="menu-cursor" onClick={() => setPanel('none')}>
              [ESC] {labels.close}
            </button>
          </div>
        </section>
      )}

      {panel === 'sheet' && (
        <section className="evidence-panel mx-auto w-full max-w-2xl p-4" aria-label={labels.sheet}>
          <h2 className="font-display text-lg">{labels.sheet}</h2>
          <p className="text-muted mt-1 text-sm">
            {player.name} · {player.role}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {player.stats.map((stat) => (
              <li key={stat.name} className="flex items-center gap-3 text-sm">
                <span className="w-32 truncate">{stat.name}</span>
                <span className="font-mono text-[0.7rem]">Lv.{stat.level}</span>
                <span
                  className="stat-bar"
                  aria-hidden="true"
                  style={{ ['--stat-fill' as string]: stat.level }}
                />
              </li>
            ))}
          </ul>
          <p className="text-muted mt-4 text-xs leading-relaxed">{labels.statBasis}</p>
          <button
            type="button"
            className="menu-cursor mt-3 font-mono text-[0.65rem]"
            onClick={() => setPanel('none')}
          >
            [ESC] {labels.close}
          </button>
        </section>
      )}
    </div>
  )
}

/** The island receives quests already localized; the state machine needs the shape back. */
function toQuest(quest: SceneQuest) {
  return {
    id: quest.id,
    npcId: quest.npcId,
    title: { en: quest.title, id: quest.title },
    passages: quest.passages.map((p) => ({ en: p, id: p })),
    completedBy: quest.completedBy,
    requires: quest.requires,
    destination: quest.destination
  }
}
