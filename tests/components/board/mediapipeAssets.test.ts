import { describe, expect, it, vi } from 'vitest'
import {
  MEDIAPIPE_VERSION,
  MODEL_URL,
  resolveWasmBase,
  wasmSources
} from '@/components/board/mediapipeAssets'

describe('wasmSources()', () => {
  it('prefers the self-hosted copy, which cannot disagree with the installed runtime', () => {
    expect(wasmSources()[0]).toBe('/vendor/mediapipe/wasm')
  })

  it('never hardcodes a version in the CDN fallback', () => {
    // This is the whole point: the reference implementation pinned 0.10.22-rc
    // in package.json while requesting 0.10.3 WASM from a CDN. It worked, and
    // would have broken silently on the next upgrade.
    const cdn = wasmSources().find((s) => s.startsWith('https://'))
    if (MEDIAPIPE_VERSION) {
      expect(cdn).toContain(`@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`)
    } else {
      expect(cdn).toBeUndefined()
    }
  })

  it('serves the model from our own origin — it has no npm peer to fall back to', () => {
    expect(MODEL_URL).toBe('/models/hand_landmarker.task')
    expect(MODEL_URL.startsWith('/')).toBe(true)
  })
})

describe('resolveWasmBase()', () => {
  it('stops at the first source that loads', async () => {
    const load = vi.fn().mockResolvedValue(undefined)
    expect(await resolveWasmBase(load)).toBe('/vendor/mediapipe/wasm')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('falls through to the CDN when the self-hosted copy is missing', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('404')).mockResolvedValueOnce(undefined)
    const base = await resolveWasmBase(load)
    expect(load).toHaveBeenCalledTimes(2)
    expect(base?.startsWith('https://cdn.jsdelivr.net/')).toBe(true)
  })

  it('returns null when every source fails, rather than throwing', async () => {
    // Total failure is a supported outcome: Detective Mode is simply not
    // offered, and the board carries on working with mouse and keyboard.
    const load = vi.fn().mockRejectedValue(new Error('offline'))
    await expect(resolveWasmBase(load)).resolves.toBeNull()
  })
})
