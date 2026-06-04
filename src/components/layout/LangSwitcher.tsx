import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

const pillTransition = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 }

const pillStyle = {
  background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
  border: '1px solid color-mix(in oklch, var(--color-accent) 28%, transparent)'
}

function getTargetHref(targetLang: 'en' | 'id'): string {
  const pathname = window.location.pathname
  const isId = pathname.startsWith('/id')
  if (targetLang === 'id') {
    if (isId) return pathname
    return pathname === '/' ? '/id' : `/id${pathname}`
  }
  if (!isId) return pathname
  return pathname.replace(/^\/id/, '') || '/'
}

export default function LangSwitcher() {
  const [currentLang, setCurrentLang] = useState<'en' | 'id'>(() => {
    if (typeof window === 'undefined') return 'en'
    return window.location.pathname.startsWith('/id') ? 'id' : 'en'
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => {
      setCurrentLang(window.location.pathname.startsWith('/id') ? 'id' : 'en')
    }
    document.addEventListener('astro:page-load', handler)
    return () => document.removeEventListener('astro:page-load', handler)
  }, [])

  function handleClick(lang: 'en' | 'id') {
    if (lang === currentLang) return
    const href = getTargetHref(lang)
    if (containerRef.current) {
      gsap
        .timeline()
        .to(containerRef.current, { scale: 0.88, duration: 0.08, ease: 'power2.in' })
        .to(containerRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(3)',
          clearProps: 'transform',
          onComplete: () => {
            window.location.href = href
          }
        })
    } else {
      window.location.href = href
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className="hidden md:flex items-center gap-0.5 rounded-xl border p-1"
      style={{ borderColor: 'color-mix(in oklch, var(--color-border) 40%, transparent)' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pillTransition}
    >
      {(['en', 'id'] as const).map((lang) => {
        const active = currentLang === lang
        const flag = lang === 'en' ? '🇺🇸' : '🇮🇩'
        const label = lang === 'en' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'
        return (
          <button
            key={lang}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => handleClick(lang)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg"
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-lg"
                style={pillStyle}
                transition={pillTransition}
              />
            )}
            <motion.span
              className="relative z-10 select-none text-base"
              animate={{ scale: active ? 1.25 : 0.9, opacity: active ? 1 : 0.45 }}
              transition={pillTransition}
            >
              {flag}
            </motion.span>
          </button>
        )
      })}
    </motion.div>
  )
}
