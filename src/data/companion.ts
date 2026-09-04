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
  '/': { en: 'Case file open.', id: 'Berkas kasus terbuka.' },
  '/projects': { en: 'Five files on this shelf.', id: 'Lima berkas di rak ini.' },
  '/blog': { en: 'Notes from the desk.', id: 'Catatan dari meja.' },
  '/about': { en: 'The subject himself.', id: 'Subjeknya sendiri.' },
  '/experience': { en: 'The record.', id: 'Rekaman kerja.' },
  '/resume': { en: 'One page, printed.', id: 'Satu halaman, tercetak.' },
  '/contact': { en: 'Leave a message.', id: 'Tinggalkan pesan.' },
  '/board': { en: 'Mind the threads.', id: 'Awas benangnya.' },
  '/arcade': { en: 'Evidence that clashes.', id: 'Bukti yang bertabrakan.' },
  '/play': { en: "You're inside now.", id: 'Sekarang kamu di dalam.' },
  '/now': { en: 'Active case.', id: 'Kasus berjalan.' },
  '/changelog': { en: 'Every edit, logged.', id: 'Tiap perubahan, tercatat.' },
  '/dashboard': { en: 'Surveillance feed.', id: 'Umpan pengawasan.' },
  '/ask': { en: 'Ask the file.', id: 'Tanya berkasnya.' }
}
