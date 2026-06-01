# Phase 1 — Experience & About Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the `/experience` and `/about` pages from Vue 3 to Astro with zero JavaScript where possible, fix `global.css` to use proper Tailwind v4 `@theme` with oklch colors, and extract all GitHub utility logic into testable pure functions.

**Architecture:** The Experience page uses native `<details>/<summary>` (zero JS, accessible, no React island). The About page uses `SkillsMatrix.astro` (pure Astro, static icons from skillicons.dev) and `GitHubHeatmap.tsx` (React island with `client:visible` for lazy hydration). All content data lives in `src/data/` as typed TypeScript modules.

**Tech Stack:** Astro 6, Tailwind v4 (`@tailwindcss/vite`), React 19 (`@astrojs/react`), TypeScript strict, Biome 2, vitest + jsdom

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/styles/global.css` | Tailwind v4 `@theme` + oklch + fonts + all `@utility` classes |
| Create | `src/data/experience.ts` | Typed work, project, education, skills data |
| Create | `src/data/skills.ts` | SkillsMatrix groups data |
| Create | `src/utils/github.ts` | Pure functions: generateMockContributions, getContributionLevel, calculateTotalContributions, calculateCurrentStreak, calculateLongestStreak |
| Create | `tests/utils/github.test.ts` | Unit tests for all github utils |
| Create | `src/components/about/SkillsMatrix.astro` | Static skill icon grid (no JS) |
| Create | `src/components/about/GitHubHeatmap.tsx` | React island with fetch + heatmap grid |
| Create | `src/pages/experience.astro` | Experience page using data + details/summary |
| Create | `src/pages/about.astro` | About page composing all sections |

---

## Task 1: Fix global.css — Tailwind v4 @theme + Class Dark Mode

**Files:**
- Modify: `src/styles/global.css`

The current file uses HSL variables (`--background`, `--foreground`) and `@media (prefers-color-scheme: dark)`. We need Tailwind v4 `@theme` with oklch tokens, class-based dark mode (`.dark` on `html`), Google Fonts, keyframes, and all `@utility` classes from the original design.

- [ ] **Step 1: Read the current file**

Run: `cat src/styles/global.css`

- [ ] **Step 2: Replace global.css with the full Tailwind v4 version**

Write `src/styles/global.css` with this exact content:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import 'tailwindcss';

/* Class-based dark variant (html.dark) */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans:
    'DM Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Light mode — Cool Slate Gray + Sky Blue */
  --color-background: oklch(0.975 0.005 240);
  --color-foreground: oklch(0.12 0.01 240);
  --color-muted: oklch(0.52 0.01 240);
  --color-border: oklch(0.87 0.006 240);
  --color-secondary: oklch(0.94 0.004 240);
  --color-accent: oklch(0.53 0.15 220);
  --color-accent-hover: oklch(0.45 0.15 220);
  --color-surface: oklch(0.935 0.004 240);
  --color-highlight: oklch(0.7 0.09 220);

  /* Easing tokens */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Dark mode overrides — applied when html has .dark class */
.dark {
  --color-background: oklch(0.14 0.015 160);
  --color-foreground: oklch(0.95 0.005 80);
  --color-muted: oklch(0.58 0.01 140);
  --color-border: oklch(0.26 0.02 160);
  --color-secondary: oklch(0.18 0.015 160);
  --color-accent: oklch(0.7 0.09 160);
  --color-accent-hover: oklch(0.76 0.09 160);
  --color-surface: oklch(0.17 0.012 160);
  --color-highlight: oklch(0.55 0.07 160);
}

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-sans);
    line-height: 1.6;
  }

  ::selection {
    background: var(--color-accent);
    color: oklch(0.99 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* --- Keyframes --- */

@keyframes wipe-reveal {
  from {
    clip-path: inset(0 0 100% 0);
    opacity: 0.8;
  }
  to {
    clip-path: inset(0 0 0% 0);
    opacity: 1;
  }
}

@keyframes toast-in {
  from {
    transform: translateY(-110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* --- Utility classes --- */

@utility hatch-gutter {
  background-image: repeating-linear-gradient(
    45deg,
    var(--color-border) 0,
    var(--color-border) 1px,
    transparent 0,
    transparent 50%
  );
  background-size: 6px 6px;
}

@utility paper-grid {
  background-image:
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
  background-size: 36px 36px;
}

@utility soft-panel {
  @apply border-border bg-surface rounded-2xl border;
}

@utility glass-panel {
  background: color-mix(in oklch, var(--color-background) 70%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid color-mix(in oklch, var(--color-border) 70%, transparent);
  box-shadow:
    0 8px 32px oklch(0 0 0 / 0.07),
    inset 0 1px 0 oklch(1 0 0 / 0.12);
  border-radius: 1rem;
}

@utility glass-card {
  background: color-mix(in oklch, var(--color-background) 65%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid color-mix(in oklch, var(--color-border) 60%, transparent);
  box-shadow:
    0 4px 24px oklch(0 0 0 / 0.06),
    inset 0 1px 0 oklch(1 0 0 / 0.1);
  border-radius: 0.75rem;
}

@utility nav-shell {
  @apply border-border bg-background/95 rounded-2xl border backdrop-blur-sm;
}

@utility chapter-heading {
  @apply border-border mb-6 border-t pt-4;
}

@utility chapter-label {
  font-family: var(--font-mono);
  @apply text-muted text-xs tracking-[0.18em] uppercase;
}

@utility diff-tag {
  font-family: var(--font-mono);
  @apply border-border bg-secondary rounded-md border px-2.5 py-1 text-xs;
}

@utility colophon {
  font-family: var(--font-mono);
  @apply text-muted text-center text-xs tracking-[0.12em];
}

@utility title-display {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.95;
}

@utility title-accent {
  font-style: italic;
}

@utility eyebrow {
  @apply text-accent text-xs font-semibold tracking-[0.14em] uppercase;
}

@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@layer components {
  .nav-link {
    @apply text-muted relative inline-flex items-center rounded px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase;
    transition: all 0.2s var(--ease-out-quart);
  }

  .nav-link:hover {
    @apply text-foreground bg-secondary;
  }

  .nav-link.is-active {
    @apply text-foreground border-accent border-b;
  }
}
```

- [ ] **Step 3: Run dev server and visually verify colors are correct**

Run: `npm run dev` — navigate to http://localhost:4321, toggle dark/light mode, confirm text and background colors match the original Cool Slate Gray palette.

- [ ] **Step 4: Run build to confirm no CSS errors**

Run: `npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "fix(styles): migrate global.css to Tailwind v4 @theme with oklch and class dark mode"
```

---

## Task 2: Create src/data/experience.ts

**Files:**
- Create: `src/data/experience.ts`

This file holds all static content for the Experience page. Keeping data separate from the template makes the page file readable and makes future CMS migration easy.

- [ ] **Step 1: Write the failing test**

Create `tests/data/experience.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { education, experiences, projects, skillCategories } from '@/data/experience'

describe('experience data', () => {
  it('has at least one work experience', () => {
    expect(experiences.length).toBeGreaterThan(0)
  })

  it('each experience has required fields', () => {
    for (const exp of experiences) {
      expect(exp.role).toBeTruthy()
      expect(exp.company).toBeTruthy()
      expect(exp.period).toBeTruthy()
      expect(exp.bullets.length).toBeGreaterThan(0)
      expect(exp.stack.length).toBeGreaterThan(0)
    }
  })

  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('education has required fields', () => {
    expect(education.institution).toBeTruthy()
    expect(education.degree).toBeTruthy()
    expect(education.period).toBeTruthy()
    expect(education.gpa).toBeTruthy()
  })

  it('has at least one skill category', () => {
    expect(skillCategories.length).toBeGreaterThan(0)
  })

  it('each skill category has items', () => {
    for (const cat of skillCategories) {
      expect(cat.label).toBeTruthy()
      expect(cat.items.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/data/experience.test.ts`
Expected: FAIL — "Cannot find module '@/data/experience'"

- [ ] **Step 3: Create src/data/experience.ts**

```typescript
export interface WorkExperience {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
  stack: string[]
}

export interface Project {
  title: string
  company: string
  period: string
  bullets: string[]
  stack: string[]
}

export interface Education {
  institution: string
  degree: string
  location: string
  period: string
  gpa: string
}

export interface SkillCategory {
  label: string
  icon: string
  items: string[]
}

export const experiences: WorkExperience[] = [
  {
    role: 'Software Engineer',
    company: 'PT. Pegadaian',
    location: 'Jakarta Pusat, Indonesia',
    period: 'May 2023 – Present',
    bullets: [
      'Translated business requirements into technical specifications and implemented robust, user-friendly interfaces.',
      "Contributed to the continuous evolution of Pegadaian's digital landscape by extending and enhancing application functionalities.",
      'Engaged with a diverse range of projects, including the CSR Web App, B2B Web App, and Microsite Pinjaman.',
    ],
    stack: ['Vue.js', 'Pinia', 'TypeScript', 'NestJS', 'Redis', 'PHP', 'Codeigniter 3', 'PostgreSQL', 'SCSS'],
  },
  {
    role: 'Web Development',
    company: 'Freelance',
    location: 'Pekanbaru, Indonesia',
    period: 'Sep 2021 – Jan 2023',
    bullets: [
      'Developed responsive and user-friendly web applications using React.js, Node.js, and Express.js.',
      'Integrated web applications with databases such as MongoDB, MySQL, and PostgreSQL.',
      'Used front-end frameworks such as React.js, Material UI, and Tailwind to create engaging user interfaces.',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Tailwind', 'Material UI'],
  },
  {
    role: 'Web Development',
    company: 'PT. Sumatera Kalimantan Jaya',
    location: 'Pekanbaru, Indonesia',
    period: 'Apr 2021 – Jul 2021',
    bullets: [
      'Designed and implemented a Profile Company website using Codeigniter in 14 days.',
      "Implemented MPOS application to regulate the sale and stock of the company's products with a 3-person team.",
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Codeigniter', 'Bootstrap'],
  },
]

export const projects: Project[] = [
  {
    title: 'Singel APP (Pegadaian Kita)',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Present',
    bullets: [
      'Built modular and reusable frontend components based on UI/UX team specifications using Vue 3 Composition API and Tailwind CSS.',
      'Actively contributed to a company-wide Micro-Frontend Architecture, allowing multiple teams to work in parallel and independently deploy features.',
      'Ensured seamless integration with microservice-based backends, collaborating closely with backend teams to define and consume APIs.',
      'Developed and maintained unit tests using Vitest, consistently achieving ≥80% code coverage.',
      'Advocated for clean code practices and component-driven development.',
    ],
    stack: ['Vue 3', 'NestJS', 'Tailwind', 'PostgreSQL', 'Redis', 'Vee-validate', 'Zod', 'Pinia', 'Vitest'],
  },
  {
    title: 'Microsite Pinjaman Pegadaian',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      'Revamped legacy CodeIgniter 3 monolith into a scalable NestJS microservices architecture for the loan lead generation platform.',
      'Designed and architected 9 backend services using Factory pattern, enabling dynamic support for Kredit Usaha Rakyat, Serba Guna, and Cicil Kendaraan.',
      'Developed and maintained comprehensive unit testing, achieving high test coverage to reduce regression.',
      'Created clear and structured technical documentation for knowledge transfer.',
      'Integrated with App Mitra Pegadaian.',
    ],
    stack: ['Vue.js', 'Pinia', 'TypeScript', 'NestJS', 'Redis', 'PHP', 'Codeigniter 3', 'PostgreSQL', 'Crontab'],
  },
  {
    title: 'KAMILA Application',
    company: 'PT. Pegadaian',
    period: 'May 2023 – Present',
    bullets: [
      'Developed and maintained the FE and BE, ensuring a responsive, intuitive user interface for internal Pegadaian employees.',
      'Developed backend modules for marketing progress tracking, marketing plans, and weekly marketing reporting.',
      'Built a backend module to manage employee KPI tracking, enabling performance measurement and evaluation.',
      "Continued development of the loan lead submission feature from Pegadaian's external business partners.",
    ],
    stack: ['ExpressJS', 'ReactJS', 'Tailwind', 'PostgreSQL', 'Redis', 'TypeORM', 'Redux', 'Node.js'],
  },
  {
    title: 'Reconciliation System (AIRA)',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      'Continued development of the reconciliation transaction module for integration with additional partner banks.',
      "Ensured reconciliation processes are compatible and consumable by Pegadaian's core banking services.",
      "Verified that reconciled transaction journal entries comply with the accounting division's standards.",
    ],
    stack: ['PHP 5', 'PHP Native', 'SFTP', 'VM'],
  },
  {
    title: 'Thesis — Chatbot Kukerta Information System',
    company: 'Universitas Riau',
    period: '2020',
    bullets: [
      'Created a conversation application with the kukerta admin using fuzzy string matching, achieving 80% question match rate.',
      'Designed and implemented a dialogue dataset of 3,000 questionnaire entries processed for chatbot knowledge in 1 month.',
    ],
    stack: ['Python', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Flask', 'Bootstrap'],
  },
]

export const education: Education = {
  institution: 'Universitas Riau',
  degree: 'Bachelor of Informatics Engineering',
  location: 'Pekanbaru, Indonesia',
  period: 'Sep 2016 – Oct 2020',
  gpa: '3.69 / 4.00',
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Frameworks',
    icon: 'code-2',
    items: ['Vue.js', 'React.js', 'Node.js', 'NestJS', 'Express.js'],
  },
  {
    label: 'Languages & Styling',
    icon: 'book-open',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Tailwind CSS', 'SCSS', 'HTML/CSS'],
  },
  {
    label: 'Databases & Infrastructure',
    icon: 'cpu',
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'Docker', 'GitLab CI'],
  },
  {
    label: 'Developer Tools',
    icon: 'wrench',
    items: ['Git', 'Postman', 'Jenkins', 'Vitest', 'Jest', 'Vite', 'ESLint', 'Biome'],
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/data/experience.test.ts`
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/experience.ts tests/data/experience.test.ts
git commit -m "feat(data): add typed experience, projects, education, and skills data"
```

---

## Task 3: Create src/data/skills.ts

**Files:**
- Create: `src/data/skills.ts`

SkillsMatrix data lives here so the Astro component stays declarative.

- [ ] **Step 1: Write the failing test**

Create `tests/data/skills.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { skillGroups } from '@/data/skills'

describe('skills data', () => {
  it('has 4 skill groups', () => {
    expect(skillGroups).toHaveLength(4)
  })

  it('each group has a label and at least one skill', () => {
    for (const group of skillGroups) {
      expect(group.label).toBeTruthy()
      expect(group.skills.length).toBeGreaterThan(0)
    }
  })

  it('each skill has name and icon', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.name).toBeTruthy()
        expect(skill.icon).toBeTruthy()
      }
    }
  })

  it('icon values are valid skillicons.dev slugs (no spaces, lowercase)', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.icon).toMatch(/^[a-z0-9]+$/)
      }
    }
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/data/skills.test.ts`
Expected: FAIL — "Cannot find module '@/data/skills'"

- [ ] **Step 3: Create src/data/skills.ts**

```typescript
export interface Skill {
  name: string
  icon: string
}

export interface SkillGroup {
  label: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frameworks',
    skills: [
      { name: 'Vue 3', icon: 'vue' },
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express', icon: 'express' },
    ],
  },
  {
    label: 'Languages & Styling',
    skills: [
      { name: 'TypeScript', icon: 'ts' },
      { name: 'JavaScript', icon: 'js' },
      { name: 'Tailwind', icon: 'tailwind' },
      { name: 'CSS', icon: 'css' },
      { name: 'HTML', icon: 'html' },
      { name: 'PHP', icon: 'php' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    label: 'Databases & Infrastructure',
    skills: [
      { name: 'PostgreSQL', icon: 'postgres' },
      { name: 'Redis', icon: 'redis' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'GitLab', icon: 'gitlab' },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Postman', icon: 'postman' },
      { name: 'Jenkins', icon: 'jenkins' },
      { name: 'Redux', icon: 'redux' },
      { name: 'Bootstrap', icon: 'bootstrap' },
      { name: 'Flask', icon: 'flask' },
      { name: 'Jest', icon: 'jest' },
      { name: 'Vitest', icon: 'vitest' },
    ],
  },
]
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/data/skills.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/data/skills.ts tests/data/skills.test.ts
git commit -m "feat(data): add typed skill groups data for SkillsMatrix"
```

---

## Task 4: Extract GitHub Utility Functions (TDD)

**Files:**
- Create: `src/utils/github.ts`
- Create: `tests/utils/github.test.ts`

Extract the pure functions from the original `useGitHub.ts` Vue composable into framework-agnostic utilities. These are fully testable with no DOM or API dependencies.

- [ ] **Step 1: Write failing tests**

Create `tests/utils/github.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalContributions,
  generateMockContributions,
  getContributionLevel,
} from '@/utils/github'
import type { ContributionDay } from '@/utils/github'

describe('getContributionLevel', () => {
  it('returns 0 for zero contributions', () => {
    expect(getContributionLevel(0)).toBe(0)
  })

  it('returns 1 for 1-2 contributions', () => {
    expect(getContributionLevel(1)).toBe(1)
    expect(getContributionLevel(2)).toBe(1)
  })

  it('returns 2 for 3-4 contributions', () => {
    expect(getContributionLevel(3)).toBe(2)
    expect(getContributionLevel(4)).toBe(2)
  })

  it('returns 3 for 5-6 contributions', () => {
    expect(getContributionLevel(5)).toBe(3)
    expect(getContributionLevel(6)).toBe(3)
  })

  it('returns 4 for 7+ contributions', () => {
    expect(getContributionLevel(7)).toBe(4)
    expect(getContributionLevel(20)).toBe(4)
  })
})

describe('calculateTotalContributions', () => {
  it('returns 0 for empty calendar', () => {
    expect(calculateTotalContributions([])).toBe(0)
  })

  it('sums all contribution counts', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 3, level: 2 },
      { date: '2025-01-02', count: 0, level: 0 },
      { date: '2025-01-03', count: 5, level: 3 },
    ]
    expect(calculateTotalContributions(calendar)).toBe(8)
  })
})

describe('calculateCurrentStreak', () => {
  it('returns 0 when last day has no contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 5, level: 3 },
      { date: '2025-01-02', count: 0, level: 0 },
    ]
    expect(calculateCurrentStreak(calendar)).toBe(0)
  })

  it('counts consecutive days from the end with contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 0, level: 0 },
      { date: '2025-01-02', count: 3, level: 2 },
      { date: '2025-01-03', count: 5, level: 3 },
      { date: '2025-01-04', count: 2, level: 1 },
    ]
    expect(calculateCurrentStreak(calendar)).toBe(3)
  })

  it('returns 0 for empty calendar', () => {
    expect(calculateCurrentStreak([])).toBe(0)
  })
})

describe('calculateLongestStreak', () => {
  it('returns 0 for empty calendar', () => {
    expect(calculateLongestStreak([])).toBe(0)
  })

  it('finds longest run of days with contributions', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 2, level: 1 },
      { date: '2025-01-02', count: 2, level: 1 },
      { date: '2025-01-03', count: 0, level: 0 },
      { date: '2025-01-04', count: 1, level: 1 },
      { date: '2025-01-05', count: 3, level: 2 },
      { date: '2025-01-06', count: 4, level: 2 },
      { date: '2025-01-07', count: 2, level: 1 },
    ]
    expect(calculateLongestStreak(calendar)).toBe(4)
  })

  it('handles all-zero calendar', () => {
    const calendar: ContributionDay[] = [
      { date: '2025-01-01', count: 0, level: 0 },
      { date: '2025-01-02', count: 0, level: 0 },
    ]
    expect(calculateLongestStreak(calendar)).toBe(0)
  })
})

describe('generateMockContributions', () => {
  it('returns exactly 365 entries', () => {
    const result = generateMockContributions()
    expect(result).toHaveLength(365)
  })

  it('each entry has date, count, and level', () => {
    const result = generateMockContributions()
    for (const day of result) {
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof day.count).toBe('number')
      expect([0, 1, 2, 3, 4]).toContain(day.level)
    }
  })

  it('level matches count via getContributionLevel', () => {
    const result = generateMockContributions()
    for (const day of result) {
      expect(day.level).toBe(getContributionLevel(day.count))
    }
  })
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/utils/github.test.ts`
Expected: FAIL — "Cannot find module '@/utils/github'"

- [ ] **Step 3: Create src/utils/github.ts**

```typescript
export interface GitHubStats {
  totalContributions: number
  currentStreak: number
  longestStreak: number
  publicRepos: number
  followers: number
  contributionCalendar: ContributionDay[]
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 6) return 3
  return 4
}

export function calculateTotalContributions(calendar: ContributionDay[]): number {
  return calendar.reduce((sum, day) => sum + day.count, 0)
}

export function calculateCurrentStreak(calendar: ContributionDay[]): number {
  let streak = 0
  for (let i = calendar.length - 1; i >= 0; i--) {
    if (calendar[i].count > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function calculateLongestStreak(calendar: ContributionDay[]): number {
  let maxStreak = 0
  let currentStreak = 0
  for (const day of calendar) {
    if (day.count > 0) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  return maxStreak
}

export function generateMockContributions(): ContributionDay[] {
  const contributions: ContributionDay[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseCount = isWeekend
      ? Math.floor(Math.random() * 3)
      : Math.floor(Math.random() * 8)
    const count = Math.random() > 0.3 ? baseCount : 0

    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level: getContributionLevel(count),
    })
  }

  return contributions
}

const GITHUB_USERNAME = 'rickyfrdy'
const CACHE_KEY = 'github-stats-cache'
const CACHE_DURATION = 5 * 60 * 1000

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached) as { data: GitHubStats; timestamp: number }
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed.data
      }
    }
  } catch {
    // ignore corrupt cache
  }

  const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
  if (!userResponse.ok) {
    throw new Error('Failed to fetch GitHub user data')
  }
  const userData = (await userResponse.json()) as { public_repos: number; followers: number }

  const contributionCalendar = generateMockContributions()

  const stats: GitHubStats = {
    totalContributions: calculateTotalContributions(contributionCalendar),
    currentStreak: calculateCurrentStreak(contributionCalendar),
    longestStreak: calculateLongestStreak(contributionCalendar),
    publicRepos: userData.public_repos,
    followers: userData.followers,
    contributionCalendar,
  }

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: stats, timestamp: Date.now() }))
  } catch {
    // ignore storage errors
  }

  return stats
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/utils/github.test.ts`
Expected: PASS — 14 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/utils/github.ts tests/utils/github.test.ts
git commit -m "feat(utils): extract github contribution utilities with full test coverage"
```

---

## Task 5: Create SkillsMatrix.astro

**Files:**
- Create: `src/components/about/SkillsMatrix.astro`

Pure Astro component — no JavaScript. Renders skill icon images from skillicons.dev. The `title` attribute on each `<img>` provides accessible tooltip-equivalent text.

- [ ] **Step 1: Create the component**

```astro
---
import { skillGroups } from '@/data/skills'

function iconUrl(icon: string): string {
  return `https://skillicons.dev/icons?i=${icon}`
}
---

<div class="space-y-7 px-4 pb-8">
  {
    skillGroups.map((group) => (
      <div>
        <p class="text-muted mb-3 font-mono text-[10px] tracking-[0.16em] uppercase">
          {group.label}
        </p>
        <div class="flex flex-wrap gap-3">
          {group.skills.map((skill) => (
            <div class="group flex flex-col items-center gap-1.5">
              <div class="glass-card flex h-12 w-12 items-center justify-center p-1.5 transition-transform duration-200 group-hover:-translate-y-0.5">
                <img
                  src={iconUrl(skill.icon)}
                  alt={skill.name}
                  title={skill.name}
                  class="h-full w-full object-contain"
                  loading="lazy"
                  width="40"
                  height="40"
                />
              </div>
              <span class="text-muted font-mono text-[9px] tracking-[0.06em]">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    ))
  }
</div>
```

- [ ] **Step 2: Run astro check to verify no type errors**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/SkillsMatrix.astro
git commit -m "feat(components): add SkillsMatrix Astro component with skillicons.dev icons"
```

---

## Task 6: Create GitHubHeatmap.tsx React Island

**Files:**
- Create: `src/components/about/GitHubHeatmap.tsx`

React component hydrated with `client:visible`. Fetches GitHub stats (with localStorage cache), renders contribution heatmap grid. Shows skeleton on load, error state on failure.

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useState } from 'react'
import { fetchGitHubStats } from '@/utils/github'
import type { ContributionDay, GitHubStats } from '@/utils/github'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getColorClass(level: number): string {
  const colors: Record<number, string> = {
    0: 'bg-muted/30',
    1: 'bg-accent/30',
    2: 'bg-accent/50',
    3: 'bg-accent/70',
    4: 'bg-accent',
  }
  return colors[level] ?? colors[0]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function groupByWeek(calendar: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7))
  }
  return weeks
}

export default function GitHubHeatmap() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGitHubStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const weeks = stats ? groupByWeek(stats.contributionCalendar) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted">Consistency and commitment to continuous learning</p>
        </div>
        {stats && (
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-accent text-2xl font-bold">{stats.totalContributions}</div>
              <div className="text-muted">Total Contributions</div>
            </div>
            <div>
              <div className="text-accent text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-muted">Current Streak</div>
            </div>
            <div>
              <div className="text-accent text-2xl font-bold">{stats.longestStreak}</div>
              <div className="text-muted">Longest Streak</div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="bg-muted/30 h-4 w-full rounded" />
          <div className="bg-muted/30 h-32 w-full rounded" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-500">Failed to load GitHub data: {error}</p>
          <button onClick={load} className="text-accent mt-2 text-sm hover:underline">
            Try again
          </button>
        </div>
      )}

      {!loading && stats && (
        <div className="overflow-x-auto pb-4 scrollbar-none">
          <div className="inline-block min-w-full">
            <div className="text-muted mb-2 flex pl-8 text-xs">
              {MONTHS.map((month) => (
                <div key={month} className="flex-none" style={{ width: `${100 / 12}%` }}>
                  {month}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              <div className="text-muted flex flex-col justify-around gap-1 pr-2 text-xs">
                <div>Mon</div>
                <div>Wed</div>
                <div>Fri</div>
              </div>

              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`${getColorClass(day.level)} hover:ring-accent h-3 w-3 cursor-pointer rounded-sm transition-all hover:scale-125 hover:ring-2`}
                        title={`${day.count} contributions on ${formatDate(day.date)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-muted mt-4 flex items-center gap-2 text-xs">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`${getColorClass(level)} h-3 w-3 rounded-sm`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="text-center">
          <a
            href="https://github.com/rickyfrdy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent inline-flex items-center gap-2 text-sm hover:underline"
          >
            View full profile on GitHub
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run astro check**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/GitHubHeatmap.tsx
git commit -m "feat(components): add GitHubHeatmap React island with caching and error state"
```

---

## Task 7: Create src/pages/experience.astro

**Files:**
- Create: `src/pages/experience.astro`

Zero-JS Experience page. Work experience uses `<details>/<summary>` for accordion behavior (browser-native, keyboard accessible). Projects and education render as flat sections.

- [ ] **Step 1: Create the page**

```astro
---
import { experiences, projects, education, skillCategories } from '@/data/experience'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="Experience — Ricki Friadi"
  description="Work history, projects, education, and skills of Ricki Friadi — Software Engineer at PT. Pegadaian since May 2023."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Experience</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Career, Projects &amp;<br />
      <span class="title-accent text-accent">Skills.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Software Engineer at PT. Pegadaian since May 2023, working across microservices, micro-frontends, and internal tooling.
    </p>
  </section>

  <!-- § 01 — Work Experience -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Work Experience</span>
    </div>

    <div class="divide-border divide-y px-4">
      {
        experiences.map((exp) => (
          <details class="group py-6">
            <summary class="flex cursor-pointer list-none items-start justify-between gap-4 focus-visible:outline-none">
              <div class="flex-1">
                <div class="flex flex-wrap items-baseline gap-2">
                  <span class="text-foreground font-semibold">{exp.role}</span>
                  <span class="diff-tag">{exp.company}</span>
                </div>
                <p class="text-muted mt-1 text-xs">{exp.location} · {exp.period}</p>
              </div>
              <svg
                class="text-muted mt-1 h-4 w-4 flex-shrink-0 rotate-0 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div class="mt-4 space-y-4">
              <ul class="text-muted space-y-2 text-sm">
                {exp.bullets.map((bullet) => (
                  <li class="flex gap-2">
                    <span class="text-accent mt-1 flex-shrink-0">›</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div class="flex flex-wrap gap-1.5">
                {exp.stack.map((tech) => (
                  <span class="diff-tag">{tech}</span>
                ))}
              </div>
            </div>
          </details>
        ))
      }
    </div>
  </section>

  <!-- § 02 — Project Experience -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Project Experience</span>
    </div>

    <div class="divide-border divide-y px-4">
      {
        projects.map((proj) => (
          <details class="group py-6">
            <summary class="flex cursor-pointer list-none items-start justify-between gap-4 focus-visible:outline-none">
              <div class="flex-1">
                <div class="flex flex-wrap items-baseline gap-2">
                  <span class="text-foreground font-semibold">{proj.title}</span>
                  <span class="diff-tag">{proj.company}</span>
                </div>
                <p class="text-muted mt-1 text-xs">{proj.period}</p>
              </div>
              <svg
                class="text-muted mt-1 h-4 w-4 flex-shrink-0 rotate-0 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div class="mt-4 space-y-4">
              <ul class="text-muted space-y-2 text-sm">
                {proj.bullets.map((bullet) => (
                  <li class="flex gap-2">
                    <span class="text-accent mt-1 flex-shrink-0">›</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div class="flex flex-wrap gap-1.5">
                {proj.stack.map((tech) => (
                  <span class="diff-tag">{tech}</span>
                ))}
              </div>
            </div>
          </details>
        ))
      }
    </div>
  </section>

  <!-- § 03 — Education -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 03 — Education</span>
    </div>

    <div class="px-4 pb-8">
      <div class="flex flex-wrap items-baseline gap-2">
        <span class="text-foreground font-semibold">{education.degree}</span>
        <span class="diff-tag">{education.institution}</span>
      </div>
      <p class="text-muted mt-1 text-xs">{education.location} · {education.period}</p>
      <p class="text-muted mt-2 text-sm">GPA: <span class="text-foreground font-semibold">{education.gpa}</span></p>
    </div>
  </section>

  <!-- § 04 — Skills -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 04 — Skills</span>
    </div>

    <div class="px-4 pb-8">
      {
        skillCategories.map((cat) => (
          <div class="mb-6">
            <p class="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">
              {cat.label}
            </p>
            <div class="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span class="diff-tag">{item}</span>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Start dev server and verify the page**

Run: `npm run dev` — navigate to http://localhost:4321/experience

Verify:
- Hero section renders with eyebrow, h1 title-display, muted subtitle
- Work experience items open/close on click using native `<details>` 
- Chevron rotates when `details` is open (`.group-open:rotate-180`)
- Stack tags render as `diff-tag` pills
- Education and skills sections render at the bottom
- Dark mode toggle works correctly (colors switch)

- [ ] **Step 4: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat(pages): add /experience page with native details/summary accordion"
```

---

## Task 8: Create src/pages/about.astro

**Files:**
- Create: `src/pages/about.astro`

About page with hero, story, annotation notes, SkillsMatrix (static Astro), and GitHubHeatmap (React island with `client:visible`).

- [ ] **Step 1: Create the page**

```astro
---
import GitHubHeatmap from '@/components/about/GitHubHeatmap'
import SkillsMatrix from '@/components/about/SkillsMatrix.astro'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="About — Ricki Friadi"
  description="Learn about my journey as a fullstack developer — from freelancing to building microservices and Micro-Frontend Architecture at PT. Pegadaian."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">About</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Building Systems With<br />
      <span class="title-accent text-accent">Human-First Clarity.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      A fullstack developer focused on reliable architecture, maintainable code, and interfaces
      that feel intentional.
    </p>
  </section>

  <!-- § 01 — My Story -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — My Story</span>
    </div>

    <div class="space-y-4 px-4 pb-8 text-sm leading-relaxed">
      <p>
        My journey into web development started in 2021 when I joined PT. Sumatera Kalimantan Jaya
        as an intern and shipped a full company profile website in 14 days. That early deadline
        pressure taught me to build fast and iterate — a habit that's stayed with me.
      </p>
      <p>
        After freelancing with
        <span class="text-foreground font-semibold">React, Node.js, and Express</span> for nearly
        two years — integrating MongoDB, MySQL, and PostgreSQL backends for diverse clients — I
        joined <span class="text-foreground font-semibold">PT. Pegadaian</span> in May 2023 as a
        Software Engineer, working on the CSR Web App, B2B Web App, and internal tooling.
      </p>
      <p>
        Since 2024 I've been deep in microservices and Micro-Frontend territory — revamping a
        legacy CodeIgniter monolith into 9 NestJS microservices using the Factory pattern, and
        contributing to a company-wide Micro-Frontend Architecture that lets multiple teams deploy
        independently. I maintain ≥80% unit test coverage with Vitest across all my modules.
      </p>
      <p>
        I use <span class="text-foreground font-semibold">TypeScript</span> as my core language
        across the stack. On the frontend I reach for Vue 3 or React. On the backend, NestJS and
        Express. I care about CI/CD hygiene, clean code, and building things that are actually
        testable.
      </p>
    </div>

    <!-- Annotation notes -->
    <div class="border-border border-t px-4 pb-8">
      <p class="eyebrow mt-6 mb-4">§ Notes</p>
      <div class="space-y-4">
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
            Clean Code Philosophy
          </p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Code is read more than it's written. Every line should be intentional, clear, and
            maintainable for the next developer.
          </p>
        </div>
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
            Performance Matters
          </p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Users expect fast, responsive applications. I optimize every layer — from database
            queries to frontend rendering.
          </p>
        </div>
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
            User-Centric Approach
          </p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Technology is just a tool. What matters is solving real problems for real people in
            ways that make their lives easier.
          </p>
        </div>
        <div class="border-accent/40 border-l-2 pl-4">
          <p class="text-foreground mb-2 text-xs font-semibold tracking-[0.1em] uppercase">
            Beyond Code
          </p>
          <ul class="text-muted space-y-1 text-sm">
            <li>Love listening to music while coding</li>
            <li>Active in developer communities and open source</li>
            <li>Currently exploring serverless architecture</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- § 02 — Skills -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Skills</span>
    </div>
    <SkillsMatrix />
  </section>

  <!-- § 03 — GitHub Activity -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 03 — GitHub Activity</span>
    </div>
    <div class="px-4 pb-6">
      <GitHubHeatmap client:visible />
    </div>
  </section>

  <!-- Final CTA -->
  <section class="px-4 py-12 text-center">
    <p class="eyebrow mb-4">Collaboration</p>
    <h2 class="title-display" style="font-size: clamp(1.8rem, 5vw, 3rem)">
      Let's Build Something Together
    </h2>
    <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
      I'm always interested in hearing about new projects and opportunities.
    </p>
    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href="/contact"
        class="bg-accent text-background hover:bg-accent-hover inline-flex h-10 items-center rounded-lg px-6 text-sm font-medium transition-colors"
      >
        Get In Touch
      </a>
      <a
        href="/projects"
        class="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
      >
        View My Projects
      </a>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Verify the about page in browser**

Run: `npm run dev` — navigate to http://localhost:4321/about

Verify:
- Hero renders with `title-display` font (Cormorant Garamond)
- Story paragraphs render correctly
- `§ Notes` annotation section with left borders renders
- SkillsMatrix shows skill icon grids in 4 groups
- GitHubHeatmap loads after the section enters viewport (`client:visible`)
- Heatmap shows loading skeleton initially, then fills in
- Dark/light toggle applies correct colors (oklch values)
- CTA buttons link to `/contact` and `/projects`

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat(pages): add /about page with story, SkillsMatrix, and GitHubHeatmap island"
```

---

## Task 9: Final Verification — Lint, Tests, Build

**Files:** (no new files — verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass. Should include:
- `tests/utils/cn.test.ts` — 4 passing
- `tests/stores/theme.test.ts` — 13 passing
- `tests/data/experience.test.ts` — 6 passing
- `tests/data/skills.test.ts` — 4 passing
- `tests/utils/github.test.ts` — 14 passing

Total: 41+ tests passing, 0 failing.

- [ ] **Step 2: Run Biome linter on all TS/TSX files**

Run: `npx biome check src/`
Expected: 0 errors. If errors: `npx biome check --write --unsafe src/` to auto-fix.

- [ ] **Step 3: Run ESLint on Astro files**

Run: `npx eslint --config eslint.astro.config.js "src/**/*.astro"`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Run astro check (TypeScript)**

Run: `npx astro check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Run production build**

Run: `npm run build`
Expected: Build succeeds. Output includes:
- `dist/experience/index.html`
- `dist/about/index.html`
- `dist/sitemap-index.xml`
- `dist/robots.txt`

- [ ] **Step 6: Delete the test lint file from Phase 0**

Run: `rm src/pages/__test_lint.astro` if it still exists (it was a temporary file from Phase 0).

Run `git status` — if the file exists and was committed, commit its removal:

```bash
git rm src/pages/__test_lint.astro
git commit -m "chore: remove Phase 0 test lint page"
```

- [ ] **Step 7: Final commit if any auto-fixes were applied**

If `biome check --write` changed files:
```bash
git add -p  # stage only linting fixes
git commit -m "style: apply Biome formatting fixes to Phase 1 files"
```

---

## Self-Review

**Spec coverage:**
- ✅ global.css migrated to Tailwind v4 @theme + oklch + class dark mode + fonts + all utility classes
- ✅ `/experience` page with accordion (details/summary, zero JS)
- ✅ `/about` page with story, notes, SkillsMatrix, GitHubHeatmap island, CTA
- ✅ SkillsMatrix.astro — pure Astro, skillicons.dev, no React island needed
- ✅ GitHubHeatmap.tsx — React island with `client:visible` lazy hydration
- ✅ `src/utils/github.ts` — all pure functions extracted and fully tested
- ✅ `src/data/experience.ts` — all 3 work experiences, 5 projects, education, 4 skill categories
- ✅ `src/data/skills.ts` — 4 groups with 26 skills total

**Type consistency:**
- `ContributionDay` interface defined in `src/utils/github.ts` and imported in `GitHubHeatmap.tsx`
- `SkillGroup`/`Skill` types defined in `src/data/skills.ts` and imported in `SkillsMatrix.astro`
- `WorkExperience`, `Project`, `Education`, `SkillCategory` defined in `src/data/experience.ts` and used in `experience.astro`

**Placeholder check:** No TBDs or TODOs. All code blocks are complete.
