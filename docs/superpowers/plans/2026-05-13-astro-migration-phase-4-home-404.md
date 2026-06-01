# Phase 4 — Home Page & 404 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "coming soon" placeholder on `/` with a full portfolio home page, and fix `/404` which still uses legacy HSL class syntax.

**Architecture:** Both pages are pure Astro SSG — no React islands needed. The home page pulls data at build time from `src/data/projects.ts` (top 3 projects) and `getCollection('blog')` (latest 2 posts). Sections follow the same `border-b` chapter layout established across all other pages. The 404 page is a minimal one-task fix to replace `hsl(var(--x))` classes with v4 semantic tokens.

**Tech Stack:** Astro 6 (SSG, `getCollection`), Tailwind v4 custom utilities (`eyebrow`, `title-display`, `title-accent`, `chapter-heading`, `chapter-label`, `diff-tag`, `glass-card`), no JS islands.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/pages/404.astro` | Fix legacy HSL arbitrary classes → v4 semantic |
| Modify | `src/pages/index.astro` | Full portfolio home page with 5 sections |

---

## Task 1: Fix 404.astro

**Context:** The current 404 page uses `text-[hsl(var(--muted-foreground))]` and `bg-[hsl(var(--primary))]` — both legacy tokens that don't exist in the Tailwind v4 `@theme`. The correct v4 equivalents are `text-muted` and `bg-accent text-background`. The page must have `404` in the title and a link back to `/`.

**Files:**
- Modify: `src/pages/404.astro`

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/404.astro
```

- [ ] **Step 2: Rewrite `src/pages/404.astro`**

Write the file with this exact content:

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="404 — Page Not Found"
  description="The page you're looking for doesn't exist."
>
  <section class="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p class="text-muted font-display text-[8rem] font-light leading-none tracking-tighter">
      404
    </p>
    <h1 class="text-foreground mt-2 text-xl font-semibold">Page not found</h1>
    <p class="text-muted mt-3 max-w-sm text-sm leading-relaxed">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div class="mt-8 flex gap-4">
      <a
        href="/"
        class="bg-accent text-background hover:bg-accent-hover inline-flex h-10 items-center rounded-lg px-6 text-sm font-medium transition-colors"
      >
        Go home
      </a>
      <a
        href="/projects"
        class="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
      >
        View projects
      </a>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 3: Run astro check (Node 24 required)**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro
git commit -m "fix(404): replace legacy HSL classes with Tailwind v4 semantic tokens"
```

---

## Task 2: Build the Home Page

**Context:**
- `src/data/projects.ts` exports `projects: Project[]`. Use `projects.slice(0, 3)` to get the first 3 (ordered by recency in the data file).
- `getCollection` is imported from `astro:content`. Returns blog entries with `.id` (not `.slug`), `.data.title`, `.data.description`, `.data.pubDate`, `.data.tags`, `.data.draft`.
- Filter drafts: `getCollection('blog', ({ data }) => !data.draft)`. Sort descending by `pubDate`. Take first 2.
- `categoryLabel` maps `'web-app'→'Web App'`, `'api'→'API'`, `'tool'→'Tool'`, `'open-source'→'Open Source'`.
- Available utility classes: `eyebrow`, `title-display`, `title-accent`, `chapter-heading`, `chapter-label`, `diff-tag`, `glass-card`, `hatch-gutter`, `paper-grid`.
- Semantic classes: `border-border`, `text-muted`, `text-foreground`, `text-accent`, `bg-background`, `bg-secondary`, `bg-accent`, `text-background`, `hover:bg-accent-hover`, `hover:text-accent`.

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read the current placeholder**

```bash
cat src/pages/index.astro
```

- [ ] **Step 2: Rewrite `src/pages/index.astro`**

Write the file with this exact content:

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
import { getCollection } from 'astro:content'

const featuredProjects = projects.slice(0, 3)

const recentPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 2)

const categoryLabel: Record<string, string> = {
  'web-app': 'Web App',
  api: 'API',
  tool: 'Tool',
  'open-source': 'Open Source',
}

const capabilities = [
  {
    area: 'Frontend',
    description: 'Component-driven UIs with Vue 3, React, and Astro. Micro-Frontend Architecture with Module Federation.',
    stack: ['Vue 3', 'React', 'Astro', 'TypeScript', 'Tailwind'],
  },
  {
    area: 'Backend',
    description: 'REST and event-driven APIs with NestJS and Node.js. PostgreSQL, Redis, and SFTP integrations.',
    stack: ['NestJS', 'Node.js', 'PostgreSQL', 'Redis', 'Express'],
  },
  {
    area: 'Architecture',
    description: 'Microservices with Factory pattern, contract-first API design enforced by Zod, GitLab CI pipelines.',
    stack: ['Microservices', 'Module Federation', 'Zod', 'Docker', 'GitLab CI'],
  },
]
---

<MainLayout
  title="Ricki Friadi — Fullstack Developer"
  description="Fullstack Developer specializing in Vue 3, NestJS microservices, and Micro-Frontend Architecture. Based in Jakarta, Indonesia."
>
  <!-- ─── Hero ─────────────────────────────────────────────────── -->
  <section class="border-border relative border-b px-4 py-16 md:py-24">
    <div class="paper-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
    <div class="relative">
      <p class="eyebrow mb-4">Fullstack Developer · Jakarta, Indonesia</p>
      <h1
        class="title-display max-w-3xl"
        style="font-size: clamp(3rem, 10vw, 6.5rem); line-height: 0.92"
      >
        Ricki<br />
        <span class="title-accent text-accent">Friadi.</span>
      </h1>
      <p class="text-muted mt-6 max-w-lg text-sm leading-relaxed">
        I build reliable fullstack systems — from Vue 3 micro-frontends and NestJS microservices
        to the architecture that keeps them maintainable at scale.
      </p>

      <!-- Availability badge -->
      <div class="mt-6 inline-flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span class="bg-accent relative inline-flex h-2 w-2 rounded-full" />
        </span>
        <span class="text-muted font-mono text-xs">Open to opportunities</span>
      </div>

      <!-- CTAs -->
      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="/projects"
          class="bg-accent text-background hover:bg-accent-hover inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
        >
          View My Work
        </a>
        <a
          href="/contact"
          class="border-border text-foreground hover:bg-secondary inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
        >
          Get in Touch
        </a>
      </div>
    </div>
  </section>

  <!-- ─── § 01 — Selected Work ─────────────────────────────────── -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Selected Work</span>
    </div>

    <div class="grid gap-px border-border divide-y px-4 pb-8 sm:grid-cols-1 md:grid-cols-3 md:divide-x md:divide-y-0">
      {featuredProjects.map((project) => (
        <a
          href={`/projects/${project.slug}`}
          class="group block py-6 no-underline md:px-6 md:first:pl-0 md:last:pr-0"
        >
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span class="diff-tag">{categoryLabel[project.category] ?? project.category}</span>
            <span class="diff-tag">{project.year}</span>
          </div>
          <h2 class="text-foreground group-hover:text-accent text-base font-semibold leading-snug transition-colors">
            {project.title}
          </h2>
          <p class="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
            {project.shortDescription}
          </p>
          {project.keyMetric && (
            <p class="text-accent mt-3 font-mono text-xs">{project.keyMetric}</p>
          )}
          <span class="text-accent mt-4 block font-mono text-xs">View case study →</span>
        </a>
      ))}
    </div>

    <div class="px-4 pb-8">
      <a
        href="/projects"
        class="text-muted hover:text-accent font-mono text-xs transition-colors"
      >
        All projects →
      </a>
    </div>
  </section>

  <!-- ─── § 02 — What I Build ──────────────────────────────────── -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — What I Build</span>
    </div>

    <div class="grid gap-px border-border divide-y px-4 pb-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {capabilities.map((cap, i) => (
        <div class="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
          <p class="text-muted font-mono text-[10px] uppercase tracking-widest">
            0{i + 1}
          </p>
          <h3 class="text-foreground mt-2 text-base font-semibold">{cap.area}</h3>
          <p class="text-muted mt-2 text-sm leading-relaxed">{cap.description}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            {cap.stack.map((s) => (
              <span class="diff-tag">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  <!-- ─── § 03 — Recent Writing ────────────────────────────────── -->
  {recentPosts.length > 0 && (
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — Recent Writing</span>
      </div>

      <div class="divide-border divide-y px-4">
        {recentPosts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class="group block py-6 no-underline"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-foreground group-hover:text-accent text-base font-semibold transition-colors">
                  {post.data.title}
                </h2>
                <p class="text-muted mt-1 line-clamp-1 text-sm leading-relaxed">
                  {post.data.description}
                </p>
              </div>
              <time
                datetime={post.data.pubDate.toISOString()}
                class="text-muted flex-shrink-0 font-mono text-xs"
              >
                {post.data.pubDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </time>
            </div>
          </a>
        ))}
      </div>

      <div class="px-4 pb-8">
        <a
          href="/blog"
          class="text-muted hover:text-accent font-mono text-xs transition-colors"
        >
          All articles →
        </a>
      </div>
    </section>
  )}

  <!-- ─── § 04 — Open to Work ──────────────────────────────────── -->
  <section class="border-border border-b px-4 py-12">
    <div class="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="eyebrow mb-2">Availability</p>
        <h2
          class="title-display"
          style="font-size: clamp(1.8rem, 4vw, 3rem); line-height: 0.95"
        >
          Open to<br />
          <span class="title-accent text-accent">New Roles.</span>
        </h2>
        <p class="text-muted mt-3 max-w-md text-sm leading-relaxed">
          Looking for fullstack or backend-focused positions. Strong preference for TypeScript,
          Vue / React, and NestJS stacks. Remote or Jakarta-based.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <a
          href="/contact"
          class="bg-accent text-background hover:bg-accent-hover inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
        >
          Start a Conversation
        </a>
        <a
          href="/experience"
          class="border-border text-foreground hover:bg-secondary inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
        >
          View Experience
        </a>
      </div>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 3: Run astro check (Node 24)**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 4: Build and verify the page exists**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -8
```
Expected: `14 page(s) built`, `/index.html` listed, `Complete!`

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): build full home page with hero, work, capabilities, blog, and CTA"
```

---

## Task 3: Final Verification

**Context:** Both new/updated pages must be in `dist/` and the full suite must stay green.

**Files:** none (verification only)

- [ ] **Step 1: Run all tests**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -6
```
Expected: `7 files`, `50 passed`

- [ ] **Step 2: Biome check**

```bash
npx biome check src/ 2>&1 | tail -5
```
Expected: `1 warning` (known suppression comment on `z` import in `content.config.ts`), 0 errors

- [ ] **Step 3: ESLint**

```bash
npx eslint --config eslint.astro.config.js "src/**/*.astro" 2>&1 | tail -3
```
Expected: no output

- [ ] **Step 4: Astro type check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 5: Production build**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -6
```
Expected: `14 page(s) built`, `Complete!`

- [ ] **Step 6: Verify key pages in dist**

```bash
ls dist/index.html dist/404.html
```
Expected: both files exist

- [ ] **Step 7: Commit if any unstaged changes**

Only run if `git status` shows changes:
```bash
git add -A && git commit -m "chore(phase4): verified — 50 tests, 0 errors, 14 pages built"
```
