# Changelog

## [v1.2.8] — 2026-07-03

### Added
- **Blog editorial redesign** — `/blog` rebuilt as a card-grid listing (featured cards + uniform grid), category filter pills, client-side search, and pagination (fixed page size, hidden when everything fits on one page); `/blog/tag/[tag]` gets the same treatment
- **`category`/`coverImage` blog schema fields** — `category` (required) drives the filter pills and card badges; optional `coverImage` falls back to a deterministic `AnimatedGradient` keyed by slug when a post has no cover art yet
- **Article hero band** — `/blog/[slug]` opens on a hero band (category pill, title, cover art, date/author) that's always rendered in the dark theme regardless of the visitor's site-wide light/dark selection, followed by a utility bar (back link, reading time, share via Web Share API + clipboard fallback)
- **Sticky article sidebar** — table of contents (promoted from an inline collapsible `<details>`), tags, reading time, and a short author blurb, sticky alongside the prose on wide viewports and collapsing to a single column on mobile

### Changed
- **Collaborators section** ("People I've worked with") redesigned from a quote/bento layout to square (1:1) photo cards; company name now appears as a text tag that slides in on hover instead of a static logo panel; hover and scroll-reveal animation is GSAP-driven
- **`Collaborator` content model** — `role`/`company` split into separate fields, `quote` removed

### Fixed
- **Scroll-reveal content could get stuck invisible** on `/projects` and other pages — root-caused to two independent reveal systems (a legacy CSS + `IntersectionObserver` system that predated `PageAnimations.astro` and was never fully retired, plus GSAP `ScrollTrigger` positions going stale if custom fonts swap in after they're calculated) both hiding content with no fallback; `PageAnimations.astro` now refreshes `ScrollTrigger` once fonts load and force-reveals any content still hidden after a short grace period, and every page now uses the one hardened system
- **Removed the `#page-accent-line` page-transition glow** — the glowing accent bar that swept across the top of the page on every navigation is gone, with no replacement indicator

## [v1.2.7] — 2026-06-27

### Added
- **NavLinks.astro** — pure Astro replacement for `NavLinks.tsx`; active state resolved server-side via `Astro.url.pathname` (zero client hydration for the nav)
- **`nav-island` CSS utility** — floating centered pill navbar with glassmorphism (`backdrop-filter: blur(20px) saturate(1.8)`), theme-aware background via `color-mix(in oklch, var(--color-background) 72%, transparent)`, and border from `--color-border`
- **`nav-island-pill` CSS utility** — accent-tinted active link indicator using existing `--color-accent` token
- **View Transitions active pill** — `transition:name="nav-active-pill"` on active link span; shared-element animation slides the pill between links on navigation via Astro's `ClientRouter`
- **`prefers-reduced-motion` guard** — `::view-transition-group/old/new(nav-active-pill)` collapses to `0.01ms` on reduced-motion

### Changed
- **AppHeader** — refactored from full-width sticky glass bar to floating island pill (`position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); border-radius: 9999px`); scroll progress bar moved to separate fixed element above the pill (`z-[51]`)
- **NavLinks** — migrated from React island (`client:load`) to pure `.astro` component; removes Framer Motion `layoutId` from desktop nav; `transition:persist` removed so active state re-renders correctly on each navigation
- **MainLayout** — `<main>` receives `pt-[calc(var(--nav-height)+1.5rem)]` to compensate for fixed navbar positioning

### Removed
- **`NavLinks.tsx`** — deleted; replaced by `NavLinks.astro`

## [v1.2.6] — 2026-06-21

### Added
- **ContactForm** — autosave draft to localStorage, honeypot, confetti animation, loading spinner, field-level error messages
- **NavLinks** — `aria-current="page"` for active link announcement
- **ProjectsAccordion** — `aria-expanded` and `aria-controls` for panel toggle
- **GitHubActivity** — cached `relativeTime()`, memoized timestamps, "Show N more" pagination (5-at-a-time with AnimatePresence), counter badge
- **SkillsMatrix** — search input with category filter tabs-sliding pill
- **WanderingEyes** — ambient oklch glow via `requestAnimationFrame` (hue drift + opacity pulse)

### Changed
- **Theme system** — prefers-color-scheme + `.dark` class toggle, CSS layer architecture (`@layer base / components`), `--nav-height` token
- **global.css** — reorganized into layers with colophon → `@utility` migration
- **Color tokens** — all text colors now pass WCAG AA (4.5:1 minimum):
  - Light `--color-muted`: 0.52→0.40 (1.8:1→6.1:1 ✅ AA)
  - Light `--color-accent`: 0.53→0.42 (1.8:1→5.6:1 ✅ AA)
  - Dark `--color-muted`: 0.58→0.65 (3.3:1→5.8:1 ✅ AA)
  - Dark `--color-accent`: 0.70→0.76 (4.0:1→8.2:1 ✅ AAA)
- **GitHubLanguages** — language names always visible (`hidden sm:inline` → `text-[9px] sm:text-[10px]`)
- **GitHubPinnedRepos** — Star/GitFork icons: `h-4→h-3`, `text-[9px]→text-[10px]`, `aria-hidden="true"`
- **LangSwitcher** — Framer Motion AnimatePresence → `t-dropdown` CSS (lighter, same UX)
- **ContactForm submit** — `<Send>` ↔ `<Loader2>` via `t-icon-swap` cross-fade; "Sending…" via `t-shimmer` sweep
- **ContactForm success** — Framer Motion spring + `<CheckCircle>` → `t-success-check` SVG stroke-draw + bob
- **FeaturedBadge** — removed `lottie-web` (45 KB dep) → two inline SVGs in `t-icon-swap`

### Fixed
- **GitHubHeatmap** — div grid → semantic `<table>` with `<thead>/<tbody>`, `aria-label` per cell, arrow-key navigation (↑↓←→) with roving `tabIndex`
- **MobileBottomNav** — Escape key dismisses "More" drawer, `aria-expanded` + `aria-controls` on toggle
- **ProjectsGrid** — mobile collapsible filter drawer with AnimatePresence, active-filter count badge
- **Focus-visible rings** — added `focus-visible:ring-2 ring-accent` to NavLinks, WanderingEyes, LangSwitcher dropdown options, MobileBottomNav tabs + drawer links
- **FeaturedBadge** — reduced-motion guard (skips Lottie when `prefers-reduced-motion: reduce`)
- **ProjectsGrid mobile** — filter sidebar becomes collapsible on mobile with active filter badge

### CSS / Architecture
- Installed full [transitions.dev](https://transitions.dev) `_root.css` token block with 10 transition kits
- Wired 7 transitions into components (menu-dropdown, icon-swap, shimmer-text, success-check, error-shake, tabs-sliding, avatar-hover)
- All transitions include `prefers-reduced-motion: reduce` guards
