# Navbar Animations & Mobile Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Framer Motion spring-pill desktop nav, GSAP + View Transition page animations, and a mobile floating bottom nav to the existing Astro 6 + React site.

**Architecture:** Three self-contained pieces — `NavLinks.tsx` (Framer Motion `layoutId` pill + hover underline, replaces the plain `<ul>` in AppHeader), page transitions wired in `MainLayout.astro` (CSS View Transitions for exit/enter + GSAP accent line via `astro:before-swap`/`astro:after-swap`), and `MobileBottomNav.tsx` (fixed bottom island with spring pill and "More" drawer). All React islands use `transition:persist` so they survive Astro's ClientRouter SPA navigation, and `astro:page-load` to sync their active-path state.

**Tech Stack:** React 19, Framer Motion v12 (`layoutId`, `AnimatePresence`, `motion`), GSAP v3, Tailwind v4, Astro 6 (`client:load`, `transition:persist`, `transition:name`), lucide-react v1

---

### Task 1: Create NavLinks.tsx

**Files:**
- Create: `src/components/layout/NavLinks.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create NavLinks.tsx**

Create `src/components/layout/NavLinks.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/works', label: 'Works' },
  { href: '/contact', label: 'Contact' },
] as const

function isLinkActive(href: string, path: string): boolean {
  return href === '/' ? path === '/' : path.startsWith(href)
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } },
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
              className={`nav-link-item relative inline-flex items-center rounded-md px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors duration-[180ms] ${active ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
                    border: '1px solid color-mix(in oklch, var(--color-accent) 28%, transparent)',
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
```

- [ ] **Step 2: Add nav-link-item hover underline CSS**

In `src/styles/global.css`, append after the last line:

```css
/* --- Desktop nav hover underline (NavLinks island) --- */
.nav-link-item::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 12px;
  right: 12px;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1);
  border-radius: 1px;
}

.nav-link-item:hover::after {
  transform: scaleX(1);
}

.nav-link-item[data-active]::after {
  transform: scaleX(1);
  opacity: 0.5;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `bun run check`

Expected: No type errors in `NavLinks.tsx`. `motion.ul` with `variants` and `motion.span` with `layoutId` are valid Framer Motion v12 APIs.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/NavLinks.tsx src/styles/global.css
git commit -m "feat(navbar): add NavLinks island with spring pill and hover underline"
```

---

### Task 2: Wire NavLinks into AppHeader.astro

**Files:**
- Modify: `src/components/layout/AppHeader.astro`

- [ ] **Step 1: Replace frontmatter and plain nav `<ul>` with the island**

`src/components/layout/AppHeader.astro` currently has:

```astro
---
import WanderingEyes from './WanderingEyes'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/works', label: 'Works' },
  { href: '/contact', label: 'Contact' },
] as const

const currentPath = Astro.url.pathname
---
```

And inside `<nav>`:
```astro
    <ul class="hidden items-center gap-6 md:flex">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'font-mono text-xs tracking-widest uppercase transition-colors',
              href === '/' ? currentPath === '/' : currentPath.startsWith(href)
                ? 'text-foreground'
                : 'text-muted hover:text-accent',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
```

**Replace the frontmatter** with:
```astro
---
import NavLinks from './NavLinks'
import WanderingEyes from './WanderingEyes'
---
```

**Replace the `<ul>...</ul>` block** inside `<nav>` with:
```astro
    <NavLinks client:load transition:persist />
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun run check`

Expected: No errors. `NavLinks` is a valid React component for `client:load`. `transition:persist` is a valid Astro directive.

- [ ] **Step 3: Start dev server and visually verify**

Run: `bun run dev`, open `http://localhost:4321`.

Confirm:
- Nav links stagger-fade in on first load (7 links × 55ms stagger)
- Active page shows tinted pill background with accent border
- Hovering a non-active link: accent underline scales from center
- Navigating to `/about`: pill springs from "Home" to "About" with overshoot

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppHeader.astro
git commit -m "feat(navbar): wire NavLinks island into AppHeader"
```

---

### Task 3: Page Transition CSS

**Files:**
- Modify: `src/components/layout/MainLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add `transition:name` to `<main>` in MainLayout.astro**

In `src/components/layout/MainLayout.astro`, find line:
```astro
    <main class="flex-1">
```

Replace with:
```astro
    <main transition:name="page-content" class="flex-1">
```

This gives `<main>` a dedicated View Transition layer (`view-transition-name: page-content`) so only the page content animates — the header and footer stay put.

- [ ] **Step 2: Add page-exit and page-enter keyframes to global.css**

In `src/styles/global.css`, add the following directly after the existing `::view-transition-old(root)` / `::view-transition-new(root)` block (after line 48):

```css
/* Page content View Transition — exit: fade + drift up; enter: clip-path wipe + fade + drift up */
@keyframes page-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-14px); }
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(14px); clip-path: inset(0 0 100% 0); }
  to   { opacity: 1; transform: translateY(0);    clip-path: inset(0 0 0% 0); }
}

::view-transition-old(page-content) {
  animation: page-exit 150ms var(--ease-out-expo) forwards;
}

::view-transition-new(page-content) {
  animation: page-enter 300ms var(--ease-out-expo) forwards;
  animation-delay: 80ms;
}
```

- [ ] **Step 3: Verify transition applies**

Run: `bun run dev`, navigate between pages.

Confirm:
- Old page content fades out + drifts 14px up (150ms)
- New page content wipes in from top + fades + drifts up (300ms, 80ms delay)
- Header, footer, WanderingEyes stay completely static — they have no `view-transition-name`

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/MainLayout.astro src/styles/global.css
git commit -m "feat(transitions): add page-content view transition exit and clip-path wipe enter"
```

---

### Task 4: Accent Line + GSAP Script

**Files:**
- Modify: `src/components/layout/MainLayout.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add the accent line div to MainLayout.astro**

In `src/components/layout/MainLayout.astro`, add the accent line immediately after `<AppHeader />`:

**Before:**
```astro
    <AppHeader />
    <main transition:name="page-content" class="flex-1">
```

**After:**
```astro
    <AppHeader />
    <div id="page-accent-line" transition:persist aria-hidden="true"></div>
    <main transition:name="page-content" class="flex-1">
```

`transition:persist` keeps this div alive across SPA navigations so GSAP can target the same DOM element in both `astro:before-swap` and `astro:after-swap`.

- [ ] **Step 2: Add accent line base CSS to global.css**

Append to the end of `src/styles/global.css`:

```css
/* --- Page transition accent line --- */
#page-accent-line {
  position: fixed;
  top: 57px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
  box-shadow: 0 0 8px color-mix(in oklch, var(--color-accent) 50%, transparent);
  transform: scaleX(0);
  transform-origin: left center;
  z-index: 9999;
  pointer-events: none;
}
```

- [ ] **Step 3: Add GSAP transition script to MainLayout.astro**

In `src/components/layout/MainLayout.astro`, add a new `<script>` block immediately before `</body>` (after the existing `<script is:inline>` block):

```astro
    <script>
      import gsap from 'gsap'

      document.addEventListener('astro:before-swap', () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const line = document.getElementById('page-accent-line')
        if (!line) return
        gsap.killTweensOf(line)
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.2, ease: 'power2.inOut' },
        )
      })

      document.addEventListener('astro:after-swap', () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const line = document.getElementById('page-accent-line')
        if (!line) return
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.15,
          ease: 'power2.in',
          delay: 0.12,
        })
      })
    </script>
```

Note: This `<script>` (without `is:inline`) is a bundled module script. Astro deduplicates it across navigations so the listeners register exactly once and persist for the life of the SPA session.

- [ ] **Step 4: Verify accent line fires on navigation**

Run: `bun run dev`, navigate between several pages.

Confirm:
- A 2px accent-colored line sweeps left→right below the header on every page navigation
- After the new page loads, the line sweeps right→left and disappears
- The line does NOT appear when toggling the dark/light theme (theme toggle uses `document.startViewTransition` directly, not Astro's ClientRouter, so `astro:before-swap` never fires)

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/MainLayout.astro src/styles/global.css
git commit -m "feat(transitions): add GSAP accent line sweep on page navigation"
```

---

### Task 5: Create MobileBottomNav.tsx

**Files:**
- Create: `src/components/layout/MobileBottomNav.tsx`

- [ ] **Step 1: Create MobileBottomNav.tsx**

Create `src/components/layout/MobileBottomNav.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  FileText,
  FolderOpen,
  Home,
  LayoutGrid,
  Mail,
  MoreHorizontal,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = { href: string; label: string; Icon: LucideIcon }

const mainLinks: NavItem[] = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/about', label: 'About', Icon: User },
  { href: '/works', label: 'Works', Icon: LayoutGrid },
]

const moreLinks: NavItem[] = [
  { href: '/experience', label: 'Experience', Icon: Briefcase },
  { href: '/resume', label: 'Resume', Icon: FileText },
  { href: '/projects', label: 'Projects', Icon: FolderOpen },
  { href: '/contact', label: 'Contact', Icon: Mail },
]

function isLinkActive(href: string, path: string): boolean {
  return href === '/' ? path === '/' : path.startsWith(href)
}

const pillStyle = {
  background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
  boxShadow: '0 0 12px color-mix(in oklch, var(--color-accent) 15%, transparent)',
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

  const moreActive = moreLinks.some(({ href }) => isLinkActive(href, currentPath))

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="relative flex items-center gap-0.5 px-1.5 py-1.5"
        style={{
          background: 'rgba(14,22,19,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid color-mix(in oklch, var(--color-accent) 22%, transparent)',
          borderRadius: '22px',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
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
              className="relative flex flex-col items-center gap-[3px] px-3 py-2.5 rounded-[14px]"
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
                className="relative z-10"
                style={{ color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)' }}
              />
              <span
                className="relative z-10 font-mono text-[7.5px] tracking-[0.07em] uppercase"
                style={{ color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)' }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                  style={{
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 5px color-mix(in oklch, var(--color-accent) 60%, transparent)',
                  }}
                />
              )}
            </a>
          )
        })}

        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="relative flex flex-col items-center gap-[3px] px-3 py-2.5 rounded-[14px]"
        >
          {(moreOpen || moreActive) && (
            <motion.span
              layoutId="mobile-nav-pill"
              className="absolute inset-0 rounded-[14px]"
              style={pillStyle}
              transition={pillTransition}
            />
          )}
          <MoreHorizontal
            size={18}
            className="relative z-10"
            style={{ color: moreOpen || moreActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)' }}
          />
          <span
            className="relative z-10 font-mono text-[7.5px] tracking-[0.07em] uppercase"
            style={{ color: moreOpen || moreActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.28)' }}
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
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 overflow-hidden"
              style={{
                background: 'rgba(14,22,19,0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid color-mix(in oklch, var(--color-accent) 22%, transparent)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
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
                    className="flex items-center gap-3 px-4 py-3 font-mono text-[0.7rem] tracking-[0.08em] uppercase transition-colors hover:text-foreground"
                    style={{
                      color: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.45)',
                      borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun run check`

Expected: No errors. `LucideIcon` is a valid named export from `lucide-react` v1. All icon names (`Home`, `User`, `LayoutGrid`, `MoreHorizontal`, `Briefcase`, `FileText`, `FolderOpen`, `Mail`) are standard lucide icons available in v1.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MobileBottomNav.tsx
git commit -m "feat(mobile-nav): add MobileBottomNav island with spring pill and More drawer"
```

---

### Task 6: Wire MobileBottomNav into MainLayout.astro

**Files:**
- Modify: `src/components/layout/MainLayout.astro`

- [ ] **Step 1: Import MobileBottomNav in the frontmatter**

In `src/components/layout/MainLayout.astro`, the current frontmatter is:

```astro
---
import { ClientRouter } from 'astro:transitions'
import AppFooter from './AppFooter.astro'
import AppHeader from './AppHeader.astro'
import BaseHead from './BaseHead.astro'
import '@/styles/global.css'
```

Add the MobileBottomNav import:

```astro
---
import { ClientRouter } from 'astro:transitions'
import AppFooter from './AppFooter.astro'
import AppHeader from './AppHeader.astro'
import BaseHead from './BaseHead.astro'
import MobileBottomNav from './MobileBottomNav'
import '@/styles/global.css'
```

- [ ] **Step 2: Add the island to `<body>` just before the existing `<script is:inline>` block**

Find the section in MainLayout.astro that looks like:

```astro
    <AppFooter />

    <script is:inline>
```

Add `<MobileBottomNav>` between `<AppFooter />` and the script:

```astro
    <AppFooter />

    <MobileBottomNav client:load transition:persist />

    <script is:inline>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `bun run check`

Expected: No errors.

- [ ] **Step 4: Start dev server and verify on mobile viewport**

Run: `bun run dev`, open `http://localhost:4321`.

In browser DevTools set viewport to 390×844 (iPhone 14). Confirm:
- Floating glass pill appears at bottom-center, hidden on desktop (≥ 768px)
- Home is active on `/` — shows tinted pill + accent dot
- Tapping "More" opens the upward drawer with Experience, Resume, Projects, Contact
- Tapping a drawer link navigates and closes the drawer
- Pill springs to the new active tab on navigation
- Spring entry animation (fade + scale up) plays on first load, 200ms delay

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/MainLayout.astro
git commit -m "feat(mobile-nav): wire MobileBottomNav into MainLayout"
```
