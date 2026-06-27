import type { Education, ExperienceProject, SkillCategory, WorkExperience } from '@/models'

export const summary =
  'Fullstack developer with 4+ years delivering production systems in Indonesian fintech. At PT. Pegadaian, I build micro-frontend platforms and NestJS microservice backends powering a loan lead platform at 80% conversion facilitating Rp 3 miliar+ in loan originations, and an employee super-app serving 1.5 million active users.'

export const experiences = [
  {
    role: 'Software Engineer',
    company: 'PT. Pegadaian',
    location: 'Jakarta Pusat, Indonesia',
    period: 'May 2023 – Present',
    bullets: [
      'Led migration of Microsite Pinjaman from PHP/CodeIgniter monolith to 9 NestJS microservices, achieving 80% lead-to-approval conversion and facilitating Rp 3 miliar+ in loan originations across KUR, Serba Guna, and Cicil Kendaraan products.',
      'Built micro-frontend modules for Singel APP (Pegadaian Kita) using Module Federation, contributing to a platform serving 1.5 million active users with parallel team deployments and independent delivery per feature.',
      'Developed KPI tracking and marketing performance modules in KAMILA, enabling data-driven performance reviews and loan lead submission integration with external business partners.'
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
    ],
    companyLogo: 'pegadaian'
  },
  {
    role: 'Web Development',
    company: 'Freelance',
    location: 'Pekanbaru, Indonesia',
    period: 'Sep 2021 – Jan 2023',
    bullets: [
      'Delivered responsive web applications for SMB clients using React.js, Node.js, and PostgreSQL, enabling clients to establish digital presence and automate customer-facing processes.',
      'Integrated third-party APIs and relational/document databases (MongoDB, MySQL, PostgreSQL), replacing manual workflows and enabling measurable operational efficiency gains.'
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
      "Delivered a company profile website in 14 days using CodeIgniter, establishing the company's digital presence ahead of schedule.",
      'Implemented an MPOS application for real-time sales and inventory management with a 3-person team, eliminating manual stock tracking and enabling accurate daily financial reporting.'
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Codeigniter', 'Bootstrap']
  }
] satisfies WorkExperience[]

export const projects = [
  {
    title: 'Singel APP (Pegadaian Kita)',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Present',
    bullets: [
      'Built modular micro-frontend components with Module Federation serving 1.5 million active users; achieved ≥80% unit test coverage with Vitest, enabling continuous delivery at scale.',
      'Advocated for clean code and component-driven development, reducing cross-team integration friction in a multi-team parallel deployment environment.'
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
    ],
    companyLogo: 'pegadaian'
  },
  {
    title: 'Microsite Pinjaman Pegadaian',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      'Designed a Factory-pattern architecture to support new loan types without codebase changes, enabling Rp 3 miliar+ origination volume at 80% lead-to-approval conversion.',
      'Designed 9 backend microservices with clear contracts and comprehensive documentation, enabling knowledge transfer to subsequent engineers.'
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
    ],
    companyLogo: 'pegadaian'
  },
  {
    title: 'KAMILA Application',
    company: 'PT. Pegadaian',
    period: 'May 2023 – Present',
    bullets: [
      'Built KPI tracking and marketing performance reporting modules, giving management data-driven visibility into field team performance.',
      "Developed loan lead submission integration with external business partners, expanding Pegadaian's origination channels beyond direct customer acquisition."
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
    ],
    companyLogo: 'pegadaian'
  },
  {
    title: 'Reconciliation System (AIRA)',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Present',
    bullets: [
      "Extended bank reconciliation coverage to additional partner banks, ensuring financial transaction accuracy and compliance with Pegadaian's core banking accounting standards."
    ],
    stack: ['PHP 5', 'PHP Native', 'SFTP', 'VM'],
    companyLogo: 'pegadaian'
  },
  {
    title: 'Thesis — Chatbot Kukerta Information System',
    company: 'Universitas Riau',
    period: '2020',
    bullets: [
      "Achieved 80% question match accuracy on a 3,000-entry dialogue dataset using fuzzy string matching, automating student information queries for the university's KKN program."
    ],
    stack: ['Python', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Flask', 'Bootstrap']
  }
] satisfies ExperienceProject[]

export const education: Education = {
  institution: 'Universitas Riau',
  degree: 'Bachelor of Informatics Engineering',
  location: 'Pekanbaru, Indonesia',
  period: 'Sep 2016 – Oct 2020',
  gpa: '3.69 / 4.00'
}

export const skillCategories = [
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
] satisfies SkillCategory[]
