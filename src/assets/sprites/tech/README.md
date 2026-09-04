# Tech icon sprites

16x16 PNG, one per slug in `SKILL_ICON` (`src/utils/skillIcon.ts`). Filename **is**
the slug: `vue.png`, `nestjs.png`, `ts.png`.

Dropping a file here is the whole registration step — `getSkillIconUrl()` builds its
map from this directory. A slug with no sprite yet renders as a text tag instead, so
the set can grow one icon at a time and the site never shows a broken image.

## Drawing notes

- Canvas 16x16, no anti-aliasing, no partial alpha (transparent or opaque only).
- Keep to the CASE FILE palette; these sit on `--color-surface`.
- Displayed at 32px and 48px, i.e. 2x and 3x — every edge must land on the 1px grid
  or integer scaling will look uneven.

## Slugs still to draw

astro biomejs bootstrap codeigniter css docker eslint express flask git gitlab html
jenkins jest jquery js materialui mongodb mysql nestjs nodejs php pinia postgres
postman python react redis redux scss tailwind ts typeorm veevalidate vite vitest
vue zod
