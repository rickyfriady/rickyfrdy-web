# Blog Enhancements — Design Spec

**Date:** 2026-05-17
**Status:** Approved

---

## Goal

Add four quality-of-life enhancements to the existing blog: reading time, collapsible table of contents, clickable tag pages, and a full-content RSS feed. All implemented with Astro-native APIs — no remark/rehype plugins.

---

## Architecture

Seven files total. One new npm group install (`markdown-it` + `sanitize-html` for RSS).

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/utils/readingTime.ts` | Word count → `"N min read"` string |
| Create | `tests/utils/readingTime.test.ts` | Unit tests for reading time utility |
| Create | `src/components/blog/TableOfContents.astro` | Collapsible `<details>` TOC from headings array |
| Create | `src/pages/blog/tag/[tag].astro` | Tag-filtered post listing page |
| Create | `src/pages/rss.xml.ts` | RSS feed endpoint with full post content |
| Modify | `src/pages/blog/index.astro` | Add reading time display, make tags clickable |
| Modify | `src/pages/blog/[slug].astro` | Add reading time, TOC, make tags clickable |

---

## Feature: Reading Time

### Utility (`src/utils/readingTime.ts`)

```ts
export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}
```

- Splits on whitespace, counts words, divides by 200 wpm, rounds up.
- Input is `post.body` — the raw markdown text from Astro's content collection (available without rendering).
- Output is a short display string: `"4 min read"`.

### Display

- **Blog listing (`blog/index.astro`):** Appended to the date cell — `Mar 15, 2025 · 4 min read` — in the same mono/muted style as the existing date.
- **Post header (`blog/[slug].astro`):** On the same line as the publication date, separated by `·`.

### Tests (`tests/utils/readingTime.test.ts`)

- Empty string → `"1 min read"` (minimum)
- 200-word body → `"1 min read"`
- 201-word body → `"2 min read"` (ceiling)
- 1000-word body → `"5 min read"`

---

## Feature: Table of Contents

### Component (`src/components/blog/TableOfContents.astro`)

**Props:**
```ts
interface Props {
  headings: { depth: number; slug: string; text: string }[]
}
```

**Data source:** `render().headings` from Astro's content collection — natively provided, no plugin needed.

**Filtering:** Only depth 2 and 3 (h2, h3). Depth 1 is the post title (already shown in header). Depth 4+ is too granular.

**Markup:** Native HTML `<details><summary>` — collapsible with zero JavaScript, accessible by default.

```html
<details class="...">
  <summary>Contents</summary>
  <nav aria-label="Table of contents">
    <ol>
      <li data-depth="2"><a href="#slug">Heading text</a></li>
      <li data-depth="3"><a href="#slug" class="pl-4">Sub-heading</a></li>
    </ol>
  </nav>
</details>
```

**Styling:**
- `<details>` wrapper: `border-border border rounded-xl px-4 py-3 mb-6`
- `<summary>`: `font-mono text-xs tracking-[0.15em] uppercase text-muted cursor-pointer`
- Links: `text-foreground hover:text-accent text-sm transition-colors`
- Depth-3 items: `pl-4` indent to show nesting
- Hidden when `headings` array is empty (no headings in post)

**Placement:** Rendered inside `blog/[slug].astro` just above `<Content />`, inside the `<article>` tag.

**A11y:** `<nav aria-label="Table of contents">` wraps the link list; `<details>` is keyboard-accessible natively.

---

## Feature: Tag Pages

### Clickable Tags

Tags in both `blog/index.astro` and `blog/[slug].astro` become `<a>` links:

```astro
<a href={`/blog/tag/${tag}`} class="diff-tag hover:border-accent/60 transition-colors">
  {tag}
</a>
```

The existing `diff-tag` utility class is reused — only the wrapper changes from `<span>` to `<a>`.

### Tag Page (`src/pages/blog/tag/[tag].astro`)

`getStaticPaths` collects all unique tags from non-draft posts and generates one route per tag:

```ts
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))]
  return tags.map((tag) => ({
    params: { tag },
    props: { tag, posts: posts.filter((p) => p.data.tags.includes(tag)) },
  }))
}
```

**Layout:** Reuses the same listing layout as `blog/index.astro`. Hero section heading becomes `Posts tagged #${tag}`. Posts sorted newest first. Reading time shown (same as listing). Tags on each post are also clickable (linking to other tag pages).

**No tags index page** (`/blog/tags`) — out of scope.

---

## Feature: RSS Feed

### Endpoint (`src/pages/rss.xml.ts`)

Uses `@astrojs/rss` (install if not present) + `markdown-it` + `sanitize-html` to render raw `post.body` markdown into safe HTML for the `<content:encoded>` field.

```ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const sorted = posts.sort((a, b) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
  return rss({
    title: 'Ricki Friadi',
    description: 'Writing on systems & craft — essays on microservices, TypeScript, architecture.',
    site: context.site!,
    items: sorted.map((post) => ({
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

**Dependencies to install:** `markdown-it`, `sanitize-html`, `@types/sanitize-html`, `@types/markdown-it` (dev deps for types).

**`@astrojs/rss`:** Check if already installed; install if missing.

**Feed URL:** `/rss.xml` — standard location, discoverable by feed readers.

**`site` config:** `astro.config.ts` must have `site: 'https://rickifriadi.dev'` (or equivalent). Check and add if missing.

---

## A11y

- `<details><summary>` is natively keyboard-accessible and screen-reader friendly.
- Tag `<a>` links have descriptive text (the tag name itself).
- TOC nav has `aria-label="Table of contents"`.
- RSS link can be added to `<BaseHead>` as `<link rel="alternate" type="application/rss+xml" title="Ricki Friadi RSS" href="/rss.xml" />` for browser discovery.

---

## Out of Scope

- Tags index page (`/blog/tags`)
- Related posts section
- Full-text search
- Pagination (only 1 post currently)
- Social share buttons
- Comments
- Author byline field
- `coverImage` / `ogImage` per-post field
