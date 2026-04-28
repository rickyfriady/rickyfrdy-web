import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { onBeforeUnmount, ref } from 'vue'

interface Point {
  x: number
  y: number
}

export interface HandData {
  position: Point
  isPinching: boolean
}

const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
const MODEL_PATH = '/models/hand_landmarker.task'

export function useHandGesture() {
  const cursorPosition = ref<Point>({ x: 0, y: 0 })
  const isPinching = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)
  const isActive = ref(false)

  const hands = ref<HandData[]>([])
  const isTwoHandPinch = ref(false)
  const twoHandDistance = ref(0)
  const zoomDelta = ref(0)

  const videoRef = ref<HTMLVideoElement | null>(null)

  let handLandmarker: HandLandmarker | null = null
  let stream: MediaStream | null = null
  let requestId: number | null = null

  let lastCursor: Point = { x: 0, y: 0 }
  let pinchState = false
  let lastTwoHandDist = 0
  let wasTwoHandPinch = false

  async function ensureLandmarker() {
    if (handLandmarker) return handLandmarker

    const vision = await FilesetResolver.forVisionTasks(WASM_PATH)
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_PATH,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2
    })

    return handLandmarker
  }

  function resetState() {
    hands.value = []
    isPinching.value = false
    isTwoHandPinch.value = false
    twoHandDistance.value = 0
    zoomDelta.value = 0

    pinchState = false
    lastTwoHandDist = 0
    wasTwoHandPinch = false
  }

  function stopLoop() {
    if (requestId !== null) {
      cancelAnimationFrame(requestId)
      requestId = null
    }
  }

  function stopCamera() {
    if (!stream) return

    stream.getTracks().forEach((track) => track.stop())
    stream = null

    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
  }

  function stopGesture() {
    isActive.value = false
    isReady.value = false

    stopLoop()
    stopCamera()

    document.body.classList.remove('camera-active')
    resetState()
  }

  function readPinchDistance(landmarks: { x: number; y: number }[]) {
    const indexTip = landmarks[8]
    const thumbTip = landmarks[4]
    if (!indexTip || !thumbTip) return Number.POSITIVE_INFINITY

    const dx = indexTip.x - thumbTip.x
    const dy = indexTip.y - thumbTip.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  function detectHands() {
    if (!isActive.value || !handLandmarker || !videoRef.value) return

    if (videoRef.value.readyState < 2) {
      requestId = requestAnimationFrame(detectHands)
      return
    }

    const result = handLandmarker.detectForVideo(videoRef.value, performance.now())
    const landmarksByHand = result.landmarks ?? []

    const detectedHands: HandData[] = []

    for (const landmarks of landmarksByHand) {
      const palmCenter = landmarks[9] ?? landmarks[0]
      if (!palmCenter) continue

      const pinchDist = readPinchDistance(landmarks)
      const posX = (1 - palmCenter.x) * window.innerWidth
      const posY = palmCenter.y * window.innerHeight

      detectedHands.push({
        position: { x: posX, y: posY },
        isPinching: pinchDist < 0.05
      })
    }

    hands.value = detectedHands

    if (detectedHands.length === 2 && detectedHands.every((hand) => hand.isPinching)) {
      const [handA, handB] = detectedHands
      if (!handA || !handB) {
        requestId = requestAnimationFrame(detectHands)
        return
      }

      const dx = handA.position.x - handB.position.x
      const dy = handA.position.y - handB.position.y
      const currentDist = Math.sqrt(dx * dx + dy * dy)

      twoHandDistance.value = currentDist
      isTwoHandPinch.value = true

      if (wasTwoHandPinch && lastTwoHandDist > 0) {
        zoomDelta.value = (currentDist - lastTwoHandDist) / 100
      } else {
        zoomDelta.value = 0
      }

      lastTwoHandDist = currentDist
      wasTwoHandPinch = true

      requestId = requestAnimationFrame(detectHands)
      return
    }

    if (wasTwoHandPinch) {
      isTwoHandPinch.value = false
      twoHandDistance.value = 0
      zoomDelta.value = 0
      lastTwoHandDist = 0
      wasTwoHandPinch = false
    }

    const primary = landmarksByHand[0]

    if (!primary) {
      if (pinchState) {
        pinchState = false
        isPinching.value = false
      }

      requestId = requestAnimationFrame(detectHands)
      return
    }

    const palmCenter = primary[9] ?? primary[0]
    if (!palmCenter) {
      requestId = requestAnimationFrame(detectHands)
      return
    }

    let rawX = (1 - palmCenter.x) * window.innerWidth
    let rawY = palmCenter.y * window.innerHeight

    let deltaX = rawX - lastCursor.x
    let deltaY = rawY - lastCursor.y
    let movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const MAX_FRAME_MOVE = 80

    if (movement > MAX_FRAME_MOVE) {
      const ratio = MAX_FRAME_MOVE / movement
      rawX = lastCursor.x + deltaX * ratio
      rawY = lastCursor.y + deltaY * ratio
      deltaX = rawX - lastCursor.x
      deltaY = rawY - lastCursor.y
      movement = MAX_FRAME_MOVE
    }

    let lerp = 0.05
    if (movement < 3) {
      lerp = 0.02
    } else if (movement < 10) {
      lerp = 0.08
    } else {
      const speedRatio = (movement - 10) / 150
      lerp = Math.min(0.15 + speedRatio * 0.6, 0.7)
    }

    const smoothX = lastCursor.x + (rawX - lastCursor.x) * lerp
    const smoothY = lastCursor.y + (rawY - lastCursor.y) * lerp

    lastCursor = { x: smoothX, y: smoothY }
    cursorPosition.value = { x: smoothX, y: smoothY }

    const pinchDist = readPinchDistance(primary)
    let shouldPinch = pinchState

    if (pinchState) {
      if (pinchDist > 0.07) shouldPinch = false
    } else if (pinchDist < 0.04) {
      shouldPinch = true
    }

    if (shouldPinch !== pinchState) {
      pinchState = shouldPinch
      isPinching.value = shouldPinch
    }

    requestId = requestAnimationFrame(detectHands)
  }

  async function startGesture() {
    error.value = null

    try {
      isActive.value = true
      await ensureLandmarker()

      if (!videoRef.value) {
        throw new Error('Camera video element is not ready')
      }

      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.value.srcObject = stream
      await videoRef.value.play()

      isReady.value = true
      document.body.classList.add('camera-active')

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      lastCursor = { x: centerX, y: centerY }
      cursorPosition.value = { x: centerX, y: centerY }

      stopLoop()
      requestId = requestAnimationFrame(detectHands)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize hand gesture'
      stopGesture()
    }
  }

  function toggleGesture() {
    if (isActive.value) {
      stopGesture()
      return
    }

    void startGesture()
  }

  onBeforeUnmount(() => {
    stopGesture()
  })

  return {
    cursorPosition,
    isPinching,
    isReady,
    error,
    isActive,
    toggleGesture,
    hands,
    isTwoHandPinch,
    twoHandDistance,
    zoomDelta,
    videoRef,
    stopGesture
  }
}
