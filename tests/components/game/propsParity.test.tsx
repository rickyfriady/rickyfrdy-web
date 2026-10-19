import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PlayScene from '@/components/game/PlayScene'
import type { SceneRoom } from '@/utils/game/scene'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const bare = [',,,,,,,,,,', ',,,,,,,,,,', ',,,,,,,,,,', ',,,,,,,,,,']
const dressed = [',,BBB,Y,,,', ',,M,h,y,,,', ',,V,P,K,,,', ',F,N,u,,,,']

const roomOf = (grid: string[]): SceneRoom => ({
  id: 'valley',
  name: 'Valley',
  grid,
  spawn: { x: 1, y: 3 },
  objects: [],
  doors: []
})

function readOut(grid: string[]) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: !query.includes('reduced-motion'),
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
        rooms={[roomOf(grid)]}
        npcs={[]}
        quests={[]}
        player={{ name: 'Ricki', role: 'Engineer', stats: [] }}
        labels={{}}
        weather="settled"
      />
    )
  })
  const text = container.textContent
  const decorative = [...container.querySelectorAll('span.block')].every((n) => !n.textContent)
  act(() => root.unmount())
  return { text, decorative }
}

afterEach(() => vi.unstubAllGlobals())

describe('props are decoration', () => {
  it('give a screen reader the same text as the undressed room', () => {
    expect(readOut(dressed).text).toBe(readOut(bare).text)
  })

  it('carry no text of their own', () => {
    expect(readOut(dressed).decorative).toBe(true)
  })
})
