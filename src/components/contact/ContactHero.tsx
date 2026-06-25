import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import WrapShader from './WrapShader'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

interface Props {
  eyebrow?: string
  headingLine1?: string
  headingLine2?: string
  subtitle?: string
}

export default function ContactHero({
  eyebrow = 'Contact',
  headingLine1 = "Let's Build",
  headingLine2 = 'Something Together.',
  subtitle = "Open to fullstack roles, freelance projects, and interesting collaborations. Drop a message and I'll get back to you within a few days."
}: Props) {
  const reducedMotion = useReducedMotion()

  function fadeUp(delay: number) {
    return {
      initial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] as const }
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <WrapShader />

      {/* Gradient overlay for text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/90" />

      <div className="relative z-10 px-4 py-10 pb-12">
        <motion.p {...fadeUp(0)} className="eyebrow mb-3">
          {eyebrow}
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="title-display"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', lineHeight: 0.93 }}
        >
          {headingLine1}
          <br />
          <span className="title-accent text-accent">{headingLine2}</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
          {subtitle}
        </motion.p>

        {/* Available status badge */}
        <motion.div {...fadeUp(0.35)} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted backdrop-blur-sm">
            <span className="t-badge-dot inline-block h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
            Available
          </span>
        </motion.div>

        {/* CTA buttons */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <motion.a
            {...fadeUp(0.5)}
            href="mailto:friadi.ricki@gmail.com"
            className="glass-btn inline-flex items-center gap-2.5 rounded-xl border border-border px-4 py-3 text-sm text-foreground"
          >
            <Mail className="h-4 w-4 flex-shrink-0 text-accent" />
            <span>friadi.ricki@gmail.com</span>
          </motion.a>

          <motion.a
            {...fadeUp(0.6)}
            href="https://www.linkedin.com/in/rickifriadi"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn inline-flex items-center gap-2.5 rounded-xl border border-border px-4 py-3 text-sm text-foreground"
          >
            <LinkedinIcon className="h-4 w-4 flex-shrink-0 text-accent" />
            <span>linkedin.com/in/rickifriadi</span>
            <ExternalLink className="ml-auto h-3 w-3 flex-shrink-0 text-muted/50" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
