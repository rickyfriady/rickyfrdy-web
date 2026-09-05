import { buildSpriteMap, getSprite, type SpriteArt, spriteKey } from '@/utils/game/sprites'

/**
 * Which rendering path an asset takes, and how to render it.
 *
 * The path is derived from the directory the file sits in, never from a prop
 * threaded through a component. That is the whole mechanism: moving a file
 * between `assets/sprites/` and `assets/illustrated/` changes how it renders
 * and touches no code, and a component asks for an id without knowing or
 * caring which kind of art answers.
 */

/** Highest wins. The drawn fallback is the floor under both art paths. */
export type RenderPath = 'illustrated' | 'pixel' | 'fallback'

export interface ResolvedAsset {
  id: string
  path: RenderPath
  /** The 1x source. Absent on the fallback path. */
  url?: string
  /** `srcset` covering every density on disk. Illustrated path only. */
  srcset?: string
  width?: number
  height?: number
}

/** One illustrated asset: its sources keyed by pixel density. */
export interface IllustratedArt {
  byDensity: Record<number, string>
  width?: number
  height?: number
}

/**
 * `backdrop/case-room@2x.webp` → `{ key: 'case-room', density: 2 }`
 *
 * Density lives in the filename rather than a manifest because the filename is
 * the one place it cannot drift from the file it describes.
 */
export function parseDensity(path: string): { key: string; density: number } {
  const base = spriteKey(path)
  const match = base.match(/^(.*)@(\d+)x$/)
  if (!match) return { key: base, density: 1 }
  return { key: match[1], density: Number(match[2]) }
}

/** Group a glob result into one entry per asset, with its densities collected. */
export function buildIllustratedMap(
  modules: Record<string, unknown>
): Record<string, IllustratedArt> {
  const flat = buildSpriteMap(modules)
  const out: Record<string, IllustratedArt> = {}
  for (const path of Object.keys(modules)) {
    // `buildSpriteMap` already normalised URL and dimensions; reuse its result
    // rather than re-deriving them, so both paths read metadata identically.
    const resolved = flat[spriteKey(path)]
    if (!resolved) continue
    const { key, density } = parseDensity(path)
    out[key] ??= { byDensity: {} }
    const entry = out[key]
    entry.byDensity[density] = resolved.url
    // 1x carries the intrinsic size; a denser source is the same art, larger.
    if (density === 1) {
      entry.width = resolved.width
      entry.height = resolved.height
    }
  }
  return out
}

/**
 * `srcset` across every density present, ascending.
 *
 * A 1x display must not pay for a 3x file, and a 3x display should not be
 * handed a 1x one — letting the browser choose is both cheaper and more correct
 * than picking here, where the device is unknown.
 */
export function srcsetFor(art: IllustratedArt): string {
  return Object.keys(art.byDensity)
    .map(Number)
    .sort((a, b) => a - b)
    .map((d) => `${art.byDensity[d]} ${d}x`)
    .join(', ')
}

/** The densest source on disk — the `src` a browser without `srcset` gets. */
export function baseSource(art: IllustratedArt): string | undefined {
  const densities = Object.keys(art.byDensity)
    .map(Number)
    .sort((a, b) => a - b)
  return art.byDensity[densities[0]]
}

/**
 * Resolve one slot against both paths.
 *
 * Precedence is illustrated → pixel → drawn fallback. An illustrated file wins
 * because it is the deliberate upgrade: dropping one in is how art arrives, and
 * it should take effect without deleting the pixel sprite it supersedes.
 */
export function resolveAsset(
  id: string,
  illustrated: Record<string, IllustratedArt>,
  pixel: Record<string, SpriteArt>
): ResolvedAsset {
  const art = illustrated[id]
  if (art && Object.keys(art.byDensity).length > 0) {
    return {
      id,
      path: 'illustrated',
      url: baseSource(art),
      srcset: srcsetFor(art),
      width: art.width,
      height: art.height
    }
  }
  const sprite = pixel[id]
  if (sprite) {
    return { id, path: 'pixel', url: sprite.url, width: sprite.width, height: sprite.height }
  }
  return { id, path: 'fallback' }
}

/**
 * Illustrated art discovered from its directory.
 *
 * Empty today, exactly as the sprite map is: the drawn fallback is the floor,
 * so every scene is complete before any file lands here.
 */
const ILLUSTRATED_ART = buildIllustratedMap(
  import.meta.glob('../../assets/illustrated/**/*.{png,webp,avif,jpg,jpeg}', {
    eager: true,
    import: 'default'
  })
)

/** Asset ids that have illustrated art. Exported for coverage reporting. */
export const ILLUSTRATED_IDS: readonly string[] = Object.keys(ILLUSTRATED_ART).sort()

export function getIllustrated(id: string): IllustratedArt | undefined {
  return ILLUSTRATED_ART[id]
}

/**
 * Resolve a slot against the real directories.
 *
 * The map-taking `resolveAsset` above stays pure so it can be tested with
 * fixtures; this is the one place that binds it to what is actually on disk.
 * Every caller goes through here, which is what keeps the precedence rule in a
 * single location rather than re-derived per component.
 */
export function resolveById(id: string): ResolvedAsset {
  const art = ILLUSTRATED_ART[id]
  const sprite = getSprite(id)
  return resolveAsset(id, art ? { [id]: art } : {}, sprite.url ? { [id]: { url: sprite.url } } : {})
}
