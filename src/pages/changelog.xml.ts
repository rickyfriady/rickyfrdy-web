import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { CHANGELOG_TYPES, readChangelogEntries } from '@/utils/changelog'

const LABELS = new Map(CHANGELOG_TYPES.map((t) => [t.type, t.label]))

export async function GET(context: APIContext) {
  const entries = readChangelogEntries()

  return rss({
    title: 'Ricki Friadi — Changelog',
    description: 'Changes shipped to rickyfrdy.my.id, generated from commit history.',
    site: context.site ?? 'https://rickyfrdy.my.id',
    items: entries.map((entry) => ({
      title: `${LABELS.get(entry.type) ?? entry.type}${entry.scope ? ` (${entry.scope})` : ''}: ${entry.subject}`,
      pubDate: new Date(entry.date),
      description: entry.subject,
      link: `/changelog/#${entry.hash}`
    }))
  })
}
