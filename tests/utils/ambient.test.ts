import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AmbientEngine,
  BAR_SECONDS,
  BEATS_PER_BAR,
  eventsForBar,
  FADE,
  footstepVoice,
  LOOP_BARS,
  midiToHz
} from '@/utils/ambient'

/** Just enough of Web Audio to count what an engine asks for. */
class FakeParam {
  value = 0
  ramps: [number, number][] = []
  setValueAtTime = vi.fn()
  cancelScheduledValues = vi.fn()
  exponentialRampToValueAtTime = vi.fn()
  linearRampToValueAtTime = (v: number, t: number) => {
    this.ramps.push([v, t])
  }
}
class FakeNode {
  gain = new FakeParam()
  frequency = new FakeParam()
  Q = new FakeParam()
  buffer: unknown = null
  loop = false
  type = ''
  connect = (n: unknown) => n
  start = vi.fn()
  stop = vi.fn()
}
class FakeContext {
  currentTime = 0
  sampleRate = 8000
  state = 'suspended'
  destination = new FakeNode()
  created = { osc: 0, buffers: 0, gains: 0 }
  resume = vi.fn(() => {
    this.state = 'running'
    return Promise.resolve()
  })
  suspend = vi.fn(() => Promise.resolve())
  createGain = () => {
    this.created.gains++
    return new FakeNode()
  }
  createOscillator = () => {
    this.created.osc++
    return new FakeNode()
  }
  createBufferSource = () => new FakeNode()
  createBiquadFilter = () => new FakeNode()
  createBuffer = () => {
    this.created.buffers++
    return { getChannelData: () => new Float32Array(16) }
  }
}

let ctx: FakeContext
const make = vi.fn(() => {
  ctx = new FakeContext()
  return ctx as unknown as AudioContext
})

beforeEach(() => {
  vi.useFakeTimers()
  make.mockClear()
})
afterEach(() => vi.useRealTimers())

describe('the composition', () => {
  const bars = Array.from({ length: LOOP_BARS }, (_, i) => eventsForBar(i))

  it('never lets a note run past the end of its bar', () => {
    for (const [i, events] of bars.entries())
      for (const e of events)
        expect(e.beat + e.dur, `bar ${i} ${e.voice}`).toBeLessThanOrEqual(BEATS_PER_BAR)
  })

  it('wraps: bar 16 is bar 0, so the loop is exactly sixteen bars', () => {
    expect(eventsForBar(LOOP_BARS)).toEqual(eventsForBar(0))
    expect(eventsForBar(-1)).toEqual(eventsForBar(LOOP_BARS - 1))
  })

  it('turns over without a leap: the last lead note lands a step from the first', () => {
    const lead = (events: ReturnType<typeof eventsForBar>) =>
      events.filter((e) => e.voice === 'lead').sort((a, b) => a.beat - b.beat)
    const last = lead(bars[LOOP_BARS - 1]).at(-1)?.midi as number
    const first = lead(bars[0])[0].midi as number
    expect(Math.abs(first - last)).toBeLessThanOrEqual(4)
  })

  it('keeps every lead note inside C major pentatonic, so none clashes with a chord', () => {
    const allowed = new Set([0, 2, 4, 7, 9])
    for (const events of bars)
      for (const e of events.filter((n) => n.voice === 'lead'))
        expect(allowed.has((e.midi as number) % 12), `midi ${e.midi}`).toBe(true)
  })

  it('has a chord under every bar and a breath in the third phrase', () => {
    for (const events of bars) expect(events.filter((e) => e.voice === 'pad')).toHaveLength(3)
    expect(bars[8].some((e) => e.voice === 'lead')).toBe(false)
  })

  it('is slow and long enough to be a place, not a jingle', () => {
    expect(BAR_SECONDS * LOOP_BARS).toBeGreaterThan(45)
  })

  it('converts MIDI to a pitch', () => {
    expect(midiToHz(69)).toBe(440)
    expect(midiToHz(81)).toBeCloseTo(880)
  })
})

describe('footsteps', () => {
  it('sound different on grass and on a path', () => {
    expect(footstepVoice('grass')).not.toEqual(footstepVoice('path'))
    expect(footstepVoice('path').freq).toBeGreaterThan(footstepVoice('grass').freq)
    expect(footstepVoice('path').dur).toBeLessThan(footstepVoice('grass').dur)
  })
})

describe('the engine', () => {
  it('does nothing, and touches no audio, before a gesture unlocks it', () => {
    const engine = new AmbientEngine(make)
    engine.play(0.5)
    engine.footstep('grass')
    engine.setVolume(0.2)
    expect(make).not.toHaveBeenCalled()
    expect(engine.unlocked).toBe(false)
    expect(engine.isPlaying).toBe(false)
  })

  it('unlocking creates the context and resumes it, and still does not play', () => {
    const engine = new AmbientEngine(make)
    expect(engine.unlock()).toBe(true)
    expect(make).toHaveBeenCalledTimes(1)
    expect(ctx.resume).toHaveBeenCalled()
    expect(engine.isPlaying).toBe(false)
    expect(ctx.created.osc).toBe(0)
  })

  it('plays after unlock, fading in to the volume', () => {
    const engine = new AmbientEngine(make)
    engine.unlock()
    engine.play(0.5)
    expect(engine.isPlaying).toBe(true)
    expect(ctx.created.osc).toBeGreaterThan(0)
  })

  it('schedules more bars as the clock moves, without running ahead of itself', () => {
    const engine = new AmbientEngine(make)
    engine.unlock()
    engine.play(0.5)
    const early = ctx.created.osc
    ctx.currentTime += BAR_SECONDS * 3
    vi.advanceTimersByTime(60)
    expect(ctx.created.osc).toBeGreaterThan(early)
  })

  it('fades out on stop, then sleeps the context', () => {
    const engine = new AmbientEngine(make)
    engine.unlock()
    engine.play(0.5)
    engine.stop()
    expect(engine.isPlaying).toBe(false)
    vi.advanceTimersByTime(FADE * 1000 + 200)
    expect(ctx.suspend).toHaveBeenCalled()
  })

  it('stopping twice is harmless, and playing again during the fade keeps one loop', () => {
    const engine = new AmbientEngine(make)
    engine.unlock()
    engine.play(0.5)
    engine.stop()
    engine.stop()
    engine.play(0.5)
    vi.advanceTimersByTime(FADE * 1000 + 200)
    expect(engine.isPlaying).toBe(true)
    expect(ctx.suspend).not.toHaveBeenCalled()
  })

  it('answers a footstep only while playing', () => {
    const engine = new AmbientEngine(make)
    engine.unlock()
    engine.footstep('path')
    expect(ctx.created.gains).toBe(0)
    engine.play(0.5)
    const before = ctx.created.gains
    engine.footstep('path')
    expect(ctx.created.gains).toBeGreaterThan(before)
  })

  it('reports no audio when the browser has none, and never throws', () => {
    const engine = new AmbientEngine(() => null)
    expect(engine.unlock()).toBe(false)
    expect(() => {
      engine.play(0.5)
      engine.footstep('grass')
      engine.stop()
    }).not.toThrow()
  })

  it('swallows a context that throws', () => {
    const engine = new AmbientEngine(() => {
      throw new Error('blocked')
    })
    expect(engine.unlock()).toBe(false)
    expect(() => engine.play(0.5)).not.toThrow()
  })
})
