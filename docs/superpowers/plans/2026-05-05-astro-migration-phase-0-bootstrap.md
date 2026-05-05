# Astro Migration — Phase 0: Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Vue 3 ricki-portfolio repo into a working Astro 5 skeleton with layout shell, theme switching, strict linting, and passing tests — no real page content yet.

**Architecture:** Operate inside the existing repo on a new branch. Remove all Vue-specific files and dependencies, install Astro 5 + integrations (React, Tailwind v4 via vite plugin, sitemap). The output is a running `bun dev` with a blank layout, dark/light theme via nanostores, Biome + eslint-plugin-astro green, and unit tests passing.

**Tech Stack:** Astro 5, @astrojs/react, @tailwindcss/vite (Tailwind v4), @astrojs/sitemap, astro-robots-txt, nanostores, @nanostores/react, Biome, eslint-plugin-astro, husky, lint-staged, dangerjs, TypeScript strict, vitest

---

## File Map

| Action      | Path                                                            | Responsibility                            |
| ----------- | --------------------------------------------------------------- | ----------------------------------------- |
| Create      | `src/components/layout/BaseHead.astro`                          | SEO, OG, canonical, JSON-LD per page      |
| Create      | `src/components/layout/MainLayout.astro`                        | Root HTML shell, slots for page content   |
| Create      | `src/components/layout/AppHeader.astro`                         | Navigation shell (placeholder links)      |
| Create      | `src/components/layout/AppFooter.astro`                         | Footer shell (placeholder)                |
| Create      | `src/pages/index.astro`                                         | Placeholder home page using MainLayout    |
| Create      | `src/pages/404.astro`                                           | 404 page                                  |
| Create      | `src/stores/theme.ts`                                           | nanostores dark/light atom + helpers      |
| Keep/verify | `src/utils/cn.ts`                                               | clsx + tailwind-merge helper              |
| Create      | `src/styles/global.css`                                         | Tailwind v4 import + CSS design tokens    |
| Create      | `astro.config.ts`                                               | Astro integrations + vite config          |
| Create      | `biome.json`                                                    | Biome lint + format rules                 |
| Create      | `.eslintrc-astro.cjs`                                           | eslint-plugin-astro for .astro files only |
| Create      | `dangerfile.ts`                                                 | DangerJS PR automation rules              |
| Rewrite     | `tsconfig.json`                                                 | Astro strict TypeScript config            |
| Rewrite     | `lint-staged.config.js`                                         | Biome for .ts/.tsx, eslint for .astro     |
| Rewrite     | `vitest.config.ts`                                              | Standalone vitest (no vite.config merge)  |
| Rewrite     | `package.json` scripts                                          | Astro dev/build/check/lint commands       |
| Create      | `tests/stores/theme.test.ts`                                    | Unit tests for theme store                |
| Create      | `tests/utils/cn.test.ts`                                        | Unit tests for cn utility                 |
| Delete      | `vite.config.ts`                                                | Replaced by astro.config.ts               |
| Delete      | `index.html`                                                    | Replaced by Astro pages                   |
| Delete      | `src/App.vue`, `src/main.ts`, `src/style.css`                   | Vue entry point                           |
| Delete      | `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.test.json` | Replaced by Astro tsconfig                |

---

## Task 1: Create migration branch

**Files:** (git only)

- [ ] **Step 1: Create and switch to migration branch**

```bash
git checkout -b feat/astro-migration
```

Expected: `Switched to a new branch 'feat/astro-migration'`

- [ ] **Step 2: Verify you're on the right branch**

```bash
git branch --show-current
```

Expected: `feat/astro-migration`

---

## Task 2: Remove Vue dependencies and files

**Files:**

- Delete: `src/App.vue`
- Delete: `src/main.ts`
- Delete: `src/style.css`
- Delete: `index.html`
- Delete: `tsconfig.app.json`
- Delete: `tsconfig.node.json`
- Delete: `tsconfig.test.json`
- Delete: `vite.config.ts`

- [ ] **Step 1: Remove Vue-specific source files**

```bash
rm src/App.vue src/main.ts src/style.css index.html
rm tsconfig.app.json tsconfig.node.json tsconfig.test.json
rm vite.config.ts
```

- [ ] **Step 2: Remove all Vue + old tooling packages**

```bash
bun remove vue vue-router pinia vite-ssg @unhead/vue reka-ui radix-ui \
  @vueuse/core @vueuse/motion lucide-vue-next vee-validate vue-sonner next-themes \
  @vitejs/plugin-vue @vue/compiler-sfc @vue/tsconfig vue-tsc \
  eslint-plugin-vue vue-eslint-parser @eslint/js typescript-eslint \
  globals eslint prettier prettier-plugin-organize-imports \
  prettier-plugin-tailwindcss @testing-library/vue @vue/test-utils \
  vite-plugin-compression2
```

Expected: Packages removed, `bun.lock` updated.

- [ ] **Step 3: Remove old component and router directories (will be rebuilt)**

```bash
rm -rf src/components src/router src/stores src/hooks
```

- [ ] **Step 4: Verify node_modules has no vue**

```bash
ls node_modules | grep "^vue" || echo "vue removed"
```

Expected: `vue removed`

---

## Task 3: Install Astro and all new dependencies

**Files:** `package.json`, `bun.lock`

- [ ] **Step 1: Install Astro core + integrations**

```bash
bun add astro @astrojs/react @astrojs/sitemap @astrojs/check astro-robots-txt
```

- [ ] **Step 2: Install React (required by @astrojs/react)**

```bash
bun add react react-dom @types/react @types/react-dom
```

- [ ] **Step 3: Install nanostores**

```bash
bun add nanostores @nanostores/react
```

- [ ] **Step 4: Install lucide-react and sonner**

```bash
bun add lucide-react sonner gsap
```

- [ ] **Step 5: Install new dev tooling**

```bash
bun add -d @biomejs/biome eslint eslint-plugin-astro eslint-plugin-jsx-a11y \
  @typescript-eslint/parser @testing-library/react danger
```

Note: `@vitest/coverage-v8` and `@vitest/ui` are already in the project — do NOT remove them.

- [ ] **Step 6: Verify astro installed**

```bash
bunx astro --version
```

Expected: version string like `astro v5.x.x`

---

## Task 4: Configure astro.config.ts

**Files:**

- Create: `astro.config.ts`

- [ ] **Step 1: Create astro.config.ts**

```ts
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://rickifriadi.dev',
  output: 'static',
  integrations: [react(), sitemap(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  }
})
```

- [ ] **Step 2: Verify astro can read config**

```bash
bunx astro check 2>&1 | head -5 || true
```

Expected: No import errors on the config file itself (type errors are expected at this stage).

---

## Task 5: Configure TypeScript (strict mode)

**Files:**

- Rewrite: `tsconfig.json`

- [ ] **Step 1: Replace tsconfig.json with Astro strict config**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@test/*": ["./tests/*"]
    },
    "useUnknownInCatchVariables": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*", "tests/**/*", "*.ts", "*.cts", "*.mts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

- [ ] **Step 2: Verify TypeScript resolves**

```bash
bunx tsc --noEmit 2>&1 | head -20 || true
```

Expected: May show errors about missing files (components not created yet) — that's fine. Should NOT show "Cannot find module 'astro/tsconfigs/strict'".

---

## Task 6: Configure Biome

**Files:**

- Create: `biome.json`

- [ ] **Step 1: Create biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "include": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "tests/**/*.ts",
      "tests/**/*.tsx",
      "*.ts",
      "*.tsx",
      "*.js",
      "*.mjs",
      "*.cjs"
    ],
    "ignore": ["node_modules", "dist", "coverage", ".astro"]
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noConsole": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "none",
      "semicolons": "asNeeded"
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

- [ ] **Step 2: Run Biome check to verify config is valid**

```bash
bunx biome check --config-path biome.json biome.json
```

Expected: Either clean or only formatting warnings — no config parse errors.

---

## Task 7: Configure eslint-plugin-astro

**Files:**

- Create: `.eslintrc-astro.cjs`

- [ ] **Step 1: Create .eslintrc-astro.cjs**

```js
module.exports = {
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      extends: ['plugin:astro/recommended', 'plugin:jsx-a11y/recommended'],
      plugins: ['jsx-a11y'],
      rules: {
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/no-conflict-set-directives': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/alt-text': 'error'
      }
    }
  ]
}
```

- [ ] **Step 2: Verify eslint can parse the config**

```bash
bunx eslint --config .eslintrc-astro.cjs --print-config /dev/null 2>&1 | head -5 || true
```

Expected: JSON output starting with `{` — no "Cannot find module" errors.

---

## Task 8: Update lint-staged and husky

**Files:**

- Rewrite: `lint-staged.config.js`
- Modify: `.husky/pre-commit`

- [ ] **Step 1: Rewrite lint-staged.config.js**

```js
export default {
  '*.{ts,tsx,js,mjs,cjs}': ['biome check --write --no-errors-on-unmatched'],
  '*.astro': ['eslint --fix --config .eslintrc-astro.cjs'],
  '*.{json,css,html}': ['biome format --write --no-errors-on-unmatched']
}
```

- [ ] **Step 2: Update .husky/pre-commit to run lint-staged**

Read the current `.husky/pre-commit` file. If it already runs `lint-staged`, leave it. If not, replace its content:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bun lint-staged
```

- [ ] **Step 3: Verify husky hook is executable**

```bash
ls -la .husky/pre-commit
```

Expected: `-rwxr-xr-x` permissions (executable).

If not executable:

```bash
chmod +x .husky/pre-commit
```

---

## Task 9: Update package.json scripts

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Replace the scripts section in package.json**

Open `package.json` and replace the `"scripts"` block with:

```json
"scripts": {
  "prepare": "husky",
  "dev": "astro dev",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "check": "astro check",
  "lint": "biome check . && eslint --config .eslintrc-astro.cjs 'src/**/*.astro'",
  "lint:fix": "biome check --write . && eslint --fix --config .eslintrc-astro.cjs 'src/**/*.astro'",
  "format": "biome format --write .",
  "format:check": "biome format .",
  "lint-staged": "lint-staged",
  "test": "vitest",
  "test:ui": "vitest --ui --coverage",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

---

## Task 10: Update vitest.config.ts

**Files:**

- Rewrite: `vitest.config.ts`

- [ ] **Step 1: Rewrite vitest.config.ts (standalone, no vite.config merge)**

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.astro']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './tests')
    }
  }
})
```

- [ ] **Step 2: Verify tests/setup.ts exists and is valid**

```bash
cat tests/setup.ts
```

If the file doesn't exist or imports Vue test utils, replace it with:

```ts
import '@testing-library/jest-dom'
```

---

## Task 11: Create src/utils/cn.ts and its test

**Files:**

- Keep: `src/utils/cn.ts` (already exists, just verify)
- Create: `tests/utils/cn.test.ts`

- [ ] **Step 1: Verify cn.ts is correct**

```bash
cat src/utils/cn.ts
```

Expected content (already exists):

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

If the return type annotation is missing, add it now. This is required by `noImplicitReturns`.

- [ ] **Step 2: Create tests/utils/cn.test.ts**

```bash
mkdir -p tests/utils
```

Create `tests/utils/cn.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates tailwind conflicts (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })
})
```

- [ ] **Step 3: Run test to verify it passes**

```bash
bun test:run tests/utils/cn.test.ts
```

Expected: `4 passed`

---

## Task 12: Create theme store and its test

**Files:**

- Create: `src/stores/theme.ts`
- Create: `tests/stores/theme.test.ts`

- [ ] **Step 1: Create tests/stores/theme.test.ts (test first)**

```bash
mkdir -p tests/stores src/stores
```

Create `tests/stores/theme.test.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest'
import { theme, toggleTheme, setThemeValue } from '@/stores/theme'

describe('theme store', () => {
  afterEach(() => {
    theme.set('dark')
  })

  it('defaults to dark', () => {
    expect(theme.get()).toBe('dark')
  })

  it('toggles from dark to light', () => {
    theme.set('dark')
    toggleTheme()
    expect(theme.get()).toBe('light')
  })

  it('toggles from light to dark', () => {
    theme.set('light')
    toggleTheme()
    expect(theme.get()).toBe('dark')
  })

  it('setThemeValue updates the atom', () => {
    setThemeValue('light')
    expect(theme.get()).toBe('light')
  })
})
```

- [ ] **Step 2: Run test to verify it fails (expected)**

```bash
bun test:run tests/stores/theme.test.ts 2>&1 | tail -5
```

Expected: FAIL — `Cannot find module '@/stores/theme'`

- [ ] **Step 3: Create src/stores/theme.ts**

```ts
import { atom } from 'nanostores'

export type Theme = 'light' | 'dark'

export const theme = atom<Theme>('dark')

export function toggleTheme(): void {
  theme.set(theme.get() === 'dark' ? 'light' : 'dark')
}

export function setThemeValue(value: Theme): void {
  theme.set(value)
}

export function initTheme(): void {
  if (typeof localStorage === 'undefined') return
  const stored = localStorage.getItem('theme') as Theme | null
  const preferred: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const resolved = stored ?? preferred
  theme.set(resolved)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function applyThemeToDom(value: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
  localStorage.setItem('theme', value)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
bun test:run tests/stores/theme.test.ts
```

Expected: `4 passed`

- [ ] **Step 5: Commit theme store + cn test**

```bash
git add src/stores/theme.ts src/utils/cn.ts tests/stores/theme.test.ts tests/utils/cn.test.ts
git commit -m "feat(stores): add theme nanostores atom with toggle helpers"
```

---

## Task 13: Create global CSS

**Files:**

- Create: `src/styles/global.css`

- [ ] **Step 1: Create src/styles directory and global.css**

```bash
mkdir -p src/styles
```

Create `src/styles/global.css`:

```css
@import 'tailwindcss';

@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 222 47% 11%;
    --muted: 210 16% 93%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;
    --ring: 221 83% 53%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
  }

  .dark {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --border: 217 33% 17%;
    --ring: 224 76% 48%;
    --primary: 224 76% 48%;
    --primary-foreground: 210 40% 98%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
}
```

---

## Task 14: Create BaseHead.astro

**Files:**

- Create: `src/components/layout/BaseHead.astro`

- [ ] **Step 1: Create layout directory**

```bash
mkdir -p src/components/layout
```

- [ ] **Step 2: Create src/components/layout/BaseHead.astro**

```astro
---
interface Props {
  title: string
  description: string
  ogImage?: string | undefined
}

const { title, description, ogImage = '/og-default.png' } = Astro.props
const siteTitle = title.includes('Ricki Friadi') ? title : `${title} — Ricki Friadi`
const canonicalURL = new URL(Astro.url.pathname, Astro.site)
const ogImageURL = new URL(ogImage, Astro.site)

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ricki Friadi',
  url: Astro.site?.toString(),
  jobTitle: 'Fullstack Developer',
  sameAs: [
    'https://github.com/rickifriadi',
    'https://linkedin.com/in/rickifriadi',
  ],
})
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="generator" content={Astro.generator} />

<!-- Primary -->
<title>{siteTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={siteTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Ricki Friadi" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={siteTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- JSON-LD -->
<script type="application/ld+json" set:html={jsonLd} />

<!-- Theme init (runs before paint to avoid flash) -->
<script is:inline>
  ;(function () {
    const stored = localStorage.getItem('theme')
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const theme = stored || preferred
    document.documentElement.classList.toggle('dark', theme === 'dark')
  })()
</script>
```

---

## Task 15: Create AppHeader.astro and AppFooter.astro

**Files:**

- Create: `src/components/layout/AppHeader.astro`
- Create: `src/components/layout/AppFooter.astro`

- [ ] **Step 1: Create src/components/layout/AppHeader.astro**

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/works', label: 'Works' },
  { href: '/contact', label: 'Contact' },
] as const

const currentPath = Astro.url.pathname
---

<header class="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="text-lg font-semibold tracking-tight">
      Ricki Friadi
    </a>

    <ul class="hidden items-center gap-6 md:flex">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'text-sm transition-colors hover:text-[hsl(var(--primary))]',
              currentPath === href
                ? 'text-[hsl(var(--foreground))] font-medium'
                : 'text-[hsl(var(--muted-foreground))]',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>

    <button
      id="theme-toggle"
      aria-label="Toggle dark mode"
      class="rounded-md p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
    >
      <span class="block dark:hidden" aria-hidden="true">☀️</span>
      <span class="hidden dark:block" aria-hidden="true">🌙</span>
    </button>
  </nav>
</header>

<script>
  import { toggleTheme, applyThemeToDom, theme } from '@/stores/theme'

  const btn = document.getElementById('theme-toggle')
  btn?.addEventListener('click', () => {
    toggleTheme()
    applyThemeToDom(theme.get())
  })
</script>
```

- [ ] **Step 2: Create src/components/layout/AppFooter.astro**

```astro
---
const year = new Date().getFullYear()
---

<footer class="border-t border-[hsl(var(--border))] py-8">
  <div class="mx-auto max-w-6xl px-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
    <p>© {year} Ricki Friadi. Built with Astro.</p>
  </div>
</footer>
```

---

## Task 16: Create MainLayout.astro

**Files:**

- Create: `src/components/layout/MainLayout.astro`

- [ ] **Step 1: Create src/components/layout/MainLayout.astro**

```astro
---
import AppFooter from './AppFooter.astro'
import AppHeader from './AppHeader.astro'
import BaseHead from './BaseHead.astro'
import '@/styles/global.css'

interface Props {
  title: string
  description: string
  ogImage?: string | undefined
}

const { title, description, ogImage } = Astro.props
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <BaseHead title={title} description={description} ogImage={ogImage} />
  </head>
  <body class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </body>
</html>
```

---

## Task 17: Create placeholder pages

**Files:**

- Create: `src/pages/index.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create src/pages directory**

```bash
mkdir -p src/pages
```

- [ ] **Step 2: Create src/pages/index.astro**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="Ricki Friadi — Fullstack Developer"
  description="Portfolio of Ricki Friadi, a Fullstack Developer specializing in Vue 3, TypeScript, and NestJS."
>
  <section class="mx-auto max-w-6xl px-6 py-24">
    <h1 class="text-4xl font-bold">
      Coming soon — Astro migration in progress.
    </h1>
  </section>
</MainLayout>
```

- [ ] **Step 3: Create src/pages/404.astro**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="404 — Page Not Found"
  description="The page you're looking for doesn't exist."
>
  <section class="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-48 text-center">
    <p class="text-8xl font-black text-[hsl(var(--muted-foreground))]">404</p>
    <h1 class="mt-4 text-2xl font-semibold">Page not found</h1>
    <a
      href="/"
      class="mt-8 rounded-md bg-[hsl(var(--primary))] px-6 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
    >
      Go home
    </a>
  </section>
</MainLayout>
```

- [ ] **Step 4: Add favicon placeholder to public/**

```bash
mkdir -p public
```

Create `public/favicon.svg` (minimal SVG):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">🧑‍💻</text>
</svg>
```

---

## Task 18: Create DangerJS config

**Files:**

- Create: `dangerfile.ts`

- [ ] **Step 1: Create dangerfile.ts**

```ts
import { danger, fail, warn } from 'danger'

const pr = danger.github.pr
const modifiedFiles = danger.git.modified_files
const createdFiles = danger.git.created_files
const changedFiles = [...modifiedFiles, ...createdFiles]

const lineChanges = pr.additions + pr.deletions
if (lineChanges > 500) {
  warn(
    `This PR changes ${lineChanges} lines. Consider splitting into smaller PRs for easier review.`
  )
}

const conventionalCommit =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+/
if (!conventionalCommit.test(pr.title)) {
  fail(
    `PR title "${pr.title}" must follow Conventional Commits. Example: "feat(home): add hero section"`
  )
}

const srcChanged = changedFiles.some((f) => f.startsWith('src/'))
const testChanged = changedFiles.some((f) => f.startsWith('tests/'))
if (srcChanged && !testChanged) {
  warn('Source files changed but no test files modified. Please add or update tests.')
}

for (const file of changedFiles) {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.astro')) {
    const fileDiff = await danger.git.diffForFile(file)
    if (fileDiff?.added.includes('console.log')) {
      fail(`console.log found in diff of ${file}. Remove before merging.`)
    }
  }
}
```

---

## Task 19: Verify dev server and run all checks

**Files:** (verification only)

- [ ] **Step 1: Run all unit tests**

```bash
bun test:run
```

Expected: `2 test files, 8 tests passed` (cn + theme tests)

- [ ] **Step 2: Start dev server**

```bash
bun dev
```

Expected: Output like:

```
 astro  v5.x.x started in Xs

  Local    http://localhost:4321/
  Network  use --host to expose
```

- [ ] **Step 3: Verify the page loads in browser**

Open `http://localhost:4321` and confirm:

- Page renders without JS errors in console
- Dark mode class is applied on `<html>`
- Header navigation links render
- Footer renders
- Theme toggle button toggles dark/light

- [ ] **Step 4: Verify 404 page**

Open `http://localhost:4321/nonexistent` and confirm:

- Custom 404 page renders (not a framework error)

- [ ] **Step 5: Stop dev server (Ctrl+C), then run astro check**

```bash
bun check
```

Expected: `Result (5 files): 0 errors, 0 warnings, 0 hints` (or similar — all `.astro` type checks pass)

- [ ] **Step 6: Run Biome lint**

```bash
bunx biome check .
```

Expected: No errors. Fix any warnings before proceeding.

- [ ] **Step 7: Run eslint on .astro files**

```bash
bunx eslint --config .eslintrc-astro.cjs 'src/**/*.astro'
```

Expected: No errors.

---

## Task 20: Final commit

- [ ] **Step 1: Stage all new files**

```bash
git add \
  astro.config.ts \
  biome.json \
  tsconfig.json \
  .eslintrc-astro.cjs \
  dangerfile.ts \
  lint-staged.config.js \
  vitest.config.ts \
  package.json \
  bun.lock \
  src/ \
  public/ \
  tests/
```

- [ ] **Step 2: Verify staged files look correct**

```bash
git diff --cached --stat
```

Expected: New files listed, deleted files shown as deleted. No unexpected changes.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(bootstrap): init Astro 5 with layout, theme, Biome, and strict TS

- Replace Vue 3 + vite-ssg with Astro 5 SSG
- Add React island integration via @astrojs/react
- Add Tailwind v4 via @tailwindcss/vite plugin
- Set up Biome (lint+format) + eslint-plugin-astro for .astro files
- Configure strict TypeScript: noImplicitAny, useUnknownInCatchVariables
- Add nanostores theme store with dark/light toggle
- Add BaseHead.astro with SEO, OG, JSON-LD, and no-flash theme init
- Add MainLayout, AppHeader, AppFooter, placeholder index + 404 pages
- Add DangerJS PR automation rules
- All unit tests passing (cn util + theme store)"
```

---

## Phase 0 Done ✓

At this point you have:

- `bun dev` → running Astro app at localhost:4321
- `bun test:run` → 8 passing tests
- `bun check` → 0 TypeScript errors
- `bunx biome check .` → 0 lint errors
- Dark/light theme toggle working
- SEO-ready `BaseHead.astro` on every page
- Git pre-commit hooks active

**Next:** See `docs/superpowers/plans/2026-05-05-astro-migration-phase-1-static-pages.md` (Experience + About pages).
