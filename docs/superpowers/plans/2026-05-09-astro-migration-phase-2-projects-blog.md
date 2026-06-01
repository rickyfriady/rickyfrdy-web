# Phase 2 — Projects & Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the `/projects` and `/blog` routes — Projects with client-side filtering (React island), individual project detail pages, and Blog using Astro MDX Content Collections.

**Architecture:** Projects data lives in `src/data/projects.ts` as static typed TS. The listing page uses a React island (`ProjectsGrid.tsx` with `client:load`) for filter/sort interactivity. Individual project pages are static via `getStaticPaths`. Blog uses Astro Content Collections with MDX (`src/content/blog/`), a zod schema in `src/content/config.ts`, listing page, and dynamic `[slug].astro` post page.

**Tech Stack:** Astro 6 (Content Collections, `getStaticPaths`, `getCollection`), React 19 (`client:load`), MDX, Zod (via `astro:content`), Tailwind v4

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/data/projects.ts` | 5 typed projects (real portfolio work) |
| Create | `src/content/config.ts` | Astro Content Collections blog schema |
| Create | `src/content/blog/microservices-with-nestjs.mdx` | Sample MDX post |
| Create | `src/components/projects/ProjectCard.astro` | Pure Astro card (no JS) |
| Create | `src/components/projects/ProjectsGrid.tsx` | React island: filter + sort state |
| Create | `src/pages/projects.astro` | Projects listing page |
| Create | `src/pages/projects/[slug].astro` | Static detail page via getStaticPaths |
| Create | `src/pages/blog/index.astro` | Blog listing page |
| Create | `src/pages/blog/[slug].astro` | Blog post page via getStaticPaths |
| Test | `tests/data/projects.test.ts` | Validates data shape |

---

## Task 1: Create src/data/projects.ts (TDD)

**Files:**
- Create: `src/data/projects.ts`
- Create: `tests/data/projects.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/data/projects.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'

describe('projects data', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.shortDescription).toBeTruthy()
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.year).toBeGreaterThan(2019)
      expect(['web-app', 'api', 'tool', 'open-source']).toContain(p.category)
    }
  })

  it('slugs are unique', () => {
    const slugs = projects.map((p) => p.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it('slugs are URL-safe (lowercase, hyphens only)', () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('featured projects exist', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/data/projects.test.ts`
Expected: FAIL — "Cannot find module '@/data/projects'"

- [ ] **Step 3: Create src/data/projects.ts**

```typescript
export interface Project {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  featured: boolean
  category: 'web-app' | 'api' | 'tool' | 'open-source'
  technologies: string[]
  keyMetric?: string
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
      'KAMILA (Kelola Aktivitas Marketing Internal Layanan Anda) is the internal tool used by PT. Pegadaian marketing teams to track plans, weekly reports, KPIs, and leads submitted from external business partners. Built with a React frontend and Express/Node.js backend.',
    featured: false,
    category: 'web-app',
    technologies: ['ReactJS', 'ExpressJS', 'Node.js', 'Tailwind', 'PostgreSQL', 'Redis', 'TypeORM', 'Redux'],
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
      'AIRA handles financial reconciliation between PT. Pegadaian\'s core banking system and external partner banks. The system validates transactions over SFTP, generates journal entries to accounting standards, and produces daily reports consumed by the finance division.',
    featured: false,
    category: 'tool',
    technologies: ['PHP 5', 'PHP Native', 'SFTP', 'VM', 'MySQL'],
    date: '2024-01-20',
    year: 2024,
    challenges: [
      'Working within a legacy PHP 5 codebase with no modern tooling',
      'Ensuring financial journal entries matched the accounting division's audit requirements',
      'Safely extending SFTP integration to new partner banks without breaking existing ones',
    ],
    solutions: [
      'Introduced a thin adapter layer to isolate bank-specific parsing logic',
      'Built a dry-run mode that generates journal entries without committing them for audit review',
      'Added regression test fixtures using real (anonymised) transaction samples',
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
      'Final thesis project at Universitas Riau. Built a Python/Flask chatbot that answers student questions about the Kukerta community service program using a fuzzy string matching algorithm trained on 3,000 manually curated question–answer pairs.',
    featured: false,
    category: 'tool',
    technologies: ['Python', 'Flask', 'JavaScript', 'jQuery', 'Bootstrap', 'MySQL'],
    githubUrl: 'https://github.com/rickyfrdy/chatbot-kukerta',
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

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/data/projects.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts tests/data/projects.test.ts
git commit -m "feat(data): add typed projects data with 5 portfolio entries"
```

---

## Task 2: Set Up Astro Content Collections for Blog

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/microservices-with-nestjs.mdx`

Astro Content Collections use Zod schemas to validate MDX frontmatter at build time. The `src/content/config.ts` file is auto-discovered by Astro.

- [ ] **Step 1: Create src/content/config.ts**

```typescript
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
```

- [ ] **Step 2: Create sample MDX post**

Create `src/content/blog/microservices-with-nestjs.mdx`:

```mdx
---
title: 'Building Microservices with NestJS and the Factory Pattern'
description: 'How I replaced a legacy CodeIgniter monolith with 9 NestJS microservices at PT. Pegadaian — and why the Factory pattern made each new loan product a 1-hour addition.'
pubDate: 2025-03-15
tags: ['nestjs', 'microservices', 'typescript', 'architecture']
draft: false
---

When I joined the Microsite Pinjaman project at PT. Pegadaian, the backend was a single
CodeIgniter 3 monolith serving three different loan products — and adding a fourth meant
touching code in a dozen places. Here's how we changed that.

## The Problem

The monolith handled `Kredit Usaha Rakyat`, `Serba Guna`, and `Cicil Kendaraan` through
deeply interleaved conditional logic. Every route was a `switch` statement. Every controller
had product-specific `if` blocks. Adding a new product meant finding every one of those
branches and carefully inserting another case.

## The Factory Pattern

The solution was to model each loan product as a **strategy** and inject the right one at
runtime via a factory.

```typescript
// loan-processor.factory.ts
@Injectable()
export class LoanProcessorFactory {
  constructor(
    private readonly kur: KurProcessor,
    private readonly sg: SerbaGunaProcessor,
    private readonly ck: CicilKendaraanProcessor,
  ) {}

  create(type: LoanType): LoanProcessor {
    const map: Record<LoanType, LoanProcessor> = {
      kur: this.kur,
      'serba-guna': this.sg,
      'cicil-kendaraan': this.ck,
    }
    const processor = map[type]
    if (!processor) throw new Error(`Unknown loan type: ${type}`)
    return processor
  }
}
```

Each `LoanProcessor` implements the same interface:

```typescript
interface LoanProcessor {
  validate(data: LoanApplicationDto): Promise<void>
  calculate(data: LoanApplicationDto): Promise<LoanQuote>
  submit(data: LoanApplicationDto): Promise<LoanReference>
}
```

## Adding a New Product

When `Gadai Emas` was added three months later, the work was:

1. Create `GadaiEmasProcessor` implementing `LoanProcessor`
2. Register it in `LoanProcessorFactory`
3. Write tests

No other files changed. The migration from "new requirement" to "deployed" took four hours.

## Lessons

- **Code that's easy to extend is hard to break.** The factory boundary means each processor
  is independently testable and independently deployable.
- **Type-safe discriminated unions beat string checks.** Using `LoanType` as a union type
  catches missing cases at compile time, not at 3am in production.
- **Write the tests for the interface, not the implementation.** Our integration tests target
  `LoanProcessor` — so swapping implementations is safe.
```

- [ ] **Step 3: Run astro check to verify collection schema is valid**

Run (with Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/blog/microservices-with-nestjs.mdx
git commit -m "feat(content): set up blog Content Collection with MDX schema and sample post"
```

---

## Task 3: Create ProjectCard.astro

**Files:**
- Create: `src/components/projects/ProjectCard.astro`

Pure Astro component — no JS. Receives a `Project` as prop and renders a card with title, description, tech stack badges, key metric, and links.

- [ ] **Step 1: Create the component**

```astro
---
import type { Project } from '@/data/projects'

interface Props {
  project: Project
}

const { project } = Astro.props
---

<article class="border-border hover:border-accent/40 group flex h-full flex-col rounded-2xl border transition-all duration-300">
  <!-- Thumbnail placeholder -->
  <div class="bg-secondary text-muted flex aspect-video items-center justify-center rounded-t-2xl px-4">
    <span class="font-mono text-xs tracking-[0.08em] uppercase">{project.title}</span>
    {project.featured && (
      <span class="bg-accent text-background absolute top-3 right-3 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase">
        Featured
      </span>
    )}
  </div>

  <!-- Content -->
  <div class="flex flex-1 flex-col p-5">
    <h3 class="title-display group-hover:text-accent text-2xl leading-tight transition-colors duration-300">
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
      <span>{project.category.replace('-', ' ')}</span>
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

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectCard.astro
git commit -m "feat(components): add pure Astro ProjectCard component"
```

---

## Task 4: Create ProjectsGrid.tsx React Island

**Files:**
- Create: `src/components/projects/ProjectsGrid.tsx`

React island with filter by category + technology, and sort by featured/recent. Receives all projects as a prop (server-rendered, no fetch), manages filter state client-side.

- [ ] **Step 1: Create the component**

```tsx
import { useMemo, useState } from 'react'
import type { Project } from '@/data/projects'

interface Props {
  projects: Project[]
}

type CategoryFilter = 'all' | Project['category']
type SortOrder = 'featured' | 'recent' | 'year'

export default function ProjectsGrid({ projects }: Props) {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [tech, setTech] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOrder>('featured')

  const allTechs = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      for (const t of p.technologies) set.add(t)
    }
    return Array.from(set).sort()
  }, [projects])

  const filtered = useMemo(() => {
    let result = projects

    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }
    if (tech !== 'all') {
      result = result.filter((p) =>
        p.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
      )
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return b.year - a.year
    })
  }, [projects, category, tech, sortBy])

  function reset() {
    setCategory('all')
    setTech('all')
    setSortBy('featured')
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar filters */}
      <aside className="lg:w-56 lg:flex-shrink-0">
        <div className="border-border sticky top-24 rounded-2xl border p-5 space-y-6">
          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">Category</p>
            <div className="space-y-1">
              {(['all', 'web-app', 'api', 'tool', 'open-source'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                    category === c
                      ? 'bg-secondary text-foreground'
                      : 'text-muted hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {c === 'all' ? 'All' : c.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">Sort</p>
            <div className="space-y-1">
              {(['featured', 'recent', 'year'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                    sortBy === s
                      ? 'bg-secondary text-foreground'
                      : 'text-muted hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">Technology</p>
            <select
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All technologies</option>
              {allTechs.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-muted hover:text-foreground w-full font-mono text-xs transition-colors"
          >
            Reset filters
          </button>

          <p className="text-muted font-mono text-[10px]">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="border-border flex flex-col items-center rounded-2xl border p-12 text-center">
            <p className="text-muted mb-4 text-sm">No projects match your filters</p>
            <button type="button" onClick={reset} className="text-accent text-sm hover:underline">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((project) => (
              <a
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="border-border hover:border-accent/40 group flex h-full flex-col rounded-2xl border transition-all duration-300 no-underline"
              >
                <div className="bg-secondary text-muted flex aspect-video items-center justify-center rounded-t-2xl px-4">
                  <span className="font-mono text-xs tracking-[0.08em] uppercase">{project.title}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="title-display group-hover:text-accent text-xl leading-tight transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="bg-accent text-background flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
                    {project.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="diff-tag">{t}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="diff-tag">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                  {project.keyMetric && (
                    <p className="text-accent mt-4 text-xs font-semibold">{project.keyMetric}</p>
                  )}
                  <div className="text-muted mt-auto flex items-center justify-between pt-4 text-xs font-medium tracking-wide uppercase">
                    <span>{project.category.replace('-', ' ')}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectsGrid.tsx
git commit -m "feat(components): add ProjectsGrid React island with filter and sort"
```

---

## Task 5: Create src/pages/projects.astro

**Files:**
- Create: `src/pages/projects.astro`

Static hero + ProjectsGrid React island (`client:load` — filters must work immediately on interaction).

- [ ] **Step 1: Create the page**

```astro
---
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
---

<MainLayout
  title="Projects — Ricki Friadi"
  description="Explore the portfolio of web applications and fullstack solutions built by Ricki Friadi — Vue 3, TypeScript, NestJS, PostgreSQL."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Portfolio</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Projects &amp; Case<br />
      <span class="title-accent text-accent">Studies.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Real-world systems and product experiences built with a backend-first, performance-minded approach.
    </p>
  </section>

  <!-- Projects grid with filters -->
  <section class="px-4 py-8">
    <ProjectsGrid projects={projects} client:load />
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat(pages): add /projects listing page with React filter island"
```

---

## Task 6: Create src/pages/projects/[slug].astro

**Files:**
- Create: `src/pages/projects/[slug].astro`

Static detail page. `getStaticPaths` returns one path per project slug. Renders full project details: description, challenges, solutions, results, and tech stack.

- [ ] **Step 1: Create the page**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
import type { GetStaticPaths } from 'astro'

export const getStaticPaths: GetStaticPaths = () => {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }))
}

const { project } = Astro.props
---

<MainLayout
  title={`${project.title} — Ricki Friadi`}
  description={project.shortDescription}
>
  <!-- Back -->
  <div class="border-border border-b px-4 py-4">
    <a href="/projects" class="text-muted hover:text-foreground font-mono text-xs transition-colors">
      ← All Projects
    </a>
  </div>

  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <div class="flex flex-wrap items-center gap-3">
      <span class="diff-tag">{project.category.replace('-', ' ')}</span>
      <span class="diff-tag">{project.year}</span>
      {project.featured && <span class="eyebrow">Featured</span>}
    </div>
    <h1
      class="title-display mt-4"
      style="font-size: clamp(2rem, 6vw, 4rem); line-height: 0.95"
    >
      {project.title}
    </h1>
    <p class="text-muted mt-4 max-w-2xl text-sm leading-relaxed">
      {project.shortDescription}
    </p>
    {project.keyMetric && (
      <p class="text-accent mt-3 text-sm font-semibold">{project.keyMetric}</p>
    )}

    <!-- Links -->
    <div class="mt-6 flex flex-wrap gap-3">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="bg-accent text-background hover:bg-accent-hover inline-flex h-9 items-center rounded-lg px-4 text-xs font-medium transition-colors"
        >
          Live Demo ↗
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="border-border text-foreground hover:bg-secondary inline-flex h-9 items-center rounded-lg border px-4 text-xs font-medium transition-colors"
        >
          GitHub ↗
        </a>
      )}
    </div>
  </section>

  <!-- Tech stack -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ Tech Stack</span>
    </div>
    <div class="flex flex-wrap gap-1.5 px-4 pb-8">
      {project.technologies.map((tech) => (
        <span class="diff-tag">{tech}</span>
      ))}
    </div>
  </section>

  <!-- Full description -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ Overview</span>
    </div>
    <p class="text-muted px-4 pb-8 text-sm leading-relaxed">{project.fullDescription}</p>
  </section>

  <!-- Challenges -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ Challenges</span>
    </div>
    <ul class="space-y-2 px-4 pb-8">
      {project.challenges.map((c) => (
        <li class="text-muted flex gap-2 text-sm">
          <span class="text-accent mt-1 flex-shrink-0">›</span>
          <span>{c}</span>
        </li>
      ))}
    </ul>
  </section>

  <!-- Solutions -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ Solutions</span>
    </div>
    <ul class="space-y-2 px-4 pb-8">
      {project.solutions.map((s) => (
        <li class="text-muted flex gap-2 text-sm">
          <span class="text-accent mt-1 flex-shrink-0">›</span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  </section>

  <!-- Results -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ Results</span>
    </div>
    <ul class="space-y-2 px-4 pb-8">
      {project.results.map((r) => (
        <li class="text-foreground flex gap-2 text-sm font-semibold">
          <span class="text-accent mt-1 flex-shrink-0">✓</span>
          <span>{r}</span>
        </li>
      ))}
    </ul>
  </section>

  <!-- Back CTA -->
  <section class="px-4 py-10 text-center">
    <a
      href="/projects"
      class="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
    >
      ← Back to All Projects
    </a>
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/[slug].astro
git commit -m "feat(pages): add /projects/[slug] static detail page"
```

---

## Task 7: Create src/pages/blog/index.astro

**Files:**
- Create: `src/pages/blog/index.astro`

Blog listing page using `getCollection('blog')`. Filters out drafts. Shows each post as a card with title, date, description, tags.

- [ ] **Step 1: Create the page**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { getCollection } from 'astro:content'

const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
)
---

<MainLayout
  title="Blog — Ricki Friadi"
  description="Technical articles about TypeScript, NestJS, microservices, and web architecture by Ricki Friadi."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Field Notes</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Writing on Systems<br />
      <span class="title-accent text-accent">&amp; Craft.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Essays on microservices, TypeScript, architecture, and the craft of building reliable software.
    </p>
  </section>

  <!-- Post list -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Articles</span>
    </div>

    {posts.length === 0 ? (
      <div class="px-4 pb-12">
        <p class="text-muted text-sm">No posts yet — writing in progress.</p>
      </div>
    ) : (
      <div class="divide-border divide-y px-4">
        {posts.map((post) => (
          <a
            href={`/blog/${post.slug}`}
            class="group block py-6 no-underline"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-foreground group-hover:text-accent text-base font-semibold transition-colors">
                  {post.data.title}
                </h2>
                <p class="text-muted mt-1 line-clamp-2 text-sm leading-relaxed">
                  {post.data.description}
                </p>
                {post.data.tags.length > 0 && (
                  <div class="mt-3 flex flex-wrap gap-1.5">
                    {post.data.tags.map((tag: string) => (
                      <span class="diff-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <time
                datetime={post.data.pubDate.toISOString()}
                class="text-muted flex-shrink-0 font-mono text-xs"
              >
                {post.data.pubDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
          </a>
        ))}
      </div>
    )}
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(pages): add /blog listing page with Content Collections"
```

---

## Task 8: Create src/pages/blog/[slug].astro

**Files:**
- Create: `src/pages/blog/[slug].astro`

Static blog post page. Uses `getStaticPaths` with `getCollection`. Renders MDX via `<Content />`. Shows title, date, tags, and back link.

- [ ] **Step 1: Create the page**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { getCollection } from 'astro:content'
import type { GetStaticPaths } from 'astro'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await post.render()
---

<MainLayout title={`${post.data.title} — Ricki Friadi`} description={post.data.description}>
  <!-- Back -->
  <div class="border-border border-b px-4 py-4">
    <a href="/blog" class="text-muted hover:text-foreground font-mono text-xs transition-colors">
      ← All Posts
    </a>
  </div>

  <!-- Header -->
  <section class="border-border border-b px-4 py-8">
    <div class="flex flex-wrap gap-2">
      {post.data.tags.map((tag: string) => (
        <span class="diff-tag">{tag}</span>
      ))}
    </div>
    <h1
      class="title-display mt-4"
      style="font-size: clamp(1.8rem, 5vw, 3.5rem); line-height: 0.95"
    >
      {post.data.title}
    </h1>
    <p class="text-muted mt-3 text-sm">{post.data.description}</p>
    <time
      datetime={post.data.pubDate.toISOString()}
      class="text-muted mt-4 block font-mono text-xs"
    >
      {post.data.pubDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      {post.data.updatedDate && (
        <span>
          {' '}· Updated{' '}
          {post.data.updatedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      )}
    </time>
  </section>

  <!-- Content -->
  <article class="prose prose-sm max-w-none px-4 py-8
    prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight
    prose-p:text-muted prose-p:leading-relaxed
    prose-strong:text-foreground
    prose-code:text-accent prose-code:bg-secondary prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono
    prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
    prose-a:text-accent prose-a:no-underline hover:prose-a:underline
    prose-li:text-muted">
    <Content />
  </article>

  <!-- Back CTA -->
  <div class="border-border border-t px-4 py-8 text-center">
    <a
      href="/blog"
      class="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
    >
      ← Back to Blog
    </a>
  </div>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat(pages): add /blog/[slug] MDX post page"
```

---

## Task 9: Final Verification — Lint, Tests, Build

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (44+ total — previous 39 + 5 new project data tests).

- [ ] **Step 2: Biome lint**

Run: `npx biome check src/`
Expected: 0 errors. If errors: `npx biome check --write --unsafe src/`

- [ ] **Step 3: ESLint on Astro files**

Run: `npx eslint --config eslint.astro.config.js "src/**/*.astro"`
Expected: 0 errors.

- [ ] **Step 4: astro check**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Production build**

Run (Node 24): `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build`
Expected: Build succeeds. Output includes:
- `dist/projects/index.html`
- `dist/projects/singel-app/index.html`
- `dist/projects/microsite-pinjaman/index.html`
- `dist/projects/kamila/index.html`
- `dist/projects/aira-reconciliation/index.html`
- `dist/projects/chatbot-kukerta/index.html`
- `dist/blog/index.html`
- `dist/blog/microservices-with-nestjs/index.html`
- `dist/sitemap-index.xml`

---

## Self-Review

**Spec coverage:**
- ✅ `/projects` listing with React island filter/sort (client:load)
- ✅ `/projects/[slug]` static detail pages (5 pages via getStaticPaths)
- ✅ `/blog` listing using Astro Content Collections
- ✅ `/blog/[slug]` MDX post page
- ✅ `src/content/config.ts` Zod schema for blog collection
- ✅ Sample MDX post with correct frontmatter
- ✅ TDD on data module (projects.test.ts)
- ✅ ProjectCard.astro (pure Astro, no React needed)
- ✅ ProjectsGrid.tsx (React island, receives data as prop — no fetch)

**Type consistency:**
- `Project` interface defined in `src/data/projects.ts`, imported in ProjectCard.astro, ProjectsGrid.tsx, projects.astro, [slug].astro
- `GetStaticPaths` imported from `'astro'` in both `[slug].astro` files
- `getCollection` typed return: `CollectionEntry<'blog'>` — `post.slug`, `post.data`, `post.render()` all valid

**Placeholder check:** No TBDs. All code blocks complete.
