import type { LocalizedText } from '@/models'

/**
 * What the companion says on each route.
 *
 * Decorative by contract: every line is `aria-hidden`, and nothing here is the
 * only place a fact appears. Routes with no entry get the idle pose and no
 * bubble — silence is the correct default, not a placeholder line.
 *
 * Keyed by path without the `/id` prefix, so one map serves both locales.
 */
export const companionReactions: Record<string, LocalizedText> = {
  '/': { en: 'Welcome to the valley.', id: 'Selamat datang di lembah.' },
  '/projects': { en: 'Fresh from the workshop.', id: 'Langsung dari bengkel.' },
  '/blog': { en: 'Pages from the journal.', id: 'Halaman dari jurnal.' },
  '/about': { en: 'Home, and who lives here.', id: 'Rumah, dan penghuninya.' },
  '/experience': { en: 'The records hall.', id: 'Balai catatan.' },
  '/resume': { en: 'One page, printed.', id: 'Satu halaman, tercetak.' },
  '/contact': { en: 'The post office is open.', id: 'Kantor pos buka.' },
  '/board': { en: 'Mind the threads.', id: 'Awas benangnya.' },
  '/arcade': { en: 'Toys that clash.', id: 'Mainan yang bertabrakan.' },
  '/play': { en: "You're in the valley now.", id: 'Sekarang kamu di lembah.' },
  '/now': { en: 'This season.', id: 'Musim ini.' },
  '/changelog': { en: 'Every edit, logged.', id: 'Tiap perubahan, tercatat.' },
  '/dashboard': { en: 'The weather station.', id: 'Stasiun cuaca.' },
  '/ask': { en: 'Ask the well.', id: 'Tanya sumurnya.' }
}
