<script setup lang="ts">
import HandGestureGuide from '@/components/page/works/HandGestureGuide.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useHandGesture } from '@/hooks/useHandGesture'
import { useHead } from '@unhead/vue'
import { ChevronLeft, ChevronRight, Hand, Home, Search, X, ZapOff } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Work {
  id: number
  title: string
  category: string
  description: string
  technologies: string[]
  image: string
  x: string
  y: string
  rotate: number
}

interface StringConnection {
  from: number
  to: number
}

interface PinPosition {
  x: number
  y: number
}

interface DragState {
  startX: number
  startY: number
  originX: number
  originY: number
}

interface Point {
  x: number
  y: number
}

const router = useRouter()

useHead({
  title: 'Selected Works — Ricki Friadi',
  meta: [
    {
      name: 'description',
      content:
        'Interactive investigation board showcasing selected work by Ricki Friadi — explore with hand gestures or mouse.'
    },
    { property: 'og:title', content: 'Selected Works — Ricki Friadi' },
    {
      property: 'og:description',
      content: 'Interactive portfolio board with selected projects by Ricki Friadi.'
    },
    { property: 'og:url', content: 'https://rickifriadi.dev/works' },
    { name: 'twitter:title', content: 'Selected Works — Ricki Friadi' },
    { name: 'twitter:description', content: 'Interactive investigation board of selected work.' }
  ],
  link: [{ rel: 'canonical', href: 'https://rickifriadi.dev/works' }]
})

function toWebp(src: string) {
  return src.replace(/\.png$/, '.webp')
}

const works: Work[] = [
  {
    id: 1,
    title: 'ADACareer Job Platform',
    category: 'SaaS Application',
    description:
      'A comprehensive job search platform helping users find their first job in 7 days. Features CV upload, automated matching, and career guidance tools.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    image: '/works/works-1.png',
    x: '15%',
    y: '15%',
    rotate: -3
  },
  {
    id: 2,
    title: 'Jari Pemoeda Advocacy',
    category: 'Non-Profit Platform',
    description:
      'Digital advocacy platform to map, analyze, and advocate for social issues with a centralized data bank.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    image: '/works/works-2.png',
    x: '40%',
    y: '10%',
    rotate: 2
  },
  {
    id: 3,
    title: 'Manjo Catering',
    category: 'E-Commerce',
    description:
      'Modern landing page and ordering system with menu gallery, social proof, and seamless ordering flow.',
    technologies: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    image: '/works/works-3.png',
    x: '65%',
    y: '18%',
    rotate: -2
  },
  {
    id: 4,
    title: 'FRI Certification Portal',
    category: 'Academic System',
    description:
      'Official digital platform for faculty certification and training approvals with streamlined workflows.',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap'],
    image: '/works/works-4.png',
    x: '20%',
    y: '40%',
    rotate: 4
  },
  {
    id: 5,
    title: 'Ergonomics Research Lab',
    category: 'Research Portal',
    description:
      'Interactive research website showcasing lab activities, members, and experimental outputs.',
    technologies: ['Three.js', 'React', 'GSAP', 'WebGL'],
    image: '/works/works-5.png',
    x: '50%',
    y: '35%',
    rotate: -4
  },
  {
    id: 6,
    title: 'Local Food Delivery',
    category: 'Mobile App / PWA',
    description:
      'Hyperlocal delivery app with real-time tracking, menu browsing, and location-based merchant discovery.',
    technologies: ['React', 'Leaflet', 'Firebase', 'PWA'],
    image: '/works/works-6.png',
    x: '75%',
    y: '45%',
    rotate: 3
  },
  {
    id: 7,
    title: 'TRICH Barberspace',
    category: 'Booking System',
    description:
      'Premium booking platform for a modern barbershop with schedule visibility and queue management.',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Radix UI'],
    image: '/works/works-7.png',
    x: '30%',
    y: '65%',
    rotate: -3
  },
  {
    id: 8,
    title: 'MINERVA Digital Twin',
    category: 'Industrial IoT',
    description:
      'Real-time digital twin dashboard for monitoring furnace data, energy usage, and machine status.',
    technologies: ['React', 'Socket.io', 'Chart.js', 'IoT'],
    image: '/works/works-8.png',
    x: '55%',
    y: '60%',
    rotate: 2
  },
  {
    id: 9,
    title: '3D Logistics Simulation',
    category: 'Simulation',
    description:
      '3D simulation for factory logistics and AGV movement to optimize industrial layout and operations.',
    technologies: ['Three.js', 'Blender', 'Physics Engine', 'TypeScript'],
    image: '/works/works-9.png',
    x: '80%',
    y: '70%',
    rotate: -5
  }
]

const stringConnections: StringConnection[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 0, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 2, to: 5 },
  { from: 5, to: 6 },
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 8 },
  { from: 5, to: 8 }
]

const pinColors = ['#1c1c1c', '#5e5e5a', '#a3a39e', '#3a3a37', '#d1d1ca', '#777773', '#b6b6b0']
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5

const viewportRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const viewportWidth = ref(1440)
const viewportHeight = ref(900)
const zoomLevel = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const isHandDragging = ref(false)
const dragState = ref<DragState | null>(null)
const mouseHoveredCardIndex = ref<number | null>(null)
const handHoveredCardIndex = ref<number | null>(null)
const currentWorkIndex = ref(0)
const selectedWorkIndex = ref<number | null>(null)
const isModalOpen = ref(false)
const headerText = ref('Tap Here To Go Back')
const showGuide = ref(false)

const {
  cursorPosition,
  isPinching,
  isReady,
  error,
  isActive,
  toggleGesture,
  hands,
  isTwoHandPinch,
  zoomDelta,
  videoRef,
  stopGesture
} = useHandGesture()

let headerTimer: ReturnType<typeof setTimeout> | null = null

const canvasWidth = computed(() => viewportWidth.value * 2)
const canvasHeight = computed(() => viewportHeight.value * 2)
const cardWidth = computed(() =>
  viewportWidth.value >= 1024 ? 256 : viewportWidth.value >= 768 ? 236 : 196
)

const hoveredCardIndex = computed(() => handHoveredCardIndex.value ?? mouseHoveredCardIndex.value)
const selectedWork = computed(() =>
  selectedWorkIndex.value !== null ? (works[selectedWorkIndex.value] ?? null) : null
)

const isInteracting = computed(() => isDragging.value || isHandDragging.value)

const pinPositions = computed<PinPosition[]>(() =>
  works.map((work) => {
    const xPercent = Number.parseFloat(work.x)
    const yPercent = Number.parseFloat(work.y)

    const left = (xPercent / 100) * canvasWidth.value
    const top = (yPercent / 100) * canvasHeight.value

    return {
      x: left + cardWidth.value / 2,
      y: top - 2
    }
  })
)

const canvasStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${zoomLevel.value})`,
  transition:
    isDragging.value || isHandDragging.value
      ? 'none'
      : 'transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1)'
}))

function clampZoom(value: number) {
  return Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM)
}

function updateViewportMetrics() {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

function setCardRef(el: Element | null, index: number) {
  cardRefs.value[index] = (el as HTMLElement | null) ?? null
}

function findCardUnderCursor(point: Point) {
  for (let i = 0; i < cardRefs.value.length; i += 1) {
    const card = cardRefs.value[i]
    if (!card) continue

    const rect = card.getBoundingClientRect()
    const insideX = point.x >= rect.left && point.x <= rect.right
    const insideY = point.y >= rect.top && point.y <= rect.bottom

    if (insideX && insideY) {
      return i
    }
  }

  return null
}

function getStringPath(connection: StringConnection) {
  const from = pinPositions.value[connection.from]
  const to = pinPositions.value[connection.to]
  if (!from || !to) return ''

  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const dist = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2)
  const sag = Math.min(dist * 0.15, 40)

  return `M ${from.x} ${from.y} Q ${midX} ${midY + sag} ${to.x} ${to.y}`
}

function openWork(index: number) {
  selectedWorkIndex.value = index
  currentWorkIndex.value = index
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function onModalOpenChange(open: boolean) {
  if (!open) {
    closeModal()
  }
}

function scrollToWork(index: number) {
  const pin = pinPositions.value[index]
  if (!pin) return

  offsetX.value = canvasWidth.value / 2 - pin.x
  offsetY.value = canvasHeight.value / 2 - pin.y - 120
}

function goToNextWork() {
  const nextIndex = (currentWorkIndex.value + 1) % works.length
  currentWorkIndex.value = nextIndex

  if (isModalOpen.value) {
    selectedWorkIndex.value = nextIndex
  } else {
    scrollToWork(nextIndex)
  }
}

function goToPrevWork() {
  const prevIndex = (currentWorkIndex.value - 1 + works.length) % works.length
  currentWorkIndex.value = prevIndex

  if (isModalOpen.value) {
    selectedWorkIndex.value = prevIndex
  } else {
    scrollToWork(prevIndex)
  }
}

function zoomIn() {
  zoomLevel.value = clampZoom(zoomLevel.value + 0.2)
}

function zoomOut() {
  zoomLevel.value = clampZoom(zoomLevel.value - 0.2)
}

function resetView() {
  zoomLevel.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

function onWheel(event: WheelEvent) {
  const delta = event.deltaY > 0 ? -0.08 : 0.08
  zoomLevel.value = clampZoom(zoomLevel.value + delta)
}

function onCanvasPointerDown(event: PointerEvent) {
  if (isModalOpen.value) return

  const target = event.target as HTMLElement | null
  if (target?.closest('[data-work-card]')) return

  isDragging.value = true
  dragState.value = {
    startX: event.clientX,
    startY: event.clientY,
    originX: offsetX.value,
    originY: offsetY.value
  }

  viewportRef.value?.setPointerCapture(event.pointerId)
}

function onCanvasPointerMove(event: PointerEvent) {
  if (!isDragging.value || !dragState.value) return

  offsetX.value = dragState.value.originX + (event.clientX - dragState.value.startX)
  offsetY.value = dragState.value.originY + (event.clientY - dragState.value.startY)
}

function onCanvasPointerUp(event: PointerEvent) {
  if (!isDragging.value) return

  isDragging.value = false
  dragState.value = null

  if (viewportRef.value?.hasPointerCapture(event.pointerId)) {
    viewportRef.value.releasePointerCapture(event.pointerId)
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
    return
  }

  if (!isModalOpen.value) return

  if (event.key === 'ArrowRight') {
    goToNextWork()
  }

  if (event.key === 'ArrowLeft') {
    goToPrevWork()
  }
}

const wasPinchModal = ref(false)
const lastHandPoint = ref<Point>({ x: 0, y: 0 })
const wasPinchDragging = ref(false)

watch(isActive, (active, previous) => {
  if (active && !previous) {
    showGuide.value = true
  }

  if (!active) {
    handHoveredCardIndex.value = null
    isHandDragging.value = false
    wasPinchModal.value = false
    wasPinchDragging.value = false
  }
})

watch([isTwoHandPinch, zoomDelta], ([twoHand, delta]) => {
  if (!twoHand || delta === 0) return
  zoomLevel.value = clampZoom(zoomLevel.value + delta * 0.5)
})

watch(cursorPosition, (point) => {
  if (!isActive.value || !isReady.value) {
    handHoveredCardIndex.value = null
    return
  }

  handHoveredCardIndex.value = findCardUnderCursor(point)
})

watch(
  [isPinching, isActive, isReady, isTwoHandPinch, handHoveredCardIndex],
  ([pinch, active, ready, twoHand, hovered]) => {
    if (!active || !ready || twoHand) {
      wasPinchModal.value = pinch
      return
    }

    if (pinch && !wasPinchModal.value && hovered !== null) {
      openWork(hovered)
    }

    if (!pinch && wasPinchModal.value && isModalOpen.value) {
      closeModal()
    }

    wasPinchModal.value = pinch
  }
)

watch(cursorPosition, (point) => {
  if (!isActive.value || !isReady.value || isModalOpen.value || isTwoHandPinch.value) {
    isHandDragging.value = false
    wasPinchDragging.value = false
    lastHandPoint.value = point
    return
  }

  const isOverCard = handHoveredCardIndex.value !== null

  if (isPinching.value && !isOverCard) {
    if (!wasPinchDragging.value) {
      wasPinchDragging.value = true
      lastHandPoint.value = point
      return
    }

    const dx = point.x - lastHandPoint.value.x
    const dy = point.y - lastHandPoint.value.y

    if (Math.abs(dx) > 100 || Math.abs(dy) > 100) {
      lastHandPoint.value = point
      return
    }

    offsetX.value += dx * 1.5
    offsetY.value += dy * 1.5
    isHandDragging.value = true
  } else {
    isHandDragging.value = false
    wasPinchDragging.value = false
  }

  lastHandPoint.value = point
})

onMounted(() => {
  updateViewportMetrics()
  headerTimer = setTimeout(() => {
    headerText.value = 'Selected Works'
  }, 2500)

  window.addEventListener('resize', updateViewportMetrics)
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMetrics)
  window.removeEventListener('keydown', onKeyDown)

  if (headerTimer) {
    clearTimeout(headerTimer)
  }

  stopGesture()
})
</script>

<template>
  <section class="works-page bg-background relative h-[100dvh] w-full overflow-hidden">
    <h1 class="sr-only">Selected Works Investigation Board</h1>
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="camera-feed pointer-events-none fixed inset-0 z-[2] h-[100dvh] w-[100dvw] object-cover transition-opacity duration-700"
      :class="isActive ? 'opacity-15' : 'opacity-0'"
    />

    <div
      class="pointer-events-none absolute inset-0 z-0 hidden opacity-30 md:block"
      style="
        background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E');
      "
    />

    <div class="pointer-events-none absolute top-0 left-1/2 z-[5] hidden -translate-x-1/2 md:block">
      <div
        class="lamp-mount absolute top-0 left-1/2 h-8 w-8 -translate-x-1/2 rounded-b-md bg-[#232323]"
      />
      <div class="lamp-wire absolute top-0 left-1/2 h-40 w-[4px] -translate-x-1/2" />
      <div class="lamp-head absolute top-[140px] left-1/2 -translate-x-1/2">
        <div class="h-8 w-24 rounded-[999px] bg-[#111111] shadow-xl" />
        <div class="mx-auto h-4 w-5 rounded-b-md bg-[#585858]" />
      </div>
      <div class="lamp-cone absolute top-[155px] left-1/2 h-[82vh] w-[780px] -translate-x-1/2" />
    </div>

    <div class="pointer-events-none absolute inset-0 z-[1] hidden md:block">
      <div
        class="h-full w-full"
        style="
          background: radial-gradient(
            ellipse 50% 80% at 50% 28%,
            transparent 0%,
            rgba(24, 24, 24, 0.1) 40%,
            rgba(24, 24, 24, 0.28) 70%,
            rgba(24, 24, 24, 0.45) 100%
          );
        "
      />
    </div>

    <div
      class="pointer-events-none absolute top-0 right-0 left-0 z-[1] h-24"
      style="background: linear-gradient(180deg, rgba(17, 17, 17, 0.26) 0%, transparent 100%)"
    />

    <div class="pointer-events-none absolute top-0 right-0 left-0 z-50 flex justify-center">
      <Button
        as="button"
        variant="unstyled"
        class="island pointer-events-auto -mt-24 flex min-w-[220px] cursor-pointer items-center justify-center rounded-b-[2rem] bg-[#121212] px-6 pt-24 pb-4 text-[#f4f3ee] shadow-2xl transition-colors transition-transform duration-300 hover:bg-[#252525] md:-mt-28 md:min-w-[300px] md:rounded-b-[2.5rem] md:px-12 md:pt-32 md:pb-6"
        :class="{ 'translate-y-[-220px] md:translate-y-[-300px]': isInteracting }"
        @click="router.push('/')"
      >
        <Home class="mr-2 h-4 w-4 md:mr-3 md:h-5 md:w-5" />
        <span class="text-sm font-bold tracking-[0.2em] uppercase md:text-xl md:tracking-widest">{{
          headerText
        }}</span>
      </Button>
    </div>

    <div
      ref="viewportRef"
      class="absolute inset-0 z-0 h-full w-full touch-none overflow-hidden"
      :class="[isDragging ? 'cursor-grabbing' : 'cursor-grab']"
      @pointerdown="onCanvasPointerDown"
      @pointermove="onCanvasPointerMove"
      @pointerup="onCanvasPointerUp"
      @pointercancel="onCanvasPointerUp"
      @pointerleave="onCanvasPointerUp"
      @wheel.prevent="onWheel"
    >
      <h2 class="sr-only">Interactive Case Board</h2>
      <div
        class="canvas-root relative -mt-[50vh] -ml-[50vw] h-[200vh] w-[200vw] origin-center"
        :style="canvasStyle"
      >
        <svg class="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <path
            v-for="(connection, index) in stringConnections"
            :key="`connection-${connection.from}-${connection.to}`"
            :d="getStringPath(connection)"
            class="string-line"
            :style="{ animationDelay: `${index * 0.1}s` }"
          />
        </svg>

        <button
          v-for="(work, index) in works"
          :key="work.id"
          :ref="(el) => setCardRef(el, index)"
          type="button"
          data-work-card
          :aria-label="`Open details for ${work.title}`"
          class="work-card absolute w-56 rounded-lg bg-[#e7e6e1] p-2 text-left shadow-lg transition-shadow transition-transform duration-200 md:w-64"
          :class="
            hoveredCardIndex === index
              ? 'z-50 scale-[1.05] shadow-2xl ring-2 ring-[#111111]'
              : 'z-10 hover:z-50 hover:scale-[1.05] hover:shadow-2xl'
          "
          :style="{ left: work.x, top: work.y, transform: `rotate(${work.rotate}deg)` }"
          @mouseenter="mouseHoveredCardIndex = index"
          @mouseleave="mouseHoveredCardIndex = null"
          @pointerdown.stop
          @click="openWork(index)"
        >
          <div class="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
            <div
              class="h-5 w-5 rounded-full shadow-lg"
              :style="{
                backgroundColor: pinColors[index % pinColors.length],
                boxShadow:
                  '0 2px 8px rgba(0,0,0,0.35), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)'
              }"
            />
            <div
              class="absolute left-1/2 h-3 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gray-400 to-gray-600"
              style="top: 14px"
            />
          </div>

          <div
            v-if="hoveredCardIndex === index"
            class="absolute -top-8 left-1/2 z-30 -translate-x-1/2 rounded bg-[#111111] px-2 py-1 text-xs whitespace-nowrap text-[#f4f3ee]"
          >
            Click or Pinch to view
          </div>

          <div
            class="pointer-events-none relative mb-2 h-32 w-full overflow-hidden rounded-md md:h-40"
          >
            <picture>
              <source :srcset="toWebp(work.image)" type="image/webp" />
              <img
                :src="work.image"
                :alt="work.title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
          <h3 class="text-sm leading-tight font-bold text-[#141414] select-none md:text-base">
            {{ work.title }}
          </h3>
          <p class="text-xs text-[#656560] select-none md:text-sm">{{ work.category }}</p>

          <div
            class="pointer-events-none absolute -top-1 -left-1 h-4 w-8 rotate-[-15deg] bg-[#d7d6d0]/80 shadow-sm"
          />
          <div
            class="pointer-events-none absolute -top-1 -right-1 h-4 w-8 rotate-[15deg] bg-[#d7d6d0]/80 shadow-sm"
          />
        </button>
      </div>
    </div>

    <div
      v-if="isActive && isReady"
      class="pointer-events-none fixed z-[190]"
      :style="{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: 'translate(-50%, -50%)'
      }"
    >
      <div class="hand-cursor" :class="{ pinching: isPinching }">
        <div class="cursor-dot" />
        <div class="cursor-ring" />
      </div>
      <div
        v-if="isTwoHandPinch && hands.length === 2"
        class="mt-1 -translate-x-1/2 rounded bg-[#111111]/85 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#f4f3ee]"
      >
        ZOOM
      </div>
    </div>

    <div
      class="absolute bottom-2 left-1/2 z-40 flex w-[calc(100%-1rem)] max-w-[96vw] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#111111]/20 bg-[#f4f3ee]/84 px-2 py-2 shadow-xl backdrop-blur-md md:bottom-6 md:w-auto md:max-w-[95vw] md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none"
      style="padding-bottom: max(0.5rem, env(safe-area-inset-bottom))"
    >
      <Button
        as="button"
        variant="unstyled"
        class="gesture-toggle"
        :class="isActive ? 'gesture-toggle-on' : 'gesture-toggle-off'"
        :title="isActive ? 'Disable hand gestures' : 'Enable hand gestures'"
        @click="toggleGesture"
      >
        <template v-if="isActive">
          <Hand class="h-5 w-5" />
          <span class="text-xs font-medium md:text-sm">Hand: ON</span>
          <span v-if="!isReady" class="loading-dot" />
        </template>
        <template v-else>
          <ZapOff class="h-5 w-5" />
          <span class="text-xs font-medium md:text-sm">Start Hand Control</span>
        </template>
      </Button>

      <div class="dock-group">
        <Button
          as="button"
          variant="unstyled"
          size="icon"
          class="dock-icon"
          aria-label="Previous work"
          @click="goToPrevWork"
        >
          <ChevronLeft class="h-5 w-5" />
        </Button>
        <Button
          as="button"
          variant="unstyled"
          size="icon"
          class="dock-icon"
          aria-label="Next work"
          @click="goToNextWork"
        >
          <ChevronRight class="h-5 w-5" />
        </Button>
      </div>

      <div class="dock-group">
        <Button
          as="button"
          variant="unstyled"
          size="icon"
          class="dock-icon"
          aria-label="Zoom out"
          @click="zoomOut"
        >
          <Search class="h-4 w-4" />
          <span class="ml-0.5 text-[10px]">-</span>
        </Button>
        <span class="w-12 text-center font-mono text-xs font-medium text-[#5b5b56] select-none">
          {{ Math.round(zoomLevel * 100) }}%
        </span>
        <Button
          as="button"
          variant="unstyled"
          size="icon"
          class="dock-icon"
          aria-label="Zoom in"
          @click="zoomIn"
        >
          <Search class="h-4 w-4" />
          <span class="ml-0.5 text-[10px]">+</span>
        </Button>
      </div>

      <Button as="button" variant="unstyled" class="dock-reset" @click="resetView">Reset</Button>
    </div>

    <div
      v-if="error"
      class="absolute right-4 bottom-20 z-50 max-w-xs rounded-lg bg-[#111111]/92 px-3 py-2 text-xs text-[#f4f3ee] shadow-lg backdrop-blur-sm"
    >
      {{ error }}
    </div>

    <Dialog :open="isModalOpen" @update:open="onModalOpenChange">
      <DialogContent class="gap-0 overflow-hidden p-0">
        <template v-if="selectedWork">
          <DialogClose as-child>
            <Button
              as="button"
              variant="unstyled"
              size="icon"
              class="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-[#111111]/85 p-2 text-[#f4f3ee] transition-colors hover:bg-[#252525]"
              @click="closeModal"
            >
              <X class="h-5 w-5" />
            </Button>
          </DialogClose>

          <div class="pointer-events-none relative h-56 w-full md:h-80">
            <picture>
              <source :srcset="toWebp(selectedWork.image)" type="image/webp" />
              <img
                :src="selectedWork.image"
                :alt="selectedWork.title"
                class="h-full w-full object-cover"
              />
            </picture>
            <div class="absolute inset-0 bg-gradient-to-t from-[#111111]/55 to-transparent" />
            <div class="absolute bottom-4 left-4">
              <span
                class="rounded-full bg-[#f4f3ee]/92 px-3 py-1 text-sm font-medium text-[#151515]"
              >
                {{ selectedWork.category }}
              </span>
            </div>
          </div>

          <DialogHeader class="max-h-[48dvh] overflow-y-auto md:max-h-none md:overflow-visible">
            <DialogTitle>{{ selectedWork.title }}</DialogTitle>
            <DialogDescription class="mt-2">
              {{ selectedWork.description }}
            </DialogDescription>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tech in selectedWork.technologies"
                :key="tech"
                class="rounded-full bg-[#f4f3ee] px-3 py-1 text-sm text-[#151515]"
              >
                {{ tech }}
              </span>
            </div>
          </DialogHeader>

          <DialogFooter class="border-border border-t">
            <Button
              variant="outline"
              class="border-border text-foreground hover:bg-secondary inline-flex items-center gap-2 rounded-full"
              @click="goToPrevWork"
            >
              <ChevronLeft class="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              class="border-border text-foreground hover:bg-secondary inline-flex items-center gap-2 rounded-full"
              @click="goToNextWork"
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>
          </DialogFooter>
        </template>
      </DialogContent>
    </Dialog>

    <HandGestureGuide :is-open="showGuide" @close="showGuide = false" />
  </section>
</template>

<style scoped>
.camera-feed {
  transform: scaleX(-1);
  filter: grayscale(100%) contrast(110%) blur(4px);
}

.lamp-wire {
  background: linear-gradient(180deg, #7d7d77 0%, #1c1c1c 100%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.lamp-cone {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(170, 170, 170, 0.07) 30%,
    rgba(110, 110, 110, 0.03) 60%,
    transparent 100%
  );
  clip-path: polygon(42% 0%, 58% 0%, 90% 100%, 10% 100%);
}

.string-line {
  fill: none;
  stroke: #53534f;
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18));
  animation: draw-wire 1.5s ease-in-out forwards;
}

.hand-cursor {
  position: relative;
  width: 28px;
  height: 28px;
}

.cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #f4f3ee;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.35);
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 2px solid rgba(244, 243, 238, 0.85);
  transform: translate(-50%, -50%);
  transition:
    width 0.2s ease,
    height 0.2s ease,
    border-color 0.2s ease;
}

.hand-cursor.pinching .cursor-ring {
  width: 18px;
  height: 18px;
  border-color: rgba(22, 22, 22, 0.95);
}

.hand-cursor.pinching .cursor-dot {
  background: #161616;
  box-shadow: 0 0 14px rgba(22, 22, 22, 0.4);
}

.gesture-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.7rem 1rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.gesture-toggle:hover {
  transform: translateY(-1px);
}

.gesture-toggle-on {
  border-color: rgb(17 17 17 / 0.75);
  background: rgb(17 17 17 / 0.92);
  color: #f4f3ee;
}

.gesture-toggle-off {
  border-color: rgb(207 207 201 / 0.85);
  background: rgb(244 243 238 / 0.92);
  color: rgb(17 17 17);
}

.loading-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: #d8d7d2;
  box-shadow: 0 0 0 rgba(216, 215, 210, 0.7);
  animation: pulse-dot 1.1s infinite;
}

.dock-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid rgb(207 207 201 / 0.9);
  background: rgba(244, 243, 238, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 999px;
  padding: 0.3rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
}

.dock-icon {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(17 17 17);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.dock-icon:hover {
  background: rgba(231, 230, 225, 0.95);
}

.dock-reset {
  height: 2.25rem;
  border-radius: 999px;
  background: rgb(17 17 17);
  color: rgb(244 243 238);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 0.9rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.dock-reset:hover {
  background: rgb(37 37 37);
}

@media (min-width: 768px) {
  .dock-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .dock-reset {
    height: 3rem;
    padding: 0 1.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 767px) {
  .gesture-toggle {
    padding: 0.6rem 0.85rem;
  }
}

@keyframes draw-wire {
  from {
    opacity: 0;
    stroke-dashoffset: 220;
  }
  to {
    opacity: 0.7;
    stroke-dashoffset: 0;
  }
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(216, 215, 210, 0.7);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(216, 215, 210, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .string-line,
  .loading-dot {
    animation: none;
  }
}
</style>
