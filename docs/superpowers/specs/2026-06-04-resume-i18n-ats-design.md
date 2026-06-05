# Resume i18n (EN/ID) + ATS-Friendly PDF — Design Spec

**Date:** 2026-06-04
**Branch:** `dev-feature/ricky/resume-i18n-ats`
**Base:** `feature/ricky/v1.2.1`

---

## Overview

Two goals addressed together:

1. **ATS-friendly PDF download** — a plain-text variant of the resume PDF optimised for applicant tracking systems.
2. **Site-wide Indonesian (i18n)** — full EN/ID language support using Astro's native i18n URL routing, with a flag-based animated language switcher in the navbar.

---

## 1. ATS PDF

### Problem

The current `ResumePdf.tsx` uses JetBrains Mono + Lora custom fonts, coloured tag backgrounds, accent-coloured arrows, and decorative borders. ATS parsers commonly skip or corrupt text rendered with custom fonts and CSS styling, causing parsed resumes to lose bullet points or garble skill tags.

### Solution

A parallel PDF template `ResumePdfAts.tsx` that renders the same data in a maximally machine-readable format.

**Rules for ATS template:**
- Font: Helvetica only (react-pdf built-in, no font file needed)
- Colors: `#000000` text on `#ffffff` background — no accent colors, no tag backgrounds
- Skills rendered as comma-separated plain text, not styled tag pills
- Bullet markers: plain hyphen `–` instead of styled arrow `›`
- Section headers: ALL CAPS plain text separated by a 0.5pt `borderBottom` line
- No `borderRadius`, no `backgroundColor` on any `<View>`
- No decorative elements

**Props interface:** Identical to `ResumePdf` — same `experiences`, `projects`, `education`, `skillCategories`, `summary`.

### New files

| File | Purpose |
|------|---------|
| `src/components/resume/ResumePdfAts.tsx` | ATS-friendly PDF template |
| `src/pages/resume-ats.pdf.ts` | English ATS PDF route → `GET /resume-ats.pdf` |
| `src/pages/id/resume-ats.pdf.ts` | Indonesian ATS PDF route → `GET /id/resume-ats.pdf` |
| `src/pages/id/resume.pdf.ts` | Indonesian designed PDF route → `GET /id/resume.pdf` |

### Updated download UI (`resume.astro` + `id/resume.astro`)

Two download buttons side by side:
- Primary: "Download PDF" → `/resume.pdf` (designed version)
- Secondary: "ATS Version" → `/resume-ats.pdf` (smaller, muted style)

---

## 2. i18n Data Layer

### Content files

**`src/data/experience.ts`** — unchanged, remains English source of truth.

**`src/data/experience.id.ts`** — new, exports the same TypeScript shape:
- `summary` — Indonesian professional summary
- `experiences[].bullets` — translated achievement descriptions
- `projects[].bullets` — translated project descriptions  
- `education.degree` — e.g. "Sarjana Teknik Informatika"
- `skillCategories[].label` — mostly English (tech terms stay universal)
- `role`, `company`, `location`, `period`, `stack` — kept in English (proper nouns)

**`src/i18n/ui.ts`** — expanded with `id` locale keys covering:
- All section headings (Summary, Work Experience, Education, Skills, etc.)
- Page titles and meta descriptions
- Nav labels
- Button labels (Download PDF, ATS Version, View Live Demo, etc.)
- Footer copy
- Common UI strings (Back, Next, Previous, etc.)

The existing `t(lang, key)` helper stays as-is — just more keys and the `id` locale added.

No runtime translation library needed — all content is static, resolved at build time.

---

## 3. Astro i18n Routing

### Config (`astro.config.mjs`)

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'id'],
  routing: { prefixDefaultLocale: false }
}
```

`prefixDefaultLocale: false` preserves all existing English URLs with no breaking changes. Indonesian content is served under `/id/`.

### Page structure

| English (existing) | Indonesian (new) |
|--------------------|-----------------|
| `/` | `/id/` |
| `/about` | `/id/about` |
| `/resume` | `/id/resume` |
| `/experience` | `/id/experience` |
| `/projects` | `/id/projects` |
| `/works` | `/id/works` |
| `/contact` | `/id/contact` |
| `/resume.pdf` | `/id/resume.pdf` |
| `/resume-ats.pdf` | `/id/resume-ats.pdf` |

All Indonesian pages live under `src/pages/id/` as static `.astro` files. They import from `experience.id.ts` and use `t('id', key)` for UI strings.

### `MainLayout.astro` changes

Accepts a new `lang: 'en' | 'id'` prop:
- Sets `<html lang={lang}>` 
- Passes `lang` and current path slug to `LangSwitcher`

---

## 4. Language Switcher

### Component: `LangSwitcher.tsx`

React island (`client:load transition:persist`) — needs Framer Motion for animations.

**Placement in header (right side, before theme toggle):**
```
[ 🐣 logo ]  [ nav links ]  [ 🇺🇸 🇮🇩 ]  [ ☀️/🌙 ]
```

Hidden on mobile (`md:flex hidden`).

**Visual design:**
- Compact two-flag pill with a floating spring background sliding between flags
- Active flag: `scale: 1.25`, full opacity
- Inactive flag: `scale: 0.9`, 45% opacity
- Background pill uses `layoutId="lang-pill"` with the same spring config as the nav pill (`stiffness: 400, damping: 30, mass: 0.8`)
- Pill background: `color-mix(in oklch, var(--color-accent) 12%, transparent)` with accent border — matches nav active pill style

**Animations:**
- **Sliding pill:** `layoutId="lang-pill"` spring slides under the active flag on switch
- **Flag scale:** spring transition on `scale` between active/inactive states
- **Tap feedback:** GSAP micro-bounce on the container (`scale 0.88 → 1`, `back.out(3)`, 200ms) — same pattern as theme toggle
- **Entry:** `initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}` with spring on mount

**Navigation on click:**
Each flag button has a pre-computed `href` (passed as a prop from the layout, using Astro's `getRelativeLocaleUrl`). On click: `window.location.href = href` — simple full navigation, no client-side routing needed.

**Props:**
```ts
interface Props {
  currentLang: 'en' | 'id'
  enHref: string   // equivalent page in English
  idHref: string   // equivalent page in Indonesian
}
```

---

## 5. File Change Summary

### New files
- `src/components/resume/ResumePdfAts.tsx`
- `src/components/layout/LangSwitcher.tsx`
- `src/data/experience.id.ts`
- `src/pages/resume-ats.pdf.ts`
- `src/pages/id/index.astro`
- `src/pages/id/about.astro`
- `src/pages/id/resume.astro`
- `src/pages/id/resume.pdf.ts`
- `src/pages/id/resume-ats.pdf.ts`
- `src/pages/id/experience.astro`
- `src/pages/id/projects.astro`
- `src/pages/id/works.astro`
- `src/pages/id/contact.astro`

### Modified files
- `astro.config.mjs` — add `i18n` config
- `src/i18n/ui.ts` — add `id` locale, expand EN keys
- `src/components/layout/AppHeader.astro` — add `LangSwitcher` island
- `src/components/layout/MainLayout.astro` — add `lang` prop, pass to header + html tag
- `src/pages/resume.astro` — add ATS download button
- All English pages — pass `lang="en"` to `MainLayout`

---

## 6. Out of Scope

- Blog posts — not translated (content-heavy, low ROI for a portfolio)
- `/og` image routes — English only
- RSS feed — English only
- Contact form — same form for both languages, labels translated via `ui.ts`
