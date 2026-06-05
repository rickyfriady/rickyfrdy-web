export const ui = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.resume': 'Resume',
    'nav.projects': 'Projects',
    'nav.works': 'Works',
    'nav.contact': 'Contact',

    // Resume page
    'resume.title': 'Resume — Ricki Friadi',
    'resume.description':
      'Fullstack Developer resume — Ricki Friadi. 4+ years building production systems in Indonesian fintech.',
    'resume.summary': 'Summary',
    'resume.experience': 'Work Experience',
    'resume.projects': 'Project Experience',
    'resume.education': 'Education',
    'resume.skills': 'Skills',
    'resume.download': 'Download PDF',
    'resume.ats': 'ATS Version',
    'resume.gpa': 'GPA',

    // Case study (existing keys preserved)
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
    'case.next': 'Next →'
  },
  id: {
    // Nav
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.experience': 'Pengalaman',
    'nav.resume': 'CV',
    'nav.projects': 'Proyek',
    'nav.works': 'Karya',
    'nav.contact': 'Kontak',

    // Resume page
    'resume.title': 'CV — Ricki Friadi',
    'resume.description':
      'CV Fullstack Developer — Ricki Friadi. 4+ tahun membangun sistem produksi di fintech Indonesia.',
    'resume.summary': 'Ringkasan',
    'resume.experience': 'Pengalaman Kerja',
    'resume.projects': 'Pengalaman Proyek',
    'resume.education': 'Pendidikan',
    'resume.skills': 'Keahlian',
    'resume.download': 'Unduh PDF',
    'resume.ats': 'Versi ATS',
    'resume.gpa': 'IPK',

    // Case study
    'case.back': '← Proyek',
    'case.role': 'Peran',
    'case.overview': 'Ringkasan',
    'case.impact': 'Dampak',
    'case.problem': 'Tantangan',
    'case.solution': 'Solusi',
    'case.highlights': 'Sorotan',
    'case.live': 'Lihat Demo',
    'case.github': 'Lihat di GitHub',
    'case.prev': '← Sebelumnya',
    'case.next': 'Berikutnya →'
  }
} as const

export type Lang = keyof typeof ui

export function t(lang: Lang, key: keyof (typeof ui)['en']): string {
  return ui[lang][key]
}
