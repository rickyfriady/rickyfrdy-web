/**
 * The valley's ambient audio, synthesised with Web Audio. No file ships and
 * none is requested.
 *
 * Three parts, kept apart so the music can be tested without sound:
 * - the composition (`eventsForBar`), plain data and a pure function;
 * - the voices, which turn one event into oscillators and envelopes;
 * - the engine, which owns the clock, the layers and the fades.
 *
 * The engine is inert until `unlock()` runs inside a user gesture, because
 * browsers refuse to start audio any other way and because nothing here should
 * ever begin on its own.
 */

export const BPM = 72
export const BEATS_PER_BAR = 4
export const LOOP_BARS = 16
export const BEAT_SECONDS = 60 / BPM
export const BAR_SECONDS = BEAT_SECONDS * BEATS_PER_BAR

export type Voice = 'lead' | 'pad' | 'bass' | 'brush'

export interface NoteEvent {
  voice: Voice
  /** Start, in beats from the top of the bar. */
  beat: number
  /** Length in beats. */
  dur: number
  /** MIDI note; a brush has none. */
  midi?: number
}

/** One chord a bar, I vi IV V, four times round: C, Am, F, G. */
const CHORDS = [
  { root: 48, tones: [60, 64, 67] },
  { root: 45, tones: [57, 60, 64] },
  { root: 41, tones: [57, 60, 65] },
  { root: 43, tones: [55, 59, 62] }
] as const

type Line = readonly (readonly [beat: number, midi: number, dur: number])[]

/**
 * The tune: four phrases of four bars over the same chords, C major pentatonic
 * so no note ever clashes with a chord. The last phrase ends on D, a step below
 * the E the first one opens on, so the loop turns over without a seam.
 */
const PHRASES: readonly (readonly Line[])[] = [
  [
    [
      [0, 76, 1.5],
      [2, 79, 1],
      [3, 76, 1]
    ],
    [
      [0, 81, 2],
      [2.5, 79, 0.5],
      [3, 76, 1]
    ],
    [
      [0, 74, 1.5],
      [2, 72, 1],
      [3, 69, 1]
    ],
    [
      [0, 67, 2],
      [2, 74, 1],
      [3, 72, 1]
    ]
  ],
  [
    [
      [0, 79, 1],
      [1, 76, 1],
      [2, 79, 2]
    ],
    [
      [0, 81, 1.5],
      [2, 76, 1],
      [3, 79, 1]
    ],
    [
      [0, 72, 2],
      [2, 74, 1],
      [3, 76, 1]
    ],
    [
      [0, 74, 2],
      [2, 67, 1],
      [3, 69, 1]
    ]
  ],
  [
    [],
    [
      [2, 76, 1],
      [3, 79, 1]
    ],
    [[0, 81, 3]],
    [
      [0, 79, 1],
      [1, 74, 1],
      [2, 67, 2]
    ]
  ],
  [
    [
      [0, 76, 1],
      [1, 79, 0.5],
      [1.5, 76, 0.5],
      [2, 74, 1],
      [3, 76, 1]
    ],
    [
      [0, 81, 2],
      [2, 79, 1],
      [3, 76, 1]
    ],
    [
      [0, 74, 1],
      [1, 72, 1],
      [2, 69, 1],
      [3, 72, 1]
    ],
    [
      [0, 67, 1],
      [1, 69, 1],
      [2, 72, 1],
      [3, 74, 1]
    ]
  ]
]

/** Everything that sounds in bar `bar` of the loop (any number; it wraps). */
export function eventsForBar(bar: number): NoteEvent[] {
  const n = ((Math.floor(bar) % LOOP_BARS) + LOOP_BARS) % LOOP_BARS
  const phrase = Math.floor(n / 4)
  const inPhrase = n % 4
  const chord = CHORDS[inPhrase]
  const events: NoteEvent[] = []

  for (const midi of chord.tones) events.push({ voice: 'pad', beat: 0, dur: BEATS_PER_BAR, midi })
  events.push({ voice: 'bass', beat: 0, dur: 1.5, midi: chord.root })
  events.push({ voice: 'bass', beat: 2, dur: 1.5, midi: chord.root + (inPhrase === 3 ? 7 : 0) })
  for (const [beat, midi, dur] of PHRASES[phrase][inPhrase]) {
    events.push({ voice: 'lead', beat, dur, midi })
  }
  // The third phrase opens on air, so its first two bars have no brush either.
  if (!(phrase === 2 && inPhrase < 2)) {
    events.push({ voice: 'brush', beat: 1, dur: 0.15 }, { voice: 'brush', beat: 3, dur: 0.15 })
  }
  return events
}

export const midiToHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

export type Surface = 'grass' | 'path'

/** What a footstep sounds like: soft and low on grass, short and bright on a path. */
export function footstepVoice(surface: Surface) {
  return surface === 'path'
    ? ({ filter: 'bandpass', freq: 2200, dur: 0.035, gain: 0.05 } as const)
    : ({ filter: 'lowpass', freq: 900, dur: 0.06, gain: 0.04 } as const)
}

interface Tone {
  type: OscillatorType
  freq: number
  start: number
  dur: number
  gain: number
  attack: number
  release: number
}

const VOICES: Record<
  Exclude<Voice, 'brush'>,
  { type: OscillatorType; gain: number; attack: number; release: number }
> = {
  lead: { type: 'triangle', gain: 0.07, attack: 0.02, release: 0.25 },
  pad: { type: 'sine', gain: 0.016, attack: 0.5, release: 0.8 },
  bass: { type: 'triangle', gain: 0.09, attack: 0.02, release: 0.3 }
}

/** Fade, in seconds, for starting, stopping and muting. */
export const FADE = 1.2

export function isAudioSupported(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(
    window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  )
}

function defaultContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  return Ctor ? new Ctor() : null
}

export class AmbientEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private playing = false
  private token = 0
  private tick: ReturnType<typeof setInterval> | undefined
  private birdTimer: ReturnType<typeof setTimeout> | undefined
  private wind: { source: AudioBufferSourceNode; lfo: OscillatorNode } | null = null
  private nextBarAt = 0
  private nextBar = 0

  constructor(private makeContext: () => AudioContext | null = defaultContext) {}

  /** True once a gesture has let audio start. Nothing plays before this. */
  get unlocked(): boolean {
    return this.ctx !== null
  }

  get isPlaying(): boolean {
    return this.playing
  }

  /** Must be called from a user gesture. Returns whether audio is available. */
  unlock(): boolean {
    try {
      this.ctx ??= this.makeContext()
      if (!this.ctx) return false
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return true
    } catch {
      this.ctx = null
      return false
    }
  }

  /** Start the loop and the layers, fading in to `volume`. Does nothing before `unlock()`. */
  play(volume: number): void {
    if (!this.ctx || this.playing) return
    try {
      const ctx = this.ctx
      this.token++
      if (ctx.state === 'suspended') void ctx.resume()
      this.master ??= this.buildMaster(ctx)
      this.noise ??= this.buildNoise(ctx)
      this.fade(volume, FADE)
      this.playing = true
      this.nextBarAt = ctx.currentTime + 0.1
      this.nextBar = 0
      this.pump()
      // A `stop()` still fading out has left these running; do not double them.
      clearInterval(this.tick)
      clearTimeout(this.birdTimer)
      this.tick = setInterval(() => this.pump(), 50)
      if (!this.wind) this.startWind(ctx)
      this.scheduleBird()
    } catch {
      this.halt()
    }
  }

  /** Fade out and stop. Safe to call at any time, including twice. */
  stop(): void {
    if (!this.playing) return
    this.playing = false
    const token = ++this.token
    try {
      this.fade(0, FADE)
    } catch {
      // A broken context has nothing left to fade.
    }
    setTimeout(
      () => {
        // A `play()` since then has taken the context back.
        if (token === this.token) this.halt()
      },
      FADE * 1000 + 100
    )
  }

  setVolume(volume: number): void {
    if (!this.playing) return
    try {
      this.fade(volume, 0.2)
    } catch {
      this.halt()
    }
  }

  footstep(surface: Surface): void {
    if (!this.playing || !this.ctx || !this.master || !this.noise) return
    try {
      const v = footstepVoice(surface)
      const ctx = this.ctx
      const now = ctx.currentTime
      const src = ctx.createBufferSource()
      src.buffer = this.noise
      const filter = ctx.createBiquadFilter()
      filter.type = v.filter
      filter.frequency.value = v.freq
      const amp = ctx.createGain()
      amp.gain.setValueAtTime(v.gain, now)
      amp.gain.exponentialRampToValueAtTime(0.0001, now + v.dur)
      src.connect(filter).connect(amp).connect(this.master)
      src.start(now, Math.random())
      src.stop(now + v.dur + 0.02)
    } catch {
      // A missed footstep is not worth a stack trace.
    }
  }

  private buildMaster(ctx: AudioContext): GainNode {
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    return master
  }

  private buildNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  private fade(to: number, seconds: number): void {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    const gain = this.master.gain
    gain.cancelScheduledValues(now)
    gain.setValueAtTime(gain.value, now)
    gain.linearRampToValueAtTime(to, now + seconds)
  }

  /** Schedule every bar that starts inside the look-ahead window. */
  private pump(): void {
    if (!this.ctx || !this.master) return
    const horizon = this.ctx.currentTime + 0.3
    while (this.nextBarAt < horizon) {
      this.scheduleBar(this.nextBar, this.nextBarAt)
      this.nextBarAt += BAR_SECONDS
      this.nextBar++
    }
  }

  private scheduleBar(bar: number, at: number): void {
    for (const e of eventsForBar(bar)) {
      const start = at + e.beat * BEAT_SECONDS
      const dur = e.dur * BEAT_SECONDS
      if (e.voice === 'brush') this.brush(start, dur)
      else if (e.midi !== undefined) {
        this.tone({ ...VOICES[e.voice], freq: midiToHz(e.midi), start, dur })
      }
    }
  }

  private tone(t: Tone): void {
    if (!this.ctx || !this.master) return
    const osc = this.ctx.createOscillator()
    const amp = this.ctx.createGain()
    osc.type = t.type
    osc.frequency.value = t.freq
    const end = t.start + t.dur
    amp.gain.setValueAtTime(0, t.start)
    amp.gain.linearRampToValueAtTime(t.gain, t.start + t.attack)
    amp.gain.setValueAtTime(t.gain, Math.max(t.start + t.attack, end - t.release))
    amp.gain.linearRampToValueAtTime(0, end)
    osc.connect(amp).connect(this.master)
    osc.start(t.start)
    osc.stop(end + 0.05)
  }

  /** A soft brushed hit: a short burst of high noise. */
  private brush(start: number, dur: number): void {
    if (!this.ctx || !this.master || !this.noise) return
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 3000
    const amp = this.ctx.createGain()
    amp.gain.setValueAtTime(0.018, start)
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    src.connect(filter).connect(amp).connect(this.master)
    src.start(start, Math.random())
    src.stop(start + dur + 0.02)
  }

  /** Wind: looped noise through a band-pass whose level swells and falls slowly. */
  private startWind(ctx: AudioContext): void {
    if (!this.master || !this.noise) return
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    source.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 500
    band.Q.value = 0.5
    const level = ctx.createGain()
    level.gain.value = 0.02
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.12
    const depth = ctx.createGain()
    depth.gain.value = 0.012
    lfo.connect(depth).connect(level.gain)
    source.connect(band).connect(level).connect(this.master)
    source.start()
    lfo.start()
    this.wind = { source, lfo }
  }

  /** A short two-note chirp every so often. */
  private scheduleBird(): void {
    const wait = 8000 + Math.random() * 12000
    this.birdTimer = setTimeout(() => {
      this.chirp()
      if (this.playing) this.scheduleBird()
    }, wait)
  }

  private chirp(): void {
    if (!this.playing || !this.ctx || !this.master) return
    try {
      const now = this.ctx.currentTime
      for (const [offset, from, to] of [
        [0, 2600, 3400],
        [0.12, 3000, 2400]
      ] as const) {
        const osc = this.ctx.createOscillator()
        const amp = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(from, now + offset)
        osc.frequency.linearRampToValueAtTime(to, now + offset + 0.07)
        amp.gain.setValueAtTime(0.02, now + offset)
        amp.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08)
        osc.connect(amp).connect(this.master)
        osc.start(now + offset)
        osc.stop(now + offset + 0.1)
      }
    } catch {
      // Birdsong is a garnish.
    }
  }

  /** Stop everything that keeps running and let the context sleep. */
  private halt(): void {
    this.playing = false
    clearInterval(this.tick)
    clearTimeout(this.birdTimer)
    this.tick = undefined
    this.birdTimer = undefined
    try {
      this.wind?.source.stop()
      this.wind?.lfo.stop()
    } catch {
      // Already stopped.
    }
    this.wind = null
    try {
      void this.ctx?.suspend()
    } catch {
      // Nothing to suspend.
    }
  }
}

/** One engine for the page: there is one valley. */
export const ambient = new AmbientEngine()
