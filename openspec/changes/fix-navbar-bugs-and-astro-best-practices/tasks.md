## 1. Fix Critical Bugs

- [ ] 1.1 Fix Bug #1 — Desktop nav links vertical: add unlayered CSS override in global.css for `astro-island[await-children] > ul { display: unset; }`
- [ ] 1.2 Fix Bug #2 — Mobile bottom nav invisible in light mode: change `color-mix` base to `var(--color-surface)` in MobileBottomNav.tsx

## 2. Content Collection Schema

- [ ] 2.1 Create `src/content/config.ts` with Zod schemas for `blog` and `projects` collections
- [ ] 2.2 Verify existing MDX files pass schema validation (`astro check`)

## 3. Hydration Optimization

- [ ] 3.1 Change LangSwitcher `client:load` → `client:idle`
- [ ] 3.2 Change MobileBottomNav `client:load` → `client:visible`
- [ ] 3.3 Change HeroPhoto `client:load` → `client:idle`
- [ ] 3.4 Change ContactForm `client:load` → `client:visible`

## 4. Configuration & URL Fixes

- [ ] 4.1 Replace hardcoded `https://rickyfrdy.my.id` with `Astro.site` in BaseHead.astro
- [ ] 4.2 Add `loading="eager"` to hero images on index.astro and id/index.astro

## 5. GSAP Performance

- [ ] 5.1 Refactor PageAnimations.astro to dynamically import GSAP + ScrollTrigger using dynamic `import()`

## 6. Verify

- [ ] 6.1 Build succeeds with 0 errors (`astro build`)
- [ ] 6.2 Desktop nav renders horizontal links at ≥768px
- [ ] 6.3 Mobile bottom nav visible in light mode
- [ ] 6.4 Content collection validation catches bad frontmatter
