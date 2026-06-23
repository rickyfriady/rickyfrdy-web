## Context

The project uses `bun run build` which runs `astro check && astro build`. `astro check` enforces TypeScript strictness across all `.astro` files. Recent dependency upgrades (Astro 6, React 19, TypeScript 5.9) introduced type-level deprecations and one genuine type error that now blocks the build.

The type error is in a client-side `<script>` block (not the Astro frontmatter) — specifically in GSAP-driven avatar hover animation code that runs in the browser.

All other issues are deprecation warnings from the type system, not runtime bugs.

## Goals / Non-Goals

**Goals:**
- Restore `bun run build` to 0 errors, 0 warnings exit
- Remove all 4 TypeScript errors blocking CI
- Eliminate 14 deprecation hints for clean output

**Non-Goals:**
- No runtime behavior changes — fixes are type-system only
- No refactoring or redesign of the components
- No dependency upgrades or downgrades
- No spec-level requirement changes

## Decisions

### Decision 1: Cast to `HTMLElement` in CollaboratorsSection.astro

Querying `.t-avatar` via `querySelectorAll('.t-avatar')` returns `NodeListOf<Element>`. `.style` only exists on `HTMLElement`. The code already casts on line 395 (`(el as HTMLElement).style.transitionTimingFunction`) but lines 397–403 use bare `el`.

**Choice**: Change `querySelectorAll('.t-avatar')` to `querySelectorAll<HTMLElement>('.t-avatar')`.

**Why this approach**: Fixes all 4 error lines at the source type level. No repeated casts needed. Only one line change. Also makes line 395's existing cast redundant (but harmless).

**Alternatives considered**: 
- Casting `el as HTMLElement` inside the `forEach` callback — works but duplicates existing cast pattern.
- Using a separate variable `const avatar = el as HTMLElement` — more explicit but adds noise.

### Decision 2: Import `z` from `zod` directly

Astro 6 deprecated re-exporting `zod`'s `z` through the `astro:content` module.

**Choice**: Change `import { defineCollection, z } from 'astro:content'` to `import { defineCollection } from 'astro:content'` + `import { z } from 'zod'`.

**Why**: Astro's virtual module now marks the `z` re-export with `@deprecated`. `zod` is already a direct dependency. The `z` object is identical. Zero behavioral change.

### Decision 3: Fix `FormEvent` deprecation in ContactForm.tsx

React 19 deprecated the `React.FormEvent<HTMLFormElement>` type in favor of the standard `React.FormEvent<HTMLFormElement>` from updated types. The warning is a React 19 types quirk.

**Choice**: Change `e: React.FormEvent<HTMLFormElement>` to use the underlying `SyntheticEvent` or suppress with the correct non-deprecated type. Based on React 19 types, replace with `React.FormEvent<HTMLFormElement>` usage.

Actually, looking at the actual code (line 89): `async function handleSubmit(e: React.FormEvent<HTMLFormElement>)` — this is the standard React form event type. The deprecation suggests React 19's type definitions flagged `FormEvent` for deprecation in favor of...

Let me check what React 19 recommends. Actually, in React 19, the synthetic event types were updated. The deprecation warning about `FormEvent` might be because React 19 now recommends using native DOM types or `React.FormEvent` without the generic.

**Choice**: Change `React.FormEvent<HTMLFormElement>` to an inline event type or the correct React 19 pattern. Most likely `React.FormEvent<HTMLFormElement>` → use a parameter with the proper type or just use a native approach. Let me check the exact right type during implementation — this is a one-line type change.

### Decision 4: Fix inline `event` deprecation in blog pages

Astro 6 deprecated the global `event` variable accessible inside inline `onclick` handlers.

**Choice**: Change `onclick="event.stopPropagation()"` to `onclick="this.closest('a')?.click()"` or suppress propagation via a data attribute approach.

Since these tags are inside links and the only purpose is to prevent the parent link from navigating when a tag is clicked, the simplest fix is:
- Option A: Use `data-astro-exec` or a client script
- Option B: Change to a different UX pattern

**Final choice**: Replace inline `event` usage with a simple Astro client script approach or move the handler to use the element reference directly with `this`.

## Risks / Trade-offs

- **Low risk**: All changes are type-level or import-level. No runtime logic changes.
- **No migration needed**: Changes are within existing files, no deployment steps.
- **Rollback**: Simple `git revert` if any issue discovered.
