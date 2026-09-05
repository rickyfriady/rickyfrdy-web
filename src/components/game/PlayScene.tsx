import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { QuestState, Stat } from '@/models'
import { gameEvents, initGame, recordEvent, resetGame } from '@/stores/game'
import { resolveById } from '@/utils/game/assets'
import { cameraOffset } from '@/utils/game/camera'
import { doorAt, TILE } from '@/utils/game/collision'
import { damageFor, moves, opponents } from '@/utils/game/encounter'
import { nearestFacing } from '@/utils/game/interact'
import { type Direction, type MoveInput, stepPosition } from '@/utils/game/movement'
import { questStates } from '@/utils/game/quests'
import { mulberry32, seedFrom } from '@/utils/game/random'
import type { SceneRoom } from '@/utils/game/scene'
import { fallbackKind, integerScale } from '@/utils/game/sprites'
import { playSound } from '@/utils/sound'

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
  quests: SceneQuest[]
  player: ScenePlayer
  labels: Record<string, string>
  /** Opponent names live in data as `{ en, id }`; the island picks the side. */
  lang: 'en' | 'id'
}

type Panel = 'none' | 'journal' | 'sheet' | 'encounter'

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
function ObjectArt({ sprite, tilePx }: { sprite: string; tilePx: number }) {
  const [failed, setFailed] = useState(false)
  const asset = useMemo(() => resolveById(sprite), [sprite])
  const floor = (
    <div
      className="sprite-fb pixel-sprite"
      aria-hidden="true"
      data-kind={fallbackKind(sprite)}
      style={{ ['--sprite-size' as string]: `${tilePx}px` }}
    />
  )

  if (failed || asset.path === 'fallback' || !asset.url) return floor

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

export default function PlayScene({ rooms, quests, player, labels, lang }: Props) {
  /* Read once: a visitor who asked for less motion gets a still scene, and the
     destination list below the stage is the interaction path. */
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  /* Below `md` the scene does not mount: the destination list is the experience
     there. A `hidden md:block` wrapper cannot enforce that on its own — a
     `client:only` island hydrates regardless of a display:none ancestor — so the
     gate has to live here. Subscribed rather than read once, because a rotation
     crosses this breakpoint far more often than a motion preference changes.
     ponytail: the island's JS still downloads below `md`; moving to
     `client:media` would drop that too, but the component would then have to
     survive SSR. */
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
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '')
  const [dialogue, setDialogue] = useState<Dialogue | null>(null)
  const [passage, setPassage] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [panel, setPanel] = useState<Panel>('none')
  const [events, setEvents] = useState<string[]>([])
  const [scale, setScale] = useState(2)
  const [encounter, setEncounter] = useState<{ index: number; hp: number; log: string[] } | null>(
    null
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const actorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const keysRef = useRef<MoveInput>({ up: false, down: false, left: false, right: false })
  const facingRef = useRef<Direction>('down')
  const rafRef = useRef(0)
  const dialogueOpenRef = useRef(false)

  const room = useMemo(() => rooms.find((r) => r.id === roomId) ?? rooms[0], [rooms, roomId])
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
      const width = stageRef.current?.parentElement?.clientWidth ?? VIEW_W * TILE * 2
      setScale(Math.min(3, integerScale(width, VIEW_W * TILE)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const paint = useCallback(() => {
    if (!room) return
    const pos = posRef.current
    const cam = cameraOffset(room, { x: pos.x + BODY / 2, y: pos.y + BODY / 2 }, VIEW_W, VIEW_H)
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${-Math.round(cam.x * tilePx)}px, ${-Math.round(cam.y * tilePx)}px, 0)`
    }
    if (actorRef.current) {
      actorRef.current.style.transform = `translate3d(${Math.round(pos.x * tilePx)}px, ${Math.round(pos.y * tilePx)}px, 0)`
    }
  }, [room, tilePx])

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
    if (reduced || !wide || !room) return
    let last = 0
    const frame = (now: number) => {
      const delta = last ? now - last : 0
      last = now
      if (!dialogueOpenRef.current) {
        posRef.current = stepPosition(room, posRef.current, keysRef.current, delta)
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
  }, [room, reduced, wide, paint])

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
    const target = nearestFacing(room.objects, posRef.current, facingRef.current)
    if (!target) return // Nothing in reach: silence, not an error.
    if (target.kind === 'npc') {
      recordEvent(`talk:${target.slug}`)
      const quest = quests.find((q) => q.npcId === target.slug)
      openDialogue({
        title: `${target.title} — ${target.summary}`,
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
  }, [room, quests, labels.open, openDialogue])

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
    if (event.key === 'j' || event.key === 'J') {
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

  const startEncounter = () => {
    setEncounter({ index: 0, hp: opponents[0].hp, log: [] })
    setPanel('encounter')
  }

  const playMove = (moveIndex: number) => {
    setEncounter((current) => {
      if (!current) return current
      const turn = current.log.length
      const opponent = opponents[current.index]
      if (turn >= opponent.maxTurns || current.hp <= 0) return current
      const rand = mulberry32(seedFrom(`${opponent.id}:${turn}`))
      const damage = damageFor(topLevel(player.stats), moveIndex, rand())
      const hp = Math.max(0, current.hp - damage)
      playSound('stamp')
      return {
        ...current,
        hp,
        log: [
          ...current.log,
          `${labels[`move_${moves[moveIndex].id}`] ?? moves[moveIndex].id} — ${damage}`
        ]
      }
    })
  }

  const opponent = encounter ? opponents[encounter.index] : null
  const encounterOver =
    encounter && opponent ? encounter.hp === 0 || encounter.log.length >= opponent.maxTurns : false

  if (!room) return null

  if (!wide) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="game-hud">
        <span>{room.name}</span>
        <span className="flex gap-2">
          <button type="button" className="menu-cursor px-2" onClick={() => setPanel('journal')}>
            [J] {labels.journal}
          </button>
          <button type="button" className="menu-cursor px-2" onClick={() => setPanel('sheet')}>
            [C] {labels.sheet}
          </button>
          <button type="button" className="menu-cursor px-2" onClick={startEncounter}>
            {labels.encounter}
          </button>
        </span>
      </div>

      <div
        ref={stageRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the scene is a keyboard surface; focus can always leave it with Tab, and the destination list below is the non-keyboard path.
        tabIndex={0}
        role="application"
        aria-label={labels.sceneName}
        className="game-stage mx-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        style={{ width: VIEW_W * tilePx, height: VIEW_H * tilePx }}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={clearKeys}
        onPointerDown={() => stageRef.current?.focus()}
      >
        <div ref={worldRef} className="absolute top-0 left-0 will-change-transform">
          {/* Static floor: rendered once per room, never touched by the loop. */}
          {room.grid.map((row, y) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: in a tile grid the index IS the identity — row 3 is always row 3, and the list never reorders.
            <div key={`${room.id}-${y}`} className="flex" style={{ height: tilePx }}>
              {[...row].map((tile, x) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: same — a tile's coordinate is its identity.
                  key={`${room.id}-${y}-${x}`}
                  className="block"
                  style={{
                    width: tilePx,
                    height: tilePx,
                    background:
                      tile === '#'
                        ? 'var(--color-border)'
                        : tile === '+'
                          ? 'var(--color-thread)'
                          : 'var(--color-secondary)'
                  }}
                />
              ))}
            </div>
          ))}

          {room.objects.map((object) => (
            <div
              key={object.id}
              className="absolute flex flex-col items-center"
              style={{ left: object.x * tilePx, top: object.y * tilePx, width: tilePx }}
            >
              <ObjectArt sprite={object.sprite} tilePx={tilePx} />
              <span className="text-muted mt-1 max-w-[7rem] truncate font-mono text-[0.5rem] uppercase">
                {object.title}
              </span>
            </div>
          ))}

          {/* The ref stays on the positioned wrapper so the loop keeps mutating one
              element's transform; the art inside resolves like every other slot. */}
          <div
            ref={actorRef}
            className="absolute top-0 left-0 will-change-transform"
            aria-hidden="true"
          >
            <ObjectArt sprite="hero" tilePx={Math.round(BODY * tilePx)} />
          </div>
        </div>
      </div>

      <p className="text-muted text-center font-mono text-[0.65rem]">{labels.controls}</p>

      {/* Touch controls. 44px is the floor, not the aim. */}
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

      {dialogue && (
        <div className="game-dialogue mx-auto w-full max-w-2xl">
          <p className="font-display text-base">▸ {dialogue.title}</p>
          <p className="mt-2 min-h-[3rem] text-sm leading-relaxed">{text.slice(0, revealed)}</p>
          <div className="mt-3 flex flex-wrap gap-4 font-mono text-[0.65rem]">
            <button type="button" className="menu-cursor" onClick={advance}>
              [E] {passage < dialogue.passages.length - 1 ? labels.next : labels.close}
            </button>
            {dialogue.href && (
              <a className="menu-cursor text-accent" href={dialogue.href}>
                {dialogue.linkLabel} →
              </a>
            )}
            <button type="button" className="menu-cursor" onClick={closeDialogue}>
              [ESC] {labels.close}
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
                  — {labels[`state_${states[quest.id] as QuestState}`]}
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

      {panel === 'encounter' && encounter && opponent && (
        <section
          className="evidence-panel mx-auto w-full max-w-2xl p-4"
          aria-label={labels.encounter}
        >
          <h2 className="font-display text-lg">{opponent.opponent[lang]}</h2>
          <p className="font-mono text-[0.7rem]">
            HP {encounter.hp}/{opponent.hp} · {labels.turn} {encounter.log.length}/
            {opponent.maxTurns}
          </p>
          <ul className="text-muted mt-2 font-mono text-[0.65rem]">
            {encounter.log.map((line) => (
              <li key={line}>&gt; {line}</li>
            ))}
          </ul>
          {encounterOver ? (
            <p className="mt-3 text-sm">{encounter.hp === 0 ? labels.won : labels.timeout}</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3 font-mono text-[0.65rem]">
              {moves.map((move, index) => (
                <button
                  key={move.id}
                  type="button"
                  className="menu-cursor"
                  onClick={() => playMove(index)}
                >
                  [{index + 1}] {labels[`move_${move.id}`] ?? move.id}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="menu-cursor mt-4 block font-mono text-[0.65rem]"
            onClick={() => {
              setEncounter(null)
              setPanel('none')
            }}
          >
            [S] {labels.skip}
          </button>
        </section>
      )}
    </div>
  )
}

function topLevel(stats: Stat[]): number {
  return stats.length > 0 ? stats[0].level : 1
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
