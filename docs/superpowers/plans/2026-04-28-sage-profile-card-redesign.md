# Sage Profile Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio from an editorial left-rail layout to a centered single-column profile card (inspired by dimasmiftah.com) with a clean white + sage green palette and diagonal hatch gutters.

**Architecture:** Pure presentational change — no new routes, no new data. Every file is restyled in-place. The centered column (max-w-[680px]) floats on a diagonal-hatch background. The Works/immersive route remains untouched. JourneyLab, JourneyStrip, FeaturedProjects, and ProjectCTA are kept as-is; only their container context changes.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Tailwind v4 (`@utility`, `@theme`), `@testing-library/vue`, Vitest, `@vueuse/motion`, Lucide Vue

---

## File Map

| File                                        | Action                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `src/style.css`                             | Replace Washi tokens with sage palette; add `hatch-gutter` utility     |
| `src/components/layout/AppHeader.vue`       | Replace left rail with sticky horizontal top bar                       |
| `src/components/layout/MainLayout.vue`      | Add hatch bg wrapper + centered 680px column with border-x             |
| `src/components/layout/AppFooter.vue`       | Remove `container mx-auto`, simplify padding to fit inside column      |
| `src/components/page/home/HomePage.vue`     | Full rewrite: profile header + hatch separators + sections             |
| `src/components/page/home/QuickStats.vue`   | Replace YAML strip with 2×2 info grid + Lucide icons                   |
| `src/components/page/about/AboutPage.vue`   | Drop `editorial-grid` two-column; single column with border-b sections |
| `src/components/page/blog/BlogPage.vue`     | Minor: drop left-rail-specific spacing                                 |
| `tests/components/layout/AppHeader.test.ts` | Remove left-rail CTA test; keep other 3 passing                        |

---

## Task 1: CSS — Sage Green Palette + Hatch Utility

**Files:**

- Modify: `src/style.css`

- [ ] **Step 1: Replace the full contents of `src/style.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import 'tailwindcss';

@theme {
  --font-sans:
    'DM Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Sage palette — clean white, sage green accent */
  --color-background: oklch(0.98 0.004 100);
  --color-foreground: oklch(0.12 0.01 80);
  --color-muted: oklch(0.52 0.01 80);
  --color-border: oklch(0.88 0.005 80);
  --color-secondary: oklch(0.95 0.005 100);
  --color-accent: oklch(0.62 0.09 160);
  --color-accent-hover: oklch(0.54 0.09 160);
  --color-surface: oklch(0.96 0.005 100);
  --color-highlight: oklch(0.75 0.07 160);

  /* Easing tokens */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-color-scheme: dark) {
  @theme {
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
}

@layer base {
  * {
    @apply box-border;
  }

  html,
  body,
  #app {
    @apply min-h-screen;
  }

  html {
    color-scheme: light dark;
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-sans);
    line-height: 1.6;
  }

  body.camera-active {
    cursor: none;
  }

  ::selection {
    background: var(--color-accent);
    color: oklch(0.98 0.004 100);
  }
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
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

@keyframes wipe-conceal {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
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

@keyframes toast-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-110%);
    opacity: 0;
  }
}

@keyframes loading-shimmer {
  from {
    width: 0%;
  }
  to {
    width: 100%;
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
  @apply border-border bg-surface rounded-2xl border;
}

@utility nav-shell {
  @apply border-border bg-background/95 rounded-2xl border backdrop-blur-sm;
}

@utility grain-overlay {
  pointer-events: none;
}

@utility chapter-heading {
  @apply border-border mb-6 border-t pt-4;
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

- [ ] **Step 2: Run dev server to confirm no CSS errors**

```bash
bun run dev
```

Expected: server starts, no errors in terminal

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: switch to sage green palette with hatch-gutter utility"
```

---

## Task 2: AppHeader — Horizontal Top Nav

**Files:**

- Modify: `src/components/layout/AppHeader.vue`
- Modify: `tests/components/layout/AppHeader.test.ts`

- [ ] **Step 1: Update the test — remove left-rail CTA assertion, keep other 3**

Replace the full contents of `tests/components/layout/AppHeader.test.ts`:

```typescript
import AppHeader from '@/components/layout/AppHeader.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

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
})
```

- [ ] **Step 2: Run test to confirm it fails (AppHeader not yet updated)**

```bash
bun run test:run tests/components/layout/AppHeader.test.ts
```

Expected: FAIL — "marks the active route link" fails because left-rail uses `border-l-2 border-accent`, but "renders logo text" and "renders all 5 nav links" pass

- [ ] **Step 3: Rewrite `src/components/layout/AppHeader.vue`**

```vue
<script setup lang="ts">
import { Briefcase, Home, Info, Layers, Mail } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: typeof Home
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Works', path: '/works', icon: Layers },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Contact', path: '/contact', icon: Mail }
]

const isActive = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))
</script>

<template>
  <!-- Desktop + tablet: fixed horizontal top bar -->
  <header
    class="border-border bg-background/90 fixed top-0 right-0 left-0 z-50 h-14 border-b backdrop-blur-sm"
  >
    <div class="mx-auto flex h-full max-w-[680px] items-center justify-between px-4">
      <!-- Logo -->
      <RouterLink to="/" aria-label="Ricki Friadi — Home" class="flex items-baseline gap-1.5">
        <span class="title-display text-xl leading-none">Ricki</span>
        <span
          class="text-muted hover:text-accent font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
        >
          Friadi
        </span>
      </RouterLink>

      <!-- Nav links — hidden on mobile (pill nav handles mobile) -->
      <nav class="hidden items-center gap-0.5 sm:flex" aria-label="Primary navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :aria-current="isActive(item.path) ? 'page' : undefined"
          class="nav-link focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          :class="isActive(item.path) ? 'is-active' : ''"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <!-- Mobile: floating pill nav (shown below sm breakpoint) -->
  <nav class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 sm:hidden">
    <div
      class="flex items-center gap-0.5 rounded-full px-1.5 py-1.5"
      style="
        background: color-mix(in oklch, var(--color-background) 88%, transparent);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--color-border);
        box-shadow:
          0 4px 24px oklch(0 0 0 / 0.06),
          0 1px 4px oklch(0 0 0 / 0.04);
      "
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :aria-label="item.name"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        class="relative flex flex-col items-center gap-1 rounded-full px-3.5 py-2 transition-colors duration-200"
        :class="isActive(item.path) ? 'text-accent' : 'text-muted hover:text-foreground'"
      >
        <span
          v-if="isActive(item.path)"
          class="absolute top-1.5 h-1 w-1 rounded-full"
          style="background: var(--color-accent)"
        />
        <component :is="item.icon" class="h-5 w-5" />
        <span class="font-mono text-[9px] tracking-[0.08em] uppercase">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun run test:run tests/components/layout/AppHeader.test.ts
```

Expected: 3/3 PASS — logo text renders, 5 nav links render, active link has `border-accent` class

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppHeader.vue tests/components/layout/AppHeader.test.ts
git commit -m "feat: replace left rail with horizontal top nav"
```

---

## Task 3: MainLayout — Hatch Background + Centered Column

**Files:**

- Modify: `src/components/layout/MainLayout.vue`

- [ ] **Step 1: Rewrite `src/components/layout/MainLayout.vue`**

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
  <!-- Immersive route (/works): full-screen, no chrome -->
  <template v-if="isImmersiveRoute">
    <main class="relative min-h-screen">
      <slot />
    </main>
  </template>

  <!-- Normal routes: hatch bg + centered 680px column -->
  <template v-else>
    <AppHeader />

    <!-- Outer wrapper carries the hatch texture as the page background -->
    <div class="hatch-gutter relative min-h-screen">
      <!-- Centered column: white bg, left+right border, sits on the hatch -->
      <div class="border-border bg-background mx-auto min-h-screen max-w-[680px] border-x pt-14">
        <main class="pb-28 sm:pb-8">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>
  </template>
</template>
```

- [ ] **Step 2: Run dev server and navigate to `/` — confirm centered column with hatch gutters visible on sides**

```bash
bun run dev
```

Open `http://localhost:5173`. Expected: white centered column (~680px) floats on a diagonal hatch pattern. Header fixed at top. No left rail.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MainLayout.vue
git commit -m "feat: centered 680px column with diagonal hatch gutters"
```

---

## Task 4: AppFooter — Fit Inside the 680px Column

**Files:**

- Modify: `src/components/layout/AppFooter.vue`

The footer is now rendered _inside_ the centered column (by MainLayout). The old `container mx-auto px-4 md:px-8` adds unnecessary width constraints. Simplify it.

- [ ] **Step 1: Replace `src/components/layout/AppFooter.vue`**

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
  <footer class="border-border border-t px-4 py-8">
    <div class="mb-4 flex justify-center gap-5">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        :aria-label="social.name"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-foreground transition-colors duration-200"
      >
        <component :is="social.icon" class="h-4 w-4" />
      </a>
    </div>
    <p class="colophon">
      Ricki Friadi&nbsp;·&nbsp;Built with Vue 3 + Tailwind v4&nbsp;·&nbsp;Jakarta,&nbsp;{{
        currentYear
      }}
    </p>
  </footer>
</template>
```

- [ ] **Step 2: Run footer tests to confirm they still pass**

```bash
bun run test:run tests/components/layout/AppFooter.test.ts
```

Expected: 3/3 PASS — colophon text renders, GitHub link renders, LinkedIn link renders

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/AppFooter.vue
git commit -m "feat: simplify footer padding to fit inside centered column"
```

---

## Task 5: QuickStats — 2×2 Info Grid with Icons

**Files:**

- Modify: `src/components/page/home/QuickStats.vue`

Replace the horizontal YAML strip with a 2×2 bordered grid with Lucide icons, matching the dimasmiftah.com info grid style.

- [ ] **Step 1: Replace `src/components/page/home/QuickStats.vue`**

```vue
<script setup lang="ts">
import { Briefcase, Clock, MapPin, Zap } from 'lucide-vue-next'

const items = [
  { icon: MapPin, label: 'Jakarta, Indonesia' },
  { icon: Briefcase, label: '4 years experience' },
  { icon: Zap, label: 'Open to Work' },
  { icon: Clock, label: 'UTC +7 · WIB' }
]
</script>

<template>
  <div class="border-border grid grid-cols-2 border-b">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="border-border flex items-center gap-3 px-4 py-3.5"
      :class="{
        'border-r': i % 2 === 0,
        'border-b': i < 2
      }"
    >
      <component :is="item.icon" class="text-muted h-3.5 w-3.5 shrink-0" />
      <span class="text-foreground font-mono text-xs">{{ item.label }}</span>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Run dev server and visually check the info grid on the home page**

Open `http://localhost:5173`. Expected: 2×2 grid below the profile header, showing MapPin/Briefcase/Zap/Clock icons with labels

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/QuickStats.vue
git commit -m "feat: replace QuickStats strip with 2x2 info grid"
```

---

## Task 6: HomePage — Profile Card Redesign

**Files:**

- Modify: `src/components/page/home/HomePage.vue`

Full rewrite. Structure: profile header → hatch separator → info grid → hatch separator → stat cards → hatch separator → about prose → chapter sections (JourneyLab, JourneyStrip, ProjectCTA, FeaturedProjects) → final CTA.

- [ ] **Step 1: Replace `src/components/page/home/HomePage.vue`**

```vue
<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-vue-next'
import { ref } from 'vue'

const photoError = ref(false)
const photoSrc = `${import.meta.env.BASE_URL}photo.jpg`

const stack = ['TypeScript', 'Node.js', 'Vue 3', 'PostgreSQL', 'Docker', 'REST APIs']
</script>

<template>
  <div>
    <!-- § 01 — Profile Header -->
    <section
      class="border-border border-b px-4 py-6"
      v-motion
      :initial="{ opacity: 0, y: 12 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <div class="flex items-center gap-4">
        <!-- Circular photo -->
        <div class="border-border h-16 w-16 shrink-0 overflow-hidden rounded-full border-2">
          <img
            v-show="!photoError"
            :src="photoSrc"
            alt="Ricki Friadi"
            class="h-full w-full object-cover"
            @error="photoError = true"
          />
          <div
            v-if="photoError"
            class="bg-secondary flex h-full w-full items-center justify-center"
          >
            <User class="text-muted h-8 w-8" />
          </div>
        </div>

        <!-- Name + role -->
        <div class="min-w-0 flex-1">
          <h1 class="title-display text-2xl leading-none">Ricki Friadi</h1>
          <p class="text-muted mt-1 font-mono text-xs">Fullstack Developer</p>
        </div>

        <!-- Availability badge -->
        <div
          class="border-accent/30 bg-accent/10 hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 sm:flex"
        >
          <span class="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
          <span class="text-accent font-mono text-[10px] tracking-[0.1em] uppercase"
            >Open to Work</span
          >
        </div>
      </div>
    </section>

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- Info grid -->
    <QuickStats />

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- Stat cards -->
    <div
      class="border-border grid grid-cols-2 border-b"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="150"
    >
      <div class="border-border border-r px-4 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Projects Shipped</p>
        <p class="title-display mt-1 text-4xl">25</p>
      </div>
      <div class="px-4 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Years Experience</p>
        <p class="title-display mt-1 text-4xl">4</p>
      </div>
    </div>

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- About prose -->
    <section
      class="border-border border-b px-4 py-6"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="100"
    >
      <h2 class="text-foreground mb-3 text-base font-semibold">About</h2>
      <p class="text-muted text-sm leading-relaxed">
        I'm Ricki Friadi, a fullstack developer building reliable systems and clean interfaces
        across the Node.js and TypeScript ecosystem — from backend APIs to frontend experiences. 4
        years of professional experience shipping products.
      </p>
      <p class="text-muted mt-3 text-sm leading-relaxed">
        Currently
        <span
          class="border-accent/30 bg-accent/10 text-accent rounded border px-1.5 py-0.5 font-mono text-[11px]"
          >open to work</span
        >
        and building with
        <span
          v-for="(tech, i) in stack"
          :key="tech"
          class="border-border bg-secondary mx-0.5 rounded border px-1.5 py-0.5 font-mono text-xs"
          >{{ tech }}</span
        >.
      </p>
    </section>

    <!-- § 02 — Journey Lab -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Journey Lab</span>
      </div>
      <JourneyLab />
    </section>

    <!-- § 03 — What Shaped My Work -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — What Shaped My Work</span>
      </div>
      <JourneyStrip />
    </section>

    <!-- Investigation Board -->
    <ProjectCTA />

    <!-- § 04 — Selected Work -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — Selected Work</span>
      </div>
      <FeaturedProjects />
    </section>

    <!-- Final CTA -->
    <section class="px-4 py-12 text-center">
      <p class="eyebrow mb-4">Collaboration</p>
      <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 3.5rem)">
        Ready To Build<br />Your Next Product?
      </h2>
      <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
        From architecture to interface polish — software that scales and still feels crafted.
      </p>
      <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" as="a" href="/contact">Start a Project</Button>
        <Button size="lg" variant="outline" as="a" href="/about">Read My Story</Button>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Run dev server, visually check the home page**

Open `http://localhost:5173`. Expected:

- Profile header: circular photo placeholder + "Ricki Friadi" + "Fullstack Developer" + green badge
- Hatch separator strip (diagonal lines)
- 2×2 info grid (MapPin/Briefcase/Zap/Clock)
- Hatch separator
- Stat cards: "25 Projects Shipped" | "4 Years Experience"
- Hatch separator
- About prose with inline tech badges
- Chapter sections below

- [ ] **Step 3: Commit**

```bash
git add src/components/page/home/HomePage.vue
git commit -m "feat: rewrite home page as profile card layout"
```

---

## Task 7: AboutPage — Single Centered Column

**Files:**

- Modify: `src/components/page/about/AboutPage.vue`

Remove the `editorial-grid` two-column layout (built for the wide left-rail view). Stack everything vertically in single column with border-b section separators.

- [ ] **Step 1: Replace `src/components/page/about/AboutPage.vue`**

```vue
<script setup lang="ts">
import GitHubHeatmap from '@/components/page/about/GitHubHeatmap.vue'
import SkillsMatrix from '@/components/page/about/SkillsMatrix.vue'
import SkillsTimeline from '@/components/page/about/SkillsTimeline.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="border-border border-b px-4 py-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <p class="eyebrow mb-3">About</p>
      <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
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

      <div
        class="space-y-4 px-4 pb-8 text-sm leading-relaxed"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
      >
        <p>
          My journey into software development started 4 years ago when I discovered my passion for
          solving complex problems through code. What began as curiosity quickly evolved into a deep
          commitment to mastering the craft of fullstack development.
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
          dashboards processing millions of events.
        </p>
        <p>
          Beyond coding, I'm passionate about continuous learning, sharing knowledge with the
          developer community, and staying updated with the latest technologies and best practices.
        </p>
      </div>

      <!-- Annotation notes — stacked below story text -->
      <div
        class="border-border border-t px-4 pb-8"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
        :delay="100"
      >
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

    <!-- § 02 — Skills Timeline -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Skills Timeline</span>
      </div>
      <SkillsTimeline />
    </section>

    <!-- § 03 — Skills Matrix -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — Skills Matrix</span>
      </div>
      <SkillsMatrix />
    </section>

    <!-- § 04 — GitHub Activity -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — GitHub Activity</span>
      </div>
      <div class="px-4 pb-6">
        <GitHubHeatmap />
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
        <Button size="lg" as="a" href="/contact">Get In Touch</Button>
        <Button size="lg" variant="outline" as="a" href="/projects">View My Projects</Button>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Run dev server and check `/about`**

Open `http://localhost:5173/about`. Expected:

- Hero heading in Cormorant Garamond with italic sage accent
- § 01 chapter section: story text + annotation notes stacked below in single column
- § 02, § 03, § 04 sections with border separators

- [ ] **Step 3: Commit**

```bash
git add src/components/page/about/AboutPage.vue
git commit -m "feat: convert About to single-column centered layout"
```

---

## Task 8: BlogPage — Centered Layout Cleanup

**Files:**

- Modify: `src/components/page/blog/BlogPage.vue`

Remove left-rail-specific padding and ensure the centered column layout looks correct. All existing tests must still pass: "Coming Soon." heading, "§ 01 — Field Notes" chapter label, back link.

- [ ] **Step 1: Replace `src/components/page/blog/BlogPage.vue`**

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 01 — Field Notes</span>
      </div>

      <div
        class="px-4 pb-12"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="600"
      >
        <h1 class="title-display text-5xl">Coming Soon.</h1>
        <p class="text-muted mt-4 text-sm leading-relaxed">
          Writing in progress — essays on systems, interfaces, and engineering craft.
        </p>
        <div class="mt-8">
          <Button variant="outline" as="a" href="/">← Back to Home</Button>
        </div>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Run blog tests to confirm all pass**

```bash
bun run test:run tests/components/page/blog/BlogPage.test.ts
```

Expected: 4/4 PASS — "Coming Soon." heading, "§ 01 — Field Notes" label, no article links, back-to-home link

- [ ] **Step 3: Commit**

```bash
git add src/components/page/blog/BlogPage.vue
git commit -m "feat: clean up blog page for centered column layout"
```

---

## Task 9: Full Test Suite + TypeScript + Visual Pass

**Files:** (none changed — verification only)

- [ ] **Step 1: Run the full test suite**

```bash
bun run test:run
```

Expected:

```
Test Files  7 passed (7)
Tests       19 passed (19)
```

- [ ] **Step 2: TypeScript + production build**

```bash
bun run build
```

Expected: `vue-tsc --noEmit` passes (no type errors), `vite build` completes with ✓

- [ ] **Step 3: Visual pass — home page desktop**

Open `http://localhost:5173`. Check:

- Diagonal hatch gutters visible on both sides of the white 680px column
- Sticky top bar with logo + nav links (desktop)
- Profile header: photo frame + name + role
- Hatch separator strips between sections
- 2×2 info grid
- Stat cards (25 / 4)
- About prose with inline badges
- Chapter sections below

- [ ] **Step 4: Visual pass — about and blog**

Open `http://localhost:5173/about`. Check: hero + single-column sections + chapter headings.
Open `http://localhost:5173/blog`. Check: centered, chapter heading, "Coming Soon." heading.

- [ ] **Step 5: Visual pass — mobile (390px)**

In DevTools, set viewport to 390px wide. Check:

- Top nav hidden (floating pill nav visible at bottom)
- Profile card stacks cleanly
- Info grid 2-column still fits at 390px
- Stat cards fit

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: full test suite and visual pass — sage profile card redesign complete"
```
