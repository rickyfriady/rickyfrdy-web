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
      loop: true,
      autoplay: false,
      path: '/lottie/fire.json'
    })

    anim.addEventListener('DOMLoaded', () => {
      readyRef.current = true
    })

    animRef.current = anim

    const play = () => {
      if (!animRef.current || !readyRef.current) return
      animRef.current.play()
    }

    const stop = () => {
      if (!animRef.current || !readyRef.current) return
      animRef.current.stop()
    }

    const wrapper = wrapperRef.current
    wrapper.addEventListener('mouseenter', play)
    wrapper.addEventListener('mouseleave', stop)

    return () => {
      anim.destroy()
      animRef.current = null
      readyRef.current = false
      wrapper.removeEventListener('mouseenter', play)
      wrapper.removeEventListener('mouseleave', stop)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="inline-flex items-center justify-center gap-1 ">
      <div ref={containerRef} aria-hidden="true" className="size-[18px] shrink-0" />
      <span className="eyebrow">{label}</span>
    </div>
  )
}
