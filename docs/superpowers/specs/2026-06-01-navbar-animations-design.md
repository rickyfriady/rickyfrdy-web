# Navbar Animations & Mobile Nav Design

## Overview

Three coordinated features that elevate navigation from functional to expressive — all using existing dependencies (Framer Motion v12, GSAP v3, Astro 6 ClientRouter).

**Tech Stack:** React 19, Framer Motion v12 (`layoutId`, `AnimatePresence`, `motion`), GSAP v3, Tailwind v4, Astro 6 (`client:load`, View Transitions API, `astro:before-swap`, `astro:after-swap`)

---

## Feature 1: Desktop Navbar Micro-interactions

### What changes

`AppHeader.astro` currently renders nav links as plain `<a>` tags with CSS hover states. We replace the nav links section with a new `NavLinks.tsx` React island that adds:

1. **Spring pill** — a `motion.span` with `layoutId="nav-pill"` absolutely positioned behind the active link. On page mount, Framer Motion springs it from off-screen to the active item's position, giving a physical snap-in feel on every navigation.

2. **Hover underline** — a `motion.span` underline per link that scales from 0 → 1 on hover using CSS `transform: scaleX()` with `transform-origin: center`. GSAP is not needed here; a CSS transition handles it cleanly.

3. **Stagger entry** — on mount, links fade + slide up with a 60ms stagger per item using Framer Motion's `variants` + `staggerChildren`.

### Component: `NavLinks.tsx`

- `client:load` island inside `AppHeader.astro`
- Receives `currentPath` as a prop from the Astro frontmatter
- Uses a `relative` positioned `<ul>` so the `layoutId` pill can be `absolute` within the shared layout context
- The pill is rendered inside each `<li>` that is active; Framer Motion's `layoutId` handles the cross-render animation
- On hover, each link shows a 1px accent-color underline that scales from center (220ms `ease-out-quart`)
- Reduced-motion: pill appears instantly (no spring), underline skips animation — detected via `useReducedMotion()` from Framer Motion

### Pill behaviour detail

```
mount (new page):
  → pill springs to active <li> position
  → spring: stiffness 400, damping 30, mass 0.8

hover (non-active link):
  → underline scaleX 0→1 in 220ms
  → link color fades to foreground in 180ms

click:
  → pill is already at new position after navigation re-mount
  (no in-page click tracking needed — Astro's SPA handles page swap)
```

---

## Feature 2: Page Transition Animations

### Architecture

Astro 6's `ClientRouter` provides lifecycle hooks (`astro:before-swap`, `astro:after-swap`) and the View Transitions API for coordinating exit/enter animations. We hook into these in a `<script>` block in `MainLayout.astro`.

The accent line is a `<div id="nav-accent-line">` injected once into `<body>` — a fixed 2px horizontal line, initially `scaleX(0)`, that GSAP sweeps left→right during each transition.

### Timing sequence

```
t=0ms    nav link clicked
         → astro:before-swap fires
         → exit: main content fades out + translates -16px (150ms ease-out)

t=100ms  → accent line: scaleX 0→1, left→right (180ms ease-in-out)
            color: var(--color-accent), width: 100vw, top: ~50px (below header)

t=200ms  → DOM swap happens (Astro replaces page content)
         → astro:after-swap fires
         → enter: clip-path inset(0 0 100% 0) → inset(0 0 0% 0) (280ms ease-out-expo)
           simultaneously: fade 0→1 + translateY 16px→0px

t=480ms  transition complete, accent line fades out (150ms)
```

### View Transitions setup

In `global.css`, define named `@keyframes` for the page-level enter/exit, applied via `::view-transition-old(page-content)` and `::view-transition-new(page-content)`. The `<main>` element gets `view-transition-name: page-content`.

The accent line is pure GSAP — no View Transition needed for it. It runs on top of everything via `position: fixed; z-index: 9999`.

### Reduced motion

If `prefers-reduced-motion: reduce` is set:
- Skip accent line animation entirely
- Exit: instant opacity 0 (no translate)
- Enter: instant opacity 1 (no clip-path)

---

## Feature 3: Mobile Bottom Navigation

### What it is

A `MobileBottomNav.tsx` React island (`client:load`) rendered in `MainLayout.astro` just before `</body>`. Visible only on mobile (`md:hidden`). The desktop `AppHeader.astro` nav links remain `hidden md:flex` — the two navs are independent.

### Layout

- **Shape**: Centered floating pill, not edge-to-edge. Width: `auto` (fits content), max ~`288px`. Border-radius: `22px`.
- **Background**: `rgba(14,22,19,0.96)` with `backdrop-filter: blur(20px)`. Accent border `rgba(--color-accent, 0.22)`.
- **Shadow**: `0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`.
- **Position**: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50`.

### Nav items (4 visible)

| Label | Route | Icon |
|-------|-------|------|
| Home | `/` | House outline (Lucide `Home`) |
| About | `/about` | Person outline (Lucide `User`) |
| Works | `/works` | Grid (Lucide `LayoutGrid`) |
| More | — | Dots (Lucide `MoreHorizontal`) |

"More" opens an upward drawer (`AnimatePresence` slide-up sheet) containing: Experience, Resume, Projects, Contact — as a simple list with the same pill-active treatment. (Mirrors the existing desktop nav exactly — no Blog link since the desktop nav omits it.)

### Active state

Each item: icon (18×18) above a label (7.5px mono uppercase). Active item gets:
- Tinted rounded background: `rgba(--color-accent, 0.12)` with `border-radius: 12px`
- Accent glow: `box-shadow: 0 0 12px rgba(--color-accent, 0.15)`
- 3px accent dot below the label
- Icon and label color: `var(--color-accent)`

Inactive: icon + label at 25% white opacity.

### Spring animation

Framer Motion `layoutId="mobile-nav-pill"` on the active item's background — same spring config as desktop (`stiffness: 400, damping: 30, mass: 0.8`). On press: `scale: 0.88` feedback (80ms).

### More drawer

- `AnimatePresence` controlled by local `isOpen` state
- Sheet slides up from the pill position: `y: 20 → 0`, `opacity: 0 → 1`, `scale: 0.96 → 1` (200ms spring)
- Backdrop: `fixed inset-0 bg-transparent` click-away to close
- Sheet has same glass treatment as the pill
- Each drawer link: same hover underline as desktop

### Entry animation

On mount (page load/navigation), the pill fades in + scales up from 0.8 → 1 (300ms spring, 200ms delay so it doesn't compete with page enter).

---

## Files Affected

| File | Change |
|------|--------|
| `src/components/layout/AppHeader.astro` | Remove plain nav `<ul>`, add `<NavLinks client:load currentPath={currentPath} />` |
| `src/components/layout/NavLinks.tsx` | **New** — desktop nav links with layoutId pill + hover underline |
| `src/components/layout/MobileBottomNav.tsx` | **New** — mobile fixed bottom nav |
| `src/components/layout/MainLayout.astro` | Add `<MobileBottomNav client:load currentPath={currentPath} />`, add `transition:name="page-content"` to `<main>`, add accent line `<div>`, add page-transition `<script>` |
| `src/styles/global.css` | Add `@keyframes` for page enter/exit, `::view-transition-old(page-content)` / `::view-transition-new(page-content)` rules, accent line base styles |

---

## What We Are NOT Building

- No hamburger menu (mobile uses the bottom nav instead)
- No mega-menu or dropdowns
- No scroll-triggered navbar hide/show (out of scope)
- No custom cursor effects
- No per-page custom transition variants (all pages use the same transition)
