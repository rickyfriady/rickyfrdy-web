import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function getIsMobile() {
  return typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
}

function Eye() {
  const eyeRef = useRef<HTMLDivElement>(null)
  const rotate = useMotionValue(0)
  const springRotate = useSpring(rotate, { damping: 20, stiffness: 300 })
  const prefersReduced = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [isMouseActive, setIsMouseActive] = useState(false)
  const isMouseActiveRef = useRef(false)

  useEffect(() => {
    setIsMobile(getIsMobile())
  }, [])

  useEffect(() => {
    if (isMobile || prefersReduced) return

    function onMove(e: MouseEvent) {
      if (!isMouseActiveRef.current) {
        isMouseActiveRef.current = true
        setIsMouseActive(true)
      }
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
      rotate.set(angle + 90)
    }

    function onLeave() {
      isMouseActiveRef.current = false
      setIsMouseActive(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [rotate, isMobile, prefersReduced])

  const shouldOrbit = (isMobile || !isMouseActive) && !prefersReduced

  return (
    <div
      ref={eyeRef}
      className="border-border relative h-4 w-4 overflow-hidden rounded-full border"
    >
      <motion.div
        className="absolute inset-0"
        style={!shouldOrbit ? { rotate: springRotate } : undefined}
        animate={shouldOrbit ? { rotate: 360 } : undefined}
        transition={shouldOrbit ? { repeat: Infinity, duration: 3, ease: 'linear' } : undefined}
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
