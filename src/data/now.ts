export interface NowFocus {
  label: string
  detail: string
}

export interface NowContent {
  /** ISO date of the last meaningful update to this page */
  updated: string
  intro: string
  focus: NowFocus[]
}

/**
 * Hand-authored "current focus" content. Update this file (and rebuild) to
 * refresh the /now page — one place, both locales.
 * Convention inspired by https://nownownow.com.
 */
export const now: Record<'en' | 'id', NowContent> = {
  en: {
    updated: '2026-07-01',
    intro:
      'Building micro-frontend platforms and NestJS microservices at PT. Pegadaian, and sharpening the edges of this site between sprints.',
    focus: [
      {
        label: 'Work',
        detail: 'Leading front-end architecture for the Singel super-app and loan-lead platform.'
      },
      {
        label: 'Learning',
        detail: 'Going deeper on AI engineering — retrieval, embeddings, and agent workflows.'
      },
      {
        label: 'Building',
        detail:
          'Evolving this portfolio: a command palette, AI site search, and a living changelog.'
      },
      {
        label: 'Away from the keyboard',
        detail: 'Slow travel through Sumatra & Java, and a lot of coffee.'
      }
    ]
  },
  id: {
    updated: '2026-07-01',
    intro:
      'Membangun platform micro-frontend dan microservices NestJS di PT. Pegadaian, sambil terus mengasah situs ini di sela sprint.',
    focus: [
      {
        label: 'Pekerjaan',
        detail: 'Memimpin arsitektur front-end untuk super-app Singel dan platform loan-lead.'
      },
      {
        label: 'Belajar',
        detail: 'Mendalami AI engineering — retrieval, embeddings, dan alur kerja agent.'
      },
      {
        label: 'Membangun',
        detail:
          'Mengembangkan portofolio ini: command palette, AI site search, dan changelog hidup.'
      },
      {
        label: 'Di luar layar',
        detail: 'Perjalanan santai keliling Sumatra & Jawa, dan banyak kopi.'
      }
    ]
  }
}
