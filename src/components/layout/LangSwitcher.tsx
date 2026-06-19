import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

const LANGS = [
  { code: 'en' as const, flag: '🇺🇸', label: 'English' },
  { code: 'id' as const, flag: '🇮🇩', label: 'Indonesia' }
]

function isIdLocale(pathname: string): boolean {
  return pathname === '/id' || pathname.startsWith('/id/')
}

function getTargetHref(targetLang: 'en' | 'id'): string {
  const pathname = window.location.pathname
  const isId = isIdLocale(pathname)
  if (targetLang === 'id') {
    if (isId) return pathname
    return pathname === '/' ? '/id' : `/id${pathname}`
  }
  if (!isId) return pathname
  return pathname.replace(/^\/id(?=\/|$)/, '') || '/'
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.6 }
  },
  exit: { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.12 } }
}

export default function LangSwitcher() {
  const [currentLang, setCurrentLang] = useState<'en' | 'id'>(() => {
    if (typeof window === 'undefined') return 'en'
    return isIdLocale(window.location.pathname) ? 'id' : 'en'
  })
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = () => {
      setCurrentLang(isIdLocale(window.location.pathname) ? 'id' : 'en')
    }
    document.addEventListener('astro:page-load', handler)
    return () => document.removeEventListener('astro:page-load', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  function handleSelect(lang: 'en' | 'id') {
    setOpen(false)
    if (lang === currentLang) return
    const href = getTargetHref(lang)
    if (buttonRef.current) {
      gsap
        .timeline()
        .to(buttonRef.current, { scale: 0.88, duration: 0.08, ease: 'power2.in' })
        .to(buttonRef.current, {
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

  const active = LANGS.find((l) => l.code === currentLang) ?? LANGS[0]

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${active.label}`}
        onClick={() => setOpen((v) => !v)}
        className="glass-btn flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm"
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span className="text-foreground font-mono text-xs uppercase tracking-wide">
          {active.code}
        </span>
        <motion.svg
          className="text-muted h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select language"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-1.5 min-w-[7.5rem] overflow-hidden rounded-xl border p-1"
            style={{
              background: 'color-mix(in oklch, var(--color-background) 85%, transparent)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'color-mix(in oklch, var(--color-border) 60%, transparent)'
            }}
          >
            {LANGS.map((lang) => {
              const isActive = lang.code === currentLang
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(lang.code)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                    style={
                      isActive
                        ? {
                            background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
                            color: 'var(--color-accent)'
                          }
                        : undefined
                    }
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {isActive && (
                      <svg
                        className="ml-auto h-3.5 w-3.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
