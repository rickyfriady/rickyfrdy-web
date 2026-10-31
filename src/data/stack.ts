import type { UIKey } from '@/i18n/ui'

/**
 * The landing page's Stack line, grouped by tier so both halves of the
 * positioning (micro-frontends and microservices) read in one scan. The same
 * fifteen technologies the old capability chips listed, nothing added.
 */
export const stackGroups: { label: UIKey; items: string[] }[] = [
  {
    label: 'home.stack.front',
    items: ['Vue 3', 'React', 'Astro', 'TypeScript', 'Tailwind', 'Module Federation']
  },
  {
    label: 'home.stack.back',
    items: ['NestJS', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Zod', 'Microservices']
  },
  { label: 'home.stack.delivery', items: ['Docker', 'GitLab CI'] }
]
