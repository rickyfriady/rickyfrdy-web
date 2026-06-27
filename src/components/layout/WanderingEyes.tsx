import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

function Eye({ isMobile }: { isMobile: boolean }) {
  const eyeRef = useRef<HTMLDivElement>(null)
  const rotate = useMotionValue(0)
  const springRotate = useSpring(rotate, { damping: 20, stiffness: 300 })

  useEffect(() => {
    if (isMobile) return

    function onMove(e: MouseEvent) {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
      rotate.set(angle + 90)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rotate, isMobile])

  if (isMobile) {
    return (
      <span
        className="inline-block rounded-full"
        style={{
          width: 16,
          height: 16,
          backgroundColor: 'color-mix(in srgb, currentColor 16%, transparent)',
          backgroundImage: 'radial-gradient(circle 5px, currentColor 100%, transparent 0)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 0',
          animation: 'wandering-eyes-move 10s infinite, wandering-eyes-blink 10s infinite'
        }}
      />
    )
  }

  return (
    <div
      ref={eyeRef}
      className="border-border relative h-4 w-4 overflow-hidden rounded-full border"
    >
      <motion.div className="absolute inset-0" style={{ rotate: springRotate }}>
        <div className="bg-accent absolute top-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full" />
      </motion.div>
    </div>
  )
}

export default function WanderingEyes() {
  const isMobile = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

  return (
    <a
      href="/"
      className="text-foreground font-display inline-flex items-center gap-2 text-lg font-light tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span aria-hidden="true" className="inline-flex gap-1">
        <Eye isMobile={!isMobile} />
        <Eye isMobile={!isMobile} />
      </span>
      Ricki Friadi
    </a>
  )
}
