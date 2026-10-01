export const ui = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.dashboard': 'Dashboard',
    'nav.resume': 'Resume',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',

    // Valley place names. Chrome only: these appear as chapter labels and
    // eyebrows, never as nav labels. A recruiter scanning the nav must still
    // find "Projects", not have to decode "Workshop". The `case.` prefix is a
    // leftover key name, kept so no page needs editing to rename a place.
    'case.file': 'The Valley',
    'case.projects': 'Workshop',
    'case.blog': 'Journal',
    'case.experience': 'Records Hall',
    'case.about': 'Home',
    'case.now': 'This Season',
    'case.ask': 'Wishing Well',
    'case.changelog': 'Almanac',
    'case.dashboard': 'Weather Station',
    'case.guestbook': 'Guestbook',
    'case.board': 'The Board',
    'case.arcade': 'Toy Shed',
    'case.play': 'Play',

    'board.title': 'The Board · Ricki Friadi',
    'board.description':
      'Every page of this site as a pinned card, with red threads joining the work that shares a technology.',
    'board.heading': 'The Board',
    'board.intro':
      'Every page here is a pinned card. A red thread joins any two cards that share a technology, hover one to see what it connects to.',
    'board.connected': 'connected to {n}',
    'board.dragHint': 'drag to pan · scroll to zoom · tab between cards',
    'board.lamp': 'Desk lamp: drag to move the spotlight',
    'board.surface': 'Pin board: drag to pan, arrow keys to move',
    'board.allCards': 'All cards',
    'detective.enable': 'Hand Mode',
    'detective.disable': 'Hand Mode: on',
    'detective.loading': 'Starting camera…',
    'detective.privacy':
      'Uses your camera to control the board with hand gestures. Video is processed entirely on your device, nothing is uploaded, nothing is recorded.',
    'detective.start': 'Enable camera',
    'detective.cancel': 'Not now',
    'detective.live': 'Camera on',
    'detective.denied':
      'Camera access was declined, so gesture control is off. The board works exactly the same with mouse and keyboard.',
    'detective.unavailable':
      'Gesture control could not start on this device. The board works exactly the same with mouse and keyboard.',
    'detective.hint': 'pinch to click · hold and move to pan · two hands to zoom',

    // Play mode. Short chrome only — NPC dialogue and quest text live in
    // src/data/quests.ts, next to the quest they belong to.
    'game.title': 'Play · Ricki Friadi',
    'game.description':
      'A small valley where every building, signpost and crop opens a real page, project, or role from this site.',
    'game.heading': 'Play',
    'game.intro':
      'Walk around and open what you find. Every building is a door to a real page, and nothing on this site is locked behind it.',
    'game.sceneName': 'The valley: arrow keys or WASD to walk, E to inspect',
    'game.controls': 'WASD / arrows to walk · E to inspect · Q quests · C character · Esc to close',
    'game.destinations': 'Everything in the valley',
    'game.artCredits': 'Art credits',
    'game.smallScreen': 'The valley needs a wider screen. This list reaches every place in it.',
    'game.showcase': 'Character',
    'game.journal': 'Quests',
    'game.sheet': 'Character sheet',
    'game.interact': 'Inspect',
    'game.open': 'Open the full page',
    'game.next': 'Next',
    'game.close': 'Close',
    'game.reset': 'Reset progress',
    'game.resetConfirm': 'Clear all saved game progress?',
    'game.statBasis':
      'Levels count how many projects and roles list a technology, plus the years it spans on the CV. A playful rendering of real data, not a certification.',
    'game.state.locked': 'locked',
    'game.state.available': 'available',
    'game.state.active': 'in progress',
    'game.state.complete': 'complete',
    'game.dir.up': 'Walk up',
    'game.dir.down': 'Walk down',
    'game.dir.left': 'Walk left',
    'game.dir.right': 'Walk right',
    'valley.intro': 'Every building here is a page on this site. Walk in, or pick from the list.',
    'valley.kind.project': 'Project',
    'valley.kind.post': 'Article',
    'valley.kind.experience': 'Role',
    'valley.place.home': 'Home',
    'valley.place.post': 'Post Office',
    'valley.place.workshop': 'Workshop',
    'valley.place.journal': 'Journal',
    'valley.place.records': 'Records Hall',
    'valley.place.board': 'Notice Board',
    'valley.route.blog': 'Blog',
    'valley.route.board': 'The Board',
    'valley.summary.about': 'Background, skills, and how I work.',
    'valley.summary.contact': 'Send a message, or find me elsewhere.',
    'valley.summary.projects': 'Every project, each with its case study.',
    'valley.summary.blog': 'Articles on what I have built and learned.',
    'valley.summary.experience': 'Roles, companies, and dates.',
    'valley.summary.board': 'Every page on one board, joined by shared technology.',
    'arcade.title': 'Toy Shed · Ricki Friadi',
    'arcade.description':
      'Odd experiments that did not fit the rest of the site: a WebGL warp shader, cursor-tracking eyes, and the blurhash placeholder pipeline.',
    'arcade.heading': 'Toy Shed',
    'arcade.intro':
      'Things that do not belong on the board. Each of these clashes with the pixel identity on purpose, they are kept because they work, not because they fit.',
    'arcade.shader': 'Warp shader',
    'arcade.shaderNote':
      'A WebGL warp pattern that used to sit behind the contact hero. Moved here so that page stays fast and on-theme.',
    'arcade.eyes': 'Wandering eyes',
    'arcade.eyesNote':
      'Eyes that follow the pointer. The header runs a squared-off variant; this is the original.',
    'arcade.blurhash': 'Blurhash placeholders',
    'arcade.blurhashNote':
      'Photographs decode from a tiny hash before the real file lands. Still used for real photography across the site, pixel art needs no placeholder.',
    'arcade.shaderPause': 'Pause',
    'arcade.shaderPlay': 'Play',
    'arcade.eyesHint': 'Move your cursor across this panel, the eyes track it.',
    'arcade.bhHash': 'From the hash (28 characters)',
    'arcade.bhReal': 'The real photograph',
    'arcade.bhReplay': 'Replay the transition',
    'arcade.gradient': 'Animated gradients',
    'arcade.gradientNote':
      'Six WebGL gradient presets that used to sit behind featured project cards and blog covers. Retired from those pages: they were still painted in the pre-redesign blue and green, and a smooth animated gradient is the opposite of a flat pixel surface.',

    // Filter labels
    'filter.type': 'Type',
    'filter.all': 'All',
    'filter.projects': 'Projects',
    'filter.works': 'Works',

    // Resume page
    'resume.title': 'Resume · Ricki Friadi',
    'resume.description':
      'Fullstack Developer resume · Ricki Friadi. 4+ years building production systems in Indonesian fintech.',
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
    'case.next': 'Next →',

    // Command palette
    'cmdk.placeholder': 'Search or jump to…',
    'cmdk.empty': 'No results found.',
    'cmdk.aria': 'Command palette',
    'cmdk.open': 'Open command palette',
    'cmdk.group.navigation': 'Navigation',
    'cmdk.group.actions': 'Actions',
    'cmdk.group.content': 'Content',
    'cmdk.action.ask': 'Ask my site (AI search)',
    'cmdk.action.theme': 'Toggle theme',
    'cmdk.action.lang': 'Switch language (EN ⇄ ID)',
    'cmdk.action.resume': 'Download resume (PDF)',
    'cmdk.action.copyEmail': 'Copy email address',
    'cmdk.action.copyGithub': 'Copy GitHub URL',
    'cmdk.action.copyLinkedin': 'Copy LinkedIn URL',
    'cmdk.action.play': 'Enter play mode',
    'cmdk.action.companion': 'Toggle the companion character',
    'cmdk.action.reset': 'Reset game progress',
    'cmdk.action.unavailable': 'Nothing to do here yet.',
    'cmdk.copied': 'Copied to clipboard',

    // Now page
    'now.title': 'Now · Ricki Friadi',
    'now.description':
      'What Ricki Friadi is focused on right now, work, learning, and side projects, with live GitHub and coding activity.',
    'now.eyebrow': 'Now',
    'now.heading': 'What I’m doing',
    'now.updated': 'Last updated',
    'now.focus': 'Current focus',
    'now.activity': 'Recent activity',
    'now.coding': 'Coding activity',
    'now.changelogLink': 'See what changed on this site →',

    // Changelog page
    'changelog.title': 'Changelog · Ricki Friadi',
    'changelog.description':
      'A running log of changes shipped to this site, generated from commit history.',
    'changelog.eyebrow': 'Changelog',
    'changelog.heading': 'Site changelog',
    'changelog.intro': 'Everything shipped to this site, straight from the commit history.',
    'changelog.empty': 'No entries yet.',
    'nav.now': 'Now',
    'nav.changelog': 'Changelog',

    // Ask (AI site search)
    'ask.title': 'Ask my site · Ricki Friadi',
    'ask.description':
      "Ask a question about Ricki Friadi's work and writing, answered from the site's own content.",
    'ask.eyebrow': 'Ask my site',
    'ask.heading': 'Ask about my work',
    'ask.intro':
      "Ask anything about my projects and writing. Answers come only from this site's content, with links to the source.",
    'ask.placeholder': 'e.g. What have you built with NestJS?',
    'ask.submit': 'Ask',
    'ask.loading': 'Searching the site…',
    'ask.loadingModel': 'Loading search model (first time only)…',
    'ask.empty': "I couldn't find anything about that on this site.",
    'ask.sources': 'Sources',
    'ask.answer': 'Answer',
    'ask.answering': 'Generating an answer…',
    'ask.disclaimer': 'Results are ranked from this site’s content. No external data is used.'
  },
  id: {
    // Nav
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.experience': 'Pengalaman',
    'nav.dashboard': 'Dashboard',
    'nav.resume': 'CV',
    'nav.projects': 'Proyek',
    'nav.contact': 'Kontak',

    // Nama tempat di lembah. Hanya untuk chrome (chapter label dan eyebrow),
    // tidak pernah untuk label nav.
    'case.file': 'Lembah',
    'case.projects': 'Bengkel',
    'case.blog': 'Jurnal',
    'case.experience': 'Balai Catatan',
    'case.about': 'Rumah',
    'case.now': 'Musim Ini',
    'case.ask': 'Sumur Harapan',
    'case.changelog': 'Almanak',
    'case.dashboard': 'Stasiun Cuaca',
    'case.guestbook': 'Buku Tamu',
    'case.board': 'Papan',
    'case.arcade': 'Gudang Mainan',
    'case.play': 'Main',

    'board.title': 'Papan · Ricki Friadi',
    'board.description':
      'Setiap halaman situs ini sebagai kartu yang dipin, dengan benang merah yang menghubungkan pekerjaan dengan teknologi yang sama.',
    'board.heading': 'Papan',
    'board.intro':
      'Setiap halaman di sini adalah kartu yang dipin. Benang merah menghubungkan dua kartu yang memakai teknologi sama, arahkan kursor ke satu kartu untuk melihat kaitannya.',
    'board.connected': 'terhubung ke {n}',
    'board.dragHint': 'seret untuk menggeser · scroll untuk zoom · tab antar kartu',
    'board.lamp': 'Lampu meja: seret untuk memindahkan sorotan',
    'board.surface': 'Papan pin: seret untuk menggeser, panah untuk berpindah',
    'board.allCards': 'Semua kartu',
    'detective.enable': 'Mode Tangan',
    'detective.disable': 'Mode Tangan: aktif',
    'detective.loading': 'Menyalakan kamera…',
    'detective.privacy':
      'Menggunakan kamera untuk mengendalikan papan dengan gerakan tangan. Video diproses sepenuhnya di perangkatmu, tidak diunggah, tidak direkam.',
    'detective.start': 'Aktifkan kamera',
    'detective.cancel': 'Nanti saja',
    'detective.live': 'Kamera aktif',
    'detective.denied':
      'Akses kamera ditolak, jadi kendali gerakan mati. Papan tetap berfungsi penuh dengan mouse dan keyboard.',
    'detective.unavailable':
      'Kendali gerakan tidak bisa dijalankan di perangkat ini. Papan tetap berfungsi penuh dengan mouse dan keyboard.',
    'detective.hint': 'jepit untuk klik · tahan lalu geser untuk menggeser · dua tangan untuk zoom',

    // Mode main. Hanya label pendek — dialog NPC dan teks quest ada di
    // src/data/quests.ts, bersebelahan dengan quest-nya.
    'game.title': 'Main · Ricki Friadi',
    'game.description':
      'Lembah kecil; tiap bangunan, papan petunjuk, dan tanaman membuka halaman, proyek, atau peran asli dari situs ini.',
    'game.heading': 'Main',
    'game.intro':
      'Jalan-jalan dan buka apa yang kamu temukan. Tiap bangunan adalah pintu ke halaman asli, dan tidak ada isi situs yang dikunci di baliknya.',
    'game.sceneName': 'Lembah: panah atau WASD untuk jalan, E untuk memeriksa',
    'game.controls': 'WASD / panah untuk jalan · E memeriksa · Q tugas · C karakter · Esc menutup',
    'game.destinations': 'Semua isi lembah',
    'game.artCredits': 'Kredit ilustrasi',
    'game.smallScreen':
      'Lembahnya butuh layar lebih lebar. Daftar ini menjangkau semua tempat di dalamnya.',
    'game.showcase': 'Karakter',
    'game.journal': 'Tugas',
    'game.sheet': 'Lembar karakter',
    'game.interact': 'Periksa',
    'game.open': 'Buka halaman lengkap',
    'game.next': 'Lanjut',
    'game.close': 'Tutup',
    'game.reset': 'Atur ulang progres',
    'game.resetConfirm': 'Hapus semua progres permainan yang tersimpan?',
    'game.statBasis':
      'Level menghitung berapa proyek dan peran yang memakai teknologi itu, ditambah rentang tahunnya di CV. Cara bermain-main menampilkan data asli, bukan sertifikasi.',
    'game.state.locked': 'terkunci',
    'game.state.available': 'tersedia',
    'game.state.active': 'berjalan',
    'game.state.complete': 'selesai',
    'game.dir.up': 'Jalan ke atas',
    'game.dir.down': 'Jalan ke bawah',
    'game.dir.left': 'Jalan ke kiri',
    'game.dir.right': 'Jalan ke kanan',
    'valley.intro':
      'Tiap bangunan di sini adalah halaman di situs ini. Masuk, atau pilih dari daftar.',
    'valley.kind.project': 'Proyek',
    'valley.kind.post': 'Artikel',
    'valley.kind.experience': 'Peran',
    'valley.place.home': 'Rumah',
    'valley.place.post': 'Kantor Pos',
    'valley.place.workshop': 'Bengkel',
    'valley.place.journal': 'Jurnal',
    'valley.place.records': 'Balai Catatan',
    'valley.place.board': 'Papan Pengumuman',
    'valley.route.blog': 'Blog',
    'valley.route.board': 'Papan',
    'valley.summary.about': 'Latar belakang, keahlian, dan cara saya bekerja.',
    'valley.summary.contact': 'Kirim pesan, atau temukan saya di tempat lain.',
    'valley.summary.projects': 'Semua proyek, masing-masing dengan studi kasusnya.',
    'valley.summary.blog': 'Artikel tentang apa yang saya bangun dan pelajari.',
    'valley.summary.experience': 'Peran, perusahaan, dan tanggal.',
    'valley.summary.board': 'Semua halaman dalam satu papan, dihubungkan oleh teknologi yang sama.',
    'arcade.title': 'Gudang Mainan · Ricki Friadi',
    'arcade.description':
      'Eksperimen aneh yang tidak cocok di bagian lain situs: shader warp WebGL, mata pengikut kursor, dan pipeline placeholder blurhash.',
    'arcade.heading': 'Gudang Mainan',
    'arcade.intro':
      'Hal-hal yang tidak cocok di papan. Semuanya sengaja bertabrakan dengan identitas pixel, disimpan karena berfungsi, bukan karena cocok.',
    'arcade.shader': 'Shader warp',
    'arcade.shaderNote':
      'Pola warp WebGL yang dulu ada di balik hero halaman kontak. Dipindah ke sini supaya halaman itu tetap cepat dan sesuai tema.',
    'arcade.eyes': 'Mata pengembara',
    'arcade.eyesNote':
      'Mata yang mengikuti kursor. Header memakai varian bersudut tegas; ini versi aslinya.',
    'arcade.blurhash': 'Placeholder blurhash',
    'arcade.blurhashNote':
      'Foto didekode dari hash kecil sebelum file aslinya sampai. Masih dipakai untuk foto asli di seluruh situs, pixel art tidak butuh placeholder.',
    'arcade.shaderPause': 'Jeda',
    'arcade.shaderPlay': 'Putar',
    'arcade.eyesHint': 'Gerakkan kursor di panel ini: matanya mengikuti.',
    'arcade.bhHash': 'Dari hash (28 karakter)',
    'arcade.bhReal': 'Foto aslinya',
    'arcade.bhReplay': 'Putar ulang transisinya',
    'arcade.gradient': 'Gradien animasi',
    'arcade.gradientNote':
      'Enam preset gradien WebGL yang dulu ada di balik kartu proyek unggulan dan sampul blog. Ditarik dari halaman-halaman itu: warnanya masih biru dan hijau sebelum redesign, dan gradien animasi yang halus itu kebalikan dari permukaan pixel yang datar.',

    // Filter labels
    'filter.type': 'Tipe',
    'filter.all': 'Semua',
    'filter.projects': 'Proyek',
    'filter.works': 'Karya',

    // Resume page
    'resume.title': 'CV · Ricki Friadi',
    'resume.description':
      'CV Fullstack Developer · Ricki Friadi. 4+ tahun membangun sistem produksi di fintech Indonesia.',
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
    'case.next': 'Berikutnya →',

    // Command palette
    'cmdk.placeholder': 'Cari atau lompat ke…',
    'cmdk.empty': 'Tidak ada hasil.',
    'cmdk.aria': 'Palet perintah',
    'cmdk.open': 'Buka palet perintah',
    'cmdk.group.navigation': 'Navigasi',
    'cmdk.group.actions': 'Aksi',
    'cmdk.group.content': 'Konten',
    'cmdk.action.ask': 'Tanya situs ini (pencarian AI)',
    'cmdk.action.theme': 'Ganti tema',
    'cmdk.action.lang': 'Ganti bahasa (EN ⇄ ID)',
    'cmdk.action.resume': 'Unduh CV (PDF)',
    'cmdk.action.copyEmail': 'Salin alamat email',
    'cmdk.action.copyGithub': 'Salin URL GitHub',
    'cmdk.action.copyLinkedin': 'Salin URL LinkedIn',
    'cmdk.action.play': 'Masuk mode main',
    'cmdk.action.companion': 'Tampilkan / sembunyikan karakter',
    'cmdk.action.reset': 'Atur ulang progres permainan',
    'cmdk.action.unavailable': 'Belum ada yang bisa dilakukan di sini.',
    'cmdk.copied': 'Disalin ke clipboard',

    // Now page
    'now.title': 'Now · Ricki Friadi',
    'now.description':
      'Apa yang sedang difokuskan Ricki Friadi saat ini, pekerjaan, pembelajaran, dan proyek sampingan, dengan aktivitas GitHub dan coding terkini.',
    'now.eyebrow': 'Now',
    'now.heading': 'Yang sedang saya kerjakan',
    'now.updated': 'Terakhir diperbarui',
    'now.focus': 'Fokus saat ini',
    'now.activity': 'Aktivitas terkini',
    'now.coding': 'Aktivitas coding',
    'now.changelogLink': 'Lihat perubahan pada situs ini →',

    // Changelog page
    'changelog.title': 'Changelog · Ricki Friadi',
    'changelog.description':
      'Catatan berjalan perubahan yang dirilis ke situs ini, dihasilkan dari riwayat commit.',
    'changelog.eyebrow': 'Changelog',
    'changelog.heading': 'Changelog situs',
    'changelog.intro': 'Semua yang dirilis ke situs ini, langsung dari riwayat commit.',
    'changelog.empty': 'Belum ada entri.',
    'nav.now': 'Now',
    'nav.changelog': 'Changelog',

    // Ask (AI site search)
    'ask.title': 'Tanya situs ini · Ricki Friadi',
    'ask.description':
      'Tanyakan tentang pekerjaan dan tulisan Ricki Friadi, dijawab dari konten situs ini sendiri.',
    'ask.eyebrow': 'Tanya situs ini',
    'ask.heading': 'Tanya tentang pekerjaan saya',
    'ask.intro':
      'Tanyakan apa saja tentang proyek dan tulisan saya. Jawaban hanya berasal dari konten situs ini, dengan tautan ke sumbernya.',
    'ask.placeholder': 'mis. Apa yang pernah kamu bangun dengan NestJS?',
    'ask.submit': 'Tanya',
    'ask.loading': 'Mencari di situs…',
    'ask.loadingModel': 'Memuat model pencarian (hanya pertama kali)…',
    'ask.empty': 'Saya tidak menemukan apa pun tentang itu di situs ini.',
    'ask.sources': 'Sumber',
    'ask.answer': 'Jawaban',
    'ask.answering': 'Membuat jawaban…',
    'ask.disclaimer':
      'Hasil diperingkat dari konten situs ini. Tidak ada data eksternal yang digunakan.'
  }
} as const

export type Lang = keyof typeof ui
export type UIKey = keyof (typeof ui)['en']

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key]
}
