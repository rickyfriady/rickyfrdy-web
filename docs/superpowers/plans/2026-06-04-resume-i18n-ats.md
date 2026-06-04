# Resume i18n (EN/ID) + ATS-Friendly PDF — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Indonesian language support (Astro URL routing under `/id/`) and an ATS-friendly plain-text PDF download variant to the resume page.

**Architecture:** Astro i18n config with `prefixDefaultLocale: false` keeps all English URLs unchanged; Indonesian pages live under `src/pages/id/`. Content is split into `experience.ts` (EN) and `experience.id.ts` (ID). A self-contained `LangSwitcher.tsx` React island reads the current URL to derive active lang and navigation targets — no server-side props needed for switching. ATS PDFs use a separate `ResumePdfAts.tsx` template (Helvetica-only, black/white, comma-joined skills).

**Tech Stack:** Astro 6 (i18n config, `astro:i18n`), Framer Motion v12 (spring pill), GSAP v3 (tap feedback), react-pdf (PDF rendering), TypeScript

---

## Task 1: Add Astro i18n config

**Files:**
- Modify: `astro.config.ts`

- [ ] **Step 1: Add i18n block to astro.config.ts**

```ts
// astro.config.ts — add i18n to the defineConfig object
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

export default defineConfig({
  site: 'https://rickyfrdy.my.id',
  output: 'static',
  integrations: [mdx(), react(), sitemap(), robotsTxt()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: false }
  },
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: tailwindcss vite plugin type is incompatible with Vite's PluginOption
    plugins: [tailwindcss() as any],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    },
    ssr: {
      noExternal: ['@react-pdf/renderer']
    }
  }
})
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add astro.config.ts
git commit -m "feat(i18n): add Astro i18n config with EN default + ID locale"
```

---

## Task 2: Expand ui.ts with full EN + ID keys

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Rewrite ui.ts with all keys for both locales**

Replace the entire file content:

```ts
// src/i18n/ui.ts
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
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): expand ui.ts with full EN + ID locale keys"
```

---

## Task 3: Indonesian experience data

**Files:**
- Create: `src/data/experience.id.ts`

- [ ] **Step 1: Create Indonesian experience data file**

```ts
// src/data/experience.id.ts
import type { Education, Project, SkillCategory, WorkExperience } from './experience'

export const summary =
  'Fullstack developer dengan 4+ tahun pengalaman membangun sistem produksi di fintech Indonesia. Di PT. Pegadaian, saya membangun platform micro-frontend dan backend microservice NestJS yang mendukung platform pengajuan pinjaman dengan konversi 80% memfasilitasi Rp 3 miliar+ dalam originasi pinjaman, serta super-app karyawan yang melayani 1,5 juta pengguna aktif.'

export const experiences: WorkExperience[] = [
  {
    role: 'Software Engineer',
    company: 'PT. Pegadaian',
    location: 'Jakarta Pusat, Indonesia',
    period: 'Mei 2023 – Sekarang',
    bullets: [
      'Memimpin migrasi Microsite Pinjaman dari monolith PHP/CodeIgniter ke 9 microservice NestJS, mencapai konversi lead-to-approval 80% dan memfasilitasi Rp 3 miliar+ originasi pinjaman untuk produk KUR, Serba Guna, dan Cicil Kendaraan.',
      'Membangun modul micro-frontend untuk Singel APP (Pegadaian Kita) menggunakan Module Federation, berkontribusi pada platform yang melayani 1,5 juta pengguna aktif dengan deployment tim paralel dan pengiriman mandiri per fitur.',
      'Mengembangkan modul pelacakan KPI dan kinerja pemasaran di KAMILA, memungkinkan tinjauan kinerja berbasis data dan integrasi pengajuan lead pinjaman dengan mitra bisnis eksternal.'
    ],
    stack: ['Vue.js', 'Pinia', 'TypeScript', 'NestJS', 'Redis', 'PHP', 'Codeigniter 3', 'PostgreSQL', 'SCSS']
  },
  {
    role: 'Web Development',
    company: 'Freelance',
    location: 'Pekanbaru, Indonesia',
    period: 'Sep 2021 – Jan 2023',
    bullets: [
      'Mengembangkan aplikasi web responsif untuk klien UKM menggunakan React.js, Node.js, dan PostgreSQL, membantu klien membangun kehadiran digital dan mengotomatiskan proses yang berhadapan dengan pelanggan.',
      'Mengintegrasikan API pihak ketiga dan database relasional/dokumen (MongoDB, MySQL, PostgreSQL), menggantikan alur kerja manual dan memungkinkan peningkatan efisiensi operasional yang terukur.'
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Tailwind', 'Material UI']
  },
  {
    role: 'Web Development',
    company: 'PT. Sumatera Kalimantan Jaya',
    location: 'Pekanbaru, Indonesia',
    period: 'Apr 2021 – Jul 2021',
    bullets: [
      'Mengembangkan website profil perusahaan dalam 14 hari menggunakan CodeIgniter, membangun kehadiran digital perusahaan lebih cepat dari jadwal.',
      'Mengimplementasikan aplikasi MPOS untuk manajemen penjualan dan inventaris secara real-time bersama tim 3 orang, menghilangkan pelacakan stok manual dan memungkinkan pelaporan keuangan harian yang akurat.'
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Codeigniter', 'Bootstrap']
  }
]

export const projects: Project[] = [
  {
    title: 'Singel APP (Pegadaian Kita)',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Sekarang',
    bullets: [
      'Membangun komponen micro-frontend modular dengan Module Federation yang melayani 1,5 juta pengguna aktif; mencapai cakupan unit test ≥80% dengan Vitest, memungkinkan continuous delivery dalam skala besar.',
      'Mengadvokasi clean code dan pengembangan berbasis komponen, mengurangi gesekan integrasi lintas tim dalam lingkungan deployment paralel multi-tim.'
    ],
    stack: ['Vue 3', 'NestJS', 'Tailwind', 'PostgreSQL', 'Redis', 'Vee-validate', 'Zod', 'Pinia', 'Vitest']
  },
  {
    title: 'Microsite Pinjaman Pegadaian',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Sekarang',
    bullets: [
      'Merancang arsitektur Factory-pattern untuk mendukung jenis pinjaman baru tanpa perubahan kode, memungkinkan volume originasi Rp 3 miliar+ dengan konversi lead-to-approval 80%.',
      'Merancang 9 microservice backend dengan kontrak yang jelas dan dokumentasi komprehensif, memungkinkan transfer pengetahuan ke engineer berikutnya.'
    ],
    stack: ['Vue.js', 'Pinia', 'TypeScript', 'NestJS', 'Redis', 'PHP', 'Codeigniter 3', 'PostgreSQL', 'Crontab']
  },
  {
    title: 'Aplikasi KAMILA',
    company: 'PT. Pegadaian',
    period: 'Mei 2023 – Sekarang',
    bullets: [
      'Membangun modul pelacakan KPI dan pelaporan kinerja pemasaran, memberikan visibilitas berbasis data kepada manajemen atas kinerja tim lapangan.',
      'Mengembangkan integrasi pengajuan lead pinjaman dengan mitra bisnis eksternal, memperluas saluran originasi Pegadaian melampaui akuisisi pelanggan langsung.'
    ],
    stack: ['ExpressJS', 'ReactJS', 'Tailwind', 'PostgreSQL', 'Redis', 'TypeORM', 'Redux', 'Node.js']
  },
  {
    title: 'Sistem Rekonsiliasi (AIRA)',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Sekarang',
    bullets: [
      'Memperluas cakupan rekonsiliasi bank ke bank mitra tambahan, memastikan akurasi transaksi keuangan dan kepatuhan terhadap standar akuntansi core banking Pegadaian.'
    ],
    stack: ['PHP 5', 'PHP Native', 'SFTP', 'VM']
  },
  {
    title: 'Tugas Akhir — Chatbot Sistem Informasi Kukerta',
    company: 'Universitas Riau',
    period: '2020',
    bullets: [
      'Mencapai akurasi pencocokan pertanyaan 80% pada dataset dialog 3.000 entri menggunakan fuzzy string matching, mengotomatiskan kueri informasi mahasiswa untuk program KKN universitas.'
    ],
    stack: ['Python', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Flask', 'Bootstrap']
  }
]

export const education: Education = {
  institution: 'Universitas Riau',
  degree: 'Sarjana Teknik Informatika',
  location: 'Pekanbaru, Indonesia',
  period: 'Sep 2016 – Okt 2020',
  gpa: '3,69 / 4,00'
}

export const skillCategories: SkillCategory[] = [
  { label: 'Framework', icon: 'code-2', items: ['Vue.js', 'React.js', 'Node.js', 'NestJS', 'Express.js'] },
  {
    label: 'Bahasa & Styling',
    icon: 'book-open',
    items: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Tailwind CSS', 'SCSS', 'HTML/CSS']
  },
  {
    label: 'Database & Infrastruktur',
    icon: 'cpu',
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'Docker', 'GitLab CI']
  },
  {
    label: 'Alat Developer',
    icon: 'wrench',
    items: ['Git', 'Postman', 'Jenkins', 'Vitest', 'Jest', 'Vite', 'ESLint', 'Biome']
  }
]
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/data/experience.id.ts
git commit -m "feat(i18n): add Indonesian experience data"
```

---

## Task 4: ATS PDF template

**Files:**
- Create: `src/components/resume/ResumePdfAts.tsx`

- [ ] **Step 1: Create ATS PDF component**

```tsx
// src/components/resume/ResumePdfAts.tsx
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Education, Project, SkillCategory, WorkExperience } from '@/data/experience'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 48,
    paddingVertical: 40,
    fontFamily: 'Helvetica',
    color: '#000000',
    fontSize: 10
  },
  name: { fontSize: 18, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, marginBottom: 4 },
  contactRow: { flexDirection: 'row', gap: 16, marginBottom: 2 },
  contactText: { fontSize: 9 },
  hr: { borderBottomWidth: 0.5, borderBottomColor: '#000000', marginVertical: 10 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  entryBlock: { marginBottom: 12 },
  entryTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  entryMeta: { fontSize: 9, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletDash: { marginRight: 5, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.5 },
  plainText: { fontSize: 9, lineHeight: 1.5 },
  summaryText: { fontSize: 9, lineHeight: 1.6 }
})

interface Props {
  experiences: WorkExperience[]
  projects: Project[]
  education: Education
  skillCategories: SkillCategory[]
  summary: string
}

export default function ResumePdfAts({ experiences, projects, education, skillCategories, summary }: Props) {
  return (
    <Document title="Ricki Friadi — Resume (ATS)">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>Ricki Friadi</Text>
        <Text style={s.subtitle}>Fullstack Developer</Text>
        <View style={s.contactRow}>
          <Text style={s.contactText}>Jakarta, Indonesia</Text>
          <Text style={s.contactText}>friadi.ricki@gmail.com</Text>
          <Text style={s.contactText}>github.com/rickyfrdy</Text>
        </View>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Summary</Text>
        <Text style={s.summaryText}>{summary}</Text>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Work Experience</Text>
        {experiences.map((exp) => (
          <View key={`${exp.company}-${exp.role}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {exp.role} - {exp.company}
            </Text>
            <Text style={s.entryMeta}>
              {exp.location} | {exp.period}
            </Text>
            {exp.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletDash}>-</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <Text style={s.plainText}>Technologies: {exp.stack.join(', ')}</Text>
          </View>
        ))}

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Project Experience</Text>
        {projects.map((proj) => (
          <View key={`${proj.company}-${proj.title}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {proj.title} - {proj.company}
            </Text>
            <Text style={s.entryMeta}>{proj.period}</Text>
            {proj.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletDash}>-</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <Text style={s.plainText}>Technologies: {proj.stack.join(', ')}</Text>
          </View>
        ))}

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Education</Text>
        <View style={s.entryBlock}>
          <Text style={s.entryTitle}>
            {education.degree} - {education.institution}
          </Text>
          <Text style={s.entryMeta}>
            {education.location} | {education.period}
          </Text>
          <Text style={s.plainText}>GPA: {education.gpa}</Text>
        </View>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Skills</Text>
        {skillCategories.map((cat) => (
          <View key={cat.label} style={{ marginBottom: 4 }}>
            <Text style={s.plainText}>
              {cat.label}: {cat.items.join(', ')}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/resume/ResumePdfAts.tsx
git commit -m "feat(resume): add ATS-friendly PDF template (Helvetica, black/white)"
```

---

## Task 5: ATS PDF route (English)

**Files:**
- Create: `src/pages/resume-ats.pdf.ts`

- [ ] **Step 1: Create English ATS PDF API route**

```ts
// src/pages/resume-ats.pdf.ts
import type { DocumentProps } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import type { APIRoute } from 'astro'
import type { ReactElement } from 'react'
import { createElement } from 'react'
import ResumePdfAts from '@/components/resume/ResumePdfAts'
import { education, experiences, projects, skillCategories, summary } from '@/data/experience'

export const GET: APIRoute = async () => {
  const element = createElement(ResumePdfAts, {
    experiences,
    projects,
    education,
    skillCategories,
    summary
  }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ricki-friadi-resume-ats.pdf"'
    }
  })
}
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/resume-ats.pdf.ts
git commit -m "feat(resume): add /resume-ats.pdf ATS download route"
```

---

## Task 6: LangSwitcher component

**Files:**
- Create: `src/components/layout/LangSwitcher.tsx`

- [ ] **Step 1: Create LangSwitcher React island**

```tsx
// src/components/layout/LangSwitcher.tsx
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const pillTransition = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 }

const pillStyle = {
  background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
  border: '1px solid color-mix(in oklch, var(--color-accent) 28%, transparent)'
}

function getTargetHref(targetLang: 'en' | 'id'): string {
  const pathname = window.location.pathname
  const isId = pathname.startsWith('/id')
  if (targetLang === 'id') {
    if (isId) return pathname
    return pathname === '/' ? '/id' : `/id${pathname}`
  }
  if (!isId) return pathname
  return pathname.replace(/^\/id/, '') || '/'
}

export default function LangSwitcher() {
  const [currentLang, setCurrentLang] = useState<'en' | 'id'>(() => {
    if (typeof window === 'undefined') return 'en'
    return window.location.pathname.startsWith('/id') ? 'id' : 'en'
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => {
      setCurrentLang(window.location.pathname.startsWith('/id') ? 'id' : 'en')
    }
    document.addEventListener('astro:page-load', handler)
    return () => document.removeEventListener('astro:page-load', handler)
  }, [])

  function handleClick(lang: 'en' | 'id') {
    if (lang === currentLang) return
    const href = getTargetHref(lang)
    if (containerRef.current) {
      gsap
        .timeline()
        .to(containerRef.current, { scale: 0.88, duration: 0.08, ease: 'power2.in' })
        .to(containerRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(3)',
          clearProps: 'transform',
          onComplete: () => { window.location.href = href }
        })
    } else {
      window.location.href = href
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className="hidden md:flex items-center gap-0.5 rounded-xl border p-1"
      style={{ borderColor: 'color-mix(in oklch, var(--color-border) 40%, transparent)' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pillTransition}
    >
      {(['en', 'id'] as const).map((lang) => {
        const active = currentLang === lang
        const flag = lang === 'en' ? '🇺🇸' : '🇮🇩'
        const label = lang === 'en' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'
        return (
          <button
            key={lang}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => handleClick(lang)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg"
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-lg"
                style={pillStyle}
                transition={pillTransition}
              />
            )}
            <motion.span
              className="relative z-10 select-none text-base"
              animate={{ scale: active ? 1.25 : 0.9, opacity: active ? 1 : 0.45 }}
              transition={pillTransition}
            >
              {flag}
            </motion.span>
          </button>
        )
      })}
    </motion.div>
  )
}
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/LangSwitcher.tsx
git commit -m "feat(i18n): add LangSwitcher island with spring pill + GSAP tap feedback"
```

---

## Task 7: Wire LangSwitcher into AppHeader + add lang prop to MainLayout

**Files:**
- Modify: `src/components/layout/AppHeader.astro`
- Modify: `src/components/layout/MainLayout.astro`

- [ ] **Step 1: Update AppHeader.astro to include LangSwitcher**

Replace the entire file:

```astro
---
import LangSwitcher from './LangSwitcher'
import NavLinks from './NavLinks'
import WanderingEyes from './WanderingEyes'
---

<header class="header-glass sticky top-0 z-50">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <WanderingEyes />

    <NavLinks client:load transition:persist />

    <div class="flex items-center gap-2">
      <LangSwitcher client:load transition:persist />

      <button
        id="theme-toggle"
        type="button"
        aria-label="Toggle dark mode"
        class="glass-btn text-muted hover:text-foreground rounded-xl p-2"
      >
        <svg id="icon-sun" class="block h-4 w-4 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
        <svg id="icon-moon" class="hidden h-4 w-4 dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </button>
    </div>
  </nav>
</header>

<script>
  import gsap from 'gsap'
  import { applyThemeToDom, initTheme, theme, toggleTheme } from '@/stores/theme'

  document.addEventListener('astro:page-load', () => {
    initTheme()

    const btn = document.getElementById('theme-toggle')

    btn?.addEventListener('click', async (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        toggleTheme()
        applyThemeToDom(theme.get())
        return
      }

      const { clientX: x, clientY: y } = e as MouseEvent

      gsap
        .timeline()
        .to(btn, { scale: 0.82, duration: 0.08, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.25, ease: 'back.out(3)', clearProps: 'transform' })

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      if (!document.startViewTransition) {
        toggleTheme()
        applyThemeToDom(theme.get())
        return
      }

      const transition = document.startViewTransition(() => {
        toggleTheme()
        applyThemeToDom(theme.get())
      })

      await transition.ready

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      )

      await transition.finished

      const isDark = document.documentElement.classList.contains('dark')
      const newIcon = document.getElementById(isDark ? 'icon-moon' : 'icon-sun')
      if (newIcon) {
        gsap.fromTo(
          newIcon,
          { rotate: -180, scale: 0 },
          { rotate: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', clearProps: 'all' },
        )
      }
    })
  })
</script>
```

- [ ] **Step 2: Update MainLayout.astro to accept + apply lang prop**

Replace the frontmatter and `<html>` opening tag only — leave the body unchanged:

```astro
---
import { ClientRouter } from 'astro:transitions'
import AppFooter from './AppFooter.astro'
import AppHeader from './AppHeader.astro'
import BaseHead from './BaseHead.astro'
import MobileBottomNav from './MobileBottomNav'
import '@/styles/global.css'

interface Props {
  title: string
  description: string
  lang?: 'en' | 'id'
  ogImage?: string | undefined
  noReveal?: boolean
}

const { title, description, lang = 'en', ogImage, noReveal = false } = Astro.props
---

<!doctype html>
<html lang={lang} class="dark" data-no-reveal={noReveal || undefined}>
```

Leave everything from `<head>` onward unchanged.

- [ ] **Step 3: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppHeader.astro src/components/layout/MainLayout.astro
git commit -m "feat(i18n): wire LangSwitcher into header, add lang prop to MainLayout"
```

---

## Task 8: Update English resume page — add ATS download button

**Files:**
- Modify: `src/pages/resume.astro`

- [ ] **Step 1: Replace the download CTA section in resume.astro**

Find this block (lines 136–154) and replace it:

```astro
    <!-- Download CTA -->
    <div class="pb-4 flex flex-wrap items-center justify-center gap-3">
      <a
        href="/resume.pdf"
        download
        class="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm transition-colors"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </a>
      <a
        href="/resume-ats.pdf"
        download
        class="text-muted border-border hover:bg-secondary inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs transition-colors"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ATS Version
      </a>
    </div>
```

- [ ] **Step 2: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/resume.astro
git commit -m "feat(resume): add ATS Version download button to resume page"
```

---

## Task 9: Indonesian resume page + PDF routes

**Files:**
- Create: `src/pages/id/resume.astro`
- Create: `src/pages/id/resume.pdf.ts`
- Create: `src/pages/id/resume-ats.pdf.ts`

- [ ] **Step 1: Create `src/pages/id/` directory and Indonesian resume page**

```astro
---
// src/pages/id/resume.astro
import { education, experiences, projects, skillCategories, summary } from '@/data/experience.id'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="CV — Ricki Friadi"
  description="CV Fullstack Developer — Ricki Friadi. 4+ tahun membangun sistem produksi di fintech Indonesia."
  lang="id"
>
  <div class="mx-auto max-w-2xl px-4 py-12">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-display text-4xl font-light tracking-tight">Ricki Friadi</h1>
      <p class="text-muted mt-1 text-sm">Fullstack Developer</p>
      <div class="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
        <span>Jakarta, Indonesia</span>
        <a href="mailto:friadi.ricki@gmail.com" class="text-accent hover:underline">friadi.ricki@gmail.com</a>
        <a
          href="https://github.com/rickyfrdy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ricki Friadi di GitHub"
          class="text-accent hover:underline"
        >github.com/rickyfrdy</a>
      </div>
    </div>

    <hr class="border-border mb-8" />

    <!-- Ringkasan -->
    <section class="mb-8">
      <h2 class="text-muted mb-3 font-mono text-[10px] tracking-[0.16em] uppercase">Ringkasan</h2>
      <p class="text-foreground text-sm leading-relaxed">{summary}</p>
    </section>

    <hr class="border-border mb-8" />

    <!-- Pengalaman Kerja -->
    <section class="mb-8">
      <h2 class="text-muted mb-4 font-mono text-[10px] tracking-[0.16em] uppercase">Pengalaman Kerja</h2>
      <div class="space-y-8">
        {experiences.map((exp) => (
          <div>
            <div class="flex flex-wrap items-baseline gap-2">
              <span class="text-foreground font-semibold text-sm">{exp.role}</span>
              <span class="diff-tag">{exp.company}</span>
            </div>
            <p class="text-muted mt-0.5 text-xs">{exp.location} · {exp.period}</p>
            <ul class="mt-3 space-y-2">
              {exp.bullets.map((bullet) => (
                <li class="flex gap-2 text-sm">
                  <span class="text-accent mt-0.5 flex-shrink-0 text-xs">›</span>
                  <span class="text-muted">{bullet}</span>
                </li>
              ))}
            </ul>
            <div class="mt-3 flex flex-wrap gap-1.5">
              {exp.stack.map((tech) => (
                <span class="diff-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <hr class="border-border mb-8" />

    <!-- Pengalaman Proyek -->
    <section class="mb-8">
      <h2 class="text-muted mb-4 font-mono text-[10px] tracking-[0.16em] uppercase">Pengalaman Proyek</h2>
      <div class="space-y-8">
        {projects.map((proj) => (
          <div>
            <div class="flex flex-wrap items-baseline gap-2">
              <span class="text-foreground font-semibold text-sm">{proj.title}</span>
              <span class="diff-tag">{proj.company}</span>
            </div>
            <p class="text-muted mt-0.5 text-xs">{proj.period}</p>
            <ul class="mt-3 space-y-2">
              {proj.bullets.map((bullet) => (
                <li class="flex gap-2 text-sm">
                  <span class="text-accent mt-0.5 flex-shrink-0 text-xs">›</span>
                  <span class="text-muted">{bullet}</span>
                </li>
              ))}
            </ul>
            <div class="mt-3 flex flex-wrap gap-1.5">
              {proj.stack.map((tech) => (
                <span class="diff-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <hr class="border-border mb-8" />

    <!-- Pendidikan -->
    <section class="mb-8">
      <h2 class="text-muted mb-4 font-mono text-[10px] tracking-[0.16em] uppercase">Pendidikan</h2>
      <div>
        <div class="flex flex-wrap items-baseline gap-2">
          <span class="text-foreground font-semibold text-sm">{education.degree}</span>
          <span class="diff-tag">{education.institution}</span>
        </div>
        <p class="text-muted mt-0.5 text-xs">{education.location} · {education.period}</p>
        <p class="text-muted mt-2 text-sm">IPK: <span class="text-foreground font-semibold">{education.gpa}</span></p>
      </div>
    </section>

    <hr class="border-border mb-8" />

    <!-- Keahlian -->
    <section class="mb-12">
      <h2 class="text-muted mb-4 font-mono text-[10px] tracking-[0.16em] uppercase">Keahlian</h2>
      <div class="space-y-4">
        {skillCategories.map((cat) => (
          <div>
            <h3 class="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">{cat.label}</h3>
            <div class="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span class="diff-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <hr class="border-border mb-8" />

    <!-- Unduh CTA -->
    <div class="pb-4 flex flex-wrap items-center justify-center gap-3">
      <a
        href="/id/resume.pdf"
        download
        class="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm transition-colors"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Unduh PDF
      </a>
      <a
        href="/id/resume-ats.pdf"
        download
        class="text-muted border-border hover:bg-secondary inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs transition-colors"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Versi ATS
      </a>
    </div>

  </div>
</MainLayout>
```

- [ ] **Step 2: Create Indonesian designed PDF route**

```ts
// src/pages/id/resume.pdf.ts
import type { DocumentProps } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import type { APIRoute } from 'astro'
import type { ReactElement } from 'react'
import { createElement } from 'react'
import ResumePdf from '@/components/resume/ResumePdf'
import { education, experiences, projects, skillCategories, summary } from '@/data/experience.id'

export const GET: APIRoute = async () => {
  const element = createElement(ResumePdf, {
    experiences,
    projects,
    education,
    skillCategories,
    summary
  }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ricki-friadi-cv-id.pdf"'
    }
  })
}
```

- [ ] **Step 3: Create Indonesian ATS PDF route**

```ts
// src/pages/id/resume-ats.pdf.ts
import type { DocumentProps } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import type { APIRoute } from 'astro'
import type { ReactElement } from 'react'
import { createElement } from 'react'
import ResumePdfAts from '@/components/resume/ResumePdfAts'
import { education, experiences, projects, skillCategories, summary } from '@/data/experience.id'

export const GET: APIRoute = async () => {
  const element = createElement(ResumePdfAts, {
    experiences,
    projects,
    education,
    skillCategories,
    summary
  }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ricki-friadi-cv-ats-id.pdf"'
    }
  })
}
```

- [ ] **Step 4: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/pages/id/resume.astro src/pages/id/resume.pdf.ts src/pages/id/resume-ats.pdf.ts
git commit -m "feat(i18n): add Indonesian resume page + PDF routes (/id/resume)"
```

---

## Task 10: Remaining Indonesian pages

**Files:**
- Create: `src/pages/id/index.astro`
- Create: `src/pages/id/about.astro`
- Create: `src/pages/id/experience.astro`
- Create: `src/pages/id/works.astro`
- Create: `src/pages/id/projects.astro`
- Create: `src/pages/id/contact.astro`

- [ ] **Step 1: Create `src/pages/id/index.astro`**

```astro
---
// src/pages/id/index.astro
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

const featuredProjects = projects.slice(0, 3)

const recentPosts = (await getCollection('blog') as CollectionEntry<'blog'>[])
  .filter((entry) => !entry.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 2)

const categoryLabel: Record<string, string> = {
  'web-app': 'Aplikasi Web',
  api: 'API',
  tool: 'Alat',
  'open-source': 'Open Source',
}

const capabilities = [
  {
    area: 'Frontend',
    description: 'Antarmuka berbasis komponen dengan Vue 3, React, dan Astro. Micro-Frontend Architecture dengan Module Federation.',
    stack: ['Vue 3', 'React', 'Astro', 'TypeScript', 'Tailwind'],
  },
  {
    area: 'Backend',
    description: 'API REST dan event-driven dengan NestJS dan Node.js. Integrasi PostgreSQL, Redis, dan SFTP.',
    stack: ['NestJS', 'Node.js', 'PostgreSQL', 'Redis', 'Express'],
  },
  {
    area: 'Arsitektur',
    description: 'Microservices dengan Factory pattern, desain API contract-first dengan Zod, pipeline GitLab CI.',
    stack: ['Microservices', 'Module Federation', 'Zod', 'Docker', 'GitLab CI'],
  },
]
---

<MainLayout
  title="Ricki Friadi — Fullstack Developer"
  description="Fullstack Developer spesialis Vue 3, NestJS microservices, dan Micro-Frontend Architecture. Berbasis di Jakarta, Indonesia."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border relative border-b px-4 py-16 md:py-24">
    <div class="paper-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
    <div class="relative">
      <p class="eyebrow mb-4">Fullstack Developer · Jakarta, Indonesia</p>
      <h1
        class="title-display max-w-3xl"
        style="font-size: clamp(3rem, 10vw, 6.5rem); line-height: 0.92"
      >
        Ricki<br />
        <span class="title-accent text-accent">Friadi.</span>
      </h1>
      <p class="text-muted mt-6 max-w-lg text-sm leading-relaxed">
        Saya membangun sistem fullstack yang andal — dari micro-frontend Vue 3 dan microservice NestJS
        hingga arsitektur yang membuatnya tetap terpelihara dalam skala besar.
      </p>

      <div class="mt-6 inline-flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span class="bg-accent relative inline-flex h-2 w-2 rounded-full" />
        </span>
        <span class="text-muted font-mono text-xs">Terbuka untuk peluang baru</span>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="/id/projects"
          class="bg-accent text-background hover:bg-accent-hover inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
        >
          Lihat Karya Saya
        </a>
        <a
          href="/id/contact"
          class="border-border text-foreground hover:bg-secondary inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
        >
          Hubungi Saya
        </a>
      </div>
    </div>
  </section>

  <!-- § 01 — Karya Terpilih -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Karya Terpilih</span>
    </div>

    <div class="divide-border divide-y px-4 md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
      {featuredProjects.map((project) => (
        <a
          href={`/projects/${project.slug}`}
          class="group block py-6 no-underline md:px-6 md:first:pl-0 md:last:pr-0"
        >
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span class="diff-tag">{categoryLabel[project.category] ?? project.category}</span>
            <span class="diff-tag">{project.year}</span>
          </div>
          <h2 class="text-foreground group-hover:text-accent text-base font-semibold leading-snug transition-colors">
            {project.title}
          </h2>
          <p class="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
            {project.shortDescription}
          </p>
          {project.keyMetric && (
            <p class="text-accent mt-3 font-mono text-xs">{project.keyMetric}</p>
          )}
          <span class="text-accent mt-4 block font-mono text-xs">Lihat studi kasus →</span>
        </a>
      ))}
    </div>

    <div class="px-4 pb-8">
      <a href="/id/projects" class="text-muted hover:text-accent font-mono text-xs transition-colors">
        Semua proyek →
      </a>
    </div>
  </section>

  <!-- § 02 — Yang Saya Bangun -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Yang Saya Bangun</span>
    </div>

    <div class="divide-border divide-y px-4 pb-8 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {capabilities.map((cap, i) => (
        <div class="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
          <p class="text-muted font-mono text-[10px] uppercase tracking-widest">0{i + 1}</p>
          <h3 class="text-foreground mt-2 text-base font-semibold">{cap.area}</h3>
          <p class="text-muted mt-2 text-sm leading-relaxed">{cap.description}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            {cap.stack.map((s) => (
              <span class="diff-tag">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  <!-- § 03 — Tulisan Terbaru -->
  {recentPosts.length > 0 && (
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — Tulisan Terbaru</span>
      </div>
      <div class="divide-border divide-y px-4">
        {recentPosts.map((post) => (
          <a href={`/blog/${post.id}`} class="group block py-6 no-underline">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-foreground group-hover:text-accent text-base font-semibold transition-colors">
                  {post.data.title}
                </h2>
                <p class="text-muted mt-1 line-clamp-1 text-sm leading-relaxed">
                  {post.data.description}
                </p>
              </div>
              <time
                datetime={post.data.pubDate.toISOString()}
                class="text-muted flex-shrink-0 font-mono text-xs"
              >
                {post.data.pubDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}
              </time>
            </div>
          </a>
        ))}
      </div>
      <div class="px-4 pb-8">
        <a href="/blog" class="text-muted hover:text-accent font-mono text-xs transition-colors">
          Semua artikel →
        </a>
      </div>
    </section>
  )}

  <!-- § 04 — Terbuka untuk Kerja -->
  <section class="border-border border-b px-4 py-12">
    <div class="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="eyebrow mb-2">Ketersediaan</p>
        <h2 class="title-display" style="font-size: clamp(1.8rem, 4vw, 3rem); line-height: 0.95">
          Terbuka untuk<br />
          <span class="title-accent text-accent">Peluang Baru.</span>
        </h2>
        <p class="text-muted mt-3 max-w-md text-sm leading-relaxed">
          Mencari posisi fullstack atau berfokus backend. Preferensi kuat untuk stack TypeScript,
          Vue / React, dan NestJS. Remote atau berbasis Jakarta.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <a
          href="/id/contact"
          class="bg-accent text-background hover:bg-accent-hover inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
        >
          Mulai Percakapan
        </a>
        <a
          href="/id/experience"
          class="border-border text-foreground hover:bg-secondary inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
        >
          Lihat Pengalaman
        </a>
      </div>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 2: Create `src/pages/id/about.astro`**

```astro
---
// src/pages/id/about.astro
import GitHubHeatmap from '@/components/about/GitHubHeatmap'
import SkillsMatrix from '@/components/about/SkillsMatrix.astro'
import MainLayout from '@/components/layout/MainLayout.astro'
import { fetchBuildTimeStats } from '@/utils/github'

const initialStats = await fetchBuildTimeStats(import.meta.env.GITHUB_TOKEN)
---

<MainLayout
  title="Tentang — Ricki Friadi"
  description="Perjalanan saya sebagai fullstack developer — dari freelance hingga membangun microservices dan Micro-Frontend Architecture di PT. Pegadaian."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Tentang</p>
    <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
      Membangun Sistem Dengan<br />
      <span class="title-accent text-accent">Kejernihan Human-First.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Fullstack developer yang fokus pada arsitektur andal, kode yang dapat dikelola, dan antarmuka
      yang terasa disengaja.
    </p>
  </section>

  <!-- § 01 — Cerita Saya -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Cerita Saya</span>
    </div>

    <div class="space-y-4 px-4 pb-8 text-sm leading-relaxed">
      <p>
        Perjalanan saya ke web development dimulai tahun 2021 ketika bergabung dengan PT. Sumatera Kalimantan Jaya
        sebagai magang dan merilis website profil perusahaan dalam 14 hari. Tekanan deadline awal itu
        mengajarkan saya untuk membangun cepat dan beriterasi — kebiasaan yang tetap bersama saya.
      </p>
      <p>
        Setelah freelance dengan
        <span class="text-foreground font-semibold">React, Node.js, dan Express</span> selama hampir
        dua tahun — mengintegrasikan backend MongoDB, MySQL, dan PostgreSQL untuk berbagai klien — saya
        bergabung dengan <span class="text-foreground font-semibold">PT. Pegadaian</span> pada Mei 2023 sebagai
        Software Engineer, mengerjakan CSR Web App, B2B Web App, dan internal tooling.
      </p>
      <p>
        Sejak 2024 saya sangat mendalami microservices dan Micro-Frontend — merombak monolith CodeIgniter
        lama menjadi 9 microservice NestJS menggunakan Factory pattern, dan berkontribusi pada
        Micro-Frontend Architecture perusahaan yang memungkinkan beberapa tim melakukan deployment secara independen.
        Saya menjaga cakupan unit test ≥80% dengan Vitest di semua modul saya.
      </p>
      <p>
        Saya menggunakan <span class="text-foreground font-semibold">TypeScript</span> sebagai bahasa inti
        di seluruh stack. Di frontend saya menggunakan Vue 3 atau React. Di backend, NestJS dan
        Express. Saya peduli dengan kebersihan CI/CD, clean code, dan membangun sesuatu yang benar-benar
        dapat diuji.
      </p>
    </div>

    <div class="border-border border-t px-4 pb-8">
      <p class="eyebrow mt-6 mb-4">§ Catatan</p>
      <div class="space-y-4">
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">Filosofi Clean Code</p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Kode lebih sering dibaca daripada ditulis. Setiap baris harus disengaja, jelas, dan
            dapat dipelihara oleh developer berikutnya.
          </p>
        </div>
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">Performa Itu Penting</p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Pengguna mengharapkan aplikasi yang cepat dan responsif. Saya mengoptimalkan setiap lapisan —
            dari kueri database hingga rendering frontend.
          </p>
        </div>
        <div class="border-border border-l-2 pl-4">
          <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">Pendekatan User-Centric</p>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            Teknologi hanyalah alat. Yang terpenting adalah memecahkan masalah nyata bagi orang-orang nyata
            dengan cara yang membuat hidup mereka lebih mudah.
          </p>
        </div>
        <div class="border-accent/40 border-l-2 pl-4">
          <p class="text-foreground mb-2 text-xs font-semibold tracking-[0.1em] uppercase">Di Luar Kode</p>
          <ul class="text-muted space-y-1 text-sm">
            <li>Suka mendengarkan musik sambil coding</li>
            <li>Aktif di komunitas developer dan open source</li>
            <li>Saat ini menjelajahi arsitektur serverless</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- § 02 — Keahlian -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Keahlian</span>
    </div>
    <SkillsMatrix />
  </section>

  <!-- § 03 — Aktivitas GitHub -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 03 — Aktivitas GitHub</span>
    </div>
    <div class="px-4 pb-6">
      <GitHubHeatmap client:visible initialStats={initialStats} />
    </div>
  </section>

  <!-- Final CTA -->
  <section class="px-4 py-12 text-center">
    <p class="eyebrow mb-4">Kolaborasi</p>
    <h2 class="title-display" style="font-size: clamp(1.8rem, 5vw, 3rem)">
      Mari Bangun Sesuatu Bersama
    </h2>
    <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
      Saya selalu tertarik mendengar tentang proyek dan peluang baru.
    </p>
    <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href="/id/contact"
        class="bg-accent text-background hover:bg-accent-hover inline-flex h-10 items-center rounded-lg px-6 text-sm font-medium transition-colors"
      >
        Hubungi Saya
      </a>
      <a
        href="/id/projects"
        class="border-border text-foreground hover:bg-secondary inline-flex h-10 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
      >
        Lihat Proyek Saya
      </a>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 3: Create `src/pages/id/experience.astro`**

```astro
---
// src/pages/id/experience.astro
import { education, experiences, projects, skillCategories } from '@/data/experience.id'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="Pengalaman — Ricki Friadi"
  description="Riwayat kerja, proyek, pendidikan, dan keahlian Ricki Friadi — Software Engineer di PT. Pegadaian sejak Mei 2023."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Pengalaman</p>
    <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
      Karir, Proyek &amp;<br />
      <span class="title-accent text-accent">Keahlian.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Software Engineer di PT. Pegadaian sejak Mei 2023, bekerja di microservices, micro-frontend, dan internal tooling.
    </p>
  </section>

  <!-- § 01 — Pengalaman Kerja -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Pengalaman Kerja</span>
    </div>
    <div class="divide-border divide-y px-4">
      {experiences.map((exp) => (
        <details class="group py-6">
          <summary class="flex cursor-pointer list-none items-start justify-between gap-4 focus-visible:outline-none">
            <div class="flex-1">
              <div class="flex flex-wrap items-baseline gap-2">
                <span class="text-foreground font-semibold">{exp.role}</span>
                <span class="diff-tag">{exp.company}</span>
              </div>
              <p class="text-muted mt-1 text-xs">{exp.location} · {exp.period}</p>
            </div>
            <svg class="text-muted mt-1 h-4 w-4 flex-shrink-0 rotate-0 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div class="mt-4 space-y-4">
            <ul class="text-muted space-y-2 text-sm">
              {exp.bullets.map((bullet) => (
                <li class="flex gap-2">
                  <span class="text-accent mt-1 flex-shrink-0">›</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div class="flex flex-wrap gap-1.5">
              {exp.stack.map((tech) => <span class="diff-tag">{tech}</span>)}
            </div>
          </div>
        </details>
      ))}
    </div>
  </section>

  <!-- § 02 — Pengalaman Proyek -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Pengalaman Proyek</span>
    </div>
    <div class="divide-border divide-y px-4">
      {projects.map((proj) => (
        <details class="group py-6">
          <summary class="flex cursor-pointer list-none items-start justify-between gap-4 focus-visible:outline-none">
            <div class="flex-1">
              <div class="flex flex-wrap items-baseline gap-2">
                <span class="text-foreground font-semibold">{proj.title}</span>
                <span class="diff-tag">{proj.company}</span>
              </div>
              <p class="text-muted mt-1 text-xs">{proj.period}</p>
            </div>
            <svg class="text-muted mt-1 h-4 w-4 flex-shrink-0 rotate-0 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div class="mt-4 space-y-4">
            <ul class="text-muted space-y-2 text-sm">
              {proj.bullets.map((bullet) => (
                <li class="flex gap-2">
                  <span class="text-accent mt-1 flex-shrink-0">›</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div class="flex flex-wrap gap-1.5">
              {proj.stack.map((tech) => <span class="diff-tag">{tech}</span>)}
            </div>
          </div>
        </details>
      ))}
    </div>
  </section>

  <!-- § 03 — Pendidikan -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 03 — Pendidikan</span>
    </div>
    <div class="px-4 pb-8">
      <div class="flex flex-wrap items-baseline gap-2">
        <span class="text-foreground font-semibold">{education.degree}</span>
        <span class="diff-tag">{education.institution}</span>
      </div>
      <p class="text-muted mt-1 text-xs">{education.location} · {education.period}</p>
      <p class="text-muted mt-2 text-sm">IPK: <span class="text-foreground font-semibold">{education.gpa}</span></p>
    </div>
  </section>

  <!-- § 04 — Keahlian -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 04 — Keahlian</span>
    </div>
    <div class="px-4 pb-8">
      {skillCategories.map((cat) => (
        <div class="mb-6">
          <p class="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">{cat.label}</p>
          <div class="flex flex-wrap gap-1.5">
            {cat.items.map((item) => <span class="diff-tag">{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 4: Create `src/pages/id/works.astro`**

```astro
---
// src/pages/id/works.astro
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'

const categories = ['all', ...new Set(projects.map((p) => p.category))]

const categoryLabel: Record<string, string> = {
  all: 'Semua',
  'web-app': 'Aplikasi Web',
  api: 'API',
  tool: 'Alat',
  'open-source': 'Open Source',
}
---

<MainLayout
  title="Karya — Ricki Friadi"
  description="Karya terpilih Ricki Friadi — micro-frontend Vue 3, microservice NestJS, dan internal tooling di PT. Pegadaian."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Karya Terpilih</p>
    <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
      Hal yang Pernah<br />
      <span class="title-accent text-accent">Saya Kirimkan.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Sistem produksi yang melayani ribuan pengguna di bidang keuangan, internal tooling, dan web publik.
    </p>
  </section>

  <!-- § 01 — Works grid with filter -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Proyek</span>
    </div>

    <works-filter class="block px-4 pb-10">
      <!-- Filter buttons -->
      <div class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter berdasarkan kategori">
        {categories.map((cat) => (
          <button
            type="button"
            data-filter={cat}
            data-active={cat === 'all' ? '' : undefined}
            class="works-filter-btn border-border text-muted font-mono text-xs uppercase tracking-widest rounded-full border px-3 py-1 transition-colors hover:border-accent hover:text-accent data-[active]:border-accent data-[active]:text-foreground data-[active]:bg-accent/10"
          >
            {categoryLabel[cat] ?? cat}
          </button>
        ))}
      </div>

      <!-- Cards grid -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            href={`/projects/${project.slug}`}
            data-card
            data-category={project.category}
            class="glass-card group block overflow-hidden rounded-xl p-5 no-underline transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div class:list={['mb-4 h-1 w-full rounded-full', project.featured ? 'bg-accent' : 'bg-border']} />

            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="diff-tag">{categoryLabel[project.category] ?? project.category}</span>
              <span class="diff-tag">{project.year}</span>
              {project.featured && <span class="eyebrow">Unggulan</span>}
            </div>

            <h2 class="text-foreground group-hover:text-accent text-base font-semibold leading-snug transition-colors">
              {project.title}
            </h2>
            <p class="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
              {project.shortDescription}
            </p>

            {project.keyMetric && (
              <p class="text-accent mt-3 font-mono text-xs">{project.keyMetric}</p>
            )}

            <div class="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span class="bg-secondary text-muted rounded px-1.5 py-0.5 font-mono text-[10px]">{tech}</span>
              ))}
              {project.technologies.length > 4 && (
                <span class="text-muted font-mono text-[10px]">+{project.technologies.length - 4}</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </works-filter>
  </section>
</MainLayout>

<script is:inline>
  class WorksFilter extends HTMLElement {
    connectedCallback() {
      const buttons = this.querySelectorAll('[data-filter]')
      const cards = this.querySelectorAll('[data-card]')

      buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          const filter = btn.getAttribute('data-filter')
          buttons.forEach(function(b) { b.removeAttribute('data-active') })
          btn.setAttribute('data-active', '')
          cards.forEach(function(card) {
            const cat = card.getAttribute('data-category')
            const visible = filter === 'all' || cat === filter
            card.style.display = visible ? '' : 'none'
          })
        })
      })
    }
  }

  if (!customElements.get('works-filter')) {
    customElements.define('works-filter', WorksFilter)
  }
</script>
```

- [ ] **Step 5: Create `src/pages/id/projects.astro`**

```astro
---
// src/pages/id/projects.astro
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import MainLayout from '@/components/layout/MainLayout.astro'
import { projects } from '@/data/projects'
---

<MainLayout
  title="Proyek — Ricki Friadi"
  description="Jelajahi portofolio aplikasi web dan solusi fullstack oleh Ricki Friadi — Vue 3, TypeScript, NestJS, PostgreSQL."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Portofolio</p>
    <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
      Proyek &amp; Studi<br />
      <span class="title-accent text-accent">Kasus.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Sistem nyata dan pengalaman produk yang dibangun dengan pendekatan backend-first dan berorientasi performa.
    </p>
  </section>

  <section class="px-4 py-8">
    <ProjectsGrid projects={projects} client:load />
  </section>
</MainLayout>
```

- [ ] **Step 6: Create `src/pages/id/contact.astro`**

```astro
---
// src/pages/id/contact.astro
import ContactForm from '@/components/contact/ContactForm'
import MainLayout from '@/components/layout/MainLayout.astro'
---

<MainLayout
  title="Kontak — Ricki Friadi"
  description="Hubungi Ricki Friadi — terbuka untuk peran fullstack, proyek freelance, dan kolaborasi."
  lang="id"
>
  <!-- Hero -->
  <section class="border-border border-b px-4 py-8">
    <p class="eyebrow mb-3">Kontak</p>
    <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
      Mari Bangun<br />
      <span class="title-accent text-accent">Sesuatu Bersama.</span>
    </h1>
    <p class="text-muted mt-4 text-sm leading-relaxed">
      Terbuka untuk peran fullstack, proyek freelance, dan kolaborasi yang menarik.
      Kirim pesan dan saya akan membalas dalam beberapa hari.
    </p>
  </section>

  <!-- § 01 — Formulir -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 01 — Kirim Pesan</span>
    </div>
    <div class="px-4 pb-10">
      <div class="max-w-lg">
        <ContactForm client:load />
      </div>
    </div>
  </section>

  <!-- § 02 — Cara Lain Menghubungi Saya -->
  <section class="border-border border-b">
    <div class="chapter-heading px-4">
      <span class="chapter-label">§ 02 — Saluran Lain</span>
    </div>
    <div class="divide-border divide-y px-4 pb-8 sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div class="py-4 sm:pr-6">
        <p class="text-muted font-mono text-xs uppercase tracking-widest">Email</p>
        <a href="mailto:friadi.ricki@gmail.com" class="text-foreground hover:text-accent mt-1 block text-sm transition-colors">
          friadi.ricki@gmail.com ↗
        </a>
      </div>
      <div class="py-4 sm:pl-6">
        <p class="text-muted font-mono text-xs uppercase tracking-widest">LinkedIn</p>
        <a href="https://www.linkedin.com/in/rickifriadi" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-accent mt-1 block text-sm transition-colors">
          linkedin.com/in/rickifriadi ↗
        </a>
      </div>
    </div>
  </section>
</MainLayout>
```

- [ ] **Step 7: Run type check**

```bash
npm run check
```
Expected: 0 errors

- [ ] **Step 8: Commit**

```bash
git add src/pages/id/
git commit -m "feat(i18n): add all Indonesian pages under /id/ route"
```

---

## Task 11: Final build verification

- [ ] **Step 1: Run full type check**

```bash
npm run check
```
Expected: 0 errors, 0 warnings

- [ ] **Step 2: Build the project**

```bash
npm run build
```
Expected: Successful build with no errors. Watch for any missing import errors or PDF rendering errors.

- [ ] **Step 3: Verify routes exist in build output**

```bash
ls dist/ | grep -E "resume|id"
ls dist/id/ 2>/dev/null || echo "id/ not found"
```
Expected: `dist/resume-ats.pdf`, `dist/id/` directory with `resume/index.html`, `about/index.html`, etc.

- [ ] **Step 4: Start dev server and manually verify key flows**

```bash
npm run dev
```

Check these URLs in the browser:
- `http://localhost:4321/resume` — English resume with two download buttons
- `http://localhost:4321/resume-ats.pdf` — Opens/downloads ATS PDF (Helvetica, black text)
- `http://localhost:4321/id/resume` — Indonesian resume page
- `http://localhost:4321/id/resume.pdf` — Indonesian designed PDF
- `http://localhost:4321/id/resume-ats.pdf` — Indonesian ATS PDF
- `http://localhost:4321/id` — Indonesian home page
- LangSwitcher on desktop: 🇺🇸 🇮🇩 flags visible in navbar; clicking 🇮🇩 from `/resume` navigates to `/id/resume`; clicking 🇺🇸 from `/id/resume` navigates back to `/resume`

- [ ] **Step 5: Commit build verification**

```bash
git add -A
git commit -m "chore: verify i18n + ATS PDF build (no-op if clean)" --allow-empty
```
