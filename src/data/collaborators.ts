export interface Collaborator {
  name: string
  role: string
  photo?: string
  linkedin?: string
  website?: string
  /** Featured collaborators surface in the bento grid; rest go in the "Show more" list. */
  featured?: boolean
  /** Short pull quote — shown only when featured. */
  quote?: string
}

export const collaborators: Collaborator[] = [
  // ── Featured (6) ─────────────────────────────────────────────────
  {
    name: 'Andika Pratama',
    role: 'Product Manager · PT. Pegadaian',
    photo: '/collaborators/andika-pratama.jpg',
    linkedin: 'https://www.linkedin.com/in/example-andika-pratama',
    featured: true,
    quote:
      'Ricki turns vague product asks into resilient systems. The Singel APP foundation he architected still ships features two years later without rewrites.'
  },
  {
    name: 'Maya Wijaya',
    role: 'Engineering Lead · PT. Pegadaian',
    photo: '/collaborators/maya-wijaya.jpg',
    linkedin: 'https://www.linkedin.com/in/example-maya-wijaya',
    website: 'https://mayawijaya.dev',
    featured: true,
    quote: 'One of the few engineers who treats observability as a first-class concern.'
  },
  {
    name: 'Budi Santoso',
    role: 'Backend Engineer · PT. Pegadaian',
    photo: '/collaborators/budi-santoso.jpg',
    linkedin: 'https://www.linkedin.com/in/example-budi-santoso',
    featured: true,
    quote: 'Pushed our service contracts to be strict in a codebase that fought us at every turn.'
  },
  {
    name: 'Siti Nurhaliza',
    role: 'UX Designer · Freelance',
    photo: '/collaborators/siti-nurhaliza.jpg',
    website: 'https://sitidesigns.id',
    featured: true
  },
  {
    name: 'Dewi Kusuma',
    role: 'QA Lead · PT. Pegadaian',
    photo: '/collaborators/dewi-kusuma.jpg',
    linkedin: 'https://www.linkedin.com/in/example-dewi-kusuma',
    featured: true
  },
  {
    name: 'Rahmat Hidayat',
    role: 'DevOps Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-rahmat-hidayat',
    featured: true
  },

  // ── Rest (14) ────────────────────────────────────────────────────
  {
    name: 'Aditya Saputra',
    role: 'Frontend Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-aditya'
  },
  {
    name: 'Putri Lestari',
    role: 'Product Designer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-putri'
  },
  {
    name: 'Hendra Wijaya',
    role: 'Mobile Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-hendra'
  },
  {
    name: 'Indah Permata',
    role: 'Scrum Master · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-indah'
  },
  {
    name: 'Bayu Setiawan',
    role: 'Data Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-bayu'
  },
  {
    name: 'Citra Anggraini',
    role: 'Marketing Lead · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-citra'
  },
  {
    name: 'Dimas Wirawan',
    role: 'Backend Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-dimas'
  },
  {
    name: 'Erika Putri',
    role: 'Business Analyst · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-erika'
  },
  {
    name: 'Fajar Nugroho',
    role: 'Solution Architect · Freelance',
    website: 'https://fajarnugroho.dev'
  },
  {
    name: 'Gita Maharani',
    role: 'Product Owner · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-gita'
  },
  {
    name: 'Hari Setiawan',
    role: 'Backend Engineer · Freelance',
    linkedin: 'https://www.linkedin.com/in/example-hari'
  },
  {
    name: 'Intan Prameswari',
    role: 'Frontend Engineer · Freelance',
    linkedin: 'https://www.linkedin.com/in/example-intan'
  },
  {
    name: 'Joko Susilo',
    role: 'Tech Lead · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-joko'
  },
  {
    name: 'Kartika Sari',
    role: 'Engineering Manager · Freelance',
    linkedin: 'https://www.linkedin.com/in/example-kartika'
  }
]
