import { describe, expect, it } from 'vitest'
import {
  baseSource,
  buildIllustratedMap,
  type IllustratedArt,
  parseDensity,
  resolveAsset,
  srcsetFor
} from '@/utils/game/assets'

/** A glob result shaped like Astro's image metadata. */
const meta = (src: string, width?: number, height?: number) => ({ src, width, height })

describe('parseDensity', () => {
  it('reads a plain filename as 1x', () => {
    expect(parseDensity('../assets/illustrated/backdrop/case-room.webp')).toEqual({
      key: 'case-room',
      density: 1
    })
  })

  it('reads an @Nx suffix as that density', () => {
    expect(parseDensity('a/case-room@2x.webp')).toEqual({ key: 'case-room', density: 2 })
    expect(parseDensity('a/case-room@3x.webp')).toEqual({ key: 'case-room', density: 3 })
  })

  it('does not mistake an @ elsewhere in the name for a density', () => {
    expect(parseDensity('a/who@home.webp')).toEqual({ key: 'who@home', density: 1 })
  })
})

describe('buildIllustratedMap', () => {
  it('groups every density of one asset under a single key', () => {
    const map = buildIllustratedMap({
      'x/case-room.webp': meta('/c1.webp', 640, 384),
      'x/case-room@2x.webp': meta('/c2.webp'),
      'x/case-room@3x.webp': meta('/c3.webp')
    })
    expect(Object.keys(map)).toEqual(['case-room'])
    expect(map['case-room'].byDensity).toEqual({ 1: '/c1.webp', 2: '/c2.webp', 3: '/c3.webp' })
  })

  it('takes intrinsic dimensions from the 1x source', () => {
    const map = buildIllustratedMap({
      'x/hero.webp': meta('/h1.webp', 320, 200),
      'x/hero@2x.webp': meta('/h2.webp', 640, 400)
    })
    expect(map.hero.width).toBe(320)
    expect(map.hero.height).toBe(200)
  })

  it('keeps separate assets separate', () => {
    const map = buildIllustratedMap({
      'x/hero.webp': meta('/h.webp'),
      'y/room.webp': meta('/r.webp')
    })
    expect(Object.keys(map).sort()).toEqual(['hero', 'room'])
  })

  it('ignores a module shape it does not understand rather than breaking the build', () => {
    const map = buildIllustratedMap({ 'x/weird.webp': 42 })
    expect(map).toEqual({})
  })

  it('is empty for an empty directory', () => {
    expect(buildIllustratedMap({})).toEqual({})
  })
})

describe('srcsetFor', () => {
  it('lists every density ascending', () => {
    const art: IllustratedArt = { byDensity: { 3: '/c3.webp', 1: '/c1.webp', 2: '/c2.webp' } }
    expect(srcsetFor(art)).toBe('/c1.webp 1x, /c2.webp 2x, /c3.webp 3x')
  })

  it('handles a lone density', () => {
    expect(srcsetFor({ byDensity: { 1: '/only.webp' } })).toBe('/only.webp 1x')
  })

  it('offers the least dense source as the plain src', () => {
    expect(baseSource({ byDensity: { 2: '/c2.webp', 1: '/c1.webp' } })).toBe('/c1.webp')
  })
})

describe('resolveAsset precedence', () => {
  const illustrated = { hero: { byDensity: { 1: '/i1.webp', 2: '/i2.webp' } } }
  const pixel = { hero: { url: '/p.png' }, npc: { url: '/npc.png' } }

  it('prefers illustrated art over a pixel sprite of the same id', () => {
    const a = resolveAsset('hero', illustrated, pixel)
    expect(a.path).toBe('illustrated')
    expect(a.url).toBe('/i1.webp')
    expect(a.srcset).toBe('/i1.webp 1x, /i2.webp 2x')
  })

  it('falls to the pixel path when only a sprite exists', () => {
    const a = resolveAsset('npc', illustrated, pixel)
    expect(a.path).toBe('pixel')
    expect(a.url).toBe('/npc.png')
    // The pixel path is not a resolution set: it scales by integer factor.
    expect(a.srcset).toBeUndefined()
  })

  it('falls to the drawn floor when neither path has art', () => {
    expect(resolveAsset('nothing', illustrated, pixel)).toEqual({ id: 'nothing', path: 'fallback' })
  })

  it('treats an illustrated entry with no densities as absent', () => {
    const a = resolveAsset('hero', { hero: { byDensity: {} } }, pixel)
    expect(a.path).toBe('pixel')
  })

  it('reaches the drawn floor when both maps are empty', () => {
    expect(resolveAsset('hero', {}, {}).path).toBe('fallback')
  })
})
