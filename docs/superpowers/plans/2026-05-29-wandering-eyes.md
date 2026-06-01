# Wandering Eyes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive cursor-tracking eyes to the `Ricki Friadi` logo in `AppHeader` — pupils track the mouse on desktop and auto-orbit on mobile.

**Architecture:** A new `WanderingEyes.tsx` React island owns the entire logo link (eyes + name text). `AppHeader.astro` replaces the plain `<a>` with `<WanderingEyes client:load />`. No new dependencies — `framer-motion` v12 is already installed.

**Tech Stack:** React 19, Framer Motion v12 (`useMotionValue`, `useSpring`, `motion.div`), Tailwind v4, Astro 6 (`client:load`).

---

### Task 1: Create WanderingEyes.tsx

**Files:**
- Create: `src/components/layout/WanderingEyes.tsx`

No unit tests — pure visual component with no branching logic to test in isolation.

- [ ] **Step 1: Create the file with the Eye sub-component and WanderingEyes component**

Create `src/components/layout/WanderingEyes.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

function Eye() {
  const eyeRef = useRef<HTMLDivElement>(null)
  const rotate = useMotionValue(0)
  const springRotate = useSpring(rotate, { damping: 20, stiffness: 300 })

  useEffect(() => {
    const isMobile = navigator.maxTouchPoints > 0
    if (isMobile) return

    function onMove(e: MouseEvent) {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
      rotate.set(angle + 90)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rotate])

  const isMobile = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

  return (
    <div
      ref={eyeRef}
      className="border-border relative h-4 w-4 overflow-hidden rounded-full border"
    >
      {/*
        motion.div fills the eye (inset-0) and rotates around its own center,
        which is the eye's center. The pupil child rides along offset at the top.
      */}
      <motion.div
        className="absolute inset-0"
        style={isMobile ? undefined : { rotate: springRotate }}
        animate={isMobile ? { rotate: 360 } : undefined}
        transition={
          isMobile
            ? { repeat: Infinity, duration: 3, ease: 'linear' }
            : undefined
        }
      >
        <div className="bg-accent absolute top-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full" />
      </motion.div>
    </div>
  )
}

export default function WanderingEyes() {
  return (
    <a
      href="/"
      className="text-foreground font-display flex items-center gap-2 text-lg font-light tracking-tight"
    >
      <span aria-hidden="true" className="flex gap-1">
        <Eye />
        <Eye />
      </span>
      Ricki Friadi
    </a>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `bun run check`

Expected: No type errors in `WanderingEyes.tsx`. The `springRotate` value is a `MotionValue<number>` accepted by `style={{ rotate }}`. The `isMobile` check is computed at render time and guarded with `typeof navigator !== 'undefined'` for SSR safety.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/WanderingEyes.tsx
git commit -m "feat(wandering-eyes): add WanderingEyes React island with spring pupil tracking"
```

---

### Task 2: Wire WanderingEyes into AppHeader

**Files:**
- Modify: `src/components/layout/AppHeader.astro`

- [ ] **Step 1: Replace the plain logo link with the WanderingEyes island**

In `src/components/layout/AppHeader.astro`, replace the frontmatter and logo element:

**Before** (frontmatter):
```astro
---
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

**After** (frontmatter):
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

**Before** (logo element inside `<nav>`):
```astro
<a href="/" class="text-foreground font-display text-lg font-light tracking-tight">
  Ricki Friadi
</a>
```

**After** (logo element inside `<nav>`):
```astro
<WanderingEyes client:load />
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `bun run check`

Expected: No errors. `WanderingEyes` is a valid default export from `./WanderingEyes`.

- [ ] **Step 3: Start dev server and visually verify**

Run: `bun run dev`

Open `http://localhost:4321` and confirm:
- Two small circular eyes appear to the left of "Ricki Friadi" in the header
- Moving the mouse causes pupils to track the cursor on desktop
- Visual appearance (font, size, spacing) is identical to the plain logo link

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppHeader.astro
git commit -m "feat(wandering-eyes): wire WanderingEyes island into AppHeader logo"
```
