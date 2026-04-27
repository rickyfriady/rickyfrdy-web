# Print Run Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the portfolio with an editorial "Print Run" aesthetic — left-rail nav, full-width hero, chapter headings, typographic project cards, editorial two-column About layout.

**Architecture:** Purely presentational changes — no new data flows, no new routes, no new components. Every file is either restyled in-place or fully rewritten. No files are created except tests. The investigation board (ProjectCTA, WorksPage) is explicitly untouched.

**Tech Stack:** Vue 3 + `<script setup lang="ts">`, Tailwind v4 (`@utility`), `@testing-library/vue`, Vitest, VueUse, `@vueuse/motion`

---

## File Map

| File                                                  | Action                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `src/style.css`                                       | Add 5 new `@utility` classes                                 |
| `src/components/layout/AppHeader.vue`                 | Full rewrite — left rail (desktop) + bottom tab bar (mobile) |
| `src/components/layout/MainLayout.vue`                | Add content offset classes (`lg:pl-[220px] pb-16 lg:pb-0`)   |
| `src/components/layout/AppFooter.vue`                 | Full rewrite — social icons + colophon line                  |
| `src/components/page/home/HomePage.vue`               | Hero restructure + section ordering + chapter headings       |
| `src/components/page/home/QuickStats.vue`             | Replace grid with horizontal data strip                      |
| `src/components/page/home/JourneyLab.vue`             | Add chapter heading + paper-grid atmosphere + bigger padding |
| `src/components/page/home/JourneyStrip.vue`           | Diff tags, v-year format, dotted left rule                   |
| `src/components/page/home/FeaturedProjects.vue`       | File-path header, conditional image, arrow metric            |
| `src/components/page/about/AboutPage.vue`             | Remove soft-panels, editorial two-column, annotation sidebar |
| `src/components/page/blog/BlogPage.vue`               | Replace posts list with coming-soon state                    |
| `tests/components/layout/AppHeader.test.ts`           | New — nav renders, active state                              |
| `tests/components/layout/AppFooter.test.ts`           | New — colophon + social links                                |
| `tests/components/page/home/FeaturedProjects.test.ts` | New — file-path, conditional image                           |
| `tests/components/page/blog/BlogPage.test.ts`         | Update — coming soon structure                               |

---

## Task 1: Global CSS — New Utility Classes

**Files:**

- Modify: `src/style.css`

- [ ] **Step 1: Add the 5 new utilities after the existing `@utility grain-overlay` block**

Open `src/style.css`. After the existing `@utility grain-overlay` block (line ~112), add:

```css
@utility chapter-heading {
  @apply border-border mb-8 border-t pt-5;
}

@utility chapter-label {
  font-family: var(--font-mono);
  @apply text-muted text-xs tracking-[0.18em] uppercase;
}

@utility editorial-grid {
  @apply grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.45fr];
}

@utility diff-tag {
  font-family: var(--font-mono);
  @apply border-border bg-secondary rounded-md border px-2.5 py-1 text-xs;
}

@utility colophon {
  font-family: var(--font-mono);
  @apply text-muted text-center text-xs tracking-[0.12em];
}
```

- [ ] **Step 2: Run the dev server to confirm no CSS errors**

```bash
bun run dev
```

Expected: server starts at `http://localhost:5173`, no Tailwind errors in console.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: add Print Run CSS utility classes"
```

---

## Task 2: AppHeader — Left Rail + Bottom Tab Bar

**Files:**

- Modify: `src/components/layout/AppHeader.vue`
- Create: `tests/components/layout/AppHeader.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/components/layout/AppHeader.test.ts`:

```typescript
import AppHeader from '@/components/layout/AppHeader.vue'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

function makeRouter(path = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/about', component: { template: '<div />' } },
      { path: '/works', component: { template: '<div />' } },
      { path: '/projects', component: { template: '<div />' } },
      { path: '/contact', component: { template: '<div />' } }
    ]
  })
  router.push(path)
  return router
}

describe('AppHeader', () => {
  it('renders logo text', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getByText('Ricki')).toBeInTheDocument()
    expect(screen.getByText('Friadi')).toBeInTheDocument()
  })

  it('renders all 5 nav links', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /about/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /works/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /projects/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /contact/i })[0]).toBeInTheDocument()
  })

  it('marks the active route link with the accent border class', async () => {
    const router = makeRouter('/about')
    await router.isReady()
    const { container } = render(AppHeader, { global: { plugins: [router] } })
    const activeLinks = container.querySelectorAll('.border-accent')
    expect(activeLinks.length).toBeGreaterThan(0)
  })

  it('renders Start a Project CTA in the left rail', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getByRole('link', { name: /start a project/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
bun run test:run -- tests/components/layout/AppHeader.test.ts
```

Expected: FAIL — tests reference structure that doesn't exist yet.

- [ ] **Step 3: Rewrite AppHeader.vue**

Replace the entire content of `src/components/layout/AppHeader.vue` with:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Briefcase, Home, Info, Layers, Mail } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Home', path: '/', icon: Home, index: '01' },
  { name: 'About', path: '/about', icon: Info, index: '02' },
  { name: 'Works', path: '/works', icon: Layers, index: '03' },
  { name: 'Projects', path: '/projects', icon: Briefcase, index: '04' },
  { name: 'Contact', path: '/contact', icon: Mail, index: '05' }
]

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))

const railLinkClass = computed(
  () => (path: string) =>
    isActive(path)
      ? 'border-l-2 border-accent text-foreground bg-secondary'
      : 'border-l-2 border-transparent text-muted hover:text-foreground hover:bg-secondary'
)
</script>

<template>
  <!-- Desktop: Fixed left rail -->
  <aside
    class="border-border bg-background fixed top-0 left-0 z-50 hidden h-screen w-[220px] flex-col border-r lg:flex"
  >
    <RouterLink to="/" class="flex flex-col gap-1 px-6 pt-8 pb-6">
      <span class="title-display text-2xl leading-none">Ricki</span>
      <span
        class="text-muted hover:text-accent font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-200"
      >
        Friadi
      </span>
    </RouterLink>

    <nav class="flex flex-col gap-0.5 px-3" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200"
        :class="railLinkClass(item.path)"
      >
        <span class="text-muted/50 w-5 font-mono text-[10px]">{{ item.index }}</span>
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="flex-1" />

    <div class="px-4 pb-8">
      <Button as="a" href="/contact" variant="outline" size="sm" class="w-full text-xs">
        Start a Project
      </Button>
    </div>
  </aside>

  <!-- Mobile: Bottom tab bar -->
  <nav
    class="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-stretch border-t backdrop-blur-sm lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Mobile navigation"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200"
      :class="isActive(item.path) ? 'text-accent' : 'text-muted hover:text-foreground'"
    >
      <component :is="item.icon" class="h-5 w-5" />
      <span class="text-[10px] font-medium">{{ item.name }}</span>
    </RouterLink>
  </nav>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:run -- tests/components/layout/AppHeader.test.ts
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Visual check**

```bash
bun run dev
```

Open `http://localhost:5173`. Verify: left rail visible at `lg` breakpoint, bottom tabs visible on mobile. Logo at top, nav links with mono index numbers, CTA button at bottom.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/AppHeader.vue tests/components/layout/AppHeader.test.ts
git commit -m "feat: rewrite AppHeader with left-rail nav and mobile bottom tab bar"
```

---

## Task 3: MainLayout — Content Offset

**Files:**

- Modify: `src/components/layout/MainLayout.vue`

- [ ] **Step 1: Add offset classes to the main content area**

Replace the entire content of `src/components/layout/MainLayout.vue` with:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'

const route = useRoute()
const isImmersiveRoute = computed(() => route.path === '/works')
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip">
    <AppHeader v-if="!isImmersiveRoute" />
    <main class="relative flex-1" :class="!isImmersiveRoute ? 'pb-16 lg:pb-0 lg:pl-[220px]' : ''">
      <slot />
    </main>
    <AppFooter v-if="!isImmersiveRoute" />
  </div>
</template>
```

- [ ] **Step 2: Visual check**

```bash
bun run dev
```

Open `http://localhost:5173`. Verify: page content does not overlap the left rail on desktop. The `/works` route still shows full-screen with no offset. Mobile has bottom padding so content isn't hidden behind the tab bar.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MainLayout.vue
git commit -m "feat: add left-rail and bottom-tab content offset to MainLayout"
```

---

## Task 4: AppFooter — Colophon

**Files:**

- Modify: `src/components/layout/AppFooter.vue`
- Create: `tests/components/layout/AppFooter.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/components/layout/AppFooter.test.ts`:

```typescript
import AppFooter from '@/components/layout/AppFooter.vue'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

async function renderFooter() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }]
  })
  await router.isReady()
  return render(AppFooter, { global: { plugins: [router] } })
}

describe('AppFooter', () => {
  it('renders the colophon text', async () => {
    await renderFooter()
    expect(screen.getByText(/Ricki Friadi/)).toBeInTheDocument()
    expect(screen.getByText(/Built with Vue 3/)).toBeInTheDocument()
  })

  it('renders GitHub social link', async () => {
    await renderFooter()
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rickyfrdy')
  })

  it('renders LinkedIn social link', async () => {
    await renderFooter()
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
bun run test:run -- tests/components/layout/AppFooter.test.ts
```

Expected: FAIL — colophon structure and LinkedIn link don't exist yet.

- [ ] **Step 3: Rewrite AppFooter.vue**

Replace the entire content of `src/components/layout/AppFooter.vue` with:

```vue
<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/rickyfrdy' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/rickyfrdy' },
  { name: 'Email', icon: Mail, url: 'mailto:rickifriadi.dev@gmail.com' }
]
</script>

<template>
  <footer class="border-border border-t py-10">
    <div class="container mx-auto px-4 md:px-8">
      <div class="mb-5 flex justify-center gap-5">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          :aria-label="social.name"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-foreground transition-colors duration-200"
        >
          <component :is="social.icon" class="h-5 w-5" />
        </a>
      </div>
      <p class="colophon">
        Ricki Friadi&nbsp;·&nbsp;Built with Vue 3 + Tailwind v4&nbsp;·&nbsp;Jakarta,&nbsp;{{
          currentYear
        }}
      </p>
    </div>
  </footer>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:run -- tests/components/layout/AppFooter.test.ts
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppFooter.vue tests/components/layout/AppFooter.test.ts
git commit -m "feat: rewrite AppFooter as colophon with social icon row"
```

---

## Task 5: HomePage — Hero Restructure

**Files:**

- Modify: `src/components/page/home/HomePage.vue`

- [ ] **Step 1: Rewrite HomePage.vue**

Replace the entire content of `src/components/page/home/HomePage.vue` with:

```vue
<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero: full-width typographic statement, no right column -->
    <section class="container mx-auto px-4 pt-16 pb-10 md:px-8 md:pt-24 md:pb-14">
      <div
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="700"
      >
        <p class="eyebrow mb-6">Fullstack Developer · Jakarta</p>

        <h1
          class="title-display"
          style="font-size: clamp(3.2rem, 8vw, 8rem); line-height: 0.92; letter-spacing: -0.02em"
        >
          Engineering Systems,<br />
          <span class="title-accent text-accent">Designing Presence.</span>
        </h1>

        <hr class="border-border my-6" />

        <p
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1 }"
          :delay="300"
          class="text-muted font-mono text-xs tracking-[0.18em] uppercase"
        >
          Ricki Friadi&nbsp;·&nbsp;Available for Work&nbsp;·&nbsp;2026
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <Button size="lg" as="a" href="/works">
            Explore Works
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" as="a" href="/contact"> Start a Conversation </Button>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="container mx-auto px-4 md:px-8">
      <QuickStats />
    </section>

    <!-- § 02 — Journey Lab -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 02 — Journey Lab</span>
      </div>
      <JourneyLab />
    </section>

    <!-- § 03 — What Shaped My Work -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 03 — What Shaped My Work</span>
      </div>
      <JourneyStrip />
    </section>

    <!-- Investigation Board (untouched) -->
    <ProjectCTA />

    <!-- § 04 — Selected Work -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 04 — Selected Work</span>
      </div>
      <FeaturedProjects />
    </section>

    <!-- Final CTA -->
    <section class="container mx-auto px-4 py-16 md:px-8 md:py-24">
      <div
        class="mx-auto max-w-3xl text-center"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }"
      >
        <p class="eyebrow mb-4">Collaboration</p>
        <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 4.5rem); line-height: 0.95">
          Ready To Build<br />Your Next Product?
        </h2>
        <p class="text-muted mx-auto mt-6 mb-10 max-w-xl text-base md:text-lg">
          From architecture to interface polish — software that scales and still feels crafted.
        </p>
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" as="a" href="/contact">Start a Project</Button>
          <Button size="lg" variant="outline" as="a" href="/about">Read My Story</Button>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Visual check — hero**

```bash
bun run dev
```

Open `http://localhost:5173`. Verify:

- Hero heading spans full content width (no right column)
- Heading is large fluid serif (Caslon)
- `Designing Presence.` is italic in accent color
- Byline line appears below the `<hr>`
- Chapter headings (`§ 02 —`, `§ 03 —`, `§ 04 —`) appear before each section
- JourneyLab now appears after QuickStats, not in the hero grid

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/HomePage.vue
git commit -m "feat: restructure HomePage hero to full-width typographic layout with chapter headings"
```

---

## Task 6: QuickStats — Horizontal Data Strip

**Files:**

- Modify: `src/components/page/home/QuickStats.vue`

- [ ] **Step 1: Rewrite QuickStats.vue**

Replace the entire content of `src/components/page/home/QuickStats.vue` with:

```vue
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { onMounted, ref } from 'vue'

interface Stat {
  label: string
  value: number
  suffix: string
  duration: number
}

const stats: Stat[] = [
  { label: 'Years Experience', value: 4, suffix: '+', duration: 2000 },
  { label: 'Projects Shipped', value: 25, suffix: '+', duration: 2500 },
  { label: 'Technologies', value: 15, suffix: '+', duration: 2000 },
  { label: 'GitHub Contributions', value: 500, suffix: '+', duration: 3000 }
]

const animatedValues = ref(stats.map(() => 0))
const hasAnimated = ref(false)
const container = ref<HTMLElement | null>(null)

function animateValue(index: number, start: number, end: number, duration: number) {
  const startTime = performance.now()
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    animatedValues.value[index] = Math.floor(start + (end - start) * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

function startAnimations() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  stats.forEach((stat, index) => {
    setTimeout(() => animateValue(index, 0, stat.value, stat.duration), index * 80)
  })
}

onMounted(() => {
  if (container.value) {
    useIntersectionObserver(
      container,
      ([{ isIntersecting }]) => {
        if (isIntersecting) startAnimations()
      },
      { threshold: 0.4 }
    )
  }
})
</script>

<template>
  <div ref="container" class="border-border border-y py-6">
    <div class="flex flex-wrap items-baseline gap-x-10 gap-y-4">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        v-motion
        :initial="{ opacity: 0, y: 12 }"
        :visible="{ opacity: 1, y: 0 }"
        :delay="index * 80"
        class="flex items-baseline gap-2"
      >
        <span class="title-display text-accent text-4xl md:text-5xl">
          {{ animatedValues[index] }}{{ stat.suffix }}
        </span>
        <span class="text-muted text-sm font-medium">{{ stat.label }}</span>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Visual check**

```bash
bun run dev
```

Open `http://localhost:5173`. Scroll to the stats section. Verify: stats appear as a horizontal strip with no grid boxes or card wrappers. Count-up animation fires on scroll.

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/QuickStats.vue
git commit -m "feat: replace QuickStats grid with horizontal data strip"
```

---

## Task 7: JourneyLab — Paper-Grid Atmosphere

**Files:**

- Modify: `src/components/page/home/JourneyLab.vue`

The chapter heading was already added in Task 5 (HomePage.vue wraps JourneyLab with the `§ 02` heading). This task only touches the panel internals.

- [ ] **Step 1: Add paper-grid overlay and increase padding**

In `src/components/page/home/JourneyLab.vue`, replace the opening `<section>` tag:

From:

```html
<section
  class="border-border rounded-2xl border p-5 md:p-6"
  @mouseenter="isPaused = true"
  @mouseleave="isPaused = false"
></section>
```

To:

```html
<section
  class="border-border relative overflow-hidden rounded-2xl border p-7 md:p-9"
  @mouseenter="isPaused = true"
  @mouseleave="isPaused = false"
>
  <div class="paper-grid pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06]" />
</section>
```

Also add the closing `</div>` for the paper-grid overlay before `</section>` — but since the paper-grid div is self-closing (`<div ... />`), no closing tag is needed. The `<div ... />` sits as the first child inside `<section>`, immediately before `<!-- Header -->`.

- [ ] **Step 2: Visual check**

```bash
bun run dev
```

Scroll to the Journey Lab section. Verify: panel has slightly more padding, subtle grid pattern visible in the background of the card. All carousel controls still work.

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/JourneyLab.vue
git commit -m "feat: add paper-grid atmosphere and increased padding to JourneyLab"
```

---

## Task 8: JourneyStrip — Diff Tags + v-Year Format

**Files:**

- Modify: `src/components/page/home/JourneyStrip.vue`

- [ ] **Step 1: Update card left border, year format, and stack tags**

In `src/components/page/home/JourneyStrip.vue`, make the following changes:

**A — Card border class** (replace the `:class` on the `<article>`):

From:

```html
:class="index === activeIndex ? 'border-accent/50' : 'opacity-60'"
```

To:

```html
:class="index === activeIndex ? 'border-l-[3px] border-l-accent opacity-100' : 'border-l-[3px]
border-l-border opacity-50'"
```

**B — Year label** (inside the `<article>`, replace the year `<p>` tag):

From:

```html
<p class="text-accent font-mono text-xs tracking-[0.16em] uppercase">{{ milestone.year }}</p>
```

To:

```html
<p class="text-muted font-mono text-xs tracking-[0.16em]">v{{ milestone.year }}.0</p>
```

**C — Stack tags** (replace the `<span>` inside the `flex flex-wrap gap-2` div):

From:

```html
<span
  v-for="item in milestone.stack"
  :key="item"
  class="border-border bg-secondary rounded-md border px-2.5 py-1 text-xs font-medium"
>
  {{ item }}
</span>
```

To:

```html
<span v-for="item in milestone.stack" :key="item" class="diff-tag">
  <span class="text-accent">+&nbsp;</span>{{ item }}
</span>
```

- [ ] **Step 2: Visual check**

```bash
bun run dev
```

Scroll to the Journey Strip. Verify: active card has solid accent left border, inactive cards have muted dotted-style border and reduced opacity. Year shows as `v2022.0` format. Stack tags show `+ Node.js` with accent plus sign.

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/JourneyStrip.vue
git commit -m "feat: update JourneyStrip with diff tags, v-year format, accent left border"
```

---

## Task 9: FeaturedProjects — File-Path Cards + Conditional Image

**Files:**

- Modify: `src/components/page/home/FeaturedProjects.vue`
- Create: `tests/components/page/home/FeaturedProjects.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/components/page/home/FeaturedProjects.test.ts`:

```typescript
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('FeaturedProjects', () => {
  it('renders a file-path header for each project', () => {
    render(FeaturedProjects)
    expect(screen.getByText('~/projects/ecommerce-platform/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/api-gateway/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/analytics-dashboard/')).toBeInTheDocument()
  })

  it('renders metric lines with arrow prefix', () => {
    render(FeaturedProjects)
    expect(screen.getByText('→ Handles 10K+ daily transactions')).toBeInTheDocument()
  })

  it('renders case study links', () => {
    render(FeaturedProjects)
    const caseLinks = screen.getAllByRole('link', { name: /read case study/i })
    expect(caseLinks).toHaveLength(3)
  })

  it('renders project title when no image is provided', () => {
    render(FeaturedProjects)
    // All projects have no image in the default data — titles render as headings
    expect(screen.getByRole('heading', { name: 'E-Commerce Platform' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
bun run test:run -- tests/components/page/home/FeaturedProjects.test.ts
```

Expected: FAIL — file-path and arrow-metric structure don't exist yet.

- [ ] **Step 3: Rewrite FeaturedProjects.vue**

Replace the entire content of `src/components/page/home/FeaturedProjects.vue` with:

```vue
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-vue-next'

interface Project {
  id: string
  title: string
  category: string
  description: string
  technologies: string[]
  metric?: string
  image?: string
  slug: string
}

const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    category: 'SaaS / E-Commerce',
    description:
      'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Vue 3', 'Redis'],
    metric: 'Handles 10K+ daily transactions',
    slug: 'ecommerce-platform'
  },
  {
    id: '2',
    title: 'Microservices API Gateway',
    category: 'Backend Infrastructure',
    description:
      'Scalable API gateway with rate limiting, authentication, load balancing, and service discovery.',
    technologies: ['Express', 'JWT', 'Docker', 'Kubernetes', 'MongoDB'],
    metric: 'Reduced response time by 60%',
    slug: 'api-gateway'
  },
  {
    id: '3',
    title: 'Real-time Analytics Dashboard',
    category: 'Data / Frontend',
    description:
      'Interactive dashboard with WebSocket updates, data visualization, and custom reporting features.',
    technologies: ['Socket.io', 'Chart.js', 'React', 'Tailwind', 'Node.js'],
    metric: 'Processing 1M+ events/day',
    slug: 'analytics-dashboard'
  }
]
</script>

<template>
  <div class="space-y-6">
    <article
      v-for="(project, index) in featuredProjects"
      :key="project.id"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :delay="index * 120"
      class="group border-border hover:border-accent/40 overflow-hidden rounded-2xl border transition-all duration-500"
      :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
    >
      <!-- File-path header -->
      <div class="border-border border-b px-6 py-2.5">
        <span class="text-muted font-mono text-xs">~/projects/{{ project.slug }}/</span>
      </div>

      <!-- Full-bleed image (if available) -->
      <div v-if="project.image" class="aspect-video w-full overflow-hidden">
        <img
          :src="project.image"
          :alt="project.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <!-- Card body -->
      <div class="p-6 md:p-8">
        <!-- Title renders large when no image -->
        <h3
          v-if="!project.image"
          class="title-display group-hover:text-accent text-3xl transition-colors duration-300 md:text-4xl"
        >
          {{ project.title }}
        </h3>
        <h3
          v-else
          class="title-display group-hover:text-accent text-2xl transition-colors duration-300 md:text-3xl"
        >
          {{ project.title }}
        </h3>

        <p class="eyebrow mt-2 mb-3">{{ project.category }}</p>
        <p class="text-muted text-sm leading-relaxed">{{ project.description }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <Badge
            v-for="tech in project.technologies.slice(0, 4)"
            :key="tech"
            variant="secondary"
            class="normal-case"
          >
            {{ tech }}
          </Badge>
        </div>

        <p v-if="project.metric" class="text-accent mt-5 font-mono text-sm font-semibold">
          → {{ project.metric }}
        </p>

        <div class="mt-6">
          <Button variant="outline" size="sm" as="a" :href="`/projects/${project.slug}`">
            Read Case Study
            <ExternalLink class="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>

    <div>
      <Button size="lg" variant="outline" as="a" href="/projects">View Full Portfolio</Button>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:run -- tests/components/page/home/FeaturedProjects.test.ts
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Visual check**

```bash
bun run dev
```

Scroll to Selected Work section. Verify: each card shows `~/projects/{slug}/` mono path at top, title is large Caslon (no image present), metric line has `→` prefix, category in eyebrow style.

- [ ] **Step 6: Commit**

```bash
git add src/components/page/home/FeaturedProjects.vue tests/components/page/home/FeaturedProjects.test.ts
git commit -m "feat: redesign FeaturedProjects cards with file-path header and conditional image"
```

---

## Task 10: AboutPage — Editorial Two-Column Layout

**Files:**

- Modify: `src/components/page/about/AboutPage.vue`

- [ ] **Step 1: Rewrite AboutPage.vue**

Replace the entire content of `src/components/page/about/AboutPage.vue` with:

```vue
<script setup lang="ts">
import GitHubHeatmap from '@/components/page/about/GitHubHeatmap.vue'
import SkillsMatrix from '@/components/page/about/SkillsMatrix.vue'
import SkillsTimeline from '@/components/page/about/SkillsTimeline.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero: full-width, no panel wrapper -->
    <section
      class="container mx-auto px-4 pt-16 pb-12 md:px-8 md:pt-24"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible="{ opacity: 1, y: 0 }"
    >
      <p class="eyebrow mb-4 inline-flex">About</p>
      <h1
        class="title-display"
        style="font-size: clamp(2.8rem, 7vw, 7rem); line-height: 0.93; letter-spacing: -0.02em"
      >
        Building Systems With<br />
        <span class="title-accent text-accent">Human-First Clarity.</span>
      </h1>
      <p class="text-muted mt-6 max-w-2xl text-lg md:text-xl">
        A fullstack developer focused on reliable architecture, maintainable code, and interfaces
        that feel intentional.
      </p>
    </section>

    <!-- § 01 — My Story: editorial two-column layout -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 01 — My Story</span>
      </div>

      <div class="editorial-grid">
        <!-- Left: story text -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :visible="{ opacity: 1, x: 0 }"
          class="space-y-4 text-base leading-relaxed"
        >
          <p>
            My journey into software development started 4 years ago when I discovered my passion
            for solving complex problems through code. What began as curiosity quickly evolved into
            a deep commitment to mastering the craft of fullstack development.
          </p>
          <p>
            I specialize in the
            <span class="text-foreground font-semibold">Node.js and TypeScript ecosystem</span>,
            building scalable backend systems and modern frontend applications. I believe in writing
            clean, maintainable code that not only works but also stands the test of time.
          </p>
          <p>
            Throughout my career, I've had the privilege of working on diverse projects — from
            e-commerce platforms handling thousands of transactions daily to real-time analytics
            dashboards processing millions of events. Each project has taught me valuable lessons
            about architecture, performance, and user experience.
          </p>
          <p>
            Beyond coding, I'm passionate about continuous learning, sharing knowledge with the
            developer community, and staying updated with the latest technologies and best
            practices.
          </p>
        </div>

        <!-- Right: annotation sidebar -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :visible="{ opacity: 1, x: 0 }"
          :delay="150"
          class="space-y-0"
        >
          <p class="eyebrow mb-5">§ Notes</p>

          <div class="border-border space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">Clean Code Philosophy</p>
            <p class="text-muted text-sm leading-relaxed">
              Code is read more than it's written. Every line should be intentional, clear, and
              maintainable for the next developer.
            </p>
          </div>

          <div class="border-border mt-5 space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">Performance Matters</p>
            <p class="text-muted text-sm leading-relaxed">
              Users expect fast, responsive applications. I optimize every layer — from database
              queries to frontend rendering.
            </p>
          </div>

          <div class="border-border mt-5 space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">User-Centric Approach</p>
            <p class="text-muted text-sm leading-relaxed">
              Technology is just a tool. What matters is solving real problems for real people in
              ways that make their lives easier.
            </p>
          </div>

          <!-- Beyond Code: pull-quote style -->
          <div class="border-accent mt-8 border-l-2 py-1 pl-5">
            <p class="eyebrow text-foreground mb-3">Beyond Code</p>
            <ul class="text-muted space-y-2 text-sm">
              <li>Love listening to music while coding</li>
              <li>Active in developer communities and open source</li>
              <li>Currently exploring serverless architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- § 02 — Skills Timeline -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 02 — Skills Timeline</span>
      </div>
      <SkillsTimeline />
    </section>

    <!-- § 03 — Skills Matrix -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 03 — Skills Matrix</span>
      </div>
      <SkillsMatrix />
    </section>

    <!-- § 04 — GitHub Activity -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 04 — GitHub Activity</span>
      </div>
      <div class="mx-auto max-w-5xl">
        <GitHubHeatmap />
      </div>
    </section>

    <!-- Final CTA: plain centered text, no panel wrapper -->
    <section class="container mx-auto px-4 py-14 md:px-8 md:py-20">
      <div
        class="mx-auto max-w-3xl text-center"
        v-motion
        :initial="{ opacity: 0, scale: 0.97 }"
        :visible="{ opacity: 1, scale: 1 }"
      >
        <p class="eyebrow mb-4 inline-flex">Collaboration</p>
        <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 4.5rem); line-height: 0.95">
          Let's Build Something Together
        </h2>
        <p class="text-muted mx-auto mt-5 mb-8 max-w-2xl text-base md:text-lg">
          I'm always interested in hearing about new projects and opportunities.
        </p>
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" as="a" href="/contact">Get In Touch</Button>
          <Button size="lg" variant="outline" as="a" href="/projects">View My Projects</Button>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Visual check**

```bash
bun run dev
```

Open `http://localhost:5173/about`. Verify:

- Hero heading spans full width without a panel wrapper
- Story section uses two-column editorial layout on desktop (65/35 split)
- Right column shows annotation blocks with eyebrow labels, no icon boxes
- "Beyond Code" is a pull-quote with left accent border
- Separators between sections are replaced by `§ 01`, `§ 02`, `§ 03`, `§ 04` chapter headings
- Bottom CTA has no panel background

- [ ] **Step 3: Commit**

```bash
git add src/components/page/about/AboutPage.vue
git commit -m "feat: redesign AboutPage with editorial two-column layout and chapter headings"
```

---

## Task 11: BlogPage — Coming Soon State

**Files:**

- Modify: `src/components/page/blog/BlogPage.vue`
- Modify: `tests/components/page/blog/BlogPage.test.ts`

- [ ] **Step 1: Update the existing test to expect the coming-soon structure**

Replace the entire content of `tests/components/page/blog/BlogPage.test.ts` with:

```typescript
import BlogPage from '@/components/page/blog/BlogPage.vue'
import { render, screen } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'

async function renderBlogPage() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/blog', component: { template: '<div />' } }
    ]
  })
  await router.isReady()
  return render(BlogPage, { global: { plugins: [router] } })
}

describe('BlogPage', () => {
  it('renders Coming Soon heading', async () => {
    await renderBlogPage()
    expect(screen.getByRole('heading', { name: /coming soon/i })).toBeInTheDocument()
  })

  it('renders the field notes chapter label', async () => {
    await renderBlogPage()
    expect(screen.getByText(/§ 01 — Field Notes/i)).toBeInTheDocument()
  })

  it('does not render any article links', async () => {
    await renderBlogPage()
    expect(screen.queryAllByRole('link', { name: /read article/i })).toHaveLength(0)
  })

  it('renders a back-to-home link', async () => {
    await renderBlogPage()
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
bun run test:run -- tests/components/page/blog/BlogPage.test.ts
```

Expected: FAIL — new structure doesn't exist yet.

- [ ] **Step 3: Rewrite BlogPage.vue**

Replace the entire content of `src/components/page/blog/BlogPage.vue` with:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen">
    <section class="container mx-auto px-4 pt-16 pb-24 md:px-8 md:pt-24">
      <div class="chapter-heading">
        <span class="chapter-label">§ 01 — Field Notes</span>
      </div>

      <div
        class="mx-auto max-w-xl"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="600"
      >
        <h1 class="title-display text-5xl md:text-7xl">Coming Soon.</h1>
        <p class="text-muted mt-6 text-base leading-relaxed md:text-lg">
          Writing in progress — essays on systems, interfaces, and engineering craft.
        </p>
        <div class="mt-10">
          <Button variant="outline" as="a" href="/" aria-label="Back to Home">
            ← Back to Home
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:run -- tests/components/page/blog/BlogPage.test.ts
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/page/blog/BlogPage.vue tests/components/page/blog/BlogPage.test.ts
git commit -m "feat: replace BlogPage with coming-soon state"
```

---

## Task 12: Full Test Suite + Final Visual Pass

**Files:** No changes — verification only.

- [ ] **Step 1: Run the full test suite**

```bash
bun run test:run
```

Expected: All tests pass. No regressions in `tests/hooks/` or `tests/routes/`.

- [ ] **Step 2: TypeScript check**

```bash
bun run build
```

Expected: `vue-tsc --noEmit` completes without type errors.

- [ ] **Step 3: Full visual pass on all redesigned pages**

```bash
bun run dev
```

Checklist:

- [ ] `/` — Left rail visible on desktop, bottom tabs on mobile. Hero heading is full-width serif. Chapter headings appear. Investigation Board is unchanged.
- [ ] `/about` — Two-column editorial layout. No soft-panel card wrappers. Chapter headings for each section.
- [ ] `/blog` — Coming Soon state. No article cards.
- [ ] `/works` — Full immersive board unchanged. No left rail offset (isImmersiveRoute).
- [ ] Resize viewport to 768px — bottom tab bar appears, left rail hidden.
- [ ] Dark mode (toggle OS preference) — all sections read cleanly in dark brown-black.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Print Run redesign — editorial layout, left-rail nav, chapter headings"
```
