# Project Case Study Pages — Design Spec

**Date:** 2026-05-13
**Status:** Approved

---

## Goal

Rebuild `/projects/[slug]` into a full case study page — minimalist editorial design with GSAP + Framer Motion animations, all 9 content sections, hybrid TypeScript + MDX data, i18n-ready labels, and full A11y compliance.

---

## Architecture

Two data sources per project:

```
src/data/projects.ts          →  structured fields (role, metrics, tech, links)
src/content/projects/[slug].mdx  →  rich prose overview (optional per project)
```

`[slug].astro` loads both. If no MDX file exists for a project, `fullDescription` from TypeScript is used as the overview fallback. All other sections (metrics, highlights, problem→solution, next/prev) always come from TypeScript structured arrays.

---

## Design

### Visual style

- **Light mode:** `#f8f7f4` background, `#0e1a16` text, `#8ca89c` accents
- **Dark mode:** `#0e1a16` background, `#f2f0e8` text, `#8ca89c` accents
- Fully theme-aware — same layout, colors invert with the site's existing `.dark` class toggle
- Left dark-green accent bar running full height of the hero
- **Cormorant Garamond italic** for the project title (large, commanding)
- **JetBrains Mono** uppercase for all section labels (`OVERVIEW`, `IMPACT`, etc.)
- **DM Sans** for body prose
- Generous whitespace, thin `border-border` dividers between sections

### Page sections (in render order)

| # | Section | Data source |
|---|---------|-------------|
| 1 | Back link `← Projects` | static |
| 2 | Hero (gradient or image + title overlay) | `heroImage?`, `title`, `year`, `category` |
| 3 | Role pill + tech stack tags + CTAs | `role?`, `technologies`, `liveUrl?`, `githubUrl?` |
| 4 | Overview | MDX `Content` component, fallback: `fullDescription` |
| 5 | Impact metrics | `metrics?: { value, label }[]` |
| 6 | Problem → Solution | `challenges[]` + `solutions[]` (paired by index) |
| 7 | Key highlights | `results[]` |
| 8 | Next / prev navigation | computed from `projects` array by index |

CTAs (Live Demo, GitHub) appear in §3 directly below the title — not repeated at the bottom.

### Hero

- If `heroImage` is set: `<img>` fills the hero with `object-fit: cover`
- If `heroImage` is undefined: dark gradient (`#0e2a22 → #0a1a14`) with subtle `paper-grid` overlay
- Title block is absolutely positioned bottom-left over the hero
- Left accent bar (`2px`, `bg-accent`) spans full hero height

### Metrics

Each metric renders as a stat card:
- Italic serif number (large, `text-accent`)
- Mono uppercase label below
- Cards in a CSS grid: 3 columns on desktop, 2 on mobile
- If `metrics` is undefined or empty, the Impact section is omitted entirely

### Problem → Solution

Pairs `challenges[i]` with `solutions[i]` side by side:
- Left column: "CHALLENGE" label + prose
- Right column: "SOLUTION" label + prose
- If arrays have different lengths, render only the paired items (zip)

### Next / Prev navigation

Computed at build time from the `projects` array order. Wraps around (last project's "next" = first project). Each shows the adjacent project's title.

---

## Animations

### GSAP (scroll + load)

- **Title entrance:** `gsap.from()` on the title characters using `SplitText` (or manual `split` into `<span>` elements) — stagger `0.03s`, `y: 40`, `opacity: 0`, `ease: power4.out`
- **Section reveals:** `ScrollTrigger` on each `<section>` — `y: 30 → 0`, `opacity: 0 → 1`, `duration: 0.7`, `ease: power3.out`, `start: "top 85%"`
- **Hero parallax:** `ScrollTrigger` on the hero image/gradient — `y` moves at `0.3×` scroll speed

### Framer Motion (React islands)

- **Metric counter animation:** `MetricCounters.tsx` is a React island (`client:visible`) wrapping the Impact section. Each metric value counts up from `0` to its target using `useMotionValue` + `animate()` when the island enters the viewport. Container uses `motion.div` with `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`.
- **CTA button hover:** `ProjectCTAs.tsx` is a React island (`client:load`) — Live Demo and GitHub buttons use `motion.a` with `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.97 }}`.

### Page transitions

Astro's built-in `<ViewTransitions />` added to `MainLayout.astro` handles page-level enter/exit. Named `transition:name` attributes on the project title and hero allow matched-element morphing from the `/projects` listing card to the case study page.

### Reduced motion

Both GSAP and Framer Motion check `prefers-reduced-motion`:

```ts
// GSAP
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => { /* animations */ })

// Framer Motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const transition = prefersReduced ? { duration: 0 } : { duration: 0.6 }
```

---

## Data Schema Changes

Add three optional fields to `Project` interface in `src/data/projects.ts`:

```ts
heroImage?: string                           // '/projects/singel-app.png' or undefined → gradient
role?: string                                // 'Lead Frontend Engineer · Fullstack'
metrics?: { value: string; label: string }[] // replaces keyMetric (keep keyMetric for compat)
```

`keyMetric` is kept (not removed) for backwards compatibility with any existing code that reads it.

Populate new fields for all 5 existing projects. For `heroImage`, set `undefined` on all (gradient placeholder). For `metrics`, derive 2–3 stat cards from the existing `results[]` strings.

---

## Content Collection

Add `projects` collection to `src/content.config.ts`:

```ts
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(), // must match projects.ts slug
  }),
})
export const collections = { blog, projects }
```

Create one sample MDX file (`src/content/projects/singel-app.mdx`) with rich overview prose. Other projects can be added later — the page gracefully falls back to `fullDescription` when no MDX exists.

---

## i18n

All visible UI labels live in `src/i18n/ui.ts`:

```ts
export const ui = {
  en: {
    'case.back': '← Projects',
    'case.role': 'Role',
    'case.overview': 'Overview',
    'case.impact': 'Impact',
    'case.problem': 'Challenge',
    'case.solution': 'Solution',
    'case.highlights': 'Highlights',
    'case.live': 'View Live Demo',
    'case.github': 'View on GitHub',
    'case.prev': '← Previous',
    'case.next': 'Next →',
  },
} as const

export type Lang = keyof typeof ui
export function t(lang: Lang, key: keyof typeof ui['en']): string {
  return ui[lang][key]
}
```

The `[slug].astro` page calls `t('en', 'case.overview')` for every label. Adding Indonesian = adding `id: { ... }` to the `ui` object, no structural changes to the page.

---

## A11y

- `<h1>` for the project title — only one per page
- `<h2>` for each section heading (Overview, Impact, etc.)
- Hero image: `alt={project.title}` if real image; `role="img" aria-label={project.title}` if gradient
- Each metric card: `aria-label={metric.value + ' ' + metric.label}` (e.g. `"≥80% test coverage"`)
- CTA links: descriptive text from `t()` — "View Live Demo", "View on GitHub" — never "click here"
- Next/prev links: `aria-label="Previous project: {title}"` and `aria-label="Next project: {title}"`
- Landmark regions: `<header>` for hero, `<main>` for content, `<nav aria-label="Project navigation">` for next/prev
- No animation without `prefers-reduced-motion` check (see Animations section)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/data/projects.ts` | Add `heroImage?`, `role?`, `metrics?` fields; populate all 5 projects |
| Modify | `src/content.config.ts` | Add `projects` Content Collection |
| Create | `src/content/projects/singel-app.mdx` | Sample rich prose overview for first project |
| Create | `src/i18n/ui.ts` | EN labels dictionary + `t()` helper |
| Rewrite | `src/pages/projects/[slug].astro` | Full 9-section case study layout |
| Create | `src/components/projects/CaseStudyHero.astro` | Hero section (gradient or image, title overlay, accent bar) |
| Create | `src/components/projects/MetricCard.astro` | Single stat card (value + label, aria-label) |
| Create | `src/components/projects/MetricCounters.tsx` | React island (`client:visible`) — Framer Motion counter animation |
| Create | `src/components/projects/ProjectCTAs.tsx` | React island (`client:load`) — Framer Motion hover on Live/GitHub buttons |
| Modify | `src/components/layout/MainLayout.astro` | Add `<ViewTransitions />` for page-level transitions |
| Create | `src/components/projects/ProjectNav.astro` | Next/prev navigation with aria-labels |
| Already installed | `gsap@^3.15.0` | ScrollTrigger + timeline animations — already in dependencies |
| Install | `framer-motion` npm package | Page transitions + metric counter animations |

---

## Out of Scope

- Real hero images (added later per project)
- Indonesian translation (`id` locale)
- GSAP `SplitText` plugin (paid) — use manual `<span>` split instead
- Lightbox for hero image
- Comments or reactions on projects
