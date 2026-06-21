import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' }
] as const

function isLinkActive(href: string, path: string): boolean {
  return href === '/' ? path === '/' : path.startsWith(href)
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }
  }
}

export default function NavLinks() {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname)
    document.addEventListener('astro:page-load', handler)
    return () => document.removeEventListener('astro:page-load', handler)
  }, [])

  return (
    <motion.ul
      className="hidden items-center gap-0.5 md:flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navLinks.map(({ href, label }) => {
        const active = isLinkActive(href, currentPath)
        return (
          <motion.li key={href} variants={itemVariants}>
            <a
              href={href}
              data-active={active ? '' : undefined}
              aria-current={active ? 'page' : undefined}
              className={`nav-link-item relative inline-flex items-center rounded-md px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors duration-[180ms] ${active ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
                    border: '1px solid color-mix(in oklch, var(--color-accent) 28%, transparent)'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </a>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
