# Ricki Friadi — Portfolio

Personal portfolio and resume site built with Astro, React islands, GSAP, and Tailwind CSS v4.

**Live:** https://rickyfrdy.my.id

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (SSG, `output: static`) |
| UI components | React 19 islands via `@astrojs/react` |
| Animation | Framer Motion 12 · GSAP 3 |
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
│   ├── layout/         AppHeader, AppFooter, MainLayout, LangSwitcher,
│   │                   MobileBottomNav, NavLinks, WanderingEyes
│   ├── about/          GitHubHeatmap, SkillsMatrix
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
└── utils/              github.ts · cn helper
```

---

## Routes

| English | Indonesian | Description |
|---------|-----------|-------------|
| `/` | `/id/` | Home |
| `/about` | `/id/about` | About + GitHub heatmap |
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
