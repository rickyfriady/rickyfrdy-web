import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PlayScene from '@/components/game/PlayScene'
import { swayVars } from '@/components/game/TileArt'
import type { SceneRoom } from '@/utils/game/scene'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// A meadow with one two-cell tree: crown (Y) over trunk (y).
const room: SceneRoom = {
  id: 'valley',
  name: 'Valley',
  grid: [',,,,,,,,,,', ',,,Y,,,,,,', ',,,y,,,,,,', ',,,,,,,,,,', ',,,,,,,,,,'],
  spawn: { x: 1, y: 3 },
  objects: [],
  doors: []
}

function mountScene({ reduced }: { reduced: boolean }) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduced-motion') ? reduced : true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  }))
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  act(() => {
    root.render(
      <PlayScene
        rooms={[room]}
        npcs={[]}
        quests={[]}
        player={{ name: 'Ricki', role: 'Engineer', stats: [] }}
        labels={{}}
        weather="settled"
      />
    )
  })
  return { container, unmount: () => act(() => root.unmount()) }
}

afterEach(() => vi.unstubAllGlobals())

describe('canopy sway', () => {
  it('animates the crown when motion is allowed', () => {
    const { container, unmount } = mountScene({ reduced: false })
    expect(container.querySelectorAll('.canopy-sway')).toHaveLength(1)
    unmount()
  })

  it('mounts no animated node under reduced motion', () => {
    const { container, unmount } = mountScene({ reduced: true })
    expect(container.querySelectorAll('.canopy-sway')).toHaveLength(0)
    unmount()
  })

  it('puts neighbouring trees out of phase', () => {
    const frame = { sheet: 'props' as const, index: 36 }
    const delays = [0, 1, 2, 3].map((x) => swayVars(frame, x, 0, 32)['--sway-delay' as never])
    expect(new Set(delays).size).toBeGreaterThan(1)
    expect(delays[0]).not.toBe(delays[1])
  })

  it('walks the four wind frames of the crown row', () => {
    const vars = swayVars({ sheet: 'props', index: 36 }, 0, 0, 32)
    expect(vars['--sway-from' as never]).toBe('0px')
    expect(vars['--sway-to' as never]).toBe('-128px')
  })
})
