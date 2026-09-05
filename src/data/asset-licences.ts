import type { AssetLicence } from '@/models'

/**
 * Every illustrated asset, and where it came from.
 *
 * The list is empty because no illustrated art has been drawn or licensed yet.
 * That is the useful state to be in: the guard tests read this manifest against
 * the contents of `src/assets/illustrated/`, so the first file dropped in there
 * without an entry fails by name, before it can reach a page. Writing the rule
 * while the directory is empty is what makes it cheap to obey later.
 */
const KENNEY = {
  author: 'Kenney',
  source: 'Kenney — Mini Characters 1.0 (kenney.nl)',
  licence: 'CC0-1.0',
  // CC0 waives the attribution requirement; the pack asks for credit as a
  // favour rather than a condition. Recorded as required anyway, because the
  // cost of naming the person who gave the art away is nothing.
  attribution: 'Character art by Kenney (kenney.nl) — CC0'
} as const

export const assetLicences: AssetLicence[] = [
  { file: 'character/npc-laura.png', ...KENNEY },
  { file: 'character/npc-rivaldy.png', ...KENNEY },
  { file: 'character/hero.png', ...KENNEY },
  { file: 'character/investigator-portrait.png', ...KENNEY }
]

/**
 * Default transferred-size ceiling per illustrated asset.
 *
 * 400 KB is roughly a full-bleed backdrop at 2x on a slow connection before it
 * starts to feel like a wait. An asset that genuinely earns more declares its
 * own `maxBytes` rather than raising the ceiling for everything.
 */
export const DEFAULT_MAX_BYTES = 400_000

/** Third-party entries that a licence obliges us to credit on the site. */
export function attributions(entries: AssetLicence[] = assetLicences) {
  return entries.filter((e) => e.author !== 'owner')
}
