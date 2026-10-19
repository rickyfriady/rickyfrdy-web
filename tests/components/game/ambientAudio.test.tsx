import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PlayScene from '@/components/game/PlayScene'
import { ambientEnabled, ambientVolume } from '@/stores/ambient'
import type { SceneRoom } from '@/utils/game/scene'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const engine = vi.hoisted(() => ({
  supported: true,
  unlocked: false,
  unlock: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
  setVolume: vi.fn(),
  footstep: vi.fn()
}))

vi.mock('@/utils/ambient', () => ({
  ambient: {
    get unlocked() {
      return engine.unlocked
    },
    unlock: engine.unlock,
    play: engine.play,
    stop: engine.stop,
    setVolume: engine.setVolume,
    footstep: engine.footstep
  },
  isAudioSupported: () => engine.supported
}))

const room: SceneRoom = {
  id: 'valley',
  name: 'Valley',
  grid: ['^^^^^^^^^^^^', ...Array.from({ length: 6 }, () => ',,,,,,,,,,,,')],
  spawn: { x: 1, y: 4 },
  objects: [],
  doors: []
}

function mount({ reduced = false, wide = true } = {}) {
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
        labels={{
          ambientOn: 'Ambient sound: on',
          ambientOff: 'Ambient sound: off',
          ambientVolume: 'Ambient volume'
        }}
        weather="settled"
      />
    )
  })
  return { container, unmount: () => act(() => root.unmount()) }
}

const gesture = () =>
  act(() => void window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })))
const setVisibility = (state: 'hidden' | 'visible') => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
  act(() => void document.dispatchEvent(new Event('visibilitychange')))
}

beforeEach(() => {
  localStorage.clear()
  engine.supported = true
  engine.unlocked = false
  engine.unlock.mockImplementation(() => {
    engine.unlocked = true
    return true
  })
  ambientEnabled.set(false)
  ambientVolume.set(0.5)
})
afterEach(() => {
  vi.unstubAllGlobals()
  for (const fn of [engine.unlock, engine.play, engine.stop, engine.setVolume, engine.footstep])
    fn.mockClear()
  setVisibility('visible')
})

describe('ambient audio in the scene', () => {
  it('is silent on a first visit: no unlock, no play', () => {
    const { unmount } = mount()
    expect(engine.unlock).not.toHaveBeenCalled()
    expect(engine.play).not.toHaveBeenCalled()
    unmount()
  })

  it('shows the control in its off state', () => {
    const { container, unmount } = mount()
    const button = container.querySelector('button[aria-pressed]') as HTMLButtonElement
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.textContent).toBe('Ambient sound: off')
    expect(container.querySelector('input[type="range"]')).not.toBeNull()
    unmount()
  })

  it('a saved opt-in waits for the first key press, then plays', () => {
    localStorage.setItem('ambient', 'on')
    const { unmount } = mount()
    expect(engine.play).not.toHaveBeenCalled()
    expect(engine.unlock).not.toHaveBeenCalled()
    gesture()
    expect(engine.unlock).toHaveBeenCalledTimes(1)
    expect(engine.play).toHaveBeenCalledWith(0.5)
    unmount()
  })

  it('clicking the control is itself the gesture: it unlocks and plays', () => {
    const { container, unmount } = mount()
    const button = container.querySelector('button[aria-pressed]') as HTMLButtonElement
    act(() => button.click())
    expect(engine.unlock).toHaveBeenCalled()
    expect(engine.play).toHaveBeenCalled()
    expect(ambientEnabled.get()).toBe(true)
    expect(localStorage.getItem('ambient')).toBe('on')
    unmount()
  })

  it('turning it off fades it out and persists the choice', () => {
    const { container, unmount } = mount()
    const button = container.querySelector('button[aria-pressed]') as HTMLButtonElement
    act(() => button.click())
    engine.stop.mockClear()
    act(() => button.click())
    expect(engine.stop).toHaveBeenCalled()
    expect(localStorage.getItem('ambient')).toBe('off')
    unmount()
  })

  it('pauses when the tab is hidden and resumes when it returns', () => {
    localStorage.setItem('ambient', 'on')
    const { unmount } = mount()
    gesture()
    expect(engine.play).toHaveBeenCalledTimes(1)
    engine.stop.mockClear()
    setVisibility('hidden')
    expect(engine.stop).toHaveBeenCalled()
    setVisibility('visible')
    expect(engine.play).toHaveBeenCalledTimes(2)
    unmount()
  })

  it('fades out and stops when the scene leaves the page', () => {
    localStorage.setItem('ambient', 'on')
    const { unmount } = mount()
    gesture()
    engine.stop.mockClear()
    unmount()
    expect(engine.stop).toHaveBeenCalled()
  })

  it('never plays, and shows no control, under reduced motion', () => {
    localStorage.setItem('ambient', 'on')
    const { container, unmount } = mount({ reduced: true })
    gesture()
    expect(engine.play).not.toHaveBeenCalled()
    expect(container.querySelector('button[aria-pressed]')).toBeNull()
    unmount()
  })

  it('never plays below md, where the scene does not mount', () => {
    localStorage.setItem('ambient', 'on')
    const { container, unmount } = mount({ wide: false })
    gesture()
    expect(engine.play).not.toHaveBeenCalled()
    expect(container.querySelector('button[aria-pressed]')).toBeNull()
    unmount()
  })

  it('runs silently, with no control and no error, where Web Audio is missing', () => {
    engine.supported = false
    localStorage.setItem('ambient', 'on')
    const { container, unmount } = mount()
    gesture()
    expect(engine.play).not.toHaveBeenCalled()
    expect(container.querySelector('button[aria-pressed]')).toBeNull()
    expect(container.querySelector('[role="application"]')).not.toBeNull()
    unmount()
  })

  it('moving the slider sets the volume and persists it', () => {
    const { container, unmount } = mount()
    const slider = container.querySelector('input[type="range"]') as HTMLInputElement
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    act(() => {
      setter?.call(slider, '25')
      slider.dispatchEvent(new Event('input', { bubbles: true }))
    })
    expect(ambientVolume.get()).toBe(0.25)
    expect(localStorage.getItem('ambientVolume')).toBe('0.25')
    unmount()
  })
})
