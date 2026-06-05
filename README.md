# Ricki Friadi — Portfolio

Personal portfolio and resume site built with Astro, React islands, and Tailwind CSS v4.

## Stack

- **Framework:** Astro 6 (SSG) with `@astrojs/react` island architecture
- **UI:** React 19, Framer Motion 12, GSAP 3
- **Styling:** Tailwind CSS v4, custom CSS utilities (glassmorphism, CSS custom properties)
- **PDF:** `@react-pdf/renderer` for designed + ATS resume variants
- **i18n:** Astro native i18n routing — English (`/`) and Indonesian (`/id/`)
- **Content:** Astro MDX + Content Collections (blog)
- **OG Images:** Satori + Sharp
- **Package manager:** Bun

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppHeader, AppFooter, MainLayout, LangSwitcher, MobileBottomNav
│   ├── about/        # GitHubHeatmap, SkillsMatrix
│   ├── contact/      # ContactForm
│   ├── projects/     # ProjectsGrid
│   └── resume/       # ResumePdf (designed), ResumePdfAts (ATS-friendly)
├── content/
│   └── blog/         # MDX blog posts
├── data/
│   ├── experience.ts    # Work history, projects, skills (English)
│   ├── experience.id.ts # Work history, projects, skills (Indonesian)
│   └── projects.ts      # Portfolio project entries
├── i18n/
│   └── ui.ts         # Translation strings (EN + ID)
├── pages/
│   ├── index.astro / about.astro / experience.astro / ...  # English routes
│   ├── resume.pdf.ts / resume-ats.pdf.ts                   # English PDF routes
│   └── id/                                                  # Indonesian routes
│       ├── index.astro / about.astro / experience.astro / ...
│       ├── resume.pdf.ts / resume-ats.pdf.ts
│       └── resume.astro
├── stores/           # Nanostores (theme)
├── styles/           # global.css (Tailwind + custom utilities)
└── utils/            # github.ts, cn helper
```

## Routes

| English | Indonesian | Description |
|---------|-----------|-------------|
| `/` | `/id/` | Home |
| `/about` | `/id/about` | About |
| `/experience` | `/id/experience` | Work history & skills |
| `/projects` | `/id/projects` | Project portfolio |
| `/works` | `/id/works` | Works grid with filter |
| `/resume` | `/id/resume` | CV page |
| `/contact` | `/id/contact` | Contact form |
| `/resume.pdf` | `/id/resume.pdf` | Designed PDF download |
| `/resume-ats.pdf` | `/id/resume-ats.pdf` | ATS-friendly PDF download |

## Scripts

```bash
bun dev          # start dev server
bun build        # type-check + production build
bun preview      # preview production build
bun lint         # run ESLint
bun lint:fix     # run ESLint with autofix
bun test         # run Vitest watch
bun test:run     # run Vitest once
bun test:coverage  # run Vitest with coverage
```

## Quality Gates

- Pre-commit hook runs `lint-staged` (ESLint + Biome on staged files).
- `@astrojs/check` runs TypeScript checking across all `.astro` files.
