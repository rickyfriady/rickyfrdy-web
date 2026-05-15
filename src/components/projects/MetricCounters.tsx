import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Metric {
  value: string
  label: string
}

function parseMetricValue(value: string): { prefix: string; num: number; suffix: string } {
  // Strip thousands-separator commas from the numeric portion
  const normalized = value.replace(/(\d),(\d)/g, '$1$2')
  const match = normalized.match(/^([^0-9]*)(\d+\.?\d*)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value }
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] }
}

function AnimatedCounter({ value, label }: Metric) {
  const { prefix, num, suffix } = parseMetricValue(value)
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (prefersReduced) {
      setDisplay(value)
      return
    }
    const controls = animate(count, num, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => {
        let formatted: string
        if (num % 1 !== 0) {
          formatted = v.toFixed(2)
        } else {
          const rounded = Math.round(v)
          formatted = rounded >= 1000 ? rounded.toLocaleString('en-US') : rounded.toString()
        }
        setDisplay(`${prefix}${formatted}${suffix}`)
      }
    })
    return controls.stop
  }, [isInView, prefersReduced, count, num, prefix, suffix, value])

  return (
    <div
      ref={ref}
      role="img"
      className="border-border flex flex-col items-center gap-1.5 rounded-xl border p-5 text-center"
      aria-label={`${value} ${label}`}
    >
      <span
        className="title-display text-accent"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontStyle: 'italic' }}
      >
        {display}
      </span>
      <span className="text-muted font-mono text-xs uppercase tracking-[0.15em]">{label}</span>
    </div>
  )
}

interface Props {
  metrics: Metric[]
}

export default function MetricCounters({ metrics }: Props) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {metrics.map((metric) => (
        <AnimatedCounter key={metric.label} value={metric.value} label={metric.label} />
      ))}
    </motion.div>
  )
}
