import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Ambient from '@/components/game/Ambient'
import type { Season } from '@/utils/game/time'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function mount(opts: { season?: Season; night?: boolean } = {}) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <Ambient
        season={opts.season ?? 'summer'}
        night={opts.night ?? false}
        scale={2}
        viewW={240}
        viewH={160}
      />
    )
  })
  return { container, unmount: () => act(() => root.unmount()) }
}

const count = (c: HTMLElement, cls: string) => c.querySelectorAll(`.${cls}`).length

afterEach(() => vi.unstubAllGlobals())

describe('ambient layer', () => {
  it('caps what exists: six leaves, two butterflies, one bird, one shaft', () => {
    const { container, unmount } = mount()
    expect(count(container, 'ambient-leaf')).toBe(6)
    expect(count(container, 'ambient-butterfly')).toBe(2)
    expect(count(container, 'ambient-bird')).toBe(1)
    expect(count(container, 'ambient-shaft')).toBe(1)
    // Creatures never pass three in all.
    expect(
      count(container, 'ambient-butterfly') + count(container, 'ambient-bird')
    ).toBeLessThanOrEqual(3)
    unmount()
  })

  it('has no light and no creatures at night, only the wind', () => {
    const { container, unmount } = mount({ night: true })
    expect(count(container, 'ambient-shaft')).toBe(0)
    expect(count(container, 'ambient-butterfly')).toBe(0)
    expect(count(container, 'ambient-bird')).toBe(0)
    expect(count(container, 'ambient-leaf')).toBe(6)
    unmount()
  })

  it('has no butterflies in winter', () => {
    const { container, unmount } = mount({ season: 'winter' })
    expect(count(container, 'ambient-butterfly')).toBe(0)
    unmount()
  })

  it('leaves take the season’s foliage colour', () => {
    const colour = (season: Season) => {
      const { container, unmount } = mount({ season })
      const value = (
        container.querySelector('.ambient-leaf') as HTMLElement
      ).style.getPropertyValue('--leaf')
      unmount()
      return value
    }
    const colours = (['spring', 'summer', 'autumn', 'winter'] as const).map(colour)
    expect(new Set(colours).size).toBe(4)
  })

  it('is decorative: hidden from assistive technology and not focusable', () => {
    const { container, unmount } = mount()
    const root = container.querySelector('.ambient') as HTMLElement
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.querySelector('button, a, [tabindex]')).toBeNull()
    unmount()
  })

  it('adds no frame loop of its own', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const { unmount } = mount()
    expect(raf).not.toHaveBeenCalled()
    unmount()
  })
})

describe('ambient pausing', () => {
  it('pauses when the tab is hidden and resumes when it returns', () => {
    const { container, unmount } = mount()
    const root = container.querySelector('.ambient') as HTMLElement
    expect(root.dataset.paused).toBe('0')
    const setVisibility = (state: 'hidden' | 'visible') => {
      Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'))
      })
    }
    setVisibility('hidden')
    expect(root.dataset.paused).toBe('1')
    setVisibility('visible')
    expect(root.dataset.paused).toBe('0')
    unmount()
  })

  it('pauses when the scene scrolls out of view', () => {
    let notify: (entries: { isIntersecting: boolean }[]) => void = () => {}
    class FakeObserver {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        notify = cb
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    const { container, unmount } = mount()
    const root = container.querySelector('.ambient') as HTMLElement
    act(() => notify([{ isIntersecting: false }]))
    expect(root.dataset.paused).toBe('1')
    act(() => notify([{ isIntersecting: true }]))
    expect(root.dataset.paused).toBe('0')
    unmount()
  })
})

describe('ambient styles', () => {
  const css = readFileSync(resolve(__dirname, '../../../src/styles/global.css'), 'utf8')
  const block = css.slice(css.indexOf('Ambient: wind, light'), css.indexOf('@utility game-hud'))

  it('uses only stepped timing, never an easing curve', () => {
    expect(block).not.toMatch(/cubic-bezier|ease/)
    const animations = [...block.matchAll(/animation:([^;]+);/g)].map((m) => m[1])
    expect(animations.length).toBeGreaterThan(0)
    for (const a of animations) expect(a, a).toMatch(/steps\(/)
  })

  it('keeps the light at or under 0.16', () => {
    const opacities = [...block.matchAll(/opacity:\s*([\d.]+)/g)].map((m) => Number(m[1]))
    expect(opacities.length).toBeGreaterThan(0)
    expect(Math.max(...opacities)).toBeLessThanOrEqual(0.16)
  })

  it('drops out entirely under reduced motion', () => {
    expect(block).toMatch(/prefers-reduced-motion: reduce\)[\s\S]*display: none/)
  })
})
