import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export default function HeroPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => {
    if (reduced || !wrapRef.current) return
    gsap.from(wrapRef.current, {
      opacity: 0,
      y: 14,
      scale: 0.97,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.25
    })
  }, [reduced])

  return (
    <div ref={wrapRef} className="flex-shrink-0 self-start md:self-center">
      {/* Portrait photo card — static gradient border */}
      <div
        className="relative w-[clamp(148px,20vw,196px)] aspect-[3/4] rounded-[20px] p-[2px]"
        style={{
          background:
            'linear-gradient(145deg, color-mix(in oklch, var(--color-accent) 55%, transparent), color-mix(in oklch, var(--color-accent) 18%, var(--color-border)))'
        }}
      >
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-[18px]"
          style={{ background: 'color-mix(in oklch, var(--color-background) 96%, transparent)' }}
          whileHover={{ scale: 1.018 }}
          transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        >
          {/* Initials fallback */}
          <div
            className="absolute inset-0 flex select-none items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="font-display font-bold leading-none tracking-[-0.04em] text-[clamp(2.5rem,6vw,3.5rem)]"
              style={{ color: 'color-mix(in oklch, var(--color-accent) 30%, transparent)' }}
            >
              RF
            </span>
          </div>

          {/* Photo */}
          <img
            src="/images/x.jpg"
            alt="Ricki Friadi"
            width={196}
            height={261}
            loading="eager"
            onLoad={() => setPhotoReady(true)}
            onError={() => setPhotoReady(false)}
            className={`absolute inset-0 h-full w-full object-cover object-top text-transparent transition-opacity duration-700 ${
              photoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </motion.div>
      </div>

      {/* Availability pill */}
      <motion.div
        className="mt-4 flex justify-start"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
          style={{
            borderColor: 'color-mix(in oklch, var(--color-accent) 22%, transparent)',
            background: 'color-mix(in oklch, var(--color-accent) 7%, transparent)'
          }}
        >
          <span className="relative flex size-[6px] flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-[6px] rounded-full bg-accent" />
          </span>
          <span className="text-muted font-mono text-[11px] tracking-[0.08em]">
            Available for work
          </span>
        </div>
      </motion.div>
    </div>
  )
}
