import { beforeEach, describe, expect, it } from 'vitest'
import {
  ambientEnabled,
  ambientVolume,
  initAmbient,
  setAmbientEnabled,
  setAmbientVolume
} from '@/stores/ambient'
import { soundEnabled } from '@/stores/sound'

describe('ambient audio preference', () => {
  beforeEach(() => {
    localStorage.clear()
    ambientEnabled.set(false)
    ambientVolume.set(0.5)
  })

  it('is off on a first visit', () => {
    initAmbient()
    expect(ambientEnabled.get()).toBe(false)
  })

  it('stays off when storage holds anything but an explicit opt-in', () => {
    for (const value of ['', 'true', 'yes', 'ON', 'off']) {
      localStorage.setItem('ambient', value)
      initAmbient()
      expect(ambientEnabled.get(), value).toBe(false)
    }
  })

  it('persists an opt-in across visits', () => {
    setAmbientEnabled(true)
    ambientEnabled.set(false) // a fresh page
    initAmbient()
    expect(ambientEnabled.get()).toBe(true)
  })

  it('is independent of the interaction-sound preference', () => {
    soundEnabled.set(true)
    initAmbient()
    expect(ambientEnabled.get()).toBe(false)
    setAmbientEnabled(true)
    expect(soundEnabled.get()).toBe(true)
    soundEnabled.set(false)
    expect(ambientEnabled.get()).toBe(true)
  })

  it('persists the volume and clamps it to 0..1', () => {
    setAmbientVolume(0.25)
    ambientVolume.set(0.5)
    initAmbient()
    expect(ambientVolume.get()).toBe(0.25)
    setAmbientVolume(7)
    expect(ambientVolume.get()).toBe(1)
    setAmbientVolume(-3)
    expect(ambientVolume.get()).toBe(0)
  })

  it('falls back to a middle volume for a corrupt stored value', () => {
    localStorage.setItem('ambientVolume', 'loud')
    initAmbient()
    expect(ambientVolume.get()).toBe(0.5)
  })
})
