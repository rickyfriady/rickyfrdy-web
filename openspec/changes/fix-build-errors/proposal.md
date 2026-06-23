## Why

`bun run build` fails with 4 TypeScript errors, blocking CI and deployments. Additionally, 14 deprecation warnings clutter output. Build must pass at zero errors before merge — currently broken.

## What Changes

- **Type errors (4)** in `CollaboratorsSection.astro`: avatar hover script uses `el.style.setProperty()` on `Element` type (no `.style`). Cast to `HTMLElement`.
- **Deprecation: `z` re-export (11)** in `content.config.ts`: Astro 6 deprecated `z` from `astro:content`. Import `z` from `zod` package directly.
- **Deprecation: `FormEvent` (1)** in `ContactForm.tsx`: `React.FormEvent` deprecated in React 19 types. Update type reference.
- **Deprecation: inline `event` (2)** in `blog/index.astro` + `blog/tag/[tag].astro`: global `event` in `onclick` handlers deprecated in Astro 6. Move to proper event handling.

All changes are type-only or import-only — zero runtime behavior changes.

## Capabilities

### New Capabilities

None — pure maintenance/fix change. No new feature or user-facing capability.

### Modified Capabilities

None — no spec-level requirement changes. All fixes are type-system-only so existing specs remain accurate.

## Impact

| File | Lines changed | Risk |
|------|--------------|------|
| `src/components/people/CollaboratorsSection.astro` | 4 (type assertion) | Low — runtime JS, type-only |
| `src/content.config.ts` | 2 (import) | Low — same `z` object, different import source |
| `src/components/contact/ContactForm.tsx` | 1 (type) | Low — type reference only |
| `src/pages/blog/index.astro` | 1 (onclick handler) | Low — event propagation behavior |
| `src/pages/blog/tag/[tag].astro` | 1 (onclick handler) | Low — event propagation behavior |

No dependency changes. No API changes. No breaking changes.
