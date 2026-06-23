## Why

Two critical layout bugs break desktop nav (links stack vertically) and mobile nav (invisible in light mode). Beyond bugs, project skips Astro best practices — missing content schema, over-eager React hydration, hardcoded URLs — that hurt maintainability and performance.

## What Changes

- **Bug #1**: Fix desktop nav links vertical layout — override unlayered Astro `astro-island[await-children] > :not(.hydrated) { display: block }` rule with proper CSS layer priority
- **Bug #2**: Fix mobile bottom nav invisible in light mode — change `color-mix` blending approach
- **Content schema**: Add `src/content/config.ts` with Zod validation for blog + projects collections
- **Hydration strategy**: Downgrade `client:load` → `client:idle`/`client:visible` for non-critical React islands (LangSwitcher, MobileBottomNav, HeroPhoto, ContactForm)
- **Base URL**: Replace hardcoded `https://rickyfrdy.my.id` with `Astro.site` in BaseHead.astro
- **GSAP optimization**: Dynamic import ScrollTrigger in PageAnimations to avoid 40KB+ bundle on every page
- **LCP fix**: Add `loading="eager"` to hero images that control Largest Contentful Paint

## Capabilities

### New Capabilities
- `code-quality`: TypeScript strict + schema validation for build safety
- `performance-optimization`: JS bundle reduction via hydration and GSAP changes

### Modified Capabilities

(none — no existing specs)

## Impact

| Area | Files Changed | Notes |
|------|--------------|-------|
| CSS | `src/styles/global.css` | Fix Bug #1 layer conflict, fix Bug #2 light mode visibility |
| Content | `src/content/config.ts` (new) | Zod schemas for blog + projects collections |
| Components | `NavLinks.tsx`, `MobileBottomNav.tsx`, `LangSwitcher.tsx`, `HeroPhoto.tsx`, `ContactForm.tsx` | Hydration directive changes |
| Layout | `MainLayout.astro`, `BaseHead.astro` | `<base>` fix, PageAnimations GSAP dynamic import |
| Assets | Hero `<img>` elements | `loading="eager"` |
  