## Context

Portfolio site built with Astro 6 (SSG), React 19 islands, Tailwind v4, GSAP + Framer Motion. Investigated during explore mode — found 2 critical bugs and several Astro best practice gaps.

### Current State

**Bug #1 — Desktop nav vertical**: `global.css` line 457 adds `astro-island[await-children] > :not(.hydrated) { display: block; }` as CLS prevention. This rule is **unlayered** — CSS Cascade Layers spec says unlayered beats all `@layer` styles. Tailwind's `.hidden` + `.md\:flex` sit in `@layer utilities`. Result: at `≥768px`, `<ul>` gets `display: block` instead of `display: flex`.

**Bug #2 — Mobile nav invisible**: `MobileBottomNav` uses `color-mix(in oklch, var(--color-background) 65%, transparent)`. In light mode, background (`oklch(0.975 0.005 240)`) and pill surface are near-identical after blending.

**Missing content schema**: No `src/content/config.ts`. `getCollection('blog')` returns `any` — frontmatter typos silently pass.

**Hydration strategy**: 9 React islands use `client:load` (eager). Non-critical ones (LangSwitcher, MobileBottomNav, HeroPhoto, ContactForm) load JS before needed.

**Hardcoded base URL**: `<base href="https://rickyfrdy.my.id">` breaks local dev.

**GSAP bundle**: `PageAnimations.astro` bundles GSAP + ScrollTrigger on every page (~40KB).

## Goals / Non-Goals

**Goals:**
- Desktop nav renders `display: flex` at ≥768px (horizontal links)
- Mobile bottom nav visible in light mode
- Content collection schemas enforce frontmatter at build time
- Non-critical React islands hydrate lazily (idle/visible)
- Base URL uses `Astro.site` instead of hardcoded domain
- GSAP + ScrollTrigger only load on pages that need animation
- Hero images use `loading="eager"` for LCP

**Non-Goals:**
- Rewrite page components or animation logic
- Change design tokens or color system architecture
- Full i18n architecture overhaul (duplicate page files stay)
- SSR/hybrid rendering mode (stays SSG)

## Decisions

### D1: Fix Bug #1 — Add utility-layer override instead of inline styles
**Decision**: Add unlayered CSS rule with higher specificity in global.css:
```css
/* Override Astro SSR display block for hydrated islands */
astro-island[await-children] > ul {
  display: unset;
}
```
**Rationale**: 
- **Option A** (inline via Framer Motion `style`) — works but couples presentation to JS
- **Option B** (unlayered override) — CSS-only, no JS dependency. But must be careful with specificity
- **Option C** (`!important`) — fragile, harder to override later
- **Option D chosen**: Target specific element type (`ul`) + keep unlayered → specificity wins over both Astro rule and Tailwind layer

### D2: Fix Bug #2 — Use opaque fallback for light mode
**Decision**: Make bottom nav pills use `background: var(--color-surface)` with opacity, not `color-mix` blend.
```css
background: color-mix(in oklch, var(--color-surface) 90%, transparent);
```
**Rationale**: `color-mix` with `var(--color-background)` creates transparency illusion. In light mode where background ≈ surface, the pill disappears. Using `var(--color-surface)` as base maintains glass effect while ensuring visibility.

### D3: Content schema approach
**Decision**: Single `src/content/config.ts` with `defineCollection` for both `blog` and `projects`.
**Rationale**: Both collections exist in `content/` but were never configured. This validates at build time for free.

### D4: Hydration directive changes
**Decision**: Move from `client:load` to appropriate lazy directives:
| Component | Current | New | Rationale |
|-----------|---------|-----|-----------|
| NavLinks | `client:load` | keep | Above fold, affects layout |
| LangSwitcher | `client:load` | `client:idle` | Not critical for initial paint |
| MobileBottomNav | `client:load` | `client:visible` | Bottom of page, mobile only |
| HeroPhoto | `client:load` | `client:idle` | Image, no interaction needed |
| ContactForm | `client:load` | `client:visible` | Below fold on contact page |

**Rationale**: Reduces initial JS bundle. NavLinks stays eager because hydration is needed before paint to prevent layout shift.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Bug #1 fix could break CLS prevention | Test with slow 3G — Astro CSS persists even without hydration |
| `client:idle` delays are non-deterministic across browsers | Browsers are consistent with `requestIdleCallback` shimming |
| `client:visible` on MobileBottomNav delays tap targets | PWA on mobile — nav already visible statically. JS adds interactivity |
