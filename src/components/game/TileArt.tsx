import type { CSSProperties } from 'react'
import { getSprite } from '@/utils/game/sprites'
import { type Cell, type Frame, SHEETS, type SheetId } from '@/utils/game/tiles'

/**
 * Sheet URLs, resolved once. A sheet that is missing from disk resolves to
 * `undefined`, and every tile that needed it falls back to a flat token colour:
 * the world stays complete and walkable with the tile directory empty.
 */
const SHEET_URL: Record<SheetId, string | undefined> = {
  town: getSprite('town').url,
  farm: getSprite('farm').url,
  water: getSprite('water').url
}

/**
 * Flat stand-ins when a sheet has no art, drawn from theme tokens and chosen
 * by what the tile does, so a wall still reads as a wall with no art at all.
 */
const FALLBACK: Record<Cell['kind'], string> = {
  walk: 'var(--color-secondary)',
  solid: 'var(--color-border)',
  water: 'color-mix(in oklch, var(--color-accent) 35%, var(--color-secondary))',
  door: 'var(--color-thread)'
}

export const hasSheet = (sheet: SheetId) => Boolean(SHEET_URL[sheet])

/**
 * Background declarations for a stack of frames, bottom first.
 *
 * One element per tile, many backgrounds: grass under a fence is the same span
 * as the fence, not a second node, so the DOM stays at one node per tile.
 */
export function framesStyle(
  frames: readonly Frame[],
  tilePx: number,
  kind?: Cell['kind']
): CSSProperties {
  const drawable = frames.filter((f) => SHEET_URL[f.sheet])
  if (drawable.length === 0) return kind ? { background: FALLBACK[kind] } : {}
  // CSS paints the first background on top, so the stack is reversed.
  const top = [...drawable].reverse()
  return {
    backgroundImage: top.map((f) => `url(${SHEET_URL[f.sheet]})`).join(','),
    backgroundPosition: top
      .map((f) => {
        const { cols } = SHEETS[f.sheet]
        return `${-(f.index % cols) * tilePx}px ${-Math.floor(f.index / cols) * tilePx}px`
      })
      .join(','),
    backgroundSize: top
      .map((f) => `${SHEETS[f.sheet].cols * tilePx}px ${SHEETS[f.sheet].rows * tilePx}px`)
      .join(','),
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated'
  }
}

/** `tile:farm:76` → the frame it names, or null for an ordinary sprite id. */
export function parseTileSprite(id: string): Frame | null {
  const match = id.match(/^tile:(town|farm|water):(\d+)$/)
  return match ? { sheet: match[1] as SheetId, index: Number(match[2]) } : null
}
