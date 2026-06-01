# Resume / CV Page Design Spec

**Date:** 2026-05-29
**Status:** Approved
**Branch:** dev-feature/ricky/resume-cv

---

## Overview

Add a `/resume` page to the portfolio site: a traditional single-column resume document for web viewing, plus a `/resume.pdf` static file generated at build time via `@react-pdf/renderer`. Both outputs are sourced from `src/data/experience.ts` — no duplicate data maintenance.

---

## Goals

- Give recruiters a clean, printable resume view distinct from the editorial `/experience` page.
- Provide a one-click PDF download generated automatically at build time.
- Surface business-impact metrics (80% conversion, Rp 3 miliar+ loan originations, 1.5M active users) in both web and PDF outputs.

---

## Architecture

Two independent outputs from one data source:

```
src/data/experience.ts                   ← single source of truth
        │
        ├─→ src/pages/resume.astro        → /resume  (web page)
        │
        └─→ src/pages/resume.pdf.ts       → /resume.pdf  (build-time PDF)
               uses src/components/resume/ResumePdf.tsx
```

### Web page (`/resume`)
- Astro page using `MainLayout`.
- Single-column, max-width ~680px centered, document layout.
- Sections divided by thin `border-border` horizontal rules.
- Typography uses existing site tokens: Lora for headings, JetBrains Mono for labels/tags, `text-foreground` / `text-muted` / `text-accent` colors.
- No `§` chapter markers or `eyebrow` pills — reads as a document, not a portfolio page.
- "Download PDF" button linking to `/resume.pdf`.
- Added to `AppHeader.astro` nav links.

### PDF endpoint (`/resume.pdf.ts`)
- Astro static API endpoint (`GetStaticPaths` not needed — single file).
- Calls `pdf.renderToBuffer(<ResumePdf ... />)` at build time.
- Returns `Response(new Uint8Array(buffer), { 'Content-Type': 'application/pdf' })`.
- Output is written to `dist/resume.pdf` by Astro's static build.

### PDF component (`src/components/resume/ResumePdf.tsx`)
- `@react-pdf/renderer` component using `Document`, `Page`, `View`, `Text`, `Link` primitives.
- Receives all resume data as props from `resume.pdf.ts`.
- Palette: `#0e1a16` text, `#8ca89c` accent, `#f8f7f4` background.
- Fonts: reuses `/public/fonts/JetBrainsMono-Regular.ttf` and `/public/fonts/Lora-Italic.ttf` (already present).
- Mirrors web page section order: header → summary → work experience → project experience → education → skills.

---

## Content

### New: `summary` export in `src/data/experience.ts`

```ts
export const summary = `Fullstack developer with 4+ years delivering production systems in Indonesian fintech. At PT. Pegadaian, I build micro-frontend platforms and NestJS microservice backends powering a loan lead platform at 80% conversion facilitating Rp 3 miliar+ in loan originations, and an employee super-app serving 1.5 million active users.`
```

### Resume header section (new — web + PDF)
- Name: Ricki Friadi
- Title: Fullstack Developer
- Location: Jakarta, Indonesia
- Email: friadi.ricki@gmail.com
- GitHub: github.com/rickyfrdy

### Updated bullets in `src/data/experience.ts`

All bullet updates flow to both `/resume` and `/experience`.

**PT. Pegadaian — Software Engineer (May 2023 – Present):**
- Led migration of Microsite Pinjaman from PHP/CodeIgniter monolith to 9 NestJS microservices, achieving 80% lead-to-approval conversion and facilitating Rp 3 miliar+ in loan originations across KUR, Serba Guna, and Cicil Kendaraan products.
- Built micro-frontend modules for Singel APP (Pegadaian Kita) using Module Federation, contributing to a platform serving 1.5 million active users with parallel team deployments and independent delivery per feature.
- Developed KPI tracking and marketing performance modules in KAMILA, enabling data-driven performance reviews and loan lead submission integration with external business partners.

**Freelance — Web Development (Sep 2021 – Jan 2023):**
- Delivered responsive web applications for SMB clients using React.js, Node.js, and PostgreSQL, enabling clients to establish digital presence and automate customer-facing processes.
- Integrated third-party APIs and relational/document databases (MongoDB, MySQL, PostgreSQL), replacing manual workflows and enabling measurable operational efficiency gains.

**PT. Sumatera Kalimantan Jaya — Web Development (Apr 2021 – Jul 2021):**
- Delivered a company profile website in 14 days using CodeIgniter, establishing the company's digital presence ahead of schedule.
- Implemented an MPOS application for real-time sales and inventory management with a 3-person team, eliminating manual stock tracking and enabling accurate daily financial reporting.

**Project: Singel APP (Pegadaian Kita):**
- Built modular micro-frontend components with Module Federation serving 1.5 million active users; achieved ≥80% unit test coverage with Vitest, enabling continuous delivery at scale.
- Advocated for clean code and component-driven development, reducing cross-team integration friction in a multi-team parallel deployment environment.

**Project: Microsite Pinjaman Pegadaian:**
- Factory-pattern architecture supports onboarding new loan types without codebase changes, directly enabling Rp 3 miliar+ origination volume at 80% lead-to-approval conversion.
- Designed 9 backend microservices with clear contracts and comprehensive documentation, enabling knowledge transfer to subsequent engineers.

**Project: KAMILA Application:**
- Built KPI tracking and marketing performance reporting modules, giving management data-driven visibility into field team performance.
- Developed loan lead submission integration with external business partners, expanding Pegadaian's origination channels beyond direct customer acquisition.

**Project: Reconciliation System (AIRA):**
- Extended bank reconciliation coverage to additional partner banks, ensuring financial transaction accuracy and compliance with Pegadaian's core banking accounting standards.

**Project: Thesis — Chatbot Kukerta Information System:**
- Achieved 80% question match accuracy on a 3,000-entry dialogue dataset using fuzzy string matching, automating student information queries for the university's KKN program.

---

## Page Layout (Web)

```
┌─────────────────────────────────────┐
│  Ricki Friadi                        │  ← Lora, large
│  Fullstack Developer                 │  ← text-muted, sm
│  Jakarta · friadi.ricki@gmail.com   │  ← text-muted, xs mono
│  github.com/rickyfrdy               │  ← accent link, xs mono
├─────────────────────────────────────┤  ← border-border hr
│  SUMMARY                            │  ← section label, mono uppercase
│  [summary paragraph]                │
├─────────────────────────────────────┤
│  WORK EXPERIENCE                    │
│  Role · Company                     │  ← font-semibold
│  Location · Period                  │  ← text-muted xs
│    › bullet text                    │
│    Stack: tag tag tag               │  ← diff-tag chips
├─────────────────────────────────────┤
│  PROJECT EXPERIENCE                 │
│  (same structure as work)           │
├─────────────────────────────────────┤
│  EDUCATION                          │
│  Degree · Institution · GPA        │
├─────────────────────────────────────┤
│  SKILLS                             │
│  Frameworks: Vue.js React...        │
│  Languages: TypeScript PHP...       │
└─────────────────────────────────────┘
         [ Download PDF ↓ ]
```

---

## File Changeset

| File | Action |
|------|--------|
| `src/data/experience.ts` | Add `summary` export; update bullets for all 3 work roles and 5 projects |
| `src/pages/resume.astro` | Create — web resume page |
| `src/pages/resume.pdf.ts` | Create — static API endpoint, calls `renderToBuffer` |
| `src/components/resume/ResumePdf.tsx` | Create — `@react-pdf/renderer` PDF component |
| `src/components/layout/AppHeader.astro` | Add Resume nav link |
| `package.json` | Add `@react-pdf/renderer` dependency |

---

## Error Handling

- `resume.pdf.ts` — if `renderToBuffer` throws, Astro build fails loudly (no silent fallback; PDF generation is a build-time guarantee, not a runtime concern).
- Font loading — reuses existing `/public/fonts/` files already validated by the OG images feature. Same static TTF constraint applies.

---

## Testing

No new unit tests. `ResumePdf.tsx` is a pure render component with no branching logic. The existing 68-test suite covers all utility functions. Manual verification: confirm `/resume` renders correctly and `/resume.pdf` is present in `dist/` after `npx astro build`.

---

## Out of Scope

- Print stylesheet on the web page (`@media print`) — the build-time PDF is the download artifact; no need to also style the web page for printing.
- Separate resume data file — all data stays in `experience.ts` to avoid drift.
- Analytics/tracking on PDF download clicks.
