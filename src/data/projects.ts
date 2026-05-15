export interface Metric {
  value: string
  label: string
}

export interface Project {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  featured: boolean
  category: 'web-app' | 'api' | 'tool' | 'open-source'
  technologies: string[]
  keyMetric?: string
  heroImage?: string
  role?: string
  metrics?: Metric[]
  liveUrl?: string
  githubUrl?: string
  date: string
  year: number
  challenges: string[]
  solutions: string[]
  results: string[]
}

export const projects: Project[] = [
  {
    slug: 'singel-app',
    title: 'Singel APP (Pegadaian Kita)',
    shortDescription:
      'Company-wide Micro-Frontend application built with Vue 3 and NestJS microservices, enabling independent team deployments.',
    fullDescription:
      'Singel APP is the unified employee super-app for PT. Pegadaian built on a Micro-Frontend Architecture. Multiple product teams build and deploy their features independently using Module Federation. The backend is a constellation of NestJS microservices connected via Redis pub/sub.',
    featured: true,
    category: 'web-app',
    technologies: ['Vue 3', 'NestJS', 'Tailwind', 'PostgreSQL', 'Redis', 'Zod', 'Pinia', 'Vitest'],
    keyMetric: '≥80% unit test coverage across all modules',
    role: 'Lead Frontend Engineer · Fullstack Developer',
    metrics: [
      { value: '≥80%', label: 'unit test coverage' },
      { value: '0', label: 'regression incidents' },
      { value: '5+', label: 'teams deploy independently' },
    ],
    date: '2024-11-01',
    year: 2024,
    challenges: [
      'Coordinating parallel development across multiple teams without breaking shared interfaces',
      'Keeping Micro-Frontend bundles lean while sharing common UI components',
      'Ensuring type-safety across independently deployed services'
    ],
    solutions: [
      'Defined strict module contracts enforced by Zod schemas shared as npm packages',
      'Used Vite Module Federation with explicit shared dependency versions',
      'Implemented integration tests that run against real service endpoints'
    ],
    results: [
      'Teams deploy independently with zero coordination overhead',
      'Consistently maintained ≥80% Vitest coverage',
      'Zero regression incidents since adopting contract-first API design'
    ]
  },
  {
    slug: 'microsite-pinjaman',
    title: 'Microsite Pinjaman Pegadaian',
    shortDescription:
      'Revamped legacy CodeIgniter 3 monolith into 9 NestJS microservices using Factory pattern, serving loan lead generation at scale.',
    fullDescription:
      'A complete backend rewrite of the loan lead generation platform for PT. Pegadaian. Replaced a single CodeIgniter 3 monolith with 9 purpose-built NestJS microservices. The Factory pattern enables dynamic product support without code changes when new loan products are introduced.',
    featured: true,
    category: 'api',
    technologies: ['Vue.js', 'NestJS', 'TypeScript', 'Redis', 'PostgreSQL', 'Crontab', 'Pinia'],
    keyMetric: '9 independent microservices using Factory pattern',
    role: 'Backend Engineer · System Architect',
    metrics: [
      { value: '9', label: 'microservices built' },
      { value: '0', label: 'downtime during migration' },
      { value: '3', label: 'sprints to complete' },
    ],
    date: '2024-01-10',
    year: 2024,
    challenges: [
      'Migrating live production traffic from monolith without downtime',
      'Designing a service architecture flexible enough to add new loan product types',
      'Maintaining compatibility with the App Mitra Pegadaian partner integration'
    ],
    solutions: [
      'Used strangler-fig pattern — routed traffic gradually from old to new services',
      'Implemented Factory pattern so each loan type is a pluggable strategy class',
      'Wrote comprehensive integration tests against the partner API contract'
    ],
    results: [
      'Zero downtime migration completed over 3 sprints',
      'New loan product types now added without changing service code',
      'Regression suite prevents partner API contract breakage'
    ]
  },
  {
    slug: 'kamila',
    title: 'KAMILA — Marketing & KPI Tracker',
    shortDescription:
      'Internal Pegadaian app for marketing progress tracking, KPI measurement, and loan lead submission from external partners.',
    fullDescription:
      'KAMILA is the internal tool used by PT. Pegadaian marketing teams to track plans, weekly reports, KPIs, and leads submitted from external business partners. Built with a React frontend and Express/Node.js backend.',
    featured: false,
    category: 'web-app',
    technologies: [
      'ReactJS',
      'ExpressJS',
      'Node.js',
      'Tailwind',
      'PostgreSQL',
      'Redis',
      'TypeORM',
      'Redux'
    ],
    role: 'Fullstack Developer',
    metrics: [
      { value: '200+', label: 'marketing employees served' },
      { value: '60%', label: 'of sessions from mobile' },
      { value: '5 min', label: 'lead processing (was hours)' },
    ],
    date: '2023-05-15',
    year: 2023,
    challenges: [
      'Building a flexible KPI tracking system that works for diverse marketing roles',
      'Handling real-time lead submission from external partner integrations',
      'Keeping the UI responsive and fast for field staff on mobile devices'
    ],
    solutions: [
      'Designed a configurable KPI template system using JSON schema definitions',
      'Used a dedicated lead queue backed by Redis to handle burst partner submissions',
      'Adopted a mobile-first layout with Progressive Web App offline support'
    ],
    results: [
      'Used by 200+ marketing employees across regional branches',
      'Lead processing time reduced from hours to under 5 minutes',
      'Mobile usage accounts for 60% of daily active sessions'
    ]
  },
  {
    slug: 'aira-reconciliation',
    title: 'AIRA — Reconciliation System',
    shortDescription:
      'Reconciliation transaction module for integration with partner banks, producing journal entries compliant with accounting standards.',
    fullDescription:
      "AIRA handles financial reconciliation between PT. Pegadaian's core banking system and external partner banks. The system validates transactions over SFTP, generates journal entries to accounting standards, and produces daily reports consumed by the finance division.",
    featured: false,
    category: 'tool',
    technologies: ['PHP 5', 'PHP Native', 'SFTP', 'VM', 'MySQL'],
    role: 'Backend Engineer',
    metrics: [
      { value: '3', label: 'partner banks onboarded' },
      { value: '0', label: 'audit findings' },
      { value: '100%', label: 'daily SLA met' },
    ],
    date: '2024-01-20',
    year: 2024,
    challenges: [
      'Working within a legacy PHP 5 codebase with no modern tooling',
      "Ensuring financial journal entries matched the accounting division's audit requirements",
      'Safely extending SFTP integration to new partner banks without breaking existing ones'
    ],
    solutions: [
      'Introduced a thin adapter layer to isolate bank-specific parsing logic',
      'Built a dry-run mode that generates journal entries without committing them for audit review',
      'Added regression test fixtures using real anonymised transaction samples'
    ],
    results: [
      'Successfully onboarded 3 additional partner banks',
      'Zero audit findings since dry-run review process introduced',
      'Daily reconciliation reports delivered within SLA every day'
    ]
  },
  {
    slug: 'chatbot-kukerta',
    title: 'Thesis — Chatbot Kukerta',
    shortDescription:
      'Conversational chatbot using fuzzy string matching to answer student queries about the Kukerta internship program, achieving 80% match rate.',
    fullDescription:
      'Final thesis project at Universitas Riau. Built a Python/Flask chatbot that answers student questions about the Kukerta community service program using a fuzzy string matching algorithm trained on 3,000 manually curated question-answer pairs.',
    featured: false,
    category: 'tool',
    technologies: ['Python', 'Flask', 'JavaScript', 'jQuery', 'Bootstrap', 'MySQL'],
    githubUrl: 'https://github.com/rickyfrdy/chatbot-kukerta',
    role: 'Solo Developer · Thesis Author',
    metrics: [
      { value: '80%', label: 'question match rate' },
      { value: '3,000', label: 'QA pairs curated' },
      { value: '3.69', label: 'thesis GPA (out of 4.00)' },
    ],
    date: '2020-09-01',
    year: 2020,
    challenges: [
      'Building an accurate NLP system with no pre-trained model available in Bahasa Indonesia',
      'Curating a diverse 3,000-entry dataset within a 1-month timeline',
      'Deploying a Python backend in a low-resource university server environment'
    ],
    solutions: [
      'Used FuzzyWuzzy library with TF-IDF vectorisation to score question similarity',
      'Structured the dataset gathering as a structured questionnaire distributed to 150 students',
      'Containerised the Flask app with lightweight Alpine-based Docker image'
    ],
    results: [
      '80% question match rate on the held-out test set',
      'Deployed and used by the Kukerta administrative office',
      'Thesis awarded "Very Satisfactory" grade (3.69/4.00 GPA)'
    ]
  }
]
