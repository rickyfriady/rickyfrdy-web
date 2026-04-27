# Print Run Redesign Spec

**Date:** 2026-04-27
**Status:** Approved
**Aesthetic:** Technical Publication — editorial structure, typographic hierarchy, no decorative filler

---

## Overview

Redesign the portfolio site to follow the "Print Run" aesthetic: the site reads like a well-designed engineering firm's publication. Structure comes from typography and editorial layout, not cards, blobs, or decoration. Every section has a clear chapter heading, generous whitespace, and a confident typographic voice.

The warm earthy palette and Caslon/General Sans typography are preserved exactly as-is. The Investigation Board CTA component is untouched.

---

## Constraints (Non-Negotiable)

- **Do not touch:** `ProjectCTA.vue`, `MagnifyingGlass.vue`, `WorksPage.vue`, `HandGestureGuide.vue`, all `src/components/ui/*` primitives
- **Preserve:** warm earthy palette (`--color-accent`, `--color-background`, `--color-foreground`, etc.)
- **Preserve:** Libre Caslon Display + General Sans + JetBrains Mono font stack
- **Preserve:** `eyebrow`, `title-display`, `title-accent` utility classes — extend, never replace
- **Preserve:** all existing animation behavior (`v-motion`, CSS transitions)

---

## Theme Strategy

**Light mode is primary.** The warm paper palette (`oklch(0.97 0.006 70)` background) gives the editorial magazine feel. Dark mode follows the exact same Print Run structure — the `--color-background: oklch(0.14 0.008 55)` dark brown becomes "ink on dark", prestige journal feel. No separate layout decisions per theme — same HTML, CSS variables handle the switch.

---

## Pages in Scope

| Page                              | Action                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| Home (`/`)                        | Full redesign                                                                        |
| About (`/about`)                  | Full redesign                                                                        |
| Works (`/works`)                  | Untouched — immersive hand-gesture canvas experience, part of the investigator theme |
| Blog (`/blog`)                    | Coming Soon state only                                                               |
| Projects, Contact, Project Detail | Out of scope — unchanged                                                             |

---

## Navigation

### Desktop — Left Rail (`AppHeader.vue`)

Fixed left-rail column, 220px wide, full viewport height. Right border: `1px solid var(--color-border)`.

**Structure (top → bottom):**

1. **Logo** — `Ricki` in Libre Caslon Display (`text-2xl`) + `Friadi` in JetBrains Mono small-caps (`text-xs tracking-[0.2em] uppercase`), stacked vertically with a gap
2. **Nav links** — stacked vertically, each link: mono index number (`01` `02` `03`) in muted color + link name in General Sans medium. Active state: `border-l-2 border-accent text-foreground`. Hover: `text-foreground bg-secondary`
3. **Spacer** (`flex-1`)
4. **CTA button** — `Start a Project` full-width outline button at the bottom

**Breakpoint:** Left rail is `lg:block hidden`. Below `lg`, it is hidden entirely.

**Main content offset:** All page content wraps in a container with `lg:pl-[220px]`.

### Mobile — Bottom Tab Bar (`AppHeader.vue`)

Fixed bottom bar. 5 tabs: Home, About, Works, Projects, Contact. Each tab: icon (Lucide) + label in `text-[10px]` General Sans. Active tab: accent color icon + underline. Height: `h-16`. Background: `bg-background/95 backdrop-blur-sm border-t border-border`.

Replaces hamburger menu entirely. No top sticky bar on mobile.

---

## Hero Section (`HomePage.vue`)

No two-column grid split. Full-width typographic statement.

**Structure (top → bottom):**

1. `eyebrow` label: `Fullstack Developer · Jakarta`
2. **Giant heading** — Libre Caslon Display, fluid size `clamp(3.2rem, 8vw, 8rem)`, `line-height: 0.92`, `letter-spacing: -0.02em`. Two lines:
   - Line 1: `Engineering Systems,` — foreground color
   - Line 2: `Designing Presence.` — `title-accent` (italic) + `text-accent` color
3. **Byline rule** — `<hr class="border-border my-6">` followed by a single line in JetBrains Mono small-caps muted: `Ricki Friadi · Available for Work · 2026`
4. **CTA row** — `Explore Projects` (filled Button) + `Start a Conversation` (ghost Button), `flex-wrap gap-3`

**Removed from hero:** JourneyLab right column. The hero is now a single left-aligned text block with no competing element.

**Section padding:** `pt-16 pb-10 md:pt-24 md:pb-14`

---

## QuickStats (`QuickStats.vue`)

Replace the `border-y` grid with a single horizontal data strip.

**Layout:** `flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y border-border py-6`

**Each stat:** Number in Libre Caslon Display `text-4xl text-accent` (count-up animation preserved) + suffix + label in `text-sm text-muted General Sans`. Stats separated visually by spacing — no `·` characters in the DOM, spacing alone creates the strip feel.

**No grid boxes. No card wrappers. No dividers between stats.**

---

## JourneyLab (`JourneyLab.vue`)

Relocated to its own section directly after QuickStats on the Home page.

**Changes:**

- Section gets chapter heading: `§ 02 — Journey Lab` (using `chapter-heading` utility)
- Panel background: `paper-grid` utility at `opacity-[0.06]` as a pseudo background for subtle atmosphere
- Padding increases: `p-5 md:p-6` → `p-7 md:p-9`
- No other behavioral changes — carousel, autoplay, controls all unchanged

---

## JourneyStrip (`JourneyStrip.vue`)

**Card structural changes:**

- Left edge: `border-l-2 border-dotted border-border` on inactive cards, `border-l-2 border-accent` on active card (replaces `border-accent/50` ring)
- Year label: changes from plain text to `v{year}.0` format in JetBrains Mono `text-xs tracking-[0.16em]`
- Stack tags: `+ Node.js` format — prepend `+` in `text-accent` mono, rest of tag in muted. Use `border-border bg-secondary rounded-md border px-2.5 py-1` container preserved
- Inactive card opacity: `opacity-50` (tightened from `opacity-60` for better active contrast)

**Section:** Chapter heading `§ 03 — What Shaped My Work`

---

## FeaturedProjects (`FeaturedProjects.vue`)

**Card structure:**

1. **File-path header** — `~/projects/{slug}/` in JetBrains Mono `text-xs text-muted`
2. **Image area (conditional):**
   - If `project.image` exists: full-bleed `<img>` at `aspect-ratio: 16/9`, `object-cover`, `rounded-t-none rounded-b-none` (sits flush at card top after file-path)
   - If no image: large Caslon title fills that area — `title-display text-3xl md:text-4xl` with `group-hover:text-accent` transition
3. **Category** — `eyebrow` label
4. **Description** — `text-muted text-sm leading-relaxed`
5. **Metric** — `→ {metric}` in JetBrains Mono `text-sm text-accent font-semibold` (the `→` is a literal character)
6. **CTA** — `Read Case Study` ghost button, small

**Project data shape update** — add optional `image?: string` field to the `Project` interface.

**Section:** Chapter heading `§ 04 — Selected Work`

---

## Investigation Board CTA (`ProjectCTA.vue`)

**No changes.** Component is preserved exactly as-is, including all styles, animations, and layout.

---

## About Page (`AboutPage.vue`)

### Hero

Same full-width heading pattern as Home. Remove `soft-panel` wrapper. No chapter number on the hero — it is the page entry point, not a section within the page.

```
[eyebrow label: About]

Building Systems With
Human-First Clarity.        ← title-display, full width, no panel
```

Subtitle in `text-muted text-lg max-w-2xl` below heading.

### Story Section

Replace two-column `soft-panel` cards with editorial two-column layout using `editorial-grid` utility (`grid-cols-1 lg:grid-cols-[1fr_0.45fr] gap-12`).

**Left column (65%) — "My Story":**

- `§ 01 — My Story` chapter heading
- Story paragraphs as plain body text — no wrapper, no card, no background
- `text-base leading-relaxed space-y-4`

**Right column (35%) — Annotation sidebar:**

- `§ — Notes` eyebrow at top
- "What Drives Me" items: each becomes a stacked annotation block
  - Small `eyebrow` label (`Clean Code Philosophy`, `Performance`, `User-First`)
  - One-sentence annotation in `text-sm text-muted`
  - Separated by `border-t border-border pt-4`
  - **Remove:** icon boxes (`bg-accent/10 rounded-lg` divs with Lucide icons)
- "Beyond Code" block becomes `border-l-2 border-accent pl-5 py-1` pull-quote — no background card

### Skills / GitHub sections

- `Separator` components between sections removed — chapter headings do the visual separation
- SkillsTimeline: `§ 02 — Skills Timeline`
- SkillsMatrix: `§ 03 — Skills Matrix`
- GitHubHeatmap: `§ 04 — GitHub Activity`
- Bottom CTA: remove `soft-panel` wrapper, go plain centered text with the same button row

---

## Works Page (`WorksPage.vue`)

**Untouched.** The Works page is a full-screen immersive interactive experience — a pannable/zoomable canvas with work cards at specific positions, string connections between them, an overhead lamp effect, and hand gesture controls (webcam-based). It is thematically cohesive with the Investigation Board CTA on the home page and must not be redesigned.

`HandGestureGuide.vue` is also untouched — it is integral to the Works page gesture feature.

---

## Blog Page (`BlogPage.vue`)

Replace current content with a single centered "Coming Soon" state.

```
§ 01 — Field Notes

Coming Soon.

Writing in progress.
Essays on systems, interfaces, and engineering craft.

[→ Back to Home]
```

Typography: Chapter heading + `title-display text-4xl` for "Coming Soon." + `text-muted` body + ghost Button link home.

No placeholder post cards. No subscribe form.

---

## AppFooter (`AppFooter.vue`)

Full replacement:

**Structure (centered, `text-center`):**

1. Social icon row — GitHub, LinkedIn, Twitter/X — Lucide icons `h-5 w-5`, `text-muted hover:text-foreground transition-colors`, `gap-5 flex justify-center mb-6`
2. Colophon line — JetBrains Mono `text-xs text-muted tracking-[0.12em]`:
   `Ricki Friadi · Built with Vue 3 + Tailwind v4 · Jakarta, 2026`

**Removed:** All current footer column layout, quick links, GitHub stats summary.

**Padding:** `py-10 border-t border-border`

---

## Global CSS (`style.css`)

### New utility classes

```css
@utility chapter-heading {
  /* Applied to a <div> wrapping a rule + label */
  @apply border-border mb-8 border-t pt-5;
}

/* The label inside chapter-heading */
@utility chapter-label {
  font-family: var(--font-mono);
  @apply text-muted text-xs tracking-[0.18em] uppercase;
}

@utility editorial-grid {
  @apply grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.45fr];
}

@utility diff-tag {
  font-family: var(--font-mono);
  @apply text-xs;
}

@utility colophon {
  font-family: var(--font-mono);
  @apply text-muted text-center text-xs tracking-[0.12em];
}
```

### Updated utilities

- `paper-grid`: no change to definition, but usage adds `opacity-[0.06]` via inline style or wrapper
- `nav-link`: add vertical layout variant for left-rail context (handled in component, not utility)

---

## Layout Wrapper

`MainLayout.vue` (or `App.vue`) needs to:

- Render `AppHeader` (left rail on desktop, bottom bar on mobile)
- Wrap `<RouterView>` in a div with `lg:pl-[220px]` to offset the left rail
- Add `pb-16 lg:pb-0` to offset the mobile bottom tab bar

---

## Breakpoint Summary

| Breakpoint        | Nav                   | Content offset            |
| ----------------- | --------------------- | ------------------------- |
| `< lg` (< 1024px) | Bottom tab bar, fixed | `pb-16` bottom padding    |
| `≥ lg` (≥ 1024px) | Left rail, fixed      | `pl-[220px]` left padding |

---

## Animation Decisions

| Element             | Treatment                                          |
| ------------------- | -------------------------------------------------- |
| Hero heading        | `v-motion` fade + slide up, `duration: 700`        |
| Byline rule         | Fade in with `delay: 300` after heading            |
| QuickStats numbers  | Existing count-up animation, unchanged             |
| Chapter headings    | No animation — they are structural, not theatrical |
| JourneyLab          | Existing behavior unchanged                        |
| JourneyStrip        | Existing scroll + intersection behavior unchanged  |
| Left rail nav links | CSS hover transitions only, no motion              |
| Bottom tab bar      | No animation — instant active state                |
| Project cards       | Existing `v-motion` stagger unchanged              |

---

## Files Changed

| File                                            | Change type                                          |
| ----------------------------------------------- | ---------------------------------------------------- |
| `src/style.css`                                 | Add new utilities                                    |
| `src/components/layout/AppHeader.vue`           | Full rewrite — left rail + bottom tab                |
| `src/components/layout/AppFooter.vue`           | Full rewrite — colophon                              |
| `src/components/layout/MainLayout.vue`          | Add content offset classes                           |
| `src/components/page/home/HomePage.vue`         | Hero restructure, section ordering, chapter headings |
| `src/components/page/home/QuickStats.vue`       | Data strip layout                                    |
| `src/components/page/home/JourneyLab.vue`       | Padding + paper-grid atmosphere                      |
| `src/components/page/home/JourneyStrip.vue`     | Card style — dotted rule, diff tags, v-year          |
| `src/components/page/home/FeaturedProjects.vue` | Card structure — file-path, conditional image        |
| `src/components/page/about/AboutPage.vue`       | Full editorial columns, remove soft-panels           |
| `src/components/page/blog/BlogPage.vue`         | Coming Soon state                                    |

## Files Untouched

| File                                             | Reason                                                  |
| ------------------------------------------------ | ------------------------------------------------------- |
| `src/components/page/home/ProjectCTA.vue`        | Intentionally preserved — Investigation Board CTA       |
| `src/components/page/home/MagnifyingGlass.vue`   | Intentionally preserved — part of ProjectCTA            |
| `src/components/page/works/WorksPage.vue`        | Intentionally preserved — immersive hand-gesture canvas |
| `src/components/page/works/HandGestureGuide.vue` | Intentionally preserved — part of Works gesture feature |
| `src/components/ui/**`                           | All primitives unchanged                                |
| `src/components/page/projects/**`                | Out of scope                                            |
| `src/components/page/contact/**`                 | Out of scope                                            |
| `src/router/index.ts`                            | No route changes needed                                 |
| `src/hooks/**`, `src/types/**`, `src/utils/**`   | No logic changes                                        |
