/**
 * Maps human-readable tech names → skillicons.dev slug.
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

export function getSkillIconUrl(tech: string): string | undefined {
  const slug = SKILL_ICON[tech]
  if (!slug) return undefined
  return `https://skillicons.dev/icons?i=${slug}`
}
