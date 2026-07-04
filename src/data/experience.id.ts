import type { Education, ExperienceProject, SkillCategory, WorkExperience } from '@/models'

export const summary =
  'Fullstack developer dengan 4+ tahun pengalaman membangun sistem produksi di fintech Indonesia. Di PT. Pegadaian, saya membangun platform micro-frontend dan backend microservice NestJS yang mendukung platform pengajuan pinjaman dengan konversi 80% memfasilitasi Rp 3 miliar+ dalam originasi pinjaman, serta super-app karyawan yang melayani 1,5 juta pengguna aktif.'

export const experiences = [
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
      'Mengembangkan aplikasi web responsif untuk klien UKM menggunakan React.js, Node.js, dan PostgreSQL, membantu klien membangun kehadiran digital dan mengotomatiskan proses yang berhadapan dengan pelanggan.',
      'Mengintegrasikan API pihak ketiga dan database relasional/dokumen (MongoDB, MySQL, PostgreSQL), menggantikan alur kerja manual dan memungkinkan peningkatan efisiensi operasional yang terukur.'
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
      'Mengembangkan website profil perusahaan dalam 14 hari menggunakan CodeIgniter, membangun kehadiran digital perusahaan lebih cepat dari jadwal.',
      'Mengimplementasikan aplikasi MPOS untuk manajemen penjualan dan inventaris secara real-time bersama tim 3 orang, menghilangkan pelacakan stok manual dan memungkinkan pelaporan keuangan harian yang akurat.'
    ],
    stack: ['PHP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Codeigniter', 'Bootstrap']
  }
] satisfies WorkExperience[]

export const projects = [
  {
    title: 'Singel APP (Pegadaian Kita)',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Sekarang',
    bullets: [
      'Membangun komponen micro-frontend modular dengan Module Federation yang melayani 1,5 juta pengguna aktif; mencapai cakupan unit test ≥80% dengan Vitest, memungkinkan continuous delivery dalam skala besar.',
      'Mengadvokasi clean code dan pengembangan berbasis komponen, mengurangi gesekan integrasi lintas tim dalam lingkungan deployment paralel multi-tim.'
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
    period: 'Jan 2024 – Sekarang',
    bullets: [
      'Merancang arsitektur Factory-pattern untuk mendukung jenis pinjaman baru tanpa perubahan kode, memungkinkan volume originasi Rp 3 miliar+ dengan konversi lead-to-approval 80%.',
      'Merancang 9 microservice backend dengan kontrak yang jelas dan dokumentasi komprehensif, memungkinkan transfer pengetahuan ke engineer berikutnya.'
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
    title: 'Aplikasi KAMILA',
    company: 'PT. Pegadaian',
    period: 'Mei 2023 – Sekarang',
    bullets: [
      'Membangun modul pelacakan KPI dan pelaporan kinerja pemasaran, memberikan visibilitas berbasis data kepada manajemen atas kinerja tim lapangan.',
      'Mengembangkan integrasi pengajuan lead pinjaman dengan mitra bisnis eksternal, memperluas saluran originasi Pegadaian melampaui akuisisi pelanggan langsung.'
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
    title: 'Sistem Rekonsiliasi (AIRA)',
    company: 'PT. Pegadaian',
    period: 'Jan 2024 – Sekarang',
    bullets: [
      'Memperluas cakupan rekonsiliasi bank ke bank mitra tambahan, memastikan akurasi transaksi keuangan dan kepatuhan terhadap standar akuntansi core banking Pegadaian.'
    ],
    stack: ['PHP 5', 'PHP Native', 'SFTP', 'VM'],
    companyLogo: 'pegadaian'
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
] satisfies ExperienceProject[]

export const education: Education = {
  institution: 'Universitas Riau',
  degree: 'Sarjana Teknik Informatika',
  location: 'Pekanbaru, Indonesia',
  period: 'Sep 2016 – Okt 2020',
  gpa: '3,69 / 4,00'
}

export const skillCategories = [
  {
    label: 'Framework',
    icon: 'code-2',
    items: ['Vue.js', 'React.js', 'Node.js', 'NestJS', 'Express.js']
  },
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
] satisfies SkillCategory[]
