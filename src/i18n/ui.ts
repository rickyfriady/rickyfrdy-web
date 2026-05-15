export const ui = {
  en: {
    'case.back': '← Projects',
    'case.role': 'Role',
    'case.overview': 'Overview',
    'case.impact': 'Impact',
    'case.problem': 'Challenge',
    'case.solution': 'Solution',
    'case.highlights': 'Highlights',
    'case.live': 'View Live Demo',
    'case.github': 'View on GitHub',
    'case.prev': '← Previous',
    'case.next': 'Next →',
  },
} as const

export type Lang = keyof typeof ui
export function t(lang: Lang, key: keyof (typeof ui)['en']): string {
  return ui[lang][key]
}
