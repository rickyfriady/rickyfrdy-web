import { useCallback, useEffect, useRef, useState } from 'react'
import { MODEL_URL, resolveWasmBase } from './mediapipeAssets'

/**
 * Hand tracking for Detective Mode.
 *
 * Ported from the working implementation in the `resanso` project. The tuned
 * parts — speed-adaptive cursor smoothing, pinch hysteresis, per-frame
 * movement clamping — are carried over deliberately unchanged: they are the
 * hard part, and they were already solved.
 *
 * Two things were changed on the way over. Asset resolution no longer
 * hardcodes a CDN version (see `mediapipeAssets.ts`), and tracking now stops
 * itself when nobody is using it.
 */

/** Only the landmark fields this hook reads, rather than pulling in the full type. */
type Landmark = { x: number; y: number }
type HandResult = { landmarks?: Landmark[][] }

export interface HandState {
  cursor: { x: number; y: number }
  isPinching: boolean
  isTwoHandPinch: boolean
  zoomDelta: number
  scrollDelta: number
}

export type GestureStatus = 'idle' | 'loading' | 'active' | 'denied' | 'unavailable'

/** Engage below this, release above the other — a single threshold flickers. */
const PINCH_ENGAGE = 0.04
const PINCH_RELEASE = 0.07
/** A jump larger than this in one frame is tracking noise, not a hand movement. */
const MAX_FRAME_MOVE = 80
/** Continuous webcam inference is expensive; stop when nobody is using it. */
const IDLE_TIMEOUT_MS = 60_000

const EMPTY: HandState = {
  cursor: { x: 0, y: 0 },
  isPinching: false,
  isTwoHandPinch: false,
  zoomDelta: 0,
  scrollDelta: 0
}

export function useHandGesture(active: boolean) {
  const [status, setStatus] = useState<GestureStatus>('idle')
  const [hand, setHand] = useState<HandState>(EMPTY)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const landmarkerRef = useRef<{
    detectForVideo: (video: HTMLVideoElement, timestamp: number) => HandResult
  } | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastCursor = useRef({ x: 0, y: 0 })
  const pinching = useRef(false)
  const lastTwoHandDist = useRef(0)
  const wasTwoHand = useRef(false)
  const lastSeen = useRef(Date.now())
  const onIdleRef = useRef<(() => void) | null>(null)

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    const stream = videoRef.current?.srcObject as MediaStream | null
    for (const track of stream?.getTracks() ?? []) track.stop()
    if (videoRef.current) videoRef.current.srcObject = null
    setHand(EMPTY)
  }, [])

  const predict = useCallback(() => {
    const video = videoRef.current
    const landmarker = landmarkerRef.current
    if (!video || !landmarker) return

    const result = landmarker.detectForVideo(video, performance.now())
    const hands = result?.landmarks ?? []

    if (hands.length === 0) {
      // Nothing to track. Give up after a while rather than burning the
      // battery on an empty frame forever.
      if (Date.now() - lastSeen.current > IDLE_TIMEOUT_MS) {
        onIdleRef.current?.()
        return
      }
      rafRef.current = requestAnimationFrame(predict)
      return
    }
    lastSeen.current = Date.now()

    const pinchDistance = (lm: Array<{ x: number; y: number }>) =>
      Math.hypot(lm[8].x - lm[4].x, lm[8].y - lm[4].y)

    const palmToScreen = (lm: Array<{ x: number; y: number }>) => {
      const palm = lm[9] ?? lm[0]
      // Mirrored: the camera sees the user, so left on screen is their right.
      return { x: (1 - palm.x) * window.innerWidth, y: palm.y * window.innerHeight }
    }

    // Two-hand pinch zoom takes priority and suspends single-hand gestures,
    // otherwise the second hand fights the cursor.
    if (hands.length === 2) {
      const bothPinching = hands.every((lm) => pinchDistance(lm) < PINCH_ENGAGE)
      if (bothPinching) {
        const [a, b] = hands.map(palmToScreen)
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        const delta =
          wasTwoHand.current && lastTwoHandDist.current > 0
            ? (dist - lastTwoHandDist.current) / 100
            : 0
        lastTwoHandDist.current = dist
        wasTwoHand.current = true
        setHand((h) => ({ ...h, isTwoHandPinch: true, zoomDelta: delta, scrollDelta: 0 }))
        rafRef.current = requestAnimationFrame(predict)
        return
      }
    }
    if (wasTwoHand.current) {
      wasTwoHand.current = false
      lastTwoHandDist.current = 0
      setHand((h) => ({ ...h, isTwoHandPinch: false, zoomDelta: 0 }))
    }

    const lm = hands[0]
    // Index + middle extended, ring + little folded = the scroll gesture.
    const twoFingers =
      lm[8].y < lm[6].y && lm[12].y < lm[10].y && lm[16].y > lm[14].y && lm[20].y > lm[18].y

    let { x: rawX, y: rawY } = palmToScreen(lm)
    let dx = rawX - lastCursor.current.x
    let dy = rawY - lastCursor.current.y
    let moved = Math.hypot(dx, dy)

    if (moved > MAX_FRAME_MOVE) {
      const ratio = MAX_FRAME_MOVE / moved
      rawX = lastCursor.current.x + dx * ratio
      rawY = lastCursor.current.y + dy * ratio
      dx *= ratio
      dy *= ratio
      moved = MAX_FRAME_MOVE
    }

    // Speed-adaptive smoothing: heavy damping when nearly still so the cursor
    // does not jitter, light damping when moving fast so it does not lag.
    let lerp: number
    if (moved < 3) lerp = 0.02
    else if (moved < 10) lerp = 0.08
    else lerp = Math.min(0.15 + ((moved - 10) / 150) * 0.6, 0.7)

    const x = lastCursor.current.x + (rawX - lastCursor.current.x) * lerp
    const y = lastCursor.current.y + (rawY - lastCursor.current.y) * lerp
    lastCursor.current = { x, y }

    if (twoFingers) {
      pinching.current = false
      setHand({
        cursor: { x, y },
        isPinching: false,
        isTwoHandPinch: false,
        zoomDelta: 0,
        scrollDelta: Math.abs(dy) > 2 ? dy * 2.5 : 0
      })
    } else {
      const d = pinchDistance(lm)
      if (pinching.current ? d > PINCH_RELEASE : d < PINCH_ENGAGE) {
        pinching.current = !pinching.current
      }
      setHand({
        cursor: { x, y },
        isPinching: pinching.current,
        isTwoHandPinch: false,
        zoomDelta: 0,
        scrollDelta: 0
      })
    }

    rafRef.current = requestAnimationFrame(predict)
  }, [])

  useEffect(() => {
    if (!active) {
      stop()
      setStatus('idle')
      return
    }

    let cancelled = false
    onIdleRef.current = () => {
      stop()
      setStatus('idle')
    }

    ;(async () => {
      setStatus('loading')
      try {
        // Dynamic import: this is the only thing that pulls MediaPipe in, and
        // it runs strictly after the visitor asks for Detective Mode.
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision')

        let fileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null
        const base = await resolveWasmBase(async (b) => {
          fileset = await FilesetResolver.forVisionTasks(b)
        })
        if (!base || !fileset) {
          if (!cancelled) setStatus('unavailable')
          return
        }

        const landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2
        })
        if (cancelled) return
        landmarkerRef.current = landmarker as never

        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cancelled) {
          for (const track of stream.getTracks()) track.stop()
          return
        }
        const video = document.createElement('video')
        video.autoplay = true
        video.playsInline = true
        video.srcObject = stream
        videoRef.current = video
        await video.play()

        lastSeen.current = Date.now()
        setStatus('active')
        rafRef.current = requestAnimationFrame(predict)
      } catch (err) {
        if (cancelled) return
        const denied = err instanceof DOMException && err.name === 'NotAllowedError'
        setStatus(denied ? 'denied' : 'unavailable')
        stop()
      }
    })()

    return () => {
      cancelled = true
      stop()
    }
  }, [active, predict, stop])

  return { status, hand, videoRef }
}
