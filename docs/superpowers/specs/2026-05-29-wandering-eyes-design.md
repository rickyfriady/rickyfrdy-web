# Wandering Eyes — Header Logo Design Spec

**Date:** 2026-05-29
**Status:** Approved
**Branch:** dev-feature/ricky/wandering-eyes

---

## Overview

Add an interactive "wandering eyes" effect to the `Ricki Friadi` logo in `AppHeader`. Two small circular eyes with minimal dot pupils sit to the left of the name. On desktop, pupils track the mouse cursor using spring physics. On mobile (touch device), pupils auto-wander in a looping rotation animation.

---

## Goals

- Add personality and interactivity to the site header without disrupting the editorial aesthetic.
- Use Framer Motion (already installed at v12) — no new dependencies.
- Degrade gracefully: mobile gets a looping animation fallback, reduced-motion users are unaffected.

---

## Architecture

Two files change:

```
src/components/layout/WanderingEyes.tsx   ← New React island (owns logo link + eyes + name)
src/components/layout/AppHeader.astro     ← Replace plain <a> logo with <WanderingEyes client:load />
```

`framer-motion` v12 is already in `dependencies` — no install step.

---

## Component Design

### `WanderingEyes.tsx`

**Structure:** The component renders the entire logo link (`<a href="/">`), containing two `<Eye />` sub-components and the "Ricki Friadi" text:

```
<a href="/" flex items-center gap-2>
  <span aria-hidden="true" flex gap-1>
    <Eye />
    <Eye />
  </span>
  Ricki Friadi
</a>
```

`aria-hidden="true"` on the eyes wrapper — decorative only, screen readers read the text.

### `Eye` sub-component

Each `Eye` is a `16×16px` circle (`rounded-full border border-border`) containing a `5×5px` pupil dot (`bg-accent`, teal `#8ca89c`). The pupil is positioned at the top of the eye circle and rotates around the eye's center point.

**Framer Motion primitives used:**
- `useMotionValue(0)` — stores current rotation angle
- `useSpring(rotate, { damping: 20, stiffness: 300 })` — spring-smoothed version for natural feel
- `motion.div` — animates the pupil; `style={{ rotate: springRotate }}` on desktop

**Desktop behavior (pointer device):**
- `useEffect` attaches a `mousemove` listener on `window`
- Calculates `Math.atan2(cursorY - eyeCenterY, cursorX - eyeCenterX)` → angle in degrees
- Sets `rotate.set(angle + 90)` (offset 90° so pupil starts at top)
- Returns cleanup: `window.removeEventListener('mousemove', onMove)`
- Mobile detection: `navigator.maxTouchPoints > 0` checked once at mount

**Mobile behavior (touch device):**
- Mouse listener is skipped entirely
- `motion.div` uses `animate={{ rotate: 360 }}` + `transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}`
- Pupils orbit continuously — no cursor needed

### AppHeader change

Remove:
```astro
<a href="/" class="text-foreground font-display text-lg font-light tracking-tight">
  Ricki Friadi
</a>
```

Replace with:
```astro
import WanderingEyes from './WanderingEyes'
...
<WanderingEyes client:load />
```

The `WanderingEyes` component replicates the same Tailwind classes (`font-display text-lg font-light tracking-tight text-foreground`) so visual appearance is identical except for the eyes.

---

## Visual Spec

```
┌──────────────────────────────────────────────────────┐
│  [○ ○]  Ricki Friadi          Home About ... Contact │
└──────────────────────────────────────────────────────┘
```

- Eye outer circle: `16×16px`, `border border-border`, `rounded-full`, transparent fill
- Pupil: `5×5px`, `rounded-full`, `bg-accent`, offset `3px` from eye center (top)
- Gap between eyes: `4px` (`gap-1`)
- Gap between eyes group and name: `8px` (`gap-2`)

---

## File Changeset

| File | Action |
|------|--------|
| `src/components/layout/WanderingEyes.tsx` | Create — React island |
| `src/components/layout/AppHeader.astro` | Replace plain logo `<a>` with `<WanderingEyes client:load />` |

No changes to `package.json` — `framer-motion` v12 already installed.

---

## Error Handling

- `eyeRef.current` null-checked before accessing `getBoundingClientRect()` — no-op if ref not ready.
- `navigator.maxTouchPoints` checked once at mount inside `useEffect` — SSR-safe (no `window` at build time).

---

## Testing

No unit tests — pure visual/interactive component with no branching logic to test. Manual verification: confirm pupils track cursor on desktop and animate on mobile (or by removing the `maxTouchPoints` check temporarily).

---

## Out of Scope

- GSAP alternative (already installed, but Framer Motion is sufficient and consistent with existing React islands).
- Reduced-motion support beyond the browser default (`prefers-reduced-motion` is respected by Framer Motion automatically in v12).
- Eye blinking animation.
- Eyelid / sclera / full cartoon style.
