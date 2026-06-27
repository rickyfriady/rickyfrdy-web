import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '@/data/experience'
import { getLogoSvg } from '@/utils/finlogo'
import { getSkillIconUrl } from '@/utils/skillIcon'

interface Props {
  projects: Project[]
}

export default function ProjectsAccordion({ projects }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <div className="space-y-2 py-6">
      {projects.map((proj, i) => {
        const isOpen = openIndex === i

        return (
          <div
            key={proj.title}
            className={`rounded-xl border transition-all duration-200 ${
              isOpen
                ? 'border-border bg-secondary/40 shadow-xs'
                : 'border-transparent hover:border-border/60 hover:bg-secondary/15'
            }`}
          >
            {/* ─── Summary button ────────────────────────────── */}
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left focus-visible:outline-none sm:px-5 sm:py-4"
            >
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {/* Logo */}
                {proj.companyLogo ? (
                  (() => {
                    const svg = getLogoSvg(proj.companyLogo)
                    if (svg) {
                      return (
                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white p-1 sm:h-10 sm:w-10 sm:p-1.5">
                          <img
                            src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
                            alt={proj.company}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain"
                          />
                        </span>
                      )
                    }
                    return (
                      <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-secondary sm:h-10 sm:w-10">
                        <span className="font-display text-base font-bold leading-none text-accent">
                          {proj.company.charAt(0)}
                        </span>
                      </span>
                    )
                  })()
                ) : (
                  <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-secondary sm:h-10 sm:w-10">
                    <span className="font-display text-base font-bold leading-none text-accent">
                      {proj.company.charAt(0)}
                    </span>
                  </span>
                )}

                <div className="min-w-0">
                  <span className="text-foreground block truncate text-[15px] font-semibold leading-snug sm:text-base">
                    {proj.title}
                  </span>
                  <div className="text-muted mt-0.5 flex items-center gap-1.5 truncate font-mono text-xs leading-tight sm:text-[13px]">
                    <span>{proj.company}</span>
                    <span className="text-border/40">·</span>
                    <span className="text-muted/60 truncate">{proj.period}</span>
                  </div>
                </div>
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-muted/30 flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            </button>

            {/* ─── Expandable body ───────────────────────────── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                    opacity: { duration: 0.2 }
                  }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/40 px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-4">
                    {/* Bullets */}
                    <ul className="text-muted space-y-2.5 text-sm leading-relaxed sm:text-[15px]">
                      {proj.bullets.map((bullet) => (
                        <motion.li
                          key={bullet.slice(0, 32)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05, duration: 0.25 }}
                          className="flex gap-3"
                        >
                          <span className="text-muted/40 mt-1.5 flex-shrink-0 font-mono text-sm leading-none sm:mt-2">
                            ▸
                          </span>
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Stack chips */}
                    <motion.div
                      initial="hidden"
                      animate="show"
                      className="mt-4 flex flex-wrap gap-2 sm:mt-5"
                    >
                      {proj.stack.map((tech) => {
                        const url = getSkillIconUrl(tech)
                        return (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={
                              url
                                ? 'inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-secondary/30 px-2.5 py-1 font-mono text-xs text-muted sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px]'
                                : 'diff-tag'
                            }
                          >
                            {url && (
                              <img
                                src={url}
                                alt={tech}
                                title={tech}
                                width="18"
                                height="18"
                                className="rounded-sm sm:h-5 sm:w-5"
                                loading="lazy"
                              />
                            )}
                            {tech}
                          </motion.span>
                        )
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
