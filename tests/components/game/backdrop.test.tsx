import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function render(Backdrop: (p: never) => React.ReactNode, rows: number) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const hills = createRef<HTMLDivElement>()
  const trees = createRef<HTMLDivElement>()
  act(() => {
    root.render(
      // biome-ignore lint/suspicious/noExplicitAny: the component's props are the subject, not the type
      (Backdrop as any)({
        rows,
        width: 40,
        tilePx: 32,
        scale: 2,
        season: 'summer',
        hillsRef: hills,
        treesRef: trees
      })
    )
  })
  return { container, hills, trees }
}

describe('backdrop with no art', () => {
  it('falls back to flat token bands, and the sky is still drawn', async () => {
    vi.resetModules()
    vi.doMock('@/utils/game/sprites', () => ({
      getSprite: (id: string) => ({ id, url: undefined })
    }))
    const { default: Backdrop } = await import('@/components/game/Backdrop')
    const { container } = render(Backdrop as never, 3)
    const sky = container.querySelector('.valley-sky') as HTMLElement
    expect(sky).not.toBeNull()
    expect(sky.getAttribute('aria-hidden')).toBe('true')
    const bands = [...sky.querySelectorAll<HTMLElement>('div')]
    expect(bands).toHaveLength(2)
    for (const band of bands) {
      expect(band.style.background).toContain('color-mix')
      expect(band.style.backgroundImage).toBe('')
    }
    vi.doUnmock('@/utils/game/sprites')
  })

  it('renders nothing in a room with no horizon', async () => {
    const { default: Backdrop } = await import('@/components/game/Backdrop')
    const { container } = render(Backdrop as never, 0)
    expect(container.querySelector('.valley-sky')).toBeNull()
  })
})
