/**
 * Maps human-readable tech names → sprite slug.
 * Falls back to undefined for techs without a matching icon.
 */
export const SKILL_ICON: Record<string, string> = {
  'Vue 3': 'vue',
  'Vue.js': 'vue',
  Vue: 'vue',
  React: 'react',
  'React.js': 'react',
  ReactJS: 'react',
  'Node.js': 'nodejs',
  NestJS: 'nestjs',
  Express: 'express',
  'Express.js': 'express',
  ExpressJS: 'express',
  Astro: 'astro',
  TypeScript: 'ts',
  JavaScript: 'js',
  PHP: 'php',
  'PHP 5': 'php',
  'PHP Native': 'php',
  Python: 'python',
  Tailwind: 'tailwind',
  'Tailwind CSS': 'tailwind',
  CSS: 'css',
  HTML: 'html',
  'HTML/CSS': 'html',
  SCSS: 'scss',
  Bootstrap: 'bootstrap',
  'Material UI': 'materialui',
  PostgreSQL: 'postgres',
  Redis: 'redis',
  MongoDB: 'mongodb',
  MySQL: 'mysql',
  Docker: 'docker',
  'GitLab CI': 'gitlab',
  Git: 'git',
  GitLab: 'gitlab',
  Postman: 'postman',
  Jenkins: 'jenkins',
  Redux: 'redux',
  Pinia: 'pinia',
  Flask: 'flask',
  Jest: 'jest',
  Vitest: 'vitest',
  Vite: 'vite',
  ESLint: 'eslint',
  Biome: 'biomejs',
  jQuery: 'jquery',
  Codeigniter: 'codeigniter',
  'Codeigniter 3': 'codeigniter',
  TypeORM: 'typeorm',
  'Vee-validate': 'veevalidate',
  Zod: 'zod'
}

/**
 * Locally drawn 16x16 pixel sprites, keyed by slug.
 *
 * Built from the directory itself, so drawing a new icon is just dropping
 * `<slug>.png` into `src/assets/sprites/tech/` — there is no list to keep in
 * sync. Slugs with no sprite yet simply return undefined, and every call site
 * already falls back to a text tag, so the icon set can grow one file at a
 * time without ever leaving a broken image on the page.
 */
const TECH_SPRITES: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../assets/sprites/tech/*.png', {
      eager: true,
      query: '?url',
      import: 'default'
    })
  ).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.png'.length), url])
)

/** Slugs that have a drawn sprite. Exported for coverage reporting. */
export const DRAWN_TECH_SPRITES: readonly string[] = Object.keys(TECH_SPRITES).sort()

/** Sprite URL for a slug that is already known (e.g. `skills.ts` entries). */
export function getSpriteBySlug(slug: string): string | undefined {
  return TECH_SPRITES[slug]
}

/** Sprite URL for a human-readable tech name. */
export function getSkillIconUrl(tech: string): string | undefined {
  const slug = SKILL_ICON[tech]
  if (!slug) return undefined
  return TECH_SPRITES[slug]
}
