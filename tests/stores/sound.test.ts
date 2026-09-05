import { beforeEach, describe, expect, it } from 'vitest'
import { initSound, setSoundEnabled, soundEnabled, toggleSound } from '@/stores/sound'

describe('sound preference', () => {
  beforeEach(() => {
    localStorage.clear()
    soundEnabled.set(false)
  })

  it('is off on a first visit', () => {
    initSound()
    expect(soundEnabled.get()).toBe(false)
  })

  it('stays off when storage holds anything other than an explicit opt-in', () => {
    for (const value of ['', 'true', 'yes', 'ON', 'off']) {
      localStorage.setItem('sound', value)
      initSound()
      expect(soundEnabled.get()).toBe(false)
    }
  })

  it('persists an opt-in across visits', () => {
    setSoundEnabled(true)
    soundEnabled.set(false) // simulate a fresh page
    initSound()
    expect(soundEnabled.get()).toBe(true)
  })

  it('persists an opt-out too, rather than falling back to the default', () => {
    setSoundEnabled(true)
    setSoundEnabled(false)
    initSound()
    expect(soundEnabled.get()).toBe(false)
  })

  it('toggles both ways', () => {
    toggleSound()
    expect(soundEnabled.get()).toBe(true)
    toggleSound()
    expect(soundEnabled.get()).toBe(false)
  })
})
