# Phase 3 — Works & Contact Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `/works` visual gallery page (native Web Component filter) and `/contact` page (React island + zod client validation + Web3Forms), and fix the AppHeader/AppFooter to use Tailwind v4 semantic classes.

**Architecture:** AppHeader/AppFooter drop legacy `hsl(var(--x))` classes for the Tailwind v4 tokens already in `global.css` (`border-border`, `bg-background`, `text-muted`, etc.). The Works page is pure Astro SSG with a `<works-filter>` native custom element (inline `<script>`) for category filtering — no React, no hydration. The Contact page uses a `ContactForm.tsx` React island (`client:load`) that owns form state, zod validation, and the Web3Forms `fetch` call; the surrounding page is pure Astro.

**Tech Stack:** Astro 6 (SSG, `is:inline` script), React 19 (`client:load`), Zod 3, Web3Forms API, Tailwind v4, Biome 2, vitest + jsdom

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/components/layout/AppHeader.astro` | Replace `hsl(var(--x))` with Tailwind v4 semantic classes |
| Modify | `src/components/layout/AppFooter.astro` | Replace `hsl(var(--x))` with Tailwind v4 semantic classes |
| Create | `src/utils/contactSchema.ts` | Zod schema + inferred type for contact form |
| Create | `tests/utils/contactSchema.test.ts` | Unit tests for schema validation |
| Create | `src/components/contact/ContactForm.tsx` | React island: form state, zod validation, Web3Forms submit |
| Create | `src/pages/contact.astro` | Contact page wrapping ContactForm island |
| Create | `src/pages/works.astro` | Works gallery page with inline `<works-filter>` Web Component |

---

## Task 1: Fix AppHeader and AppFooter

**Context:** `AppHeader.astro` uses Tailwind arbitrary-value classes like `border-[hsl(var(--border))]` and `text-[hsl(var(--muted-foreground))]`. These were from the old Vue/shadcn setup. `global.css` already defines the Tailwind v4 `@theme` tokens — so `border-border`, `text-muted`, `bg-background`, `text-accent`, `bg-secondary`, `text-foreground` are all valid Tailwind classes. No `--primary` or `--muted-foreground` tokens exist; their closest equivalents are `accent` and `muted`.

**Files:**
- Modify: `src/components/layout/AppHeader.astro`
- Modify: `src/components/layout/AppFooter.astro`

- [ ] **Step 1: Read the current files**

Run:
```bash
cat src/components/layout/AppHeader.astro
cat src/components/layout/AppFooter.astro
```

- [ ] **Step 2: Rewrite AppHeader.astro**

Write `src/components/layout/AppHeader.astro` with this exact content:

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

<header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="text-foreground font-display text-lg font-light tracking-tight">
      Ricki Friadi
    </a>

    <ul class="hidden items-center gap-6 md:flex">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'font-mono text-xs tracking-widest uppercase transition-colors',
              href === '/' ? currentPath === '/' : currentPath.startsWith(href)
                ? 'text-foreground'
                : 'text-muted hover:text-accent',
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>

    <button
      id="theme-toggle"
      type="button"
      aria-label="Toggle dark mode"
      class="text-muted hover:bg-secondary hover:text-foreground rounded-md p-2 transition-colors"
    >
      <svg id="icon-sun" class="block h-4 w-4 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
      <svg id="icon-moon" class="hidden h-4 w-4 dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    </button>
  </nav>
</header>

<script>
  import { applyThemeToDom, initTheme, theme, toggleTheme } from '@/stores/theme'

  initTheme()

  const btn = document.getElementById('theme-toggle')
  btn?.addEventListener('click', () => {
    toggleTheme()
    applyThemeToDom(theme.get())
  })
</script>
```

- [ ] **Step 3: Rewrite AppFooter.astro**

Write `src/components/layout/AppFooter.astro` with this exact content:

```astro
---
const year = new Date().getFullYear()
---

<footer class="border-border border-t py-8">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
    <p class="text-muted font-mono text-xs">
      © {year} Ricki Friadi — Built with Astro &amp; Tailwind v4
    </p>
    <div class="flex gap-4">
      <a
        href="https://github.com/rickyfrdy"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-accent font-mono text-xs transition-colors"
      >
        GitHub ↗
      </a>
      <a
        href="https://www.linkedin.com/in/rickifriadi"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-accent font-mono text-xs transition-colors"
      >
        LinkedIn ↗
      </a>
      <a
        href="/contact"
        class="text-muted hover:text-accent font-mono text-xs transition-colors"
      >
        Contact
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Verify the build still passes**

Run (Node 24 required):
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5 && npm run build 2>&1 | tail -5
```
Expected: `0 errors`, `12 page(s) built`

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppHeader.astro src/components/layout/AppFooter.astro
git commit -m "refactor(layout): update header/footer to Tailwind v4 semantic classes"
```

---

## Task 2: Contact Form Schema (TDD)

**Context:** Extract the zod schema into its own file so it can be unit-tested independently of the React component. The schema lives in `src/utils/contactSchema.ts` and is imported by both `ContactForm.tsx` and the test file. Zod is already installed (`zod` package in `node_modules`).

**Files:**
- Create: `src/utils/contactSchema.ts`
- Create: `tests/utils/contactSchema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/utils/contactSchema.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { contactSchema } from '@/utils/contactSchema'

describe('contactSchema', () => {
  it('accepts valid input', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki Friadi',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined()
    }
  })

  it('rejects short name (< 2 chars)', () => {
    const result = contactSchema.safeParse({
      name: 'R',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki',
      email: 'not-an-email',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined()
    }
  })

  it('rejects short message (< 10 chars)', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki',
      email: 'ricki@example.com',
      message: 'Hi',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined()
    }
  })

  it('rejects missing fields', () => {
    const result = contactSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/utils/contactSchema.test.ts 2>&1 | tail -10
```
Expected: FAIL — `Cannot find module '@/utils/contactSchema'`

- [ ] **Step 3: Create `src/utils/contactSchema.ts`**

```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/utils/contactSchema.test.ts 2>&1 | tail -8
```
Expected: `6 passed (6)`

- [ ] **Step 5: Commit**

```bash
git add src/utils/contactSchema.ts tests/utils/contactSchema.test.ts
git commit -m "feat(utils): add contact form zod schema with tests"
```

---

## Task 3: ContactForm React Island

**Context:** `ContactForm.tsx` is a React island used with `client:load`. It imports `contactSchema` and `ContactFormData` from `src/utils/contactSchema.ts`. The Web3Forms access key is read from `import.meta.env.PUBLIC_WEB3FORMS_KEY` (Astro exposes env vars prefixed with `PUBLIC_` to the client). The form has three states: idle, submitting, success, and error. Validation runs on submit; field-level errors appear below each input after a failed attempt. The `type="submit"` button is disabled while submitting. No `console.log` — Biome will reject it.

**Files:**
- Create: `src/components/contact/ContactForm.tsx`

- [ ] **Step 1: Create `src/components/contact/ContactForm.tsx`**

```tsx
import { useState } from 'react'
import { contactSchema } from '@/utils/contactSchema'
import type { ContactFormData } from '@/utils/contactSchema'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = Partial<Record<keyof ContactFormData, string>>

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const raw = Object.fromEntries(new FormData(form))

    const parsed = contactSchema.safeParse(raw)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      })
      return
    }

    setErrors({})
    setState('submitting')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
          ...parsed.data,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setState('success')
        form.reset()
      } else {
        setErrorMessage(json.message ?? 'Submission failed.')
        setState('error')
      }
    } catch {
      setErrorMessage('Network error — please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-8 text-center">
        <p className="text-accent text-2xl font-display font-light">Message sent.</p>
        <p className="text-muted mt-2 text-sm">I'll get back to you within a few days.</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-accent mt-4 font-mono text-xs hover:underline"
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {state === 'error' && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-red-500 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-muted font-mono text-xs tracking-widest uppercase">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-400 mt-1 text-xs">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-muted font-mono text-xs tracking-widest uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-400 mt-1 text-xs">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-muted font-mono text-xs tracking-widest uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="border-border bg-secondary text-foreground placeholder:text-muted focus:ring-accent w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0"
          placeholder="What's on your mind?"
        />
        {errors.message && <p className="text-red-400 mt-1 text-xs">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="bg-accent text-background hover:bg-accent-hover disabled:opacity-50 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npx biome check src/components/contact/ContactForm.tsx 2>&1 | tail -5
```
Expected: `No fixes applied.` or 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/contact/ContactForm.tsx
git commit -m "feat(components): add ContactForm React island with zod validation"
```

---

## Task 4: Create /contact page

**Context:** Pure Astro page. The `ContactForm` island loads immediately (`client:load`) since it's the page's main interactive element. Provide a note that `PUBLIC_WEB3FORMS_KEY` must be in `.env.local` — the form submits but fails gracefully without it (Web3Forms returns a JSON error which the form handles). Follow the same chapter-based section layout as `/about` and `/experience`: eyebrow → `title-display` → chapter sections.

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/contact.astro`**

```astro
---
import ContactForm from '@/components/contact/ContactForm'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="Contact — Ricki Friadi"
  description="Get in touch with Ricki Friadi — open to fullstack roles, freelance projects, and collaboration."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Contact</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Let's Build<br />
      <span class="title-accent text-accent">Something Together.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Open to fullstack roles, freelance projects, and interesting collaborations.
      Drop a message and I'll get back to you within a few days.
    </p>
  </section>

  <!-- § 01 — Form -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Send a Message</span>
    </div>
    <div class="px-4 pb-10">
      <div class="max-w-lg">
        <ContactForm client:load />
      </div>
    </div>
  </section>

  <!-- § 02 — Other ways to reach me -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Other Channels</span>
    </div>
    <div class="grid gap-px border-border divide-border divide-y px-4 pb-8 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
      <div class="py-4 sm:pr-6">
        <p class="text-muted font-mono text-xs uppercase tracking-widest">Email</p>
        <a
          href="mailto:friadi.ricki@gmail.com"
          class="text-foreground hover:text-accent mt-1 block text-sm transition-colors"
        >
          friadi.ricki@gmail.com ↗
        </a>
      </div>
      <div class="py-4 sm:pl-6">
        <p class="text-muted font-mono text-xs uppercase tracking-widest">LinkedIn</p>
        <a
          href="https://www.linkedin.com/in/rickifriadi"
          target="_blank"
          rel="noopener noreferrer"
          class="text-foreground hover:text-accent mt-1 block text-sm transition-colors"
        >
          linkedin.com/in/rickifriadi ↗
        </a>
      </div>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat(pages): add /contact page with Web3Forms + zod validation"
```

---

## Task 5: Create /works page

**Context:** The Works page is a curated visual gallery of the featured projects from `src/data/projects.ts`. It uses a native `<works-filter>` custom element (registered with `customElements.define`) via an inline `<script is:inline>` — no React, no hydration, zero JS bundle cost. The custom element reads `data-category` attributes on card elements and toggles their visibility. Cards link to `/projects/[slug]` for full detail. Follow the chapter layout from other pages.

The page imports `projects` from `@/data/projects` in the Astro frontmatter. Category filter options are derived at build time. The `<works-filter>` element wraps the filter buttons and the card grid; clicking a filter button sets `data-active` on itself and hides cards whose `data-category` doesn't match. An "All" button shows everything.

**Files:**
- Create: `src/pages/works.astro`

- [ ] **Step 1: Create `src/pages/works.astro`**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'

const categories = ['all', ...new Set(projects.map((p) => p.category))]

const categoryLabel: Record<string, string> = {
  all: 'All',
  'web-app': 'Web App',
  api: 'API',
  tool: 'Tool',
  'open-source': 'Open Source',
}
---

<MainLayout
  title="Works — Ricki Friadi"
  description="Selected works by Ricki Friadi — Vue 3 micro-frontends, NestJS microservices, and internal tooling at PT. Pegadaian."
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Selected Works</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      Things I've<br />
      <span class="title-accent text-accent">Shipped.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Production systems serving thousands of users across finance, internal tooling, and public-facing web.
    </p>
  </section>

  <!-- § 01 — Works grid -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Projects</span>
    </div>

    <works-filter class="block px-4 pb-10">
      <!-- Filter buttons -->
      <div class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            type="button"
            data-filter={cat}
            data-active={cat === 'all' ? '' : undefined}
            class="works-filter-btn border-border text-muted font-mono text-xs uppercase tracking-widest rounded-full border px-3 py-1 transition-colors hover:border-accent hover:text-accent data-[active]:border-accent data-[active]:text-foreground data-[active]:bg-accent/10"
          >
            {categoryLabel[cat] ?? cat}
          </button>
        ))}
      </div>

      <!-- Cards grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            href={`/projects/${project.slug}`}
            data-card
            data-category={project.category}
            class="glass-card group block overflow-hidden rounded-xl p-5 no-underline transition-transform duration-200 hover:-translate-y-0.5"
          >
            <!-- Color band -->
            <div
              class:list={[
                'mb-4 h-1 w-full rounded-full',
                project.featured ? 'bg-accent' : 'bg-border',
              ]}
            />

            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="diff-tag">{categoryLabel[project.category] ?? project.category}</span>
              <span class="diff-tag">{project.year}</span>
              {project.featured && <span class="eyebrow">Featured</span>}
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

            <div class="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span class="bg-secondary text-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span class="text-muted font-mono text-[10px]">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </works-filter>
  </section>
</MainLayout>

<script is:inline>
  class WorksFilter extends HTMLElement {
    connectedCallback() {
      const buttons = this.querySelectorAll('[data-filter]')
      const cards = this.querySelectorAll('[data-card]')

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter')

          buttons.forEach((b) => b.removeAttribute('data-active'))
          btn.setAttribute('data-active', '')

          cards.forEach((card) => {
            const cat = card.getAttribute('data-category')
            const visible = filter === 'all' || cat === filter
            card.style.display = visible ? '' : 'none'
          })
        })
      })
    }
  }

  if (!customElements.get('works-filter')) {
    customElements.define('works-filter', WorksFilter)
  }
</script>
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/pages/works.astro
git commit -m "feat(pages): add /works gallery with native web component filter"
```

---

## Task 6: Final Verification

**Context:** All Phase 3 files are in place. Run the full suite to confirm nothing regressed.

**Files:** none (verification only)

- [ ] **Step 1: Run all tests**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -8
```
Expected: `7 files`, `50 passed` (44 from Phase 1+2 + 6 new contact schema tests)

- [ ] **Step 2: Biome check**

```bash
npx biome check src/ 2>&1 | tail -5
```
Expected: `1 warning` (the suppression comment on `z` import — harmless), 0 errors

- [ ] **Step 3: ESLint on Astro files**

```bash
npx eslint --config eslint.astro.config.js "src/**/*.astro" 2>&1 | tail -5
```
Expected: no output (0 errors)

- [ ] **Step 4: Astro type check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```
Expected: `0 errors`

- [ ] **Step 5: Production build**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -8
```
Expected: `14 page(s) built` (previous 12 + /works + /contact), `Complete!`

- [ ] **Step 6: Verify new pages exist in dist**

```bash
ls dist/works/ dist/contact/
```
Expected: both directories contain `index.html`

- [ ] **Step 7: Commit verification marker**

```bash
git add -A
git commit -m "chore(phase3): verified — 50 tests, 0 errors, 14 pages built"
```
(Only commit if there are any unstaged changes; skip if tree is clean after previous commits.)
