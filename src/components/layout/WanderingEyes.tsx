import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

function getIsMobile() {
  return typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
}

function Eye() {
  const eyeRef = useRef<HTMLDivElement>(null)
  const rotate = useMotionValue(0)
  const springRotate = useSpring(rotate, { damping: 20, stiffness: 300 })

  useEffect(() => {
    const isMobile = getIsMobile()
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
  }, [rotate])

  const isMobile = getIsMobile()

  return (
    <div
      ref={eyeRef}
      className="border-border relative h-4 w-4 overflow-hidden rounded-full border"
    >
      {/*
        motion.div fills the eye (inset-0) and rotates around its own center,
        which is the eye's center. The pupil child rides along offset at the top.
      */}
      <motion.div
        className="absolute inset-0"
        style={isMobile ? undefined : { rotate: springRotate }}
        animate={isMobile ? { rotate: 360 } : undefined}
        transition={isMobile ? { repeat: Infinity, duration: 3, ease: 'linear' } : undefined}
      >
        <div className="bg-accent absolute top-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full" />
      </motion.div>
    </div>
  )
}

export default function WanderingEyes() {
  return (
    <a
      href="/"
      className="text-foreground font-display flex items-center gap-2 text-lg font-light tracking-tight"
    >
      <span aria-hidden="true" className="flex gap-1">
        <Eye />
        <Eye />
      </span>
      Ricki Friadi
    </a>
  )
}
