import { describe, expect, it, vi } from 'vitest'

// Every sheet missing: the world has to stay drawable from flat colours alone.
vi.mock('@/utils/game/sprites', () => ({ getSprite: (id: string) => ({ id, url: undefined }) }))

describe('tiles with no sheet art', () => {
  it('a prop falls back to a flat token colour by what it does', async () => {
    const { framesStyle, hasSheet } = await import('@/components/game/TileArt')
    expect(hasSheet('props')).toBe(false)
    const style = framesStyle([{ sheet: 'props', index: 0 }], 32, 'solid')
    expect(style.background).toBe('var(--color-border)')
  })
})
