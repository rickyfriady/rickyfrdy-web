import { useEffect, useRef } from 'react'

export default function WanderingEyes() {
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf: number
    const start = performance.now()

    function tick(now: number) {
      const el = dotRef.current
      if (!el) return
      const elapsed = (now - start) / 1000
      const hue = 220 + Math.sin(elapsed * 0.08) * 18
      const sat = 60 + Math.sin(elapsed * 0.12) * 10
      const light = 50 + Math.sin(elapsed * 0.15) * 6
      const opacity = 0.55 + Math.sin(elapsed * 0.25) * 0.15

      el.style.background = `oklch(${light}% ${sat / 100} ${hue})`
      el.style.opacity = String(opacity)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <a
      href="/"
      className="text-foreground font-display inline-flex items-center gap-2 text-lg font-light tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span
          ref={dotRef}
          className="block rounded-full"
          style={{
            width: 16,
            height: 16,
            background: 'var(--color-accent)',
            opacity: 0.6
          }}
        />
      </span>
      Ricki Friadi
    </a>
  )
}
