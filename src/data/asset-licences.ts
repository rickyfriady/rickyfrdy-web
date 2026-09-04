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
export const assetLicences: AssetLicence[] = []

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
