# Changelog

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
