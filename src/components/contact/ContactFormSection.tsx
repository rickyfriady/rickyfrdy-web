import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import ContactForm from './ContactForm'

interface Props {
  sectionLabel?: string
}

export default function ContactFormSection({ sectionLabel = '§ 01 — Send a Message' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="chapter-heading px-4">
        <span className="chapter-label">{sectionLabel}</span>
      </div>
      <div className="px-4 pb-10">
        <div className="max-w-lg">
          <ContactForm />
        </div>
      </div>
    </motion.div>
  )
}
