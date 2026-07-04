# Ricki Friadi — Portfolio

Personal portfolio and resume site built with Astro, GSAP, and Tailwind CSS v4 — fully static with zero client-side JS framework islands.

**Live:** https://rickyfrdy.my.id

---

## Quick Start

```bash
cp .env.example .env   # optional — GITHUB_TOKEN for /about stats
npm install
npm run dev             # or: npm run build
```

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (SSG, `output: static`) — no client-side JS framework islands, zero `client:*` hydration directives |
| Animation | GSAP 3 · [transitions.dev](https://transitions.dev) (10 CSS transition kits) · Astro View Transitions (nav pill, theme toggle) |
| Styling | Tailwind CSS v4 · custom CSS utilities (glassmorphism) |
| PDF | `@react-pdf/renderer` (React 19, **build-time only** — scoped to `ResumePdf.tsx`/`ResumePdfAts.tsx`, not part of the client runtime) — designed + ATS variants |
| i18n | Astro native i18n routing — EN (`/`) · ID (`/id/`) |
| Content | Astro MDX + Content Collections (blog) |
| OG Images | Satori + Sharp |
| State | Nanostores (theme) |
| Package manager | npm (`package-lock.json` is the lockfile in use — `package.json`'s `packageManager: bun@1.3.11` field is stale, no `bun.lockb` exists) |

---

## Project Structure

```
src/
├── components/
│   ├── layout/         AppHeader (floating island pill, theme toggle), AppFooter, MainLayout,
│   │                   LangSwitcher, MobileBottomNav, NavLinks.astro, WanderingEyes
│   ├── about/          GitHub sections: Heatmap, Activity, Languages,
│   │                   PinnedRepos, SkillsMatrix
│   ├── blog/           BlogGrid (card grid, filter, search, pagination), PostCard, TableOfContents
│   ├── dashboard/      WakaTime + GitHub stats page sections
│   ├── people/         CollaboratorsSection ("People I've worked with")
│   ├── experience/     ProjectsAccordion
│   ├── contact/        ContactForm
│   ├── projects/       ProjectsGrid, FeaturedProjectCard
│   ├── resume/         ResumePdf (designed), ResumePdfAts (ATS-friendly) — the only React (.tsx) components in the app
│   ├── ui/             FinLogo (idn-finlogos CDN), finlogos.ts, FeaturedBadge, HeroPhoto, PageAnimations
│   └── animated-gradient.astro   Canvas gradient used for featured cards + blog cover-art fallback
├── content/
│   └── blog/           MDX blog posts (category, coverImage, tags frontmatter)
├── data/
│   ├── collaborators.ts    People I've worked with entries
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
│   ├── blog/                   Listing (index), article ([slug]), tag archive (tag/[tag]) — EN only
│   ├── dashboard.astro         WakaTime + GitHub stats
│   ├── resume.astro
│   ├── contact.astro
│   ├── resume.pdf.ts           Designed PDF (EN)
│   ├── resume-ats.pdf.ts       ATS PDF (EN)
│   ├── rss.xml.ts              Blog RSS feed
│   └── id/                     Indonesian locale (about, experience, projects, dashboard, resume, contact, PDFs — no blog)
├── stores/             theme.ts (Nanostores — light/dark toggle, persisted to localStorage)
├── styles/             global.css (Tailwind + custom utilities)
└── utils/              github.ts · wakatime.ts · skillIcon.ts · finlogo.ts · readingTime.ts ·
                        gradientPreset.ts · ogCard.ts · schema.ts · contactSchema.ts · cn helper
```

---

## Routes

| English | Indonesian | Description |
|---------|-----------|-------------|
| `/` | `/id/` | Home |
| `/about` | `/id/about` | About + GitHub contribution heatmap, pinned repos, languages, activity |
| `/experience` | `/id/experience` | Work history, projects, education, skills |
| `/projects` | `/id/projects` | Project portfolio (filterable grid) |
| `/blog` | — (EN only) | Blog listing — card grid, category filter, search, pagination |
| `/blog/[slug]` | — (EN only) | Article page — dark hero band, sticky sidebar (TOC, tags, share) |
| `/blog/tag/[tag]` | — (EN only) | Tag archive, same card-grid treatment as the listing |
| `/dashboard` | `/id/dashboard` | WakaTime + GitHub build-time stats |
| `/resume` | `/id/resume` | CV page |
| `/contact` | `/id/contact` | Contact form |
| `/resume.pdf` | `/id/resume.pdf` | Designed PDF download |
| `/resume-ats.pdf` | `/id/resume-ats.pdf` | ATS-friendly PDF download |

---

## Key Features

**Language switcher** (`LangSwitcher.astro`) — glassmorphism dropdown in the header showing the active locale flag and code, using the `menu-dropdown` transitions.dev kit (scaled origin-aware open/close) and GSAP tap feedback. Detects the current locale from the URL and switches to the equivalent page in the target language.

**ATS PDF** (`ResumePdfAts.tsx`) — parallel resume template using only Helvetica, black on white, comma-separated skills, and no decorative elements — optimised for applicant tracking systems.

**FinLogo component** (`components/ui/FinLogo.astro`) — renders logos from the [`idn-finlogos`](https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/) CDN. Supports 24 categories (banks, e-wallets, logistics, insurance, etc.). See [Usage](#finlogo-usage) below.

**GitHub integration** (`/about` page) — four build-time Astro components powered by two data sources:

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
npm run dev            # start dev server
npm run build          # type-check + production build
npm run preview        # preview production build
npm run lint           # Biome (TS/TSX/JS) + ESLint (Astro files)
npm run lint:fix       # Biome + ESLint with autofix
npm test               # Vitest watch
npm run test:run       # Vitest once
npm run test:coverage  # Vitest with coverage
```

---

## Quality Gates

- Pre-commit hook runs `lint-staged`: Biome (TS/TSX/JS) + ESLint (Astro).
- `@astrojs/check` runs TypeScript checking across all `.astro` files at build time.
- `astro build` is the source of truth — 0 errors required before merge.
