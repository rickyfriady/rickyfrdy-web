import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BoardCard, BoardThread } from '@/models'
import { connectionCounts } from '@/utils/board'
import DetectiveMode from './DetectiveMode'
import { useHandGesture } from './useHandGesture'

interface Props {
  cards: BoardCard[]
  threads: BoardThread[]
  labels: {
    connected: string
    dragHint: string
    lamp: string
    board: string
  }
  detectiveLabels: Record<string, string>
}

const CARD_W = 176
const CARD_H = 104
const MIN_ZOOM = 0.4
const MAX_ZOOM = 2

/**
 * Layer 1 of the board: fully operable with mouse, keyboard, and touch.
 *
 * Gesture control (Detective Mode) is layered on top of this later and is
 * never required — roughly 95% of visitors are on mobile, have no webcam, or
 * decline the camera, so this layer has to stand on its own.
 */
export default function InvestigationBoard({ cards, threads, labels, detectiveLabels }: Props) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [activeId, setActiveId] = useState<string | null>(null)
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [lamp, setLamp] = useState({ x: 0.5, y: 0.06 })
  const lampRef = useRef<{ dx: number; dy: number } | null>(null)
  const [detective, setDetective] = useState(false)
  const { status, hand, videoRef } = useHandGesture(detective)
  const feedRef = useRef<HTMLVideoElement>(null)
  const gesturePan = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const dwellRef = useRef<{ id: string; since: number } | null>(null)

  const counts = useMemo(() => connectionCounts(threads), [threads])
  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  /** Threads touching the active card, so hovering one lights up its relations. */
  const litThreads = useMemo(() => {
    if (!activeId) return new Set<number>()
    const lit = new Set<number>()
    threads.forEach((t, i) => {
      if (t.from === activeId || t.to === activeId) lit.add(i)
    })
    return lit
  }, [activeId, threads])

  const connectedIds = useMemo(() => {
    if (!activeId) return null
    const ids = new Set<string>([activeId])
    for (const t of threads) {
      if (t.from === activeId) ids.add(t.to)
      if (t.to === activeId) ids.add(t.from)
    }
    return ids
  }, [activeId, threads])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only pan from the board itself; pointer-downs on a card must stay
      // available for the link.
      if ((e.target as HTMLElement).closest('[data-card]')) return
      dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [pan]
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (lampRef.current) {
      const box = surfaceRef.current?.getBoundingClientRect()
      if (!box) return
      // Clamped so the lamp can never be dragged off the visible canvas.
      const x = (e.clientX - box.left - lampRef.current.dx) / box.width
      const y = (e.clientY - box.top - lampRef.current.dy) / box.height
      setLamp({
        x: Math.min(0.95, Math.max(0.05, x)),
        y: Math.min(0.6, Math.max(0.02, y))
      })
      return
    }
    const d = dragRef.current
    if (!d) return
    setPan({ x: d.panX + (e.clientX - d.x), y: d.panY + (e.clientY - d.y) })
  }, [])

  const endDrag = useCallback(() => {
    dragRef.current = null
    lampRef.current = null
  }, [])

  const onLampDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    const box = el.getBoundingClientRect()
    lampRef.current = { dx: e.clientX - box.left, dy: e.clientY - box.top }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.0015)))
  }, [])

  /** Arrow keys pan, so the board is reachable without a pointer at all. */
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 120 : 40
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step]
      }
      const move = moves[e.key]
      if (!move) return
      // Let arrow keys do their normal thing while focus is on a card.
      if (document.activeElement?.closest('[data-card]')) return
      e.preventDefault()
      setPan((p) => ({ x: p.x + move[0], y: p.y + move[1] }))
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [])

  /**
   * Gestures drive the same state the mouse does — they are a layer on top of
   * a board that already works, never a separate mode with its own behaviour.
   */
  useEffect(() => {
    if (status !== 'active') {
      gesturePan.current = null
      return
    }

    if (hand.isTwoHandPinch && hand.zoomDelta !== 0) {
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + hand.zoomDelta)))
      return
    }
    if (hand.scrollDelta !== 0) {
      window.scrollBy({ top: hand.scrollDelta, behavior: 'auto' })
      return
    }

    const under = document.elementFromPoint(hand.cursor.x, hand.cursor.y)
    const card = under instanceof HTMLElement ? under.closest('[data-card]') : null

    if (hand.isPinching) {
      if (!gesturePan.current) {
        gesturePan.current = { x: hand.cursor.x, y: hand.cursor.y, panX: pan.x, panY: pan.y }
      } else if (!card) {
        setPan({
          x: gesturePan.current.panX + (hand.cursor.x - gesturePan.current.x),
          y: gesturePan.current.panY + (hand.cursor.y - gesturePan.current.y)
        })
      }
    } else if (gesturePan.current) {
      // Released without travelling far: treat it as a click on whatever is
      // under the cursor, matching how a quick pinch reads as a tap.
      const travelled = Math.hypot(
        hand.cursor.x - gesturePan.current.x,
        hand.cursor.y - gesturePan.current.y
      )
      gesturePan.current = null
      if (travelled < 12 && card instanceof HTMLElement) card.click()
    }

    // Resting the cursor on a card for a beat swings the lamp over to it.
    const id = card?.getAttribute('href') ?? null
    if (!card) {
      dwellRef.current = null
    } else if (dwellRef.current?.id !== id) {
      dwellRef.current = { id: id ?? '', since: Date.now() }
    } else if (Date.now() - dwellRef.current.since > 1000) {
      const box = surfaceRef.current?.getBoundingClientRect()
      const cardBox = card.getBoundingClientRect()
      if (box) {
        setLamp({
          x: Math.min(
            0.95,
            Math.max(0.05, (cardBox.left + cardBox.width / 2 - box.left) / box.width)
          ),
          y: 0.06
        })
      }
      dwellRef.current = null
    }

    setActiveId(card ? (card.getAttribute('data-id') ?? null) : null)
  }, [hand, status, pan])

  // Mirror the tracked stream into the visible feed. Done in an effect rather
  // than a ref callback because the stream is attached after mount.
  useEffect(() => {
    if (status !== 'active') return
    const feed = feedRef.current
    const source = videoRef.current?.srcObject ?? null
    if (feed && feed.srcObject !== source) feed.srcObject = source
  }, [status, videoRef])

  return (
    <>
      <div
        ref={surfaceRef}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: pannable region — it takes focus so arrow keys can move the board without a pointer
        tabIndex={0}
        role="application"
        aria-label={labels.board}
        className="board-surface relative h-[70vh] w-full touch-none overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center'
          }}
        >
          <svg
            className="pointer-events-none absolute overflow-visible"
            style={{ left: 0, top: 0, width: 1, height: 1 }}
            aria-hidden="true"
          >
            {threads.map((thread, i) => {
              const a = byId.get(thread.from)
              const b = byId.get(thread.to)
              if (!a || !b) return null
              const lit = litThreads.has(i)
              return (
                <line
                  key={`${thread.from}-${thread.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--color-thread)"
                  strokeWidth={lit ? 3 : 1}
                  opacity={activeId ? (lit ? 1 : 0.12) : 0.45}
                />
              )
            })}
          </svg>

          {cards.map((card) => {
            const dimmed = connectedIds !== null && !connectedIds.has(card.id)
            return (
              <a
                key={card.id}
                data-card
                data-id={card.id}
                href={card.url}
                onMouseEnter={() => setActiveId(card.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(card.id)}
                onBlur={() => setActiveId(null)}
                className="evidence-card absolute block p-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                style={{
                  left: card.x - CARD_W / 2,
                  top: card.y - CARD_H / 2,
                  width: CARD_W,
                  minHeight: CARD_H,
                  opacity: dimmed ? 0.3 : 1,
                  transition: 'opacity 120ms steps(3, end)'
                }}
              >
                <span className="board-pin" aria-hidden="true" />
                <span className="text-muted block font-mono text-[9px] tracking-[0.12em] uppercase">
                  {card.category}
                </span>
                <span className="text-foreground mt-1 block text-sm leading-tight font-semibold">
                  {card.title}
                </span>
                {counts[card.id] ? (
                  <span className="text-muted mt-2 block font-mono text-[9px]">
                    {labels.connected.replace('{n}', String(counts[card.id]))}
                  </span>
                ) : null}
              </a>
            )
          })}
        </div>

        <div
          className="board-lamp"
          style={{ left: `${lamp.x * 100}%`, top: `${lamp.y * 100}%` }}
          onPointerDown={onLampDown}
          role="img"
          aria-label={labels.lamp}
        >
          <div className="board-lamp-head" />
          <div className="board-lamp-cone" />
        </div>

        <p className="text-muted pointer-events-none absolute right-0 bottom-0 left-0 p-2 text-center font-mono text-[10px]">
          {labels.dragHint}
        </p>
      </div>

      {status === 'active' ? (
        <>
          <div
            className="detective-cursor"
            data-pinching={hand.isPinching}
            style={{ left: hand.cursor.x, top: hand.cursor.y }}
            aria-hidden="true"
          >
            <span className="detective-cursor-lens" />
            <span className="detective-cursor-handle" />
          </div>
          <div className="detective-feed" aria-hidden="true">
            <video ref={feedRef} autoPlay playsInline muted className="block w-full" />
            <span className="detective-feed-scan" />
          </div>
        </>
      ) : null}

      <DetectiveMode
        status={status}
        active={detective}
        onChange={setDetective}
        labels={detectiveLabels}
      />
    </>
  )
}
