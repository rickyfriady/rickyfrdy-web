<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { BookOpen, Code2, Cpu, GraduationCap, Wrench } from 'lucide-vue-next'

// ── Work Experience ─────────────────────────────────────────────────────────

interface WorkExperience {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
  stack: string[]
}

const experiences: WorkExperience[] = [
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

// ── Project Experience ───────────────────────────────────────────────────────

interface Project {
  title: string
  company: string
  period: string
  bullets: string[]
  stack: string[]
}

const projects: Project[] = [
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

// ── Skills ───────────────────────────────────────────────────────────────────

const skillCategories = [
  {
    icon: Code2,
    label: 'Frameworks',
    items: ['Vue JS', 'React Js', 'NodeJS', 'ExpressJS', 'NestJS']
  },
  {
    icon: Cpu,
    label: 'Languages & Styling',
    items: [
      'TypeScript',
      'JavaScript',
      'CSS in JS',
      'Tailwind',
      'SQL',
      'NoSQL',
      'Redux',
      'Zustand',
      'Pinia',
      'Zod',
      'Vee-Validate'
    ]
  },
  {
    icon: BookOpen,
    label: 'Relevant Skills',
    items: [
      'Web Performance',
      'Web Accessibility',
      'Clean Code',
      'Software Testing',
      'CI/CD',
      'REST API',
      'Unit Testing'
    ]
  },
  {
    icon: Wrench,
    label: 'Developer Tools',
    items: [
      'Git',
      'Gitlab',
      'SonarQube',
      'Npm',
      'Yarn',
      'Postman',
      'Testing Library',
      'Swagger',
      'Docker',
      'Jenkins',
      'Jira'
    ]
  }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="border-border border-b px-4 py-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <p class="eyebrow mb-3">Career</p>
      <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
        Experience &amp;<br />
        <span class="title-accent text-accent">Full History.</span>
      </h1>
      <p class="text-muted mt-4 text-sm leading-relaxed">
        Work history, projects, education, and the skills that connect them.
      </p>
    </section>

    <!-- § 01 — Work Experience -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 01 — Work Experience</span>
      </div>

      <Accordion type="single" default-value="exp-0" collapsible class="divide-border divide-y">
        <AccordionItem
          v-for="(exp, index) in experiences"
          :key="exp.company + exp.period"
          :value="`exp-${index}`"
          class="border-b-0"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="index * 80"
        >
          <AccordionTrigger
            class="hover:bg-secondary/40 px-4 py-5 text-left transition-colors duration-200 hover:no-underline"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span class="text-foreground text-sm font-semibold">{{ exp.role }}</span>
                <span class="text-accent font-mono text-xs">·</span>
                <span class="text-foreground font-mono text-xs">{{ exp.company }}</span>
              </div>
              <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span class="text-muted font-mono text-[10px] tracking-[0.08em]">{{
                  exp.period
                }}</span>
                <span class="text-muted font-mono text-[10px] tracking-[0.08em]">{{
                  exp.location
                }}</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="px-4 pt-0 pb-6">
            <ul class="space-y-2">
              <li
                v-for="bullet in exp.bullets"
                :key="bullet"
                class="text-muted flex gap-2 text-sm leading-relaxed"
              >
                <span class="text-accent mt-0.5 shrink-0 font-mono text-xs">→</span>
                <span>{{ bullet }}</span>
              </li>
            </ul>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="tech in exp.stack" :key="tech" class="diff-tag">{{ tech }}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <!-- § 02 — Project Experience -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Project Experience</span>
      </div>

      <Accordion type="single" collapsible class="divide-border divide-y">
        <AccordionItem
          v-for="(project, index) in projects"
          :key="project.title"
          :value="`proj-${index}`"
          class="border-b-0"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="index * 60"
        >
          <AccordionTrigger
            class="hover:bg-secondary/40 px-4 py-5 text-left transition-colors duration-200 hover:no-underline"
          >
            <div class="min-w-0 flex-1">
              <span class="text-foreground text-sm font-semibold">{{ project.title }}</span>
              <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span class="text-accent font-mono text-[10px] tracking-[0.08em]">{{
                  project.company
                }}</span>
                <span class="text-muted font-mono text-[10px] tracking-[0.08em]">{{
                  project.period
                }}</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="px-4 pt-0 pb-6">
            <ul class="space-y-2">
              <li
                v-for="bullet in project.bullets"
                :key="bullet"
                class="text-muted flex gap-2 text-sm leading-relaxed"
              >
                <span class="text-accent mt-0.5 shrink-0 font-mono text-xs">→</span>
                <span>{{ bullet }}</span>
              </li>
            </ul>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="tech in project.stack" :key="tech" class="diff-tag">{{ tech }}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>

    <!-- § 03 — Education -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — Education</span>
      </div>

      <div class="px-4 pb-6" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1 }">
        <div class="glass-card p-5">
          <div class="flex items-start gap-3">
            <GraduationCap aria-hidden="true" class="text-accent mt-0.5 h-5 w-5 shrink-0" />
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-foreground text-sm font-semibold">Universitas Riau</h3>
                <span class="text-muted font-mono text-[10px] tracking-[0.08em]"
                  >Sep 2016 – Oct 2020</span
                >
              </div>
              <p class="text-muted mt-1 font-mono text-xs">Bachelor of Information System</p>
              <p class="text-muted font-mono text-[10px]">Pekanbaru, Indonesia</p>

              <div class="mt-3 flex items-center gap-2">
                <span
                  class="font-mono text-xs font-semibold"
                  style="
                    background: color-mix(in oklch, var(--color-accent) 12%, transparent);
                    border: 1px solid color-mix(in oklch, var(--color-accent) 28%, transparent);
                    color: var(--color-accent);
                    padding: 2px 8px;
                    border-radius: 6px;
                  "
                  >GPA 3.69 / 4.00</span
                >
              </div>

              <div class="mt-3">
                <p class="text-muted font-mono text-[10px] tracking-[0.08em] uppercase">
                  Relevant Coursework
                </p>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="course in [
                      'Algorithms',
                      'Data Structures',
                      'Software Engineering',
                      'OOP',
                      'Database'
                    ]"
                    :key="course"
                    class="diff-tag"
                    >{{ course }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- § 04 — Skills -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — Skills</span>
      </div>

      <div
        class="grid grid-cols-1 gap-3 px-4 pb-6 sm:grid-cols-2"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
        :delay="80"
      >
        <div v-for="category in skillCategories" :key="category.label" class="glass-card p-4">
          <div class="mb-3 flex items-center gap-2">
            <component
              :is="category.icon"
              aria-hidden="true"
              class="text-accent h-4 w-4 shrink-0"
            />
            <p class="text-foreground text-xs font-semibold tracking-[0.08em] uppercase">
              {{ category.label }}
            </p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="item in category.items" :key="item" class="diff-tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 py-12 text-center">
      <p class="eyebrow mb-4">Let's Connect</p>
      <h2 class="title-display" style="font-size: clamp(1.8rem, 5vw, 3rem)">
        Ready to Work Together?
      </h2>
      <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
        Open to fullstack engineering roles, freelance projects, and technical collaborations.
      </p>
      <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" as="a" href="/contact">Get In Touch</Button>
        <Button size="lg" variant="outline" as="a" href="/about">Read My Story</Button>
      </div>
    </section>
  </div>
</template>
