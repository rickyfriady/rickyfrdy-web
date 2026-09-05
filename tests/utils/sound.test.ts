import { beforeEach, describe, expect, it, vi } from 'vitest'

type StubOsc = {
  type: string
  frequency: { setValueAtTime: ReturnType<typeof vi.fn> }
  start: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>
}

/**
 * Minimal Web Audio stub. Returns every oscillator created, because the module
 * deliberately caches one AudioContext for the page — creating a fresh one per
 * sound would leak contexts — so tests have to observe voices, not contexts.
 */
function stubAudio(): StubOsc[] {
  const created: StubOsc[] = []
  const ctx = {
    state: 'running',
    currentTime: 0,
    resume: vi.fn(),
    destination: {},
    createOscillator: () => {
      const osc = {
        type: '',
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: () => ({ connect: () => undefined }),
        start: vi.fn(),
        stop: vi.fn()
      }
      created.push(osc as StubOsc)
      return osc
    },
    createGain: () => ({
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: () => undefined
    })
  }
  // Must be constructible: the module calls `new AudioContext()`.
  vi.stubGlobal('AudioContext', function AudioContextStub(this: unknown) {
    return ctx
  } as unknown as typeof AudioContext)
  return created
}

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  )
}

/**
 * The module keeps one AudioContext for the page — correct in production, but
 * it means a cached context would leak between tests. Reset the module and
 * re-import so each test gets a clean one.
 */
async function freshAudio() {
  vi.resetModules()
  // The store has to come from the same reset module graph, or the test would
  // be flipping a different atom than the one `playSound` reads.
  const [{ playSound }, { soundEnabled }] = await Promise.all([
    import('@/utils/sound'),
    import('@/stores/sound')
  ])
  return { playSound, soundEnabled }
}

describe('playSound()', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    setReducedMotion(false)
  })

  it('stays silent while sound is off — the default state', async () => {
    const voices = stubAudio()
    const { playSound } = await freshAudio()
    playSound('tick')
    expect(voices).toHaveLength(0)
  })

  it('plays once the visitor has opted in', async () => {
    const voices = stubAudio()
    const { playSound, soundEnabled } = await freshAudio()
    soundEnabled.set(true)
    playSound('stamp')
    expect(voices).toHaveLength(1)
    expect(voices[0].start).toHaveBeenCalledTimes(1)
    expect(voices[0].stop).toHaveBeenCalledTimes(1)
  })

  it('stays silent under reduced motion even when enabled', async () => {
    // Someone asking for less motion is asking for a quieter page too.
    const voices = stubAudio()
    const { playSound, soundEnabled } = await freshAudio()
    soundEnabled.set(true)
    setReducedMotion(true)
    playSound('confirm')
    expect(voices).toHaveLength(0)
  })

  it('gives each of the four sounds its own distinct voice', async () => {
    const voices = stubAudio()
    const { playSound, soundEnabled } = await freshAudio()
    soundEnabled.set(true)
    for (const name of ['tick', 'stamp', 'drawer', 'confirm'] as const) playSound(name)
    expect(voices).toHaveLength(4)
    const shapes = new Set(
      voices.map((v) => `${v.type}:${v.frequency.setValueAtTime.mock.calls[0][0]}`)
    )
    expect(shapes.size).toBe(4)
  })

  it('does nothing when the browser has no Web Audio at all', async () => {
    vi.stubGlobal('AudioContext', undefined)
    const { playSound, soundEnabled } = await freshAudio()
    soundEnabled.set(true)
    expect(() => playSound('tick')).not.toThrow()
  })
})
