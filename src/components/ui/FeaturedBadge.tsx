import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

interface Props {
  label: string
}

export default function FeaturedBadge({ label }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/fire.json'
    })

    return () => anim.destroy()
  }, [])

  return (
    <span
      className="inline-flex items-center justify-center gap-1"
      role="img"
      aria-label={`${label} project`}
    >
      <span
        ref={containerRef}
        aria-hidden="true"
        style={{ width: 16, height: 22, flexShrink: 0 }}
      />
      <span className="eyebrow">{label}</span>
    </span>
  )
}
