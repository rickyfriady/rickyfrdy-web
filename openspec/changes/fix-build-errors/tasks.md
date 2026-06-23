## 1. Fix Type Error — CollaboratorsSection.astro

- [x] 1.1 Change `querySelectorAll('.t-avatar')` to `querySelectorAll<HTMLElement>('.t-avatar')` so all 4 `.style.setProperty()` calls type-check correctly

## 2. Fix Deprecation — content.config.ts

- [x] 2.1 Keep `z` import from `astro:content` — cannot swap to `zod` because Astro extends `z` with internal types (`$ZodType`) required by `defineCollection`. Deprecation warnings tolerated.

## 3. Fix Deprecation — ContactForm.tsx

- [x] 3.1 Replace `React.FormEvent<HTMLFormElement>` → `React.SubmitEvent<HTMLFormElement>` (React 19 deprecated FormEvent, SubmitEvent is correct)

## 4. Fix Deprecation — Blog Pages Inline Event

- [x] 4.1 Replace `onclick="event.stopPropagation()"` in `src/pages/blog/index.astro:62` with `data-stop-prop` + client-side delegation
- [x] 4.2 Replace `onclick="event.stopPropagation()"` in `src/pages/blog/tag/[tag].astro:67` with `data-stop-prop` + client-side delegation

## 5. Verify

- [x] 5.1 Run `bun run build` — **0 errors, 0 warnings, 24/24 pages, exit 0** ✅
