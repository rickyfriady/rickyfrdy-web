import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

interface Props {
  label: string
}

export default function FeaturedBadge({ label }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const readyRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/lottie/featured-sparkle.json'
    })

    anim.addEventListener('DOMLoaded', () => {
      readyRef.current = true
      if (!containerRef.current) return

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim()

      containerRef.current.querySelectorAll('path').forEach((path) => {
        path.style.fill = accent || 'currentColor'
      })
    })

    animRef.current = anim

    // Attach hover listeners imperatively — avoids JSX handler lint rule
    const play = () => {
      if (!animRef.current || !readyRef.current) return
      animRef.current.setDirection(1)
      animRef.current.play()
    }

    const reverse = () => {
      if (!animRef.current || !readyRef.current) return
      animRef.current.setDirection(-1)
      animRef.current.play()
    }

    const wrapper = wrapperRef.current
    wrapper.addEventListener('mouseenter', play)
    wrapper.addEventListener('mouseleave', reverse)

    return () => {
      anim.destroy()
      animRef.current = null
      readyRef.current = false
      wrapper.removeEventListener('mouseenter', play)
      wrapper.removeEventListener('mouseleave', reverse)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="inline-flex items-center gap-1">
      <span className="eyebrow">{label}</span>
      <div ref={containerRef} aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }} />
    </div>
  )
}
