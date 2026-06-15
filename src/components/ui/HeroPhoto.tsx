import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import AnimatedGradient from '@/components/animated-gradient'

export default function HeroPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => {
    if (reduced || !wrapRef.current) return
    gsap.from(wrapRef.current, { opacity: 0, x: 24, duration: 0.9, ease: 'power3.out', delay: 0.2 })
  }, [reduced])

  return (
    <div ref={wrapRef} className="flex-shrink-0 self-start md:self-center">
      <div className="relative">
        {/* Metadata row */}
        <motion.div
          className="mb-3 flex items-center justify-between font-mono text-[9px] tracking-[0.15em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span style={{ color: 'color-mix(in oklch, var(--color-accent) 65%, transparent)' }}>
            #001
          </span>
          <span style={{ color: 'color-mix(in oklch, var(--color-foreground) 30%, transparent)' }}>
            6°S · 106°E
          </span>
        </motion.div>

        {/* Photo frame — animated gradient border */}
        <div className="relative w-[clamp(160px,28vw,220px)] aspect-square">
          {/* AnimatedGradient fills the outer box and shows as the border */}
          <AnimatedGradient
            config={{ preset: 'Prism', speed: 18 }}
            radius="16px"
            noise={{ opacity: 0.3 }}
            style={{ zIndex: 0 }}
          />

          {/* Inner photo container — 3px inset = 3px gradient border */}
          <motion.div
            className="absolute inset-[3px] z-10 overflow-hidden rounded-[13px]"
            style={{ background: 'color-mix(in oklch, var(--color-secondary) 95%, transparent)' }}
            whileHover={{ scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* RF fallback — always behind photo */}
            <div
              className="absolute inset-0 flex select-none items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="font-display font-bold leading-none tracking-[-0.04em] text-[clamp(2.5rem,7vw,4rem)]"
                style={{ color: 'color-mix(in oklch, var(--color-accent) 35%, transparent)' }}
              >
                RF
              </span>
            </div>

            {/* Photo */}
            <img
              src="/images/avatar.jpg"
              alt="Ricki Friadi"
              width={220}
              height={220}
              loading="eager"
              onLoad={() => setPhotoReady(true)}
              onError={() => setPhotoReady(false)}
              className={`absolute inset-0 h-full w-full object-cover object-top text-transparent transition-opacity duration-700 ${
                photoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </motion.div>
        </div>

        {/* Terminal status */}
        <motion.div
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <span className="relative flex size-[7px] flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-[7px] rounded-full bg-accent" />
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: 'color-mix(in oklch, var(--color-foreground) 48%, transparent)' }}
          >
            open_to_work
          </span>
          <motion.span
            className="font-mono text-[10px] text-accent"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
          >
            _
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}
