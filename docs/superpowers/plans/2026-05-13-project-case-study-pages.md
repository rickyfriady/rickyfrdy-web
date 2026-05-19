# Project Case Study Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/projects/[slug]` into a full minimalist editorial case study page with GSAP + Framer Motion animations, 9 content sections, hybrid TypeScript + MDX data, i18n-ready labels, and WCAG A11y compliance.

**Architecture:** TypeScript `src/data/projects.ts` holds all structured fields; an optional `src/content/projects/[slug].mdx` file provides rich prose for the Overview section. The page merges both sources — falling back to `fullDescription` if no MDX file exists. GSAP handles title entrance and scroll reveals; Framer Motion runs in React islands for metric counters and CTA hover effects. Astro `<ViewTransitions />` provides page-level morphing transitions.

**Tech Stack:** Astro 6, Tailwind v4, GSAP 3 (already installed), framer-motion (to install), React 18, TypeScript, MDX.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Install | `framer-motion` | Metric counters + CTA hover animations |
| Create | `src/i18n/ui.ts` | EN labels dictionary + `t()` helper |
| Create | `tests/i18n/ui.test.ts` | Unit tests for `t()` |
| Modify | `src/data/projects.ts` | Add `heroImage?`, `role?`, `metrics?` fields; populate all 5 projects |
| Create | `tests/data/projects.test.ts` | Unit tests for new schema fields |
| Modify | `src/content.config.ts` | Add `projects` content collection |
| Create | `src/content/projects/singel-app.mdx` | Rich prose overview for first project |
| Create | `src/components/projects/CaseStudyHero.astro` | Full-bleed hero (gradient or image, title overlay, accent bar) |
| Create | `src/components/projects/MetricCard.astro` | Single static stat card (used as fallback / SSR) |
| Create | `src/components/projects/MetricCounters.tsx` | React island — Framer Motion counter animation |
| Create | `src/components/projects/ProjectCTAs.tsx` | React island — Framer Motion hover on CTA buttons |
| Create | `src/components/projects/ProjectNav.astro` | Next/prev navigation with aria-labels |
| Modify | `src/components/layout/MainLayout.astro` | Add `noReveal?` prop + `<ViewTransitions />` |
| Rewrite | `src/pages/projects/[slug].astro` | Full 9-section case study layout |
| Modify | `src/components/projects/ProjectCard.astro` | Add `transition:name` for ViewTransitions morphing |

---

## Task 1: Install framer-motion + i18n labels

**Context:**
- `framer-motion` is NOT yet in `package.json` — must be installed with Node 24.
- `src/i18n/` does not exist yet.
- The `t()` function is the only testable unit in this task.
- Test runner: Vitest. Run with `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run`.

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `tests/i18n/ui.test.ts`

- [ ] **Step 1: Install framer-motion**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm install framer-motion
```

Expected: `added N packages` with no errors.

- [ ] **Step 2: Write the failing test**

Create `tests/i18n/ui.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { t } from '@/i18n/ui'

describe('t()', () => {
  it('returns the correct label for a known key', () => {
    expect(t('en', 'case.back')).toBe('← Projects')
    expect(t('en', 'case.overview')).toBe('Overview')
    expect(t('en', 'case.live')).toBe('View Live Demo')
    expect(t('en', 'case.github')).toBe('View on GitHub')
  })

  it('returns all 11 keys without error', () => {
    const keys = [
      'case.back', 'case.role', 'case.overview', 'case.impact',
      'case.problem', 'case.solution', 'case.highlights',
      'case.live', 'case.github', 'case.prev', 'case.next',
    ] as const
    keys.forEach((key) => {
      expect(typeof t('en', key)).toBe('string')
      expect(t('en', key).length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 3: Run test — verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/i18n/ui.test.ts 2>&1 | tail -8
```

Expected: FAIL — `Cannot find module '@/i18n/ui'`

- [ ] **Step 4: Create `src/i18n/ui.ts`**

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
export function t(lang: Lang, key: keyof (typeof ui)['en']): string {
  return ui[lang][key]
}
```

- [ ] **Step 5: Run test — verify it passes**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/i18n/ui.test.ts 2>&1 | tail -5
```

Expected: `2 tests passed`

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ui.ts tests/i18n/ui.test.ts package.json package-lock.json
git commit -m "feat(i18n): add EN labels dictionary with t() helper and install framer-motion"
```

---

## Task 2: Extend Project data schema

**Context:**
- `src/data/projects.ts` has 5 projects and the `Project` interface. Current fields: `slug`, `title`, `shortDescription`, `fullDescription`, `featured`, `category`, `technologies`, `keyMetric?`, `liveUrl?`, `githubUrl?`, `date`, `year`, `challenges`, `solutions`, `results`.
- Add three optional fields: `heroImage?`, `role?`, `metrics?: { value: string; label: string }[]`.
- Keep `keyMetric?` — do not remove it (still used in `ProjectCard.astro`).
- Populate `role` and `metrics` for all 5 projects. Set `heroImage: undefined` on all (gradient placeholder for now).

**Files:**
- Modify: `src/data/projects.ts`
- Create: `tests/data/projects.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/data/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'

describe('projects data schema', () => {
  it('all projects have a non-empty role string', () => {
    projects.forEach((p) => {
      expect(typeof p.role).toBe('string')
      expect((p.role as string).length).toBeGreaterThan(0)
    })
  })

  it('all projects have a metrics array with at least 2 entries', () => {
    projects.forEach((p) => {
      expect(Array.isArray(p.metrics)).toBe(true)
      expect((p.metrics as unknown[]).length).toBeGreaterThanOrEqual(2)
    })
  })

  it('each metric has non-empty value and label strings', () => {
    projects.forEach((p) => {
      ;(p.metrics as { value: string; label: string }[]).forEach((m) => {
        expect(typeof m.value).toBe('string')
        expect(m.value.length).toBeGreaterThan(0)
        expect(typeof m.label).toBe('string')
        expect(m.label.length).toBeGreaterThan(0)
      })
    })
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/data/projects.test.ts 2>&1 | tail -8
```

Expected: FAIL — `role` and `metrics` are undefined.

- [ ] **Step 3: Update `src/data/projects.ts`**

Replace the entire file with:

```ts
export interface Metric {
  value: string
  label: string
}

export interface Project {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  featured: boolean
  category: 'web-app' | 'api' | 'tool' | 'open-source'
  technologies: string[]
  keyMetric?: string
  heroImage?: string
  role?: string
  metrics?: Metric[]
  liveUrl?: string
  githubUrl?: string
  date: string
  year: number
  challenges: string[]
  solutions: string[]
  results: string[]
}

export const projects: Project[] = [
  {
    slug: 'singel-app',
    title: 'Singel APP (Pegadaian Kita)',
    shortDescription:
      'Company-wide Micro-Frontend application built with Vue 3 and NestJS microservices, enabling independent team deployments.',
    fullDescription:
      'Singel APP is the unified employee super-app for PT. Pegadaian built on a Micro-Frontend Architecture. Multiple product teams build and deploy their features independently using Module Federation. The backend is a constellation of NestJS microservices connected via Redis pub/sub.',
    featured: true,
    category: 'web-app',
    technologies: ['Vue 3', 'NestJS', 'Tailwind', 'PostgreSQL', 'Redis', 'Zod', 'Pinia', 'Vitest'],
    keyMetric: '≥80% unit test coverage across all modules',
    role: 'Lead Frontend Engineer · Fullstack Developer',
    metrics: [
      { value: '≥80%', label: 'unit test coverage' },
      { value: '0', label: 'regression incidents' },
      { value: '5+', label: 'teams deploy independently' },
    ],
    date: '2024-11-01',
    year: 2024,
    challenges: [
      'Coordinating parallel development across multiple teams without breaking shared interfaces',
      'Keeping Micro-Frontend bundles lean while sharing common UI components',
      'Ensuring type-safety across independently deployed services',
    ],
    solutions: [
      'Defined strict module contracts enforced by Zod schemas shared as npm packages',
      'Used Vite Module Federation with explicit shared dependency versions',
      'Implemented integration tests that run against real service endpoints',
    ],
    results: [
      'Teams deploy independently with zero coordination overhead',
      'Consistently maintained ≥80% Vitest coverage',
      'Zero regression incidents since adopting contract-first API design',
    ],
  },
  {
    slug: 'microsite-pinjaman',
    title: 'Microsite Pinjaman Pegadaian',
    shortDescription:
      'Revamped legacy CodeIgniter 3 monolith into 9 NestJS microservices using Factory pattern, serving loan lead generation at scale.',
    fullDescription:
      'A complete backend rewrite of the loan lead generation platform for PT. Pegadaian. Replaced a single CodeIgniter 3 monolith with 9 purpose-built NestJS microservices. The Factory pattern enables dynamic product support without code changes when new loan products are introduced.',
    featured: true,
    category: 'api',
    technologies: ['Vue.js', 'NestJS', 'TypeScript', 'Redis', 'PostgreSQL', 'Crontab', 'Pinia'],
    keyMetric: '9 independent microservices using Factory pattern',
    role: 'Backend Engineer · System Architect',
    metrics: [
      { value: '9', label: 'microservices built' },
      { value: '0', label: 'downtime during migration' },
      { value: '3', label: 'sprints to complete' },
    ],
    date: '2024-01-10',
    year: 2024,
    challenges: [
      'Migrating live production traffic from monolith without downtime',
      'Designing a service architecture flexible enough to add new loan product types',
      'Maintaining compatibility with the App Mitra Pegadaian partner integration',
    ],
    solutions: [
      'Used strangler-fig pattern — routed traffic gradually from old to new services',
      'Implemented Factory pattern so each loan type is a pluggable strategy class',
      'Wrote comprehensive integration tests against the partner API contract',
    ],
    results: [
      'Zero downtime migration completed over 3 sprints',
      'New loan product types now added without changing service code',
      'Regression suite prevents partner API contract breakage',
    ],
  },
  {
    slug: 'kamila',
    title: 'KAMILA — Marketing & KPI Tracker',
    shortDescription:
      'Internal Pegadaian app for marketing progress tracking, KPI measurement, and loan lead submission from external partners.',
    fullDescription:
      'KAMILA is the internal tool used by PT. Pegadaian marketing teams to track plans, weekly reports, KPIs, and leads submitted from external business partners. Built with a React frontend and Express/Node.js backend.',
    featured: false,
    category: 'web-app',
    technologies: [
      'ReactJS',
      'ExpressJS',
      'Node.js',
      'Tailwind',
      'PostgreSQL',
      'Redis',
      'TypeORM',
      'Redux',
    ],
    role: 'Fullstack Developer',
    metrics: [
      { value: '200+', label: 'marketing employees served' },
      { value: '60%', label: 'of sessions from mobile' },
      { value: '5 min', label: 'lead processing (was hours)' },
    ],
    date: '2023-05-15',
    year: 2023,
    challenges: [
      'Building a flexible KPI tracking system that works for diverse marketing roles',
      'Handling real-time lead submission from external partner integrations',
      'Keeping the UI responsive and fast for field staff on mobile devices',
    ],
    solutions: [
      'Designed a configurable KPI template system using JSON schema definitions',
      'Used a dedicated lead queue backed by Redis to handle burst partner submissions',
      'Adopted a mobile-first layout with Progressive Web App offline support',
    ],
    results: [
      'Used by 200+ marketing employees across regional branches',
      'Lead processing time reduced from hours to under 5 minutes',
      'Mobile usage accounts for 60% of daily active sessions',
    ],
  },
  {
    slug: 'aira-reconciliation',
    title: 'AIRA — Reconciliation System',
    shortDescription:
      'Reconciliation transaction module for integration with partner banks, producing journal entries compliant with accounting standards.',
    fullDescription:
      "AIRA handles financial reconciliation between PT. Pegadaian's core banking system and external partner banks. The system validates transactions over SFTP, generates journal entries to accounting standards, and produces daily reports consumed by the finance division.",
    featured: false,
    category: 'tool',
    technologies: ['PHP 5', 'PHP Native', 'SFTP', 'VM', 'MySQL'],
    role: 'Backend Engineer',
    metrics: [
      { value: '3', label: 'partner banks onboarded' },
      { value: '0', label: 'audit findings' },
      { value: '100%', label: 'daily SLA met' },
    ],
    date: '2024-01-20',
    year: 2024,
    challenges: [
      'Working within a legacy PHP 5 codebase with no modern tooling',
      "Ensuring financial journal entries matched the accounting division's audit requirements",
      'Safely extending SFTP integration to new partner banks without breaking existing ones',
    ],
    solutions: [
      'Introduced a thin adapter layer to isolate bank-specific parsing logic',
      'Built a dry-run mode that generates journal entries without committing them for audit review',
      'Added regression test fixtures using real anonymised transaction samples',
    ],
    results: [
      'Successfully onboarded 3 additional partner banks',
      'Zero audit findings since dry-run review process introduced',
      'Daily reconciliation reports delivered within SLA every day',
    ],
  },
  {
    slug: 'chatbot-kukerta',
    title: 'Thesis — Chatbot Kukerta',
    shortDescription:
      'Conversational chatbot using fuzzy string matching to answer student queries about the Kukerta internship program, achieving 80% match rate.',
    fullDescription:
      'Final thesis project at Universitas Riau. Built a Python/Flask chatbot that answers student questions about the Kukerta community service program using a fuzzy string matching algorithm trained on 3,000 manually curated question-answer pairs.',
    featured: false,
    category: 'tool',
    technologies: ['Python', 'Flask', 'JavaScript', 'jQuery', 'Bootstrap', 'MySQL'],
    githubUrl: 'https://github.com/rickyfrdy/chatbot-kukerta',
    role: 'Solo Developer · Thesis Author',
    metrics: [
      { value: '80%', label: 'question match rate' },
      { value: '3,000', label: 'QA pairs curated' },
      { value: '3.69', label: 'thesis GPA (out of 4.00)' },
    ],
    date: '2020-09-01',
    year: 2020,
    challenges: [
      'Building an accurate NLP system with no pre-trained model available in Bahasa Indonesia',
      'Curating a diverse 3,000-entry dataset within a 1-month timeline',
      'Deploying a Python backend in a low-resource university server environment',
    ],
    solutions: [
      'Used FuzzyWuzzy library with TF-IDF vectorisation to score question similarity',
      'Structured the dataset gathering as a structured questionnaire distributed to 150 students',
      'Containerised the Flask app with lightweight Alpine-based Docker image',
    ],
    results: [
      '80% question match rate on the held-out test set',
      'Deployed and used by the Kukerta administrative office',
      'Thesis awarded "Very Satisfactory" grade (3.69/4.00 GPA)',
    ],
  },
]
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/data/projects.test.ts 2>&1 | tail -5
```

Expected: `3 tests passed`

- [ ] **Step 5: Run full test suite — verify no regressions**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -5
```

Expected: all tests pass (original 50 + 3 new = 53 total minimum)

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts tests/data/projects.test.ts
git commit -m "feat(data): extend Project schema with role, metrics, heroImage fields"
```

---

## Task 3: Projects content collection + first MDX file

**Context:**
- `src/content.config.ts` currently only has the `blog` collection.
- Add a `projects` collection using `glob()` loader, same pattern as blog.
- The MDX frontmatter only needs `slug: string` to match against `projects.ts`.
- `src/content/projects/` does not exist yet — create the directory by creating the MDX file.
- After this task, `astro check` must still report 0 errors.

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/projects/singel-app.mdx`

- [ ] **Step 1: Update `src/content.config.ts`**

```ts
// biome-ignore lint/correctness/noUnusedImports: z from astro:content is deprecated but required for type compatibility
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
  }),
})

export const collections = { blog, projects }
```

- [ ] **Step 2: Create `src/content/projects/singel-app.mdx`**

```mdx
---
slug: singel-app
---

Singel APP is the unified digital workspace for all PT. Pegadaian employees — a **Micro-Frontend platform** where independent product teams ship features without coordinating deploys. I led the frontend architecture and built the shared design system that all teams consume.

The platform runs on **Module Federation** (Vite), with each team owning their own bundle. A constellation of **NestJS microservices** handles the backend, connected via Redis pub/sub for async processing. Shared interfaces are enforced as npm packages with Zod schemas — if a contract breaks, the build fails before it reaches production.

What I am most proud of: we went from a codebase where a single team could block all deploys, to one where **five teams ship independently every sprint** — with 80% Vitest coverage and zero regression incidents.
```

- [ ] **Step 3: Run astro check (Node 24)**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/projects/singel-app.mdx
git commit -m "feat(content): add projects content collection with singel-app MDX overview"
```

---

## Task 4: CaseStudyHero.astro

**Context:**
- Renders the full-bleed hero: gradient fallback (using `paper-grid` utility + inline gradient) or real image when `heroImage` is set.
- Left accent bar (`bg-accent`, `w-0.5`) spans full height.
- Title block is absolute-positioned bottom-left. `id="case-study-hero-title"` is the GSAP target in Task 10.
- `data-hero-bg` on the gradient div is the GSAP parallax target in Task 10.
- `transition:name` on h1 enables ViewTransitions morphing from ProjectCard (added Task 11).
- A11y: gradient div gets `role="img" aria-label={project.title}`; real image gets `alt={project.title}`.

**Files:**
- Create: `src/components/projects/CaseStudyHero.astro`

- [ ] **Step 1: Create `src/components/projects/CaseStudyHero.astro`**

```astro
---
import type { Project } from '@/data/projects'

interface Props {
  project: Project
}

const { project } = Astro.props
---

<header class="relative h-[52vh] min-h-[320px] overflow-hidden">
  {project.heroImage ? (
    <img
      src={project.heroImage}
      alt={project.title}
      class="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <div
      class="paper-grid absolute inset-0"
      style="background: linear-gradient(160deg, #0e2a22 0%, #142e24 50%, #0a1a14 100%);"
      role="img"
      aria-label={project.title}
      data-hero-bg
    />
  )}

  <!-- Gradient overlay for title legibility -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

  <!-- Left accent bar -->
  <div class="bg-accent absolute top-0 bottom-0 left-0 w-0.5" />

  <!-- Title block -->
  <div class="absolute right-8 bottom-8 left-8" id="case-study-hero-title">
    <p class="font-mono mb-3 text-xs tracking-[0.2em] uppercase text-white/50">
      {project.category.replace(/-/g, ' ')} · {project.year}
    </p>
    <h1
      class="title-display text-white"
      style="font-size: clamp(2.5rem, 7vw, 5rem); font-style: italic; line-height: 0.95;"
      transition:name={`project-title-${project.slug}`}
    >
      {project.title}
    </h1>
  </div>
</header>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/CaseStudyHero.astro
git commit -m "feat(components): add CaseStudyHero with gradient fallback and a11y attributes"
```

---

## Task 5: MetricCard.astro

**Context:**
- Static Astro component — one stat card (value + label). Used as SSR fallback.
- `aria-label` on the wrapper provides screen-reader context (e.g. "≥80% unit test coverage").
- Italic serif number uses `title-display` utility + `text-accent` color.
- Mono uppercase label uses `font-mono` + `tracking-[0.15em]`.

**Files:**
- Create: `src/components/projects/MetricCard.astro`

- [ ] **Step 1: Create `src/components/projects/MetricCard.astro`**

```astro
---
interface Props {
  value: string
  label: string
}

const { value, label } = Astro.props
---

<div
  class="border-border flex flex-col items-center gap-1.5 rounded-xl border p-5 text-center"
  aria-label={`${value} ${label}`}
>
  <span
    class="title-display text-accent"
    style="font-size: clamp(1.8rem, 4vw, 2.8rem); font-style: italic;"
  >
    {value}
  </span>
  <span class="text-muted font-mono text-xs tracking-[0.15em] uppercase">{label}</span>
</div>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/MetricCard.astro
git commit -m "feat(components): add MetricCard static stat card"
```

---

## Task 6: MetricCounters.tsx (Framer Motion)

**Context:**
- React island (`client:visible`) — only hydrates when the Impact section enters the viewport.
- `parseMetricValue` extracts prefix/number/suffix from strings like `"≥80%"`, `"200+"`, `"3.69"`, `"5 min"`.
- Counter animation uses `animate()` from framer-motion with `onUpdate` callback to update React state.
- `useReducedMotion()` skips the count-up animation and shows the final value immediately.
- `useInView` from framer-motion triggers the animation once when the element enters the viewport.
- Keys use `metric.label` (not array index) to satisfy Biome `noArrayIndexKey` rule.
- No `console.log` anywhere.

**Files:**
- Create: `src/components/projects/MetricCounters.tsx`

- [ ] **Step 1: Create `src/components/projects/MetricCounters.tsx`**

```tsx
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Metric {
  value: string
  label: string
}

function parseMetricValue(value: string): { prefix: string; num: number; suffix: string } {
  const match = value.match(/^([^0-9]*)(\d+\.?\d*)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value }
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] }
}

function AnimatedCounter({ value, label }: Metric) {
  const { prefix, num, suffix } = parseMetricValue(value)
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(`${prefix}0${suffix}`)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (prefersReduced) {
      setDisplay(value)
      return
    }
    const controls = animate(count, num, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => {
        const formatted = num % 1 !== 0 ? v.toFixed(2) : Math.round(v).toString()
        setDisplay(`${prefix}${formatted}${suffix}`)
      },
    })
    return controls.stop
  }, [isInView, prefersReduced, count, num, prefix, suffix, value])

  return (
    <div
      ref={ref}
      className="border-border flex flex-col items-center gap-1.5 rounded-xl border p-5 text-center"
      aria-label={`${value} ${label}`}
    >
      <span
        className="title-display text-accent"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontStyle: 'italic' }}
      >
        {display}
      </span>
      <span className="text-muted font-mono text-xs uppercase tracking-[0.15em]">{label}</span>
    </div>
  )
}

interface Props {
  metrics: Metric[]
}

export default function MetricCounters({ metrics }: Props) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.6 }}
    >
      {metrics.map((metric) => (
        <AnimatedCounter key={metric.label} value={metric.value} label={metric.label} />
      ))}
    </motion.div>
  )
}
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/MetricCounters.tsx
git commit -m "feat(components): add MetricCounters React island with Framer Motion counter animation"
```

---

## Task 7: ProjectCTAs.tsx (Framer Motion)

**Context:**
- React island (`client:load`) — hydrates immediately so hover effects work on first interaction.
- `motion.a` with `whileHover` and `whileTap` for scale effects.
- `useReducedMotion()` sets scale to `1` (no animation) when the user prefers reduced motion.
- Labels (`liveLabel`, `githubLabel`) come from the Astro parent via the `t()` helper — never hardcoded in this component.
- Returns `null` if neither `liveUrl` nor `githubUrl` is provided.

**Files:**
- Create: `src/components/projects/ProjectCTAs.tsx`

- [ ] **Step 1: Create `src/components/projects/ProjectCTAs.tsx`**

```tsx
import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  liveUrl?: string
  githubUrl?: string
  liveLabel: string
  githubLabel: string
}

export default function ProjectCTAs({ liveUrl, githubUrl, liveLabel, githubLabel }: Props) {
  const prefersReduced = useReducedMotion()
  const hoverScale = prefersReduced ? 1 : 1.03
  const tapScale = prefersReduced ? 1 : 0.97

  if (!liveUrl && !githubUrl) return null

  return (
    <div className="flex flex-wrap gap-3">
      {liveUrl && (
        <motion.a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent text-background hover:bg-accent-hover inline-flex h-10 items-center rounded-lg px-5 font-mono text-xs font-medium tracking-[0.1em] uppercase transition-colors"
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: tapScale }}
        >
          {liveLabel} ↗
        </motion.a>
      )}
      {githubUrl && (
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-5 font-mono text-xs font-medium tracking-[0.1em] uppercase transition-colors"
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: tapScale }}
        >
          {githubLabel} ↗
        </motion.a>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectCTAs.tsx
git commit -m "feat(components): add ProjectCTAs React island with Framer Motion hover effects"
```

---

## Task 8: ProjectNav.astro

**Context:**
- `prev` and `next` are `Project | null` — null when there is only 1 project.
- Empty `<div aria-hidden="true" />` preserves the flex layout when one side is null.
- Each link has `aria-label` with the adjacent project title — A11y landmark requirement.
- `<nav>` element with `aria-label="Project navigation"` is the landmark region.
- `transition:name` on the adjacent title enables ViewTransitions morphing.

**Files:**
- Create: `src/components/projects/ProjectNav.astro`

- [ ] **Step 1: Create `src/components/projects/ProjectNav.astro`**

```astro
---
import type { Project } from '@/data/projects'

interface Props {
  prev: Project | null
  next: Project | null
  prevLabel: string
  nextLabel: string
}

const { prev, next, prevLabel, nextLabel } = Astro.props
---

<nav
  aria-label="Project navigation"
  class="border-border flex items-start justify-between border-t px-4 py-10"
>
  {prev ? (
    <a
      href={`/projects/${prev.slug}`}
      class="text-muted hover:text-foreground group flex max-w-[45%] flex-col gap-1 transition-colors"
      aria-label={`Previous project: ${prev.title}`}
    >
      <span class="font-mono text-xs tracking-[0.15em] uppercase">{prevLabel}</span>
      <span
        class="title-display group-hover:text-accent text-lg leading-tight transition-colors"
        transition:name={`project-title-${prev.slug}`}
      >
        {prev.title}
      </span>
    </a>
  ) : <div aria-hidden="true" />}

  {next ? (
    <a
      href={`/projects/${next.slug}`}
      class="text-muted hover:text-foreground group ml-auto flex max-w-[45%] flex-col items-end gap-1 transition-colors"
      aria-label={`Next project: ${next.title}`}
    >
      <span class="font-mono text-xs tracking-[0.15em] uppercase">{nextLabel}</span>
      <span
        class="title-display group-hover:text-accent text-right text-lg leading-tight transition-colors"
        transition:name={`project-title-${next.slug}`}
      >
        {next.title}
      </span>
    </a>
  ) : <div aria-hidden="true" />}
</nav>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectNav.astro
git commit -m "feat(components): add ProjectNav with next/prev navigation and aria-labels"
```

---

## Task 9: Rewrite [slug].astro + MainLayout noReveal

**Context:**
- The global IntersectionObserver in `MainLayout.astro` (Phase 5) hides `main > section:not(:first-child)` and reveals them on scroll. GSAP (Task 10) does the same — both running simultaneously cause visual glitches. Fix: add a `noReveal?: boolean` prop to MainLayout. When `true`, it sets `data-no-reveal` on `<html>` and the IntersectionObserver skips itself.
- `<ViewTransitions />` from `astro:transitions` is added to MainLayout head.
- `getCollection('projects')` loads MDX entries — find the one with matching `data.slug`. If none, `Content` is `null` and `fullDescription` is the fallback.
- Next/prev wraps around using modulo. If only 1 project, both are `null`.
- The page passes `noReveal` to `MainLayout` so the IntersectionObserver does not conflict with GSAP.
- `data-reveal` attribute on each `<section>` is the GSAP ScrollTrigger target (Task 10).

**Files:**
- Modify: `src/components/layout/MainLayout.astro`
- Rewrite: `src/pages/projects/[slug].astro`

- [ ] **Step 1: Update `src/components/layout/MainLayout.astro`**

Replace the entire file with:

```astro
---
import { ViewTransitions } from 'astro:transitions'
import AppFooter from './AppFooter.astro'
import AppHeader from './AppHeader.astro'
import BaseHead from './BaseHead.astro'
import '@/styles/global.css'

interface Props {
  title: string
  description: string
  ogImage?: string | undefined
  noReveal?: boolean
}

const { title, description, ogImage, noReveal = false } = Astro.props
---

<!doctype html>
<html lang="en" class="dark" data-no-reveal={noReveal || undefined}>
  <head>
    <BaseHead title={title} description={description} ogImage={ogImage} />
    <ViewTransitions />
  </head>
  <body class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />

    <script is:inline>
      (function () {
        if (!('IntersectionObserver' in window)) return
        if (document.documentElement.hasAttribute('data-no-reveal')) return

        document.documentElement.classList.add('js-reveal')

        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
              }
            })
          },
          { threshold: 0.08 }
        )

        document
          .querySelectorAll('main > section:not(:first-child)')
          .forEach(function (section) {
            observer.observe(section)
          })
      })()
    </script>
  </body>
</html>
```

- [ ] **Step 2: Rewrite `src/pages/projects/[slug].astro`**

Replace the entire file with:

```astro
---
import { getCollection, render } from 'astro:content'
import type { GetStaticPaths } from 'astro'
import CaseStudyHero from '@/components/projects/CaseStudyHero.astro'
import MetricCounters from '@/components/projects/MetricCounters'
import ProjectCTAs from '@/components/projects/ProjectCTAs'
import ProjectNav from '@/components/projects/ProjectNav.astro'
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
import type { Project } from '@/data/projects'
import { t } from '@/i18n/ui'

export const getStaticPaths: GetStaticPaths = async () => {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }))
}

interface Props {
  project: Project
}

const { project } = Astro.props
const lang = 'en'

// Try MDX content — fallback to fullDescription
const projectEntries = await getCollection('projects')
const mdxEntry = projectEntries.find((e) => e.data.slug === project.slug)
const Content = mdxEntry ? (await render(mdxEntry)).Content : null

// Next / prev (wrap-around, null if only 1 project)
const idx = projects.findIndex((p) => p.slug === project.slug)
const prev = projects.length > 1 ? projects[(idx - 1 + projects.length) % projects.length] : null
const next = projects.length > 1 ? projects[(idx + 1) % projects.length] : null

// Zip challenges + solutions by index
const pairs = project.challenges
  .slice(0, Math.min(project.challenges.length, project.solutions.length))
  .map((challenge, i) => ({ challenge, solution: project.solutions[i] }))
---

<MainLayout
  title={`${project.title} — Ricki Friadi`}
  description={project.shortDescription}
  noReveal
>
  <!-- Back link (outside sections so it overlays the hero) -->
  <div class="border-border border-b px-4 py-3">
    <a
      href="/projects"
      class="text-muted hover:text-foreground font-mono text-xs tracking-[0.15em] uppercase transition-colors"
    >
      {t(lang, 'case.back')}
    </a>
  </div>

  <!-- §2 Hero -->
  <CaseStudyHero project={project} />

  <!-- §3 Role + Tech + CTAs -->
  <section class="border-border border-b px-4 py-8" data-reveal>
    {project.role && (
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <span class="font-mono text-xs tracking-[0.15em] uppercase text-accent">
          {t(lang, 'case.role')}
        </span>
        <span class="text-foreground text-sm">{project.role}</span>
      </div>
    )}

    <div class="mb-6 flex flex-wrap gap-1.5">
      {project.technologies.map((tech) => (
        <span class="diff-tag">{tech}</span>
      ))}
    </div>

    <ProjectCTAs
      liveUrl={project.liveUrl}
      githubUrl={project.githubUrl}
      liveLabel={t(lang, 'case.live')}
      githubLabel={t(lang, 'case.github')}
      client:load
    />
  </section>

  <!-- §4 Overview -->
  <section class="border-border border-b px-4 py-8" data-reveal>
    <h2 class="font-mono mb-5 text-xs tracking-[0.15em] uppercase text-accent">
      {t(lang, 'case.overview')}
    </h2>
    {Content ? (
      <div class="prose prose-sm text-foreground max-w-2xl leading-relaxed [&_strong]:text-foreground">
        <Content />
      </div>
    ) : (
      <p class="text-foreground max-w-2xl text-sm leading-relaxed">{project.fullDescription}</p>
    )}
  </section>

  <!-- §5 Impact metrics (omitted if no metrics) -->
  {project.metrics && project.metrics.length > 0 && (
    <section class="border-border border-b px-4 py-8" data-reveal>
      <h2 class="font-mono mb-5 text-xs tracking-[0.15em] uppercase text-accent">
        {t(lang, 'case.impact')}
      </h2>
      <MetricCounters metrics={project.metrics} client:visible />
    </section>
  )}

  <!-- §6 Problem → Solution -->
  <section class="border-border border-b px-4 py-8" data-reveal>
    <h2 class="font-mono mb-6 text-xs tracking-[0.15em] uppercase text-accent">
      {t(lang, 'case.problem')} → {t(lang, 'case.solution')}
    </h2>
    <div class="space-y-6">
      {pairs.map((pair) => (
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="font-mono mb-2 text-[10px] tracking-[0.2em] uppercase text-muted">
              {t(lang, 'case.problem')}
            </p>
            <p class="text-foreground text-sm leading-relaxed">{pair.challenge}</p>
          </div>
          <div>
            <p class="font-mono mb-2 text-[10px] tracking-[0.2em] uppercase text-muted">
              {t(lang, 'case.solution')}
            </p>
            <p class="text-foreground text-sm leading-relaxed">{pair.solution}</p>
          </div>
        </div>
      ))}
    </div>
  </section>

  <!-- §7 Key highlights -->
  <section class="border-border border-b px-4 py-8" data-reveal>
    <h2 class="font-mono mb-5 text-xs tracking-[0.15em] uppercase text-accent">
      {t(lang, 'case.highlights')}
    </h2>
    <ul class="space-y-3">
      {project.results.map((result) => (
        <li class="text-foreground flex gap-3 text-sm leading-relaxed">
          <span class="text-accent mt-0.5 flex-shrink-0" aria-hidden="true">›</span>
          <span>{result}</span>
        </li>
      ))}
    </ul>
  </section>

  <!-- §8 Next / prev navigation -->
  <ProjectNav
    prev={prev}
    next={next}
    prevLabel={t(lang, 'case.prev')}
    nextLabel={t(lang, 'case.next')}
  />
</MainLayout>
```

- [ ] **Step 3: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 4: Run full test suite**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -5
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/[slug].astro src/components/layout/MainLayout.astro
git commit -m "feat(pages): rewrite /projects/[slug] as 9-section editorial case study with ViewTransitions"
```

---

## Task 10: GSAP scroll animations

**Context:**
- GSAP `^3.15.0` is already installed.
- `ScrollTrigger` must be registered before use.
- Title chars: split `textContent` into `<span>` elements using `document.createDocumentFragment()` — no `innerHTML` with dynamic content. Each span gets `display:inline-block` and `textContent` set to the character (` ` for spaces).
- `data-hero-bg` is the parallax target (gradient div in CaseStudyHero).
- `data-reveal` sections animate in with `y: 30 → 0`, `opacity: 0 → 1`.
- `gsap.matchMedia()` gates all animations behind `prefers-reduced-motion: no-preference`.
- `astro:before-swap` cleans up ScrollTrigger instances before ViewTransitions swaps DOM.
- `astro:after-swap` re-runs animations when ViewTransitions navigates back to a case study page.
- This is a regular `<script>` module (not `is:inline`) — Astro bundles and re-runs it on ViewTransitions.

**Files:**
- Modify: `src/pages/projects/[slug].astro` (append `<script>` block after `</MainLayout>`)

- [ ] **Step 1: Append GSAP script to `src/pages/projects/[slug].astro`**

Add this block at the very end of the file, after `</MainLayout>`:

```astro
<script>
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  gsap.registerPlugin(ScrollTrigger)

  function initAnimations() {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      // Title character entrance — uses DOM methods (no innerHTML)
      const titleEl = document.querySelector('#case-study-hero-title h1')
      if (titleEl instanceof HTMLElement) {
        const text = titleEl.textContent ?? ''
        const fragment = document.createDocumentFragment()
        for (const char of text) {
          const span = document.createElement('span')
          span.style.display = 'inline-block'
          span.textContent = char === ' ' ? ' ' : char
          fragment.appendChild(span)
        }
        titleEl.textContent = ''
        titleEl.appendChild(fragment)

        gsap.from(titleEl.querySelectorAll('span'), {
          y: 40,
          opacity: 0,
          stagger: 0.025,
          duration: 0.8,
          ease: 'power4.out',
        })
      }

      // Hero parallax
      const heroBg = document.querySelector('[data-hero-bg]')
      if (heroBg instanceof HTMLElement && heroBg.parentElement) {
        gsap.to(heroBg, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroBg.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Section scroll reveals
      document.querySelectorAll('[data-reveal]').forEach((section) => {
        gsap.from(section, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        })
      })
    })
  }

  initAnimations()

  // Clean up before ViewTransitions swaps the DOM
  document.addEventListener('astro:before-swap', () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })

  // Re-run after ViewTransitions navigates back to a case study page
  document.addEventListener('astro:after-swap', () => {
    if (document.querySelector('#case-study-hero-title')) {
      initAnimations()
    }
  })
</script>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Production build — verify GSAP is bundled**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -6
```

Expected: build completes

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/[slug].astro
git commit -m "feat(animations): add GSAP title entrance, hero parallax, and section scroll reveals"
```

---

## Task 11: ViewTransitions morphing on ProjectCard

**Context:**
- `<ViewTransitions />` is now in `MainLayout.astro` (added Task 9).
- For morphing to work: the same `transition:name` string must appear on the **source** element (ProjectCard) and the **destination** element (CaseStudyHero h1).
- `CaseStudyHero.astro` already has `transition:name={`project-title-${project.slug}`}` on the h1.
- Add the matching `transition:name` to the h3 title in `ProjectCard.astro`.
- Also add `transition:name` to the thumbnail div so it morphs into the hero area.

**Files:**
- Modify: `src/components/projects/ProjectCard.astro`

- [ ] **Step 1: Update `src/components/projects/ProjectCard.astro`**

Replace the entire file with:

```astro
---
import type { Project } from '@/data/projects'

interface Props {
  project: Project
}

const { project } = Astro.props
---

<article class="border-border hover:border-accent/40 group relative flex h-full flex-col rounded-2xl border transition-all duration-300">
  <!-- Thumbnail placeholder -->
  <div
    class="bg-secondary text-muted flex aspect-video items-center justify-center rounded-t-2xl px-4"
    transition:name={`project-hero-${project.slug}`}
  >
    <span class="font-mono text-xs tracking-[0.08em] uppercase">{project.title}</span>
    {project.featured && (
      <span class="bg-accent text-background absolute top-3 right-3 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase">
        Featured
      </span>
    )}
  </div>

  <!-- Content -->
  <div class="flex flex-1 flex-col p-5">
    <h3
      class="title-display group-hover:text-accent text-2xl leading-tight transition-colors duration-300"
      transition:name={`project-title-${project.slug}`}
    >
      {project.title}
    </h3>
    <p class="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
      {project.shortDescription}
    </p>

    <!-- Tech badges -->
    <div class="mt-4 flex flex-wrap gap-1.5">
      {project.technologies.slice(0, 4).map((tech) => (
        <span class="diff-tag">{tech}</span>
      ))}
      {project.technologies.length > 4 && (
        <span class="diff-tag">+{project.technologies.length - 4}</span>
      )}
    </div>

    {project.keyMetric && (
      <p class="text-accent mt-4 text-xs font-semibold">{project.keyMetric}</p>
    )}

    <div class="text-muted mt-4 flex items-center justify-between text-xs font-medium tracking-wide uppercase">
      <span>{project.category.replace(/-/g, ' ')}</span>
      <span>{project.year}</span>
    </div>

    <!-- Actions -->
    <div class="border-border mt-5 flex gap-2 border-t pt-5">
      <a
        href={`/projects/${project.slug}`}
        class="border-border text-foreground hover:bg-secondary inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
      >
        View Details
      </a>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="border-border text-muted hover:text-foreground hover:bg-secondary inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
          aria-label="View on GitHub"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      )}
    </div>
  </div>
</article>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectCard.astro
git commit -m "feat(transitions): add transition:name to ProjectCard for ViewTransitions morphing"
```

---

## Task 12: Final Verification

**Context:** Confirm all checks pass end-to-end.

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -6
```

Expected: all tests pass (at least 55 total: 50 original + 3 data + 2 i18n)

- [ ] **Step 2: Biome check**

```bash
npx biome check src/ 2>&1 | tail -5
```

Expected: `0 errors` (pre-existing suppression-comment warning on `content.config.ts` is harmless)

- [ ] **Step 3: ESLint**

```bash
npx eslint --config eslint.astro.config.js "src/**/*.astro" 2>&1 | tail -3
```

Expected: no output (0 errors)

- [ ] **Step 4: Astro type check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 5: Production build**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -6
```

Expected: build completes with all pages

- [ ] **Step 6: Verify case study pages in built output**

```bash
ls /Users/rickifriadi/dev/personal/ricki-web/dist/projects/*/index.html
```

Expected: 5 files — one per project slug (`singel-app`, `microsite-pinjaman`, `kamila`, `aira-reconciliation`, `chatbot-kukerta`)

- [ ] **Step 7: Commit if any unstaged changes remain**

```bash
git -C /Users/rickifriadi/dev/personal/ricki-web status --short
```

Only commit if there are changes:

```bash
git add -A && git commit -m "chore: verified — all tests pass, 0 errors, 5 case study pages built"
```
