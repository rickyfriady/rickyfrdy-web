import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Briefcase, FileText, FolderOpen, Home, Mail, MoreHorizontal, User } from 'lucide-react'
import { useEffect, useState } from 'react'

type NavItem = { href: string; label: string; Icon: LucideIcon }

const mainLinks: NavItem[] = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/about', label: 'About', Icon: User },
  { href: '/projects', label: 'Projects', Icon: FolderOpen }
]

const moreLinks: NavItem[] = [
  { href: '/experience', label: 'Experience', Icon: Briefcase },
  { href: '/resume', label: 'Resume', Icon: FileText },
  { href: '/contact', label: 'Contact', Icon: Mail }
]

function isLinkActive(href: string, path: string): boolean {
  return href === '/' ? path === '/' : path.startsWith(href)
}

const pillStyle = {
  background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
  boxShadow: '0 0 12px color-mix(in oklch, var(--color-accent) 15%, transparent)'
}

const pillTransition = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 }

export default function MobileBottomNav() {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname)
      setMoreOpen(false)
    }
    document.addEventListener('astro:page-load', handler)
    return () => document.removeEventListener('astro:page-load', handler)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const moreActive = moreLinks.some(({ href }) => isLinkActive(href, currentPath))

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="relative flex items-center gap-0.5 px-1.5 py-1.5 rounded-[22px]"
        style={{
          background: 'color-mix(in oklch, var(--color-background) 65%, transparent)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid color-mix(in oklch, var(--color-accent) 22%, transparent)',
          boxShadow:
            '0 8px 32px oklch(0 0 0 / 0.18), 0 2px 8px oklch(0 0 0 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.08)'
        }}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
      >
        {mainLinks.map(({ href, label, Icon }) => {
          const active = isLinkActive(href, currentPath)
          return (
            <a
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-[3px] px-3 py-2.5 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-[14px]"
                  style={pillStyle}
                  transition={pillTransition}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 ${active ? 'text-accent' : ''}`}
                style={
                  active
                    ? undefined
                    : { color: 'color-mix(in oklch, var(--color-foreground) 38%, transparent)' }
                }
              />
              <span
                className={`relative z-10 font-mono text-[7.5px] tracking-[0.07em] uppercase ${active ? 'text-accent' : ''}`}
                style={
                  active
                    ? undefined
                    : { color: 'color-mix(in oklch, var(--color-foreground) 38%, transparent)' }
                }
              >
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-accent"
                  style={{
                    boxShadow: '0 0 5px color-mix(in oklch, var(--color-accent) 60%, transparent)'
                  }}
                />
              )}
            </a>
          )
        })}

        <button
          type="button"
          aria-expanded={moreOpen}
          aria-controls="mobile-more-drawer"
          onClick={() => setMoreOpen((v) => !v)}
          className="relative flex flex-col items-center gap-[3px] px-3 py-2.5 rounded-[14px]"
        >
          {moreActive && !moreOpen && (
            <motion.span
              layoutId="mobile-nav-pill"
              className="absolute inset-0 rounded-[14px]"
              style={pillStyle}
              transition={pillTransition}
            />
          )}
          <MoreHorizontal
            size={18}
            className={`relative z-10 ${moreOpen || moreActive ? 'text-accent' : ''}`}
            style={
              moreOpen || moreActive
                ? undefined
                : { color: 'color-mix(in oklch, var(--color-foreground) 38%, transparent)' }
            }
          />
          <span
            className={`relative z-10 font-mono text-[7.5px] tracking-[0.07em] uppercase ${moreOpen || moreActive ? 'text-accent' : ''}`}
            style={
              moreOpen || moreActive
                ? undefined
                : { color: 'color-mix(in oklch, var(--color-foreground) 38%, transparent)' }
            }
          >
            More
          </span>
        </button>
      </motion.div>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              className="fixed inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              id="mobile-more-drawer"
              role="menu"
              aria-label="More navigation"
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 overflow-hidden rounded-2xl"
              style={{
                background: 'color-mix(in oklch, var(--color-background) 65%, transparent)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid color-mix(in oklch, var(--color-accent) 22%, transparent)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {moreLinks.map(({ href, label, Icon }, i) => {
                const active = isLinkActive(href, currentPath)
                return (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 font-mono text-[0.7rem] tracking-[0.08em] uppercase transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                    style={{
                      color: active
                        ? 'var(--color-accent)'
                        : 'color-mix(in oklch, var(--color-foreground) 55%, transparent)',
                      borderTop:
                        i > 0
                          ? '1px solid color-mix(in oklch, var(--color-foreground) 8%, transparent)'
                          : 'none'
                    }}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {label}
                  </a>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
