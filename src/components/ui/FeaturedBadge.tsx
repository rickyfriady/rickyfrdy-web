import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

interface Props {
  label: string
}

export default function FeaturedBadge({ label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/fire.json'
    })

    return () => {
      anim.destroy()
    }
  }, [])

  return (
    <div className="inline-flex items-center justify-center gap-1">
      <div ref={containerRef} aria-hidden="true" className="size-[18px] shrink-0" />
      <span className="eyebrow">{label}</span>
    </div>
  )
}
