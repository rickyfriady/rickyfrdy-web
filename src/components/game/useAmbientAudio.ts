import { type RefObject, useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import {
  ambientEnabled,
  ambientVolume,
  initAmbient,
  setAmbientEnabled,
  setAmbientVolume
} from '@/stores/ambient'
import { ambient, isAudioSupported } from '@/utils/ambient'

const useAtom = <T>(atom: { get(): T; listen(cb: () => void): () => void }) =>
  useSyncExternalStore(
    (cb) => atom.listen(cb),
    () => atom.get(),
    () => atom.get()
  )

/**
 * Connects the scene to the ambient engine and decides when it may sound.
 *
 * Audio plays only when every one of these holds: the visitor opted in, the
 * scene is allowed to run motion at all (not reduced, not below `md`), a
 * gesture has since unlocked the browser's audio, the scene is on screen, and
 * the tab is visible. Any one failing fades it out, and the engine itself
 * refuses to do anything before the gesture.
 */
export function useAmbientAudio({
  stageRef,
  allowed
}: {
  stageRef: RefObject<HTMLElement | null>
  allowed: boolean
}) {
  const enabled = useAtom(ambientEnabled)
  const volume = useAtom(ambientVolume)
  const [supported] = useState(isAudioSupported)
  const [unlocked, setUnlocked] = useState(() => ambient.unlocked)
  const [onScreen, setOnScreen] = useState(true)
  const [tabShown, setTabShown] = useState(true)

  useEffect(() => {
    initAmbient()
  }, [])

  // A saved opt-in waits here for the visitor's next key press or tap.
  useEffect(() => {
    if (!supported || !enabled || !allowed || unlocked) return
    const unlock = () => {
      if (ambient.unlock()) setUnlocked(true)
    }
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => {
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('pointerdown', unlock)
    }
  }, [supported, enabled, allowed, unlocked])

  useEffect(() => {
    const onVisibility = () => setTabShown(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    const stage = stageRef.current
    let observer: IntersectionObserver | undefined
    if (stage && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) =>
        setOnScreen(entries.some((e) => e.isIntersecting))
      )
      observer.observe(stage)
    }
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      observer?.disconnect()
    }
  }, [stageRef])

  const shouldPlay = supported && enabled && allowed && unlocked && onScreen && tabShown
  useEffect(() => {
    if (shouldPlay) ambient.play(ambientVolume.get())
    else ambient.stop()
  }, [shouldPlay])
  useEffect(() => {
    ambient.setVolume(volume)
  }, [volume])
  useEffect(() => () => ambient.stop(), [])

  /** Called from the toggle's click: a gesture, so it may unlock audio itself. */
  const setEnabled = useCallback((next: boolean) => {
    if (next && ambient.unlock()) setUnlocked(true)
    setAmbientEnabled(next)
  }, [])

  return { supported, enabled, volume, setEnabled, setVolume: setAmbientVolume }
}
