import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  liveUrl?: string
  githubUrl?: string
  liveLabel: string
  githubLabel: string
}

export default function ProjectCTAs({ liveUrl, githubUrl, liveLabel, githubLabel }: Props) {
  const prefersReduced = useReducedMotion()
  const hoverScale = prefersReduced ? 1 : 1.03
  const tapScale = prefersReduced ? 1 : 0.97

  if (!liveUrl && !githubUrl) return null

  return (
    <div className="flex flex-wrap gap-3">
      {liveUrl && (
        <motion.a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent text-background inline-flex h-10 items-center rounded-lg px-5 font-mono text-xs font-medium tracking-[0.1em] uppercase transition-colors"
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: tapScale }}
        >
          {liveLabel} ↗
        </motion.a>
      )}
      {githubUrl && (
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-5 font-mono text-xs font-medium tracking-[0.1em] uppercase transition-colors"
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: tapScale }}
        >
          {githubLabel} ↗
        </motion.a>
      )}
    </div>
  )
}
