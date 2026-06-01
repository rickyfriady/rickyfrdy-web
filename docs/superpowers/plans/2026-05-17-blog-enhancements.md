# Blog Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reading time, collapsible table of contents, clickable tag pages, and a full-content RSS feed to the existing Astro blog.

**Architecture:** Pure Astro-native approach — no remark/rehype plugins. Reading time is a utility function over `post.body`. TOC uses Astro's native `render().headings` array. Tag pages use `getStaticPaths`. RSS uses `@astrojs/rss` with `markdown-it` + `sanitize-html` to render raw markdown to HTML.

**Tech Stack:** Astro 6, TypeScript, Vitest, `@astrojs/rss`, `markdown-it`, `sanitize-html`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/utils/readingTime.ts` | Word count → `"N min read"` |
| Create | `tests/utils/readingTime.test.ts` | Unit tests |
| Create | `src/components/blog/TableOfContents.astro` | Collapsible `<details>` TOC |
| Create | `src/pages/blog/tag/[tag].astro` | Tag-filtered post listing |
| Create | `src/pages/rss.xml.ts` | RSS feed with full content |
| Modify | `src/pages/blog/index.astro` | Reading time + clickable tags |
| Modify | `src/pages/blog/[slug].astro` | Reading time + TOC + clickable tags |
| Modify | `src/components/layout/BaseHead.astro` | RSS `<link rel="alternate">` |

---

## Task 1: Reading time utility

**Context:**
- `src/utils/` does not yet contain a `readingTime.ts` file.
- `post.body` in Astro content collections is the raw MDX/markdown text (frontmatter already stripped).
- Vitest with `@/` path alias — run tests with: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run`

**Files:**
- Create: `src/utils/readingTime.ts`
- Create: `tests/utils/readingTime.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/utils/readingTime.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { readingTime } from '@/utils/readingTime'

describe('readingTime()', () => {
  it('returns "1 min read" for empty string', () => {
    expect(readingTime('')).toBe('1 min read')
  })

  it('returns "1 min read" for a 200-word body', () => {
    const body = Array(200).fill('word').join(' ')
    expect(readingTime(body)).toBe('1 min read')
  })

  it('returns "2 min read" for a 201-word body', () => {
    const body = Array(201).fill('word').join(' ')
    expect(readingTime(body)).toBe('2 min read')
  })

  it('returns "5 min read" for a 1000-word body', () => {
    const body = Array(1000).fill('word').join(' ')
    expect(readingTime(body)).toBe('5 min read')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/utils/readingTime.test.ts 2>&1 | tail -8
```

Expected: FAIL — `Cannot find module '@/utils/readingTime'`

- [ ] **Step 3: Create `src/utils/readingTime.ts`**

```ts
export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run tests/utils/readingTime.test.ts 2>&1 | tail -5
```

Expected: `4 tests passed`

- [ ] **Step 5: Run full test suite — no regressions**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -4
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/utils/readingTime.ts tests/utils/readingTime.test.ts
git commit -m "feat(utils): add readingTime utility"
```

---

## Task 2: Update blog listing page

**Context:**
- `src/pages/blog/index.astro` currently renders tags as `<span class="diff-tag">` and date in a single `<time>` element.
- `post.body` is available directly on each content collection entry.
- Tags need to become `<a>` links pointing to `/blog/tag/${tag}`.
- Reading time is appended below the date in the right column.

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace `src/pages/blog/index.astro`**

Replace the entire file with:

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { getCollection } from 'astro:content'
import { readingTime } from '@/utils/readingTime'

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
            href={`/blog/${post.id}`}
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
                      <a
                        href={`/blog/tag/${tag}`}
                        class="diff-tag hover:border-accent/60 transition-colors"
                        onclick="event.stopPropagation()"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div class="text-muted flex flex-shrink-0 flex-col items-end gap-1 font-mono text-xs">
                <time datetime={post.data.pubDate.toISOString()}>
                  {post.data.pubDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span>{readingTime(post.body ?? '')}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    )}
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
git add src/pages/blog/index.astro
git commit -m "feat(blog): add reading time and clickable tags to listing page"
```

---

## Task 3: TableOfContents component

**Context:**
- Astro's `render()` returns `{ Content, headings }` where `headings` is `{ depth: number; slug: string; text: string }[]`.
- Only depth 2 (h2) and depth 3 (h3) are shown. Depth 1 = page title (already in header). Depth 4+ = too granular.
- Native HTML `<details><summary>` is used — collapsible with zero JavaScript, keyboard-accessible.
- `class:list` is Astro's conditional class syntax.
- The component renders nothing when the filtered headings array is empty.

**Files:**
- Create: `src/components/blog/TableOfContents.astro`

- [ ] **Step 1: Create `src/components/blog/TableOfContents.astro`**

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[]
}

const { headings } = Astro.props
const filtered = headings.filter((h) => h.depth === 2 || h.depth === 3)
---

{filtered.length > 0 && (
  <details class="border-border mb-6 rounded-xl border px-4 py-3">
    <summary class="font-mono cursor-pointer select-none text-xs tracking-[0.15em] uppercase text-muted">
      Contents
    </summary>
    <nav aria-label="Table of contents" class="mt-3">
      <ol class="space-y-1.5">
        {filtered.map((heading) => (
          <li>
            <a
              href={`#${heading.slug}`}
              class:list={[
                'text-foreground hover:text-accent text-sm transition-colors',
                { 'pl-4 block': heading.depth === 3 },
              ]}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  </details>
)}
```

- [ ] **Step 2: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/TableOfContents.astro
git commit -m "feat(components): add TableOfContents collapsible component"
```

---

## Task 4: Update blog post page

**Context:**
- `src/pages/blog/[slug].astro` currently renders `const { Content } = await render(post)`.
- Change to `const { Content, headings } = await render(post)` to get the headings array.
- Add `readingTime` display in the post header next to the date (separated by ` · `).
- Change tag `<span>` elements to `<a>` links.
- Add `<TableOfContents headings={headings} />` just above `<Content />` inside `<article>`.

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Replace `src/pages/blog/[slug].astro`**

Replace the entire file with:

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import TableOfContents from '@/components/blog/TableOfContents.astro'
import { getCollection, render } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import type { GetStaticPaths } from 'astro'
import { readingTime } from '@/utils/readingTime'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

interface Props {
  post: CollectionEntry<'blog'>
}

const { post } = Astro.props
const { Content, headings } = await render(post)
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
        <a href={`/blog/tag/${tag}`} class="diff-tag hover:border-accent/60 transition-colors">
          {tag}
        </a>
      ))}
    </div>
    <h1
      class="title-display mt-4"
      style="font-size: clamp(1.8rem, 5vw, 3.5rem); line-height: 0.95"
    >
      {post.data.title}
    </h1>
    <p class="text-muted mt-3 text-sm">{post.data.description}</p>
    <div class="text-muted mt-4 font-mono text-xs">
      <time datetime={post.data.pubDate.toISOString()}>
        {post.data.pubDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <span> · {readingTime(post.body ?? '')}</span>
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
    </div>
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
    <TableOfContents headings={headings} />
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

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 3: Run full test suite**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -4
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat(blog): add reading time, TOC, and clickable tags to post page"
```

---

## Task 5: Tag listing page

**Context:**
- `src/pages/blog/tag/` directory does not exist yet — it is created implicitly by creating the file.
- `getStaticPaths` collects all unique tags from non-draft posts using `Set` to deduplicate.
- The tag page reuses the same listing layout as `blog/index.astro` including reading time and clickable tags.
- `post.body` is available on `CollectionEntry<'blog'>`.

**Files:**
- Create: `src/pages/blog/tag/[tag].astro`

- [ ] **Step 1: Create `src/pages/blog/tag/[tag].astro`**

```astro
---
import MainLayout from '@/components/layout/MainLayout.astro'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import type { GetStaticPaths } from 'astro'
import { readingTime } from '@/utils/readingTime'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))]
  return tags.map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter((p) => p.data.tags.includes(tag))
        .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()),
    },
  }))
}

interface Props {
  tag: string
  posts: CollectionEntry<'blog'>[]
}

const { tag, posts } = Astro.props
---

<MainLayout
  title={`#${tag} — Ricki Friadi`}
  description={`Posts tagged with ${tag} on Ricki Friadi's blog.`}
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Tag</p>
    <h1
      class="title-display"
      style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93"
    >
      #{tag}
    </h1>
    <p class="text-muted mt-4 text-sm">
      {posts.length} {posts.length === 1 ? 'post' : 'posts'}
    </p>
  </section>

  <!-- Post list -->
  <section class="border-border border-b">
    <div class="divide-border divide-y px-4">
      {posts.map((post) => (
        <a href={`/blog/${post.id}`} class="group block py-6 no-underline">
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
                  {post.data.tags.map((t: string) => (
                    <a
                      href={`/blog/tag/${t}`}
                      class="diff-tag hover:border-accent/60 transition-colors"
                      onclick="event.stopPropagation()"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div class="text-muted flex flex-shrink-0 flex-col items-end gap-1 font-mono text-xs">
              <time datetime={post.data.pubDate.toISOString()}>
                {post.data.pubDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <span>{readingTime(post.body ?? '')}</span>
            </div>
          </div>
        </a>
      ))}
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
git add "src/pages/blog/tag/[tag].astro"
git commit -m "feat(blog): add tag listing page at /blog/tag/[tag]"
```

---

## Task 6: RSS feed

**Context:**
- `@astrojs/rss`, `markdown-it`, `sanitize-html` are NOT yet in `package.json`.
- `@types/sanitize-html` and `@types/markdown-it` needed as dev deps for TypeScript.
- `context.site` is `https://rickyfrdy.my.id` (already set in `astro.config.ts`).
- `src/pages/rss.xml.ts` is a standard Astro endpoint — the filename extension `.xml.ts` tells Astro to serve it as `rss.xml`.
- `BaseHead.astro` needs a `<link rel="alternate">` tag so browsers and feed readers can auto-discover the feed.

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `src/components/layout/BaseHead.astro`

- [ ] **Step 1: Install dependencies**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm install @astrojs/rss markdown-it sanitize-html && npm install --save-dev @types/markdown-it @types/sanitize-html
```

Expected: packages installed, no errors.

- [ ] **Step 2: Create `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import type { APIContext } from 'astro'

const parser = new MarkdownIt()

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )

  return rss({
    title: 'Ricki Friadi',
    description: 'Writing on systems & craft — essays on microservices, TypeScript, architecture.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
  })
}
```

- [ ] **Step 3: Add RSS discovery link to `src/components/layout/BaseHead.astro`**

Read the current file first, then add this line after the `<link rel="apple-touch-icon">` line (after line 63):

```astro
<link rel="alternate" type="application/rss+xml" title="Ricki Friadi RSS" href="/rss.xml" />
```

The file section should look like:

```astro
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/favicon.svg" />
<link rel="alternate" type="application/rss+xml" title="Ricki Friadi RSS" href="/rss.xml" />
```

- [ ] **Step 4: Run astro check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -5
```

Expected: `0 errors`

- [ ] **Step 5: Verify RSS endpoint in production build**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -6
```

Expected: build completes. Then verify:

```bash
ls /Users/rickifriadi/dev/personal/ricki-web/dist/rss.xml
```

Expected: file exists.

- [ ] **Step 6: Commit**

```bash
git add src/pages/rss.xml.ts src/components/layout/BaseHead.astro package.json package-lock.json
git commit -m "feat(blog): add RSS feed at /rss.xml with full post content"
```

---

## Task 7: Final verification

**Context:** Confirm all checks pass end-to-end.

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx vitest run 2>&1 | tail -5
```

Expected: all tests pass (at least 59 total: 55 existing + 4 new reading time tests)

- [ ] **Step 2: Biome check**

```bash
npx biome check src/ 2>&1 | tail -4
```

Expected: `0 errors`

- [ ] **Step 3: Astro type check**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npx astro check 2>&1 | tail -4
```

Expected: `0 errors`

- [ ] **Step 4: Production build**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24 && npm run build 2>&1 | tail -6
```

Expected: build completes.

- [ ] **Step 5: Verify tag pages in built output**

```bash
ls /Users/rickifriadi/dev/personal/ricki-web/dist/blog/tag/
```

Expected: one directory per unique tag (e.g. `nestjs/`, `microservices/`, `typescript/`, `architecture/`)

- [ ] **Step 6: Verify RSS feed**

```bash
head -20 /Users/rickifriadi/dev/personal/ricki-web/dist/rss.xml
```

Expected: valid XML starting with `<?xml` containing `<channel>`, `<title>Ricki Friadi</title>`.
