# Ricki Friadi — Portfolio

Personal portfolio and resume site built with Astro, React islands, GSAP, and Tailwind CSS v4.

**Live:** https://rickyfrdy.my.id

---

## Quick Start

```bash
cp .env.example .env   # optional — GITHUB_TOKEN for /about stats
bun install
bun dev                # or: bun build
```

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (SSG, `output: static`) |
| UI components | React 19 islands via `@astrojs/react` |
| Animation | Framer Motion 12 (React islands) · GSAP 3 · [transitions.dev](https://transitions.dev) (10 CSS transition kits) · Astro View Transitions (nav pill) |
| Styling | Tailwind CSS v4 · custom CSS utilities (glassmorphism) |
| PDF | `@react-pdf/renderer` — designed + ATS variants |
| i18n | Astro native i18n routing — EN (`/`) · ID (`/id/`) |
| Content | Astro MDX + Content Collections (blog) |
| OG Images | Satori + Sharp |
| State | Nanostores (theme) |
| Package manager | Bun |

---

## Project Structure

```
src/
├── components/
│   ├── layout/         AppHeader (floating island pill), AppFooter, MainLayout,
│   │                   LangSwitcher, MobileBottomNav, NavLinks.astro, WanderingEyes
│   ├── about/          GitHub sections: Heatmap, Activity, Languages,
│   │                   PinnedRepos, SkillsMatrix
│   ├── experience/     ProjectsAccordion (animated React island)
│   ├── contact/        ContactForm
│   ├── projects/       ProjectsGrid
│   ├── resume/         ResumePdf (designed), ResumePdfAts (ATS-friendly)
│   └── ui/             FinLogo (idn-finlogos CDN), finlogos.ts (types + slugs)
├── content/
│   └── blog/           MDX blog posts
├── data/
│   ├── experience.ts       Work history, projects, skills (English)
│   ├── experience.id.ts    Work history, projects, skills (Indonesian)
│   ├── projects.ts         Portfolio project entries
│   └── skills.ts           Skills matrix data
├── i18n/
│   └── ui.ts           Translation strings — EN + ID keys
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── experience.astro
│   ├── projects.astro
│   ├── works.astro
│   ├── resume.astro
│   ├── contact.astro
│   ├── resume.pdf.ts           Designed PDF (EN)
│   ├── resume-ats.pdf.ts       ATS PDF (EN)
│   └── id/                     Indonesian locale
│       ├── index.astro
│       ├── about.astro
│       ├── experience.astro
│       ├── projects.astro
│       ├── works.astro
│       ├── resume.astro
│       ├── contact.astro
│       ├── resume.pdf.ts       Designed PDF (ID)
│       └── resume-ats.pdf.ts   ATS PDF (ID)
├── stores/             theme.ts (Nanostores)
├── styles/             global.css (Tailwind + custom utilities)
└── utils/              github.ts · skillIcon.ts · finlogo.ts · cn helper
```

---

## Routes

| English | Indonesian | Description |
|---------|-----------|-------------|
| `/` | `/id/` | Home |
| `/about` | `/id/about` | About + GitHub contribution heatmap, pinned repos, languages, activity |
| `/experience` | `/id/experience` | Work history, projects, education, skills |
| `/projects` | `/id/projects` | Project portfolio (filterable grid) |
| `/works` | `/id/works` | Works grid with category filter |
| `/resume` | `/id/resume` | CV page |
| `/contact` | `/id/contact` | Contact form |
| `/resume.pdf` | `/id/resume.pdf` | Designed PDF download |
| `/resume-ats.pdf` | `/id/resume-ats.pdf` | ATS-friendly PDF download |

---

## Key Features

**Language switcher** (`LangSwitcher.tsx`) — glassmorphism dropdown in the header showing the active locale flag and code, with a spring-animated Framer Motion panel and GSAP tap feedback. Detects the current locale from the URL and switches to the equivalent page in the target language.

**ATS PDF** (`ResumePdfAts.tsx`) — parallel resume template using only Helvetica, black on white, comma-separated skills, and no decorative elements — optimised for applicant tracking systems.

**FinLogo component** (`components/ui/FinLogo.astro`) — renders logos from the [`idn-finlogos`](https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/) CDN. Supports 24 categories (banks, e-wallets, logistics, insurance, etc.). See [Usage](#finlogo-usage) below.

**GitHub integration** (`/about` page) — four React island components powered by two data sources:

| Source | Auth | Used by | Timing |
|--------|------|---------|--------|
| **GraphQL API** (`fetchBuildTimeStats`) | `GITHUB_TOKEN` (env) | Heatmap, PinnedRepos, Languages | Build-time (SSG) |
| **REST Events API** (`fetchRecentEvents`) | None (public, 60 req/hr) | Activity timeline | Client-side on mount |

Set `GITHUB_TOKEN` in `.env` (see `.env.example`) for real build-time data. Without it, the GraphQL fetch falls back to realistic mock data.

---

## UI Transitions

The project uses CSS transition kits from [transitions.dev](https://transitions.dev) — lightweight, framework-independent animations driven by CSS custom properties. All triggered via semantic class names and data attributes.

| Transition | Component | What it does |
|---|---|---|
| **menu-dropdown** | `LangSwitcher` | Scaled origin-aware dropdown open/close |
| **icon-swap** | `ContactForm` submit · `FeaturedBadge` | Cross-fade two icons with blur+scale (Send↔Loader2, star↔bolt) |
| **shimmer-text** | `ContactForm` "Sending…" | Sweeping highlight band across muted text |
| **success-check** | `ContactForm` success state | SVG stroke-draw + rotate + blur + Y-bob on submit |
| **error-shake** | `ContactForm` fields | Per-segment cubic-bezier shake + border color tween + auto-revert |
| **tabs-sliding** | `SkillsMatrix` category filters | Sliding pill that follows the active tab (offsetLeft/offsetWidth JS + CSS transition) |
| **avatar-hover** | `CollaboratorsSection` | Distance-falloff lift + scale on avatar rows, bouncy spring on return |
| **notification-badge** · **card-resize** · **skeleton-loader** | (CSS available, unused) | Ready for future components |

All transitions respect `prefers-reduced-motion` at the OS level.

---

## FinLogo Usage

```astro
import FinLogo from '@/components/ui/FinLogo.astro'

<!-- minimal -->
<FinLogo name="bca" />

<!-- with explicit size and category hint -->
<FinLogo name="gopay" category="e-wallet" size={32} />

<!-- white bg wrapper for logos that need contrast -->
<FinLogo name="mandiri" label="Bank Mandiri" bg size={48} />

<!-- eager load for above-the-fold logos -->
<FinLogo name="visa" category="card-payment" loading="eager" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Logo slug e.g. `"bca"`, `"gopay"`, `"mandiri"` |
| `category` | `FinLogoCategory` | — | Optional grouping hint; does not affect the URL |
| `label` | `string` | title-cased slug | Accessible `alt` text |
| `size` | `number` | `40` | Width and height in px |
| `bg` | `boolean` | `false` | Wrap in white rounded container for dark-bg contrast |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Native img loading strategy |
| `class` | `string` | — | Extra CSS classes |

Slug lists per category are exported from `src/components/ui/finlogos.ts` (`LOGOS_BY_CATEGORY`). Categories: `bank-logo` · `bank-app` · `card-payment` · `e-wallet` · `e-commerce` · `financing` · `insurance` · `logistic` · `payment-gateway` · `qr-payment` · `remittance` · `switching` · `mobile-telco` · `isp` · `transportation` · `supermarket` · `entertainment` · `game` · `regulatory` · `miscellaneous` · `prepaid-card` · `direct-debit` · `donation` · `utilities`.

---

## Scripts

```bash
bun dev              # start dev server
bun build            # type-check + production build
bun preview          # preview production build
bun lint             # run ESLint (Astro files)
bun lint:fix         # ESLint with autofix
bun test             # Vitest watch
bun test:run         # Vitest once
bun test:coverage    # Vitest with coverage
```

---

## Quality Gates

- Pre-commit hook runs `lint-staged`: Biome (TS/TSX/JS) + ESLint (Astro).
- `@astrojs/check` runs TypeScript checking across all `.astro` files at build time.
- `astro build` is the source of truth — 0 errors required before merge.
