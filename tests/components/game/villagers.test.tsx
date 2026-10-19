import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PlayScene from '@/components/game/PlayScene'
import type { SceneRoom, SceneVillager } from '@/utils/game/scene'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const room: SceneRoom = {
  id: 'valley',
  name: 'Valley',
  grid: Array.from({ length: 6 }, () => ',,,,,,,,,,,,'),
  spawn: { x: 1, y: 4 },
  objects: [],
  doors: []
}

const villagers: SceneVillager[] = [
  {
    id: 'farmer-1',
    sheet: 'villager-farmer-wheat',
    room: 'valley',
    spots: [
      { x: 3, y: 2 },
      { x: 6, y: 2 }
    ],
    remarks: ['Good soil this year.']
  },
  {
    id: 'elsewhere',
    sheet: 'villager-child-peach',
    room: 'workshop',
    spots: [{ x: 1, y: 1 }],
    remarks: ['Hi.']
  }
]

function mount({ reduced }: { reduced: boolean }) {
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
        villagers={villagers}
        quests={[]}
        player={{ name: 'Ricki', role: 'Engineer', stats: [] }}
        labels={{}}
        weather="settled"
      />
    )
  })
  return { container, unmount: () => act(() => root.unmount()) }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const villagerTimers = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter((c) => c[1] === 500)

describe('villagers in the scene', () => {
  it('shows only the villagers of the current room', () => {
    const { container, unmount } = mount({ reduced: false })
    expect(container.querySelectorAll('.villager')).toHaveLength(1)
    unmount()
  })

  it('is decorative: hidden from assistive technology, with no interactive control', () => {
    const { container, unmount } = mount({ reduced: false })
    const figure = container.querySelector('.villager') as HTMLElement
    expect(figure.getAttribute('aria-hidden')).toBe('true')
    expect(figure.querySelector('button, a, [tabindex]')).toBeNull()
    unmount()
  })

  it('never offers the talk prompt a real person gets', () => {
    const { container, unmount } = mount({ reduced: false })
    expect(container.querySelector('.scene-label')).toBeNull()
    expect(container.querySelector('.villager .scene-label')).toBeNull()
    unmount()
  })

  it('starts a half-second timer, and clears it on unmount', () => {
    const set = vi.spyOn(window, 'setInterval')
    const clear = vi.spyOn(window, 'clearInterval')
    const { unmount } = mount({ reduced: false })
    expect(villagerTimers(set)).toHaveLength(1)
    const id = set.mock.results[set.mock.calls.findIndex((c) => c[1] === 500)].value
    unmount()
    expect(clear).toHaveBeenCalledWith(id)
  })

  it('starts no timer under reduced motion, and stands at its first spot', () => {
    const set = vi.spyOn(window, 'setInterval')
    const { container, unmount } = mount({ reduced: true })
    expect(villagerTimers(set)).toHaveLength(0)
    const figure = container.querySelector('.villager') as HTMLElement
    expect(figure.dataset.x).toBe('3')
    expect(figure.dataset.y).toBe('2')
    expect(container.querySelector('.villager-walk')).toBeNull()
    unmount()
  })
})
