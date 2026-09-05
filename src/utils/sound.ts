import { soundEnabled } from '@/stores/sound'

/**
 * Four interaction sounds, synthesised with Web Audio.
 *
 * Synthesised rather than loaded from files: these are short clicks and thunks,
 * so an oscillator envelope describes them in a few lines and costs no asset,
 * no network request, and no audio library.
 *
 * Sound only ever follows an action the visitor initiated. Nothing ambient,
 * nothing on page load, nothing on scroll, and never background music.
 */
export type SoundName = 'tick' | 'stamp' | 'drawer' | 'confirm'

interface Voice {
  /** Start and end frequency in Hz — a fall reads as a thunk, a rise as a pull. */
  from: number
  to: number
  duration: number
  type: OscillatorType
  gain: number
}

const VOICES: Record<SoundName, Voice> = {
  // Paper tick: the menu-navigation blip.
  tick: { from: 1400, to: 1100, duration: 0.03, type: 'square', gain: 0.05 },
  // Rubber stamp: short, low, percussive.
  stamp: { from: 320, to: 90, duration: 0.09, type: 'square', gain: 0.09 },
  // Filing drawer sliding open.
  drawer: { from: 180, to: 420, duration: 0.16, type: 'sawtooth', gain: 0.05 },
  // Heavy stamp for a completed action.
  confirm: { from: 520, to: 140, duration: 0.18, type: 'square', gain: 0.1 }
}

let ctx: AudioContext | null = null

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

/** A visitor who asked for less motion is asking for a quieter page too. */
function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function playSound(name: SoundName): void {
  if (!soundEnabled.get() || reducedMotion()) return
  const audio = audioContext()
  if (!audio) return
  // Browsers suspend the context until a user gesture; every caller here is one.
  if (audio.state === 'suspended') void audio.resume()

  const voice = VOICES[name]
  const now = audio.currentTime
  const osc = audio.createOscillator()
  const amp = audio.createGain()

  osc.type = voice.type
  osc.frequency.setValueAtTime(voice.from, now)
  osc.frequency.exponentialRampToValueAtTime(voice.to, now + voice.duration)

  amp.gain.setValueAtTime(voice.gain, now)
  amp.gain.exponentialRampToValueAtTime(0.0001, now + voice.duration)

  osc.connect(amp).connect(audio.destination)
  osc.start(now)
  osc.stop(now + voice.duration)
}
