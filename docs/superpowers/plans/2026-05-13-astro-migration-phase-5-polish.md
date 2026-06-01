# Phase 5 — Animation, Font Performance & SEO Polish Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the final polish layer — scroll-reveal animations for page sections, Google Fonts moved from render-blocking CSS `@import` to HTML `<link>` preconnect tags, and an OG image + basic SEO meta additions to BaseHead.

**Architecture:** Animations use a single `is:inline` script in `MainLayout.astro` that adds a `.js-reveal` class to `<html>` and sets up an `IntersectionObserver` targeting `main > section:not(:first-child)`. The CSS in `global.css` only hides sections when `.js-reveal` is present — so without JS, all sections remain visible. Font preconnect moves the `@import url(...)` out of the CSS file into `<link rel="preconnect">` + `<link rel="stylesheet">` in BaseHead, improving time-to-first-byte for fonts. An SVG OG image is created so the social sharing fallback resolves to an actual file.

**Tech Stack:** Astro 6, Tailwind v4, Intersection Observer API (native browser), SVG, no external libraries.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/styles/global.css` | Remove `@import` for fonts; add scroll-reveal CSS |
| Modify | `src/components/layout/MainLayout.astro` | Add `is:inline` Intersection Observer script |
| Modify | `src/components/layout/BaseHead.astro` | Add font `<link>` tags, OG image, author/robots meta |
| Create | `public/og-default.svg` | Default SVG OG image for social sharing |

---

## Task 1: Scroll-Reveal Animations

**Context:**
- `global.css` uses Tailwind v4 `@import 'tailwindcss'` at line 2. The existing `@keyframes wipe-reveal` and `@keyframes toast-in` are defined but not used for scroll reveals.
- The custom easing token `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` is available via `var(--ease-out-expo)`.
- `MainLayout.astro` wraps every page. Its `<main>` slot receives `<section>` elements directly from each page.
- The `.js-reveal` class on `<html>` is the gating mechanism — sections only start hidden when JS has run. Without JS, all sections remain fully visible.
- `is:inline` in Astro outputs the script verbatim into the HTML — no TypeScript, no imports, plain vanilla JS only.
- Biome does NOT lint `is:inline` scripts, so no `console.log` rule applies — but avoid them anyway for cleanliness.

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/layout/MainLayout.astro`

- [ ] **Step 1: Read both files**

```bash
cat src/styles/global.css | tail -20
cat src/components/layout/MainLayout.astro
```

- [ ] **Step 2: Add scroll-reveal CSS to `global.css`**

Append these rules to the END of `src/styles/global.css` (after the last closing brace):

```css
/* --- Scroll-reveal --- */
/* Only hides sections when JS has run; visible without JS */

.js-reveal main > section:not(:first-child) {
  opacity: 0;
  transform: translateY(1.5rem);
  transition:
    opacity 0.6s var(--ease-out-expo),
    transform 0.6s var(--ease-out-expo);
}

.js-reveal main > section:not(:first-child).is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Add IntersectionObserver script to `MainLayout.astro`**

The script goes just before `</body>` — after `<AppFooter />`. The complete updated file is:

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
  <body class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />

    <script is:inline>
      (function () {
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

- [ ] **Step 4: Run astro check (Node 24)**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/layout/MainLayout.astro
git commit -m "feat(animations): add scroll-reveal with IntersectionObserver, no external library"
```

---

## Task 2: Font Preconnect + OG Image + SEO Meta

**Context:**
- Current `global.css` line 1: `@import url('https://fonts.googleapis.com/css2?...')` — this is render-blocking. Moving it to an HTML `<link>` with `rel="preconnect"` reduces time-to-first-font because the browser can preconnect to Google's servers while parsing the HTML, before it even starts downloading the CSS.
- `BaseHead.astro` currently defaults `ogImage = '/og-default.png'` — this file does not exist in `public/`. We'll create `public/og-default.svg` and change the default to `/og-default.svg`.
- The Google Fonts URL to use (same as the current `@import`, with `display=swap` already included):
  `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap`

**Files:**
- Modify: `src/styles/global.css` (remove line 1 `@import`)
- Modify: `src/components/layout/BaseHead.astro`
- Create: `public/og-default.svg`

- [ ] **Step 1: Remove the `@import` from `global.css`**

Delete line 1 from `src/styles/global.css`. The file should now start with:

```css
@import 'tailwindcss';

/* Class-based dark variant (html.dark) */
@custom-variant dark (&:where(.dark, .dark *));
```

(Everything else in the file stays unchanged.)

- [ ] **Step 2: Create `public/og-default.svg`**

Create `public/og-default.svg` with this content:

```svg
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#0e1a16"/>
  <!-- Subtle grid -->
  <defs>
    <pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M36 0L0 0L0 36" fill="none" stroke="#1d2e29" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <!-- Accent bar -->
  <rect x="80" y="80" width="4" height="80" fill="#8ca89c" rx="2"/>
  <!-- Name -->
  <text x="104" y="140" font-family="Georgia,'Times New Roman',serif" font-size="72" font-weight="400" fill="#f2f0e8" letter-spacing="-1">Ricki Friadi</text>
  <!-- Title -->
  <text x="104" y="190" font-family="'Courier New',monospace" font-size="18" fill="#8ca89c" letter-spacing="5">FULLSTACK DEVELOPER</text>
  <!-- Divider -->
  <rect x="80" y="230" width="1040" height="1" fill="#1d2e29"/>
  <!-- Stack pills -->
  <text x="80" y="290" font-family="'Courier New',monospace" font-size="16" fill="#7d938d">Vue 3  ·  NestJS  ·  TypeScript  ·  Astro  ·  PostgreSQL  ·  Redis</text>
  <!-- URL -->
  <text x="80" y="560" font-family="'Courier New',monospace" font-size="16" fill="#3d5c53">rickifriadi.dev</text>
</svg>
```

- [ ] **Step 3: Rewrite `src/components/layout/BaseHead.astro`**

Write the complete file:

```astro
---
interface Props {
  title: string
  description: string
  ogImage?: string | undefined
}

const { title, description, ogImage = '/og-default.svg' } = Astro.props
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
    'https://github.com/rickyfrdy',
    'https://www.linkedin.com/in/rickifriadi',
  ],
})
---

<!-- Google Fonts preconnect (faster than @import in CSS) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
/>

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="generator" content={Astro.generator} />
<meta name="author" content="Ricki Friadi" />
<meta name="robots" content="index, follow" />

<!-- Primary -->
<title>{siteTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={siteTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
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
<link rel="apple-touch-icon" href="/favicon.svg" />

<!-- JSON-LD -->
<script is:inline type="application/ld+json" set:html={jsonLd} />

<!-- Theme init: runs before paint to avoid flash of wrong theme -->
<script is:inline>
  ;(function () {
    var stored = localStorage.getItem('theme')
    var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    var theme = stored || preferred
    document.documentElement.classList.toggle('dark', theme === 'dark')
  })()
</script>
```

- [ ] **Step 4: Run astro check (Node 24)**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 5: Verify fonts still load — check the built CSS has no @import**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -5 && grep -r "fonts.googleapis.com" dist/_astro/*.css 2>/dev/null | wc -l
```
Expected: `14 page(s) built`, and the grep returns `0` (no @import in built CSS)

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/layout/BaseHead.astro public/og-default.svg
git commit -m "perf(seo): move fonts to preconnect link tags, add OG image, add author/robots meta"
```

---

## Task 3: Final Verification

**Context:** Confirm all checks still pass with the animations and SEO changes applied.

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
Expected: `0 errors` (the suppression-comment warning on `content.config.ts` may still appear — that is the one known pre-existing warning, it is harmless)

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
Expected: `14 page(s) built`, `Complete!`

- [ ] **Step 6: Verify OG image in dist**

```bash
ls dist/og-default.svg
```
Expected: file exists

- [ ] **Step 7: Verify no @import in built CSS**

```bash
grep -l "fonts.googleapis.com" dist/_astro/*.css 2>/dev/null || echo "clean — no @import in built CSS"
```
Expected: `clean — no @import in built CSS`

- [ ] **Step 8: Commit if any unstaged changes remain**

```bash
git status --short
```
Only commit if there are changes:
```bash
git add -A && git commit -m "chore(phase5): verified — 50 tests, 0 errors, 14 pages, fonts via preconnect"
```
