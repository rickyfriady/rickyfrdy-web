import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

const CLIP =
  'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'

export default function HeroPhoto() {
  const scanRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      tl.from(wrapRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.7,
        ease: 'power3.out'
      })

      if (scanRef.current) {
        tl.fromTo(
          scanRef.current,
          { y: '-100%', opacity: 0.9 },
          { y: '200%', opacity: 0, duration: 1.1, ease: 'sine.inOut' },
          '-=0.2'
        )
      }
    }, wrapRef)

    return () => ctx.revert()
  }, [reduced])

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.45, ease: 'easeOut' as const, delay: 0.5 + i * 0.07 }
    })
  }

  return (
    <div ref={wrapRef} className="flex-shrink-0 self-start md:self-center">
      <div className="relative">
        {/* Metadata row above */}
        <div className="mb-2 flex items-center justify-between font-mono text-[9px] tracking-[0.15em] uppercase">
          <span style={{ color: 'color-mix(in oklch, var(--color-accent) 60%, transparent)' }}>
            #001
          </span>
          <span style={{ color: 'color-mix(in oklch, var(--color-foreground) 35%, transparent)' }}>
            6°S · 106°E
          </span>
        </div>

        {/* Photo frame */}
        <div className="relative" style={{ width: 'clamp(160px, 30vw, 224px)', aspectRatio: '1' }}>
          {/* Ghost glitch layer — accent-tinted offset duplicate */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              clipPath: CLIP,
              background: 'color-mix(in oklch, var(--color-accent) 18%, transparent)'
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            whileHover={{ x: 5, y: -4, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            aria-hidden="true"
          />

          {/* Main container */}
          <motion.div
            className="group relative h-full w-full overflow-hidden"
            style={{ clipPath: CLIP }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            {/* Background / RF fallback */}
            <div
              className="absolute inset-0 flex items-center justify-center select-none"
              style={{ background: 'color-mix(in oklch, var(--color-secondary) 90%, transparent)' }}
              aria-hidden="true"
            >
              <span
                className="font-bold tracking-tight"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 5rem)',
                  lineHeight: 1,
                  color: 'color-mix(in oklch, var(--color-accent) 55%, transparent)',
                  fontFamily: 'var(--font-display, serif)',
                  letterSpacing: '-0.04em'
                }}
              >
                RF
              </span>
            </div>

            {/* Actual photo — sits on top of fallback */}
            <img
              src="/images/avatar.jpg"
              alt="Ricki Friadi"
              width={224}
              height={224}
              loading="eager"
              onLoad={() => setPhotoReady(true)}
              onError={() => setPhotoReady(false)}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                photoReady ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ color: 'transparent' }}
            />

            {/* Accent duotone on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
              style={{
                background: 'var(--color-accent)',
                mixBlendMode: 'color'
              }}
            />

            {/* Scanline */}
            <div
              ref={scanRef}
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px] will-change-transform"
              style={{
                background:
                  'linear-gradient(to right, transparent, var(--color-accent) 30%, var(--color-accent) 70%, transparent)',
                boxShadow: '0 0 12px var(--color-accent)'
              }}
              aria-hidden="true"
            />

            {/* Noise grain texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                backgroundSize: '120px'
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* SVG corner brackets — drawn with Framer Motion pathLength */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            style={{ overflow: 'visible' }}
          >
            {/* top-left */}
            <motion.path
              d="M 18 0 L 0 0 L 0 18"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              custom={0}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* top-right */}
            <motion.path
              d="M 82 0 L 100 0 L 100 18"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              custom={1}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* bottom-left */}
            <motion.path
              d="M 0 82 L 0 100 L 18 100"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              custom={2}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* bottom-right */}
            <motion.path
              d="M 100 82 L 100 100 L 82 100"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              custom={3}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* diagonal cut accent line — top-right corner */}
            <motion.path
              d="M 76 0 L 100 24"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
              custom={4}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </div>

        {/* Terminal status bar */}
        <motion.div
          className="mt-3 flex items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <span className="relative flex h-[7px] w-[7px] flex-shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: 'var(--color-accent)' }}
            />
            <span
              className="relative inline-flex h-[7px] w-[7px] rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
          </span>
          <span
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
            style={{ color: 'color-mix(in oklch, var(--color-foreground) 50%, transparent)' }}
          >
            open_to_work
          </span>
          <motion.span
            className="font-mono text-[10px]"
            style={{ color: 'var(--color-accent)' }}
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
