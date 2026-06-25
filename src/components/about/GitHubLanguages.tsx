import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { LanguageStat } from '@/utils/github'

interface Props {
  languages: LanguageStat[]
}

export default function GitHubLanguages({ languages }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = useReducedMotion()

  if (languages.length === 0) return null

  return (
    <div ref={ref} className="rounded-xl border border-border bg-secondary/30 p-4 md:p-6">
      <p className="text-foreground mb-3 text-sm font-semibold">Most Used Languages</p>

      {/* Stacked bar */}
      <div className="flex h-[4px] md:h-3.5 w-full overflow-hidden rounded-full bg-secondary">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            className="relative h-full first:rounded-l-full last:rounded-r-full"
            style={{ background: lang.color }}
            initial={{ width: '0%' }}
            animate={isInView ? { width: `${lang.percentage}%` } : { width: '0%' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.7,
                    delay: i * 0.07,
                    ease: [0.25, 1, 0.5, 1]
                  }
            }
            role="img"
            aria-label={`${lang.name}: ${lang.percentage}%`}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Language breakdown">
        {languages.map((lang, i) => (
          <motion.li
            key={lang.name}
            className="flex items-center gap-1.5 flex-shrink-0"
            initial={{ opacity: 0, y: 5 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.3,
                    delay: 0.55 + i * 0.045,
                    ease: 'easeOut'
                  }
            }
          >
            <span
              className="block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: lang.color }}
              aria-hidden="true"
            />
            <span className="text-foreground font-mono text-[9px] leading-none sm:text-[10px]">
              {lang.name}
            </span>
            <span className="text-muted font-mono text-[9px] leading-none sm:text-[10px]">
              {lang.percentage}%
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
