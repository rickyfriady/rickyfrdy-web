import { type CSSProperties, useEffect, useRef, useState } from 'react'
import type { Season } from '@/utils/game/time'

/** Leaf colours by season: the foliage's own colour, so the wind carries what the trees drop. */
const LEAF: Record<Season, string> = {
  spring: '#a8d878',
  summer: '#7cc060',
  autumn: '#e09040',
  winter: '#e6edf0'
}

/** Hard caps. The DOM count is the cap, so nothing can accumulate. */
const LEAVES = [
  { left: 6, delay: 0, dur: 8 },
  { left: 20, delay: 3.4, dur: 10 },
  { left: 36, delay: 1.2, dur: 9 },
  { left: 52, delay: 5.6, dur: 11 },
  { left: 68, delay: 2.4, dur: 8.5 },
  { left: 84, delay: 6.8, dur: 10 }
]
const BUTTERFLIES = [
  { wing: '#f0c040', left: 22, top: 62, dur: 14, delay: 0 },
  { wing: '#cfe3f0', left: 64, top: 48, dur: 18, delay: 4 }
]

interface Props {
  season: Season
  /** The visitor's own clock says night: no light, no creatures. */
  night: boolean
  scale: number
  /** Viewport size in source pixels, so paths scale with the scene. */
  viewW: number
  viewH: number
}

/**
 * Wind, leaves, light and the odd creature, over the valley.
 *
 * Everything here is a CSS animation in whole steps: no script drives a frame,
 * so it adds no loop to the one the player already uses. It carries no
 * information and is hidden from assistive technology. It pauses by itself
 * when the scene is scrolled out of view or the tab is hidden.
 *
 * The caller does not mount it under reduced motion, below `md`, or in an
 * interior, so in those cases there is nothing to hide or to stop.
 */
export default function Ambient({ season, night, scale, viewW, viewH }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = true
    let shown = typeof document === 'undefined' || document.visibilityState !== 'hidden'
    const sync = () => setPaused(!(visible && shown))
    const onVisibility = () => {
      shown = document.visibilityState !== 'hidden'
      sync()
    }
    document.addEventListener('visibilitychange', onVisibility)
    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting)
        sync()
      })
      observer.observe(el)
    }
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      observer?.disconnect()
    }
  }, [])

  const w = viewW * scale
  const h = viewH * scale
  const px = (n: number) => `${n * scale}px`

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ambient absolute inset-0 overflow-hidden"
      data-paused={paused ? '1' : '0'}
      style={{ ['--u' as string]: px(1) }}
    >
      {!night && <div className="ambient-shaft absolute inset-0" />}

      {LEAVES.map((leaf) => (
        <span
          key={leaf.left}
          className="ambient-leaf absolute"
          style={
            {
              left: `${leaf.left}%`,
              top: 0,
              ['--leaf' as string]: LEAF[season],
              ['--dx' as string]: `${w * 0.3}px`,
              ['--dy' as string]: `${h * 1.05}px`,
              ['--dur' as string]: `${leaf.dur}s`,
              animationDelay: `${-leaf.delay}s`
            } as CSSProperties
          }
        />
      ))}

      {!night &&
        season !== 'winter' &&
        BUTTERFLIES.map((b) => (
          <span
            key={b.left}
            className="ambient-butterfly absolute"
            style={
              {
                left: `${b.left}%`,
                top: `${b.top}%`,
                ['--wing' as string]: b.wing,
                ['--range' as string]: `${w * 0.1}px`,
                ['--dur' as string]: `${b.dur}s`,
                animationDelay: `0s, ${-b.delay}s`
              } as CSSProperties
            }
          />
        ))}

      {!night && (
        <span
          className="ambient-bird absolute"
          style={
            {
              top: `${h * 0.12}px`,
              ['--cross' as string]: `${w + 24 * scale}px`
            } as CSSProperties
          }
        />
      )}
    </div>
  )
}
