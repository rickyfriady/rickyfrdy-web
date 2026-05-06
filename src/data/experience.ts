export interface WorkExperience {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
  stack: string[]
}

export interface Project {
  title: string
  company: string
  period: string
  bullets: string[]
  stack: string[]
}

export interface Education {
  institution: string
  degree: string
  location: string
  period: string
  gpa: string
}

export interface SkillCategory {
  label: string
  icon: string
  items: string[]
}

export const experiences: WorkExperience[] = [
  {
    role: 'Software Engineer',
    company: 'PT. Pegadaian',
    location: 'Jakarta Pusat, Indonesia',
    period: 'May 2023 – Present',
    bullets: [
      'Translated business requirements into technical specifications and implemented robust, user-friendly interfaces.',
      "Contributed to the continuous evolution of Pegadaian's digital landscape by extending and enhancing application functionalities.",
      'Engaged with a diverse range of projects, including the CSR Web App, B2B Web App, and Microsite Pinjaman.'
    ],
    stack: [
      'Vue.js',
      'Pinia',
      'TypeScript',
      'NestJS',
      'Redis',
      'PHP',
      'Codeigniter 3',
      'PostgreSQL',
      'SCSS'
    ]
  },
  {
    role: 'Web Development',
    company: 'Freelance',
    location: 'Pekanbaru, Indonesia',
    period: 'Sep 2021 – Jan 2023',
    bullets: [
      'Developed responsive and user-friendly web applications using React.js, Node.js, and Express.js.',
      'Integrated web applications with databases such as MongoDB, MySQL, and PostgreSQL.',
      'Used front-end frameworks such as React.js, Material UI, and Tailwind to create engaging user interfaces.'
    ],
    stack: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'MySQL',
      'PostgreSQL',
      'Tailwind',
      'Material UI'
    ]
  },
  {
    role: 'Web Development',
    company: 'PT. Sumatera Kalimantan Jaya',
    location: 'Pekanbaru, Indonesia',
    period: 'Apr 2021 – Jul 2021',
    bullets: [
      'Designed and implemented a Profile Company website using Codeigniter in 14 days.',
      "Implemented MPOS application to regulate the sale and stock of the company's products with a 3-person team."
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Codeigniter', 'Bootstrap']
  }
]

export const projects: Project[] = [
  {
    title: 'Singel APP (Pegadaian Kita)',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Present',
    bullets: [
      'Built modular and reusable frontend components based on UI/UX team specifications using Vue 3 Composition API and Tailwind CSS.',
      'Actively contributed to a company-wide Micro-Frontend Architecture, allowing multiple teams to work in parallel and independently deploy features.',
      'Ensured seamless integration with microservice-based backends, collaborating closely with backend teams to define and consume APIs.',
      'Developed and maintained unit tests using Vitest, consistently achieving ≥80% code coverage.',
      'Advocated for clean code practices and component-driven development.'
    ],
    stack: [
      'Vue 3',
      'NestJS',
      'Tailwind',
      'PostgreSQL',
      'Redis',
      'Vee-validate',
      'Zod',
      'Pinia',
      'Vitest'
    ]
  },
  {
    title: 'Microsite Pinjaman Pegadaian',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      'Revamped legacy CodeIgniter 3 monolith into a scalable NestJS microservices architecture for the loan lead generation platform.',
      'Designed and architected 9 backend services using Factory pattern, enabling dynamic support for Kredit Usaha Rakyat, Serba Guna, and Cicil Kendaraan.',
      'Developed and maintained comprehensive unit testing, achieving high test coverage to reduce regression.',
      'Created clear and structured technical documentation for knowledge transfer.',
      'Integrated with App Mitra Pegadaian.'
    ],
    stack: [
      'Vue.js',
      'Pinia',
      'TypeScript',
      'NestJS',
      'Redis',
      'PHP',
      'Codeigniter 3',
      'PostgreSQL',
      'Crontab'
    ]
  },
  {
    title: 'KAMILA Application',
    company: 'PT. Pegadaian',
    period: 'May 2023 – Present',
    bullets: [
      'Developed and maintained the FE and BE, ensuring a responsive, intuitive user interface for internal Pegadaian employees.',
      'Developed backend modules for marketing progress tracking, marketing plans, and weekly marketing reporting.',
      'Built a backend module to manage employee KPI tracking, enabling performance measurement and evaluation.',
      "Continued development of the loan lead submission feature from Pegadaian's external business partners."
    ],
    stack: [
      'ExpressJS',
      'ReactJS',
      'Tailwind',
      'PostgreSQL',
      'Redis',
      'TypeORM',
      'Redux',
      'Node.js'
    ]
  },
  {
    title: 'Reconciliation System (AIRA)',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      'Continued development of the reconciliation transaction module for integration with additional partner banks.',
      "Ensured reconciliation processes are compatible and consumable by Pegadaian's core banking services.",
      "Verified that reconciled transaction journal entries comply with the accounting division's standards."
    ],
    stack: ['PHP 5', 'PHP Native', 'SFTP', 'VM']
  },
  {
    title: 'Thesis — Chatbot Kukerta Information System',
    company: 'Universitas Riau',
    period: '2020',
    bullets: [
      'Created a conversation application with the kukerta admin using fuzzy string matching, achieving 80% question match rate.',
      'Designed and implemented a dialogue dataset of 3,000 questionnaire entries processed for chatbot knowledge in 1 month.'
    ],
    stack: ['Python', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Flask', 'Bootstrap']
  }
]

export const education: Education = {
  institution: 'Universitas Riau',
  degree: 'Bachelor of Informatics Engineering',
  location: 'Pekanbaru, Indonesia',
  period: 'Sep 2016 – Oct 2020',
  gpa: '3.69 / 4.00'
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Frameworks',
    icon: 'code-2',
    items: ['Vue.js', 'React.js', 'Node.js', 'NestJS', 'Express.js']
  },
  {
    label: 'Languages & Styling',
    icon: 'book-open',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Tailwind CSS', 'SCSS', 'HTML/CSS']
  },
  {
    label: 'Databases & Infrastructure',
    icon: 'cpu',
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'Docker', 'GitLab CI']
  },
  {
    label: 'Developer Tools',
    icon: 'wrench',
    items: ['Git', 'Postman', 'Jenkins', 'Vitest', 'Jest', 'Vite', 'ESLint', 'Biome']
  }
]
