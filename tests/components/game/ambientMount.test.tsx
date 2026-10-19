import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PlayScene from '@/components/game/PlayScene'
import type { SceneRoom } from '@/utils/game/scene'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const outdoors: SceneRoom = {
  id: 'valley',
  name: 'Valley',
  grid: ['^^^^^^^^^^^^', ...Array.from({ length: 6 }, () => ',,,,,,,,,,,,')],
  spawn: { x: 1, y: 4 },
  objects: [],
  doors: []
}
const indoors: SceneRoom = { ...outdoors, grid: Array.from({ length: 7 }, () => '............') }

function mount(room: SceneRoom, { reduced = false, wide = true } = {}) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduced-motion') ? reduced : wide,
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

describe('where the ambient layer exists', () => {
  it('outdoors, when motion is welcome', () => {
    const { container, unmount } = mount(outdoors)
    expect(container.querySelectorAll('.ambient')).toHaveLength(1)
    unmount()
  })

  it('not under reduced motion: no layer, so no leaf, creature or light to stop', () => {
    const { container, unmount } = mount(outdoors, { reduced: true })
    expect(container.querySelectorAll('.ambient')).toHaveLength(0)
    expect(
      container.querySelectorAll('.ambient-leaf, .ambient-butterfly, .ambient-bird, .ambient-shaft')
    ).toHaveLength(0)
    unmount()
  })

  it('not below md, where the scene itself does not mount', () => {
    const { container, unmount } = mount(outdoors, { wide: false })
    expect(container.querySelectorAll('.ambient')).toHaveLength(0)
    unmount()
  })

  it('not indoors', () => {
    const { container, unmount } = mount(indoors)
    expect(container.querySelectorAll('.ambient')).toHaveLength(0)
    unmount()
  })
})
