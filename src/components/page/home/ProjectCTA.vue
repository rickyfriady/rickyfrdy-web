<script setup lang="ts">
import MagnifyingGlass from '@/components/page/home/MagnifyingGlass.vue'
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface WorkItem {
  id: number
  title: string
  category: string
  image: string
}

interface BoardCard {
  workIdx: number
  x: number
  y: number
  rotate: number
}

const router = useRouter()

const works: WorkItem[] = [
  {
    id: 1,
    title: 'ADACareer Job Platform',
    category: 'SaaS Application',
    image: '/works/works-1.png'
  },
  {
    id: 2,
    title: 'Jari Pemoeda Advocacy',
    category: 'Non-Profit Platform',
    image: '/works/works-2.png'
  },
  {
    id: 3,
    title: 'Manjo Catering',
    category: 'E-Commerce',
    image: '/works/works-3.png'
  },
  {
    id: 4,
    title: 'FRI Certification Portal',
    category: 'Academic System',
    image: '/works/works-4.png'
  },
  {
    id: 5,
    title: 'Ergonomics Research Lab',
    category: 'Research Portal',
    image: '/works/works-5.png'
  },
  {
    id: 6,
    title: 'Local Food Delivery',
    category: 'Mobile App / PWA',
    image: '/works/works-6.png'
  }
]

const strings: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 4],
  [0, 3],
  [3, 5],
  [4, 5]
]

const boardCards: BoardCard[] = [
  { workIdx: 0, x: 8, y: 10, rotate: -4 },
  { workIdx: 1, x: 38, y: 6, rotate: 3 },
  { workIdx: 2, x: 68, y: 12, rotate: -2 },
  { workIdx: 3, x: 12, y: 52, rotate: 5 },
  { workIdx: 4, x: 45, y: 48, rotate: -3 },
  { workIdx: 5, x: 72, y: 55, rotate: 4 }
]

const stickyNotes = [
  { text: 'TOP SECRET', x: 55, y: 2, rotate: 8, color: '#e7e6e1' },
  { text: 'SUSPECT?', x: 2, y: 38, rotate: -12, color: '#f4f3ee' },
  { text: 'CONNECTED!', x: 82, y: 40, rotate: 6, color: '#d4d4ce' }
]

function getPinCenter(card: BoardCard) {
  return { x: card.x + 11, y: card.y + 2 }
}

function getPath(fromIdx: number, toIdx: number) {
  const from = boardCards[fromIdx]
  const to = boardCards[toIdx]
  if (!from || !to) return ''

  const p1 = getPinCenter(from)
  const p2 = getPinCenter(to)
  const midX = (p1.x + p2.x) / 2
  const midY = (p1.y + p2.y) / 2
  const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  const sag = Math.min(dist * 0.15, 8)

  return `M ${p1.x} ${p1.y} Q ${midX} ${midY + sag} ${p2.x} ${p2.y}`
}

function enterBoard() {
  router.push('/works')
}
</script>

<template>
  <section
    class="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 md:py-24"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
      class="mb-10 px-4 text-center md:mb-14"
    >
      <p class="eyebrow mb-4">Case Files</p>
      <h2 class="title-display text-foreground text-5xl tracking-tight md:text-7xl">
        The Investigation Board
      </h2>
      <p class="text-muted mx-auto mt-4 max-w-lg text-base md:text-lg">
        Every project tells a story. Step inside and connect the dots.
      </p>
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :visible="{ opacity: 1, scale: 1 }"
      :duration="800"
      class="group relative mx-auto w-[90vw] max-w-4xl cursor-pointer"
      role="button"
      tabindex="0"
      @click="enterBoard"
      @keydown.enter="enterBoard"
      @keydown.space.prevent="enterBoard"
    >
      <div
        class="absolute -inset-3 z-0 rounded-xl md:-inset-5"
        style="
          background: linear-gradient(
            135deg,
            #1a1a1a 0%,
            #383838 20%,
            #101010 38%,
            #474747 58%,
            #242424 78%,
            #656565 100%
          );
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.18),
            inset 0 -2px 4px rgba(0, 0, 0, 0.45),
            0 10px 32px rgba(0, 0, 0, 0.4);
        "
      />

      <div
        class="relative z-10 overflow-hidden rounded-lg"
        style="
          background-color: #f4f3ee;
          background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E');
          background-blend-mode: soft-light;
          aspect-ratio: 16 / 10;
        "
      >
        <div
          class="pointer-events-none absolute inset-0 z-50 rounded-lg shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)]"
        />

        <svg
          class="pointer-events-none absolute inset-0 z-20 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            v-for="([fromIdx, toIdx], i) in strings"
            :key="`string-${i}`"
            class="string-wire"
            :style="{ animationDelay: `${0.5 + i * 0.15}s` }"
            :d="getPath(fromIdx, toIdx)"
            stroke="#4d4d49"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
          />
        </svg>

        <article
          v-for="(card, i) in boardCards"
          :key="works[card.workIdx]?.id ?? i"
          class="case-card absolute z-10 w-[22%]"
          :style="{
            left: `${card.x}%`,
            top: `${card.y}%`,
            '--card-delay': `${0.2 + i * 0.1}s`
          }"
        >
          <div class="group-hover:shadow-xl" :style="{ transform: `rotate(${card.rotate}deg)` }">
            <div class="absolute -top-2 left-1/2 z-30 -translate-x-1/2">
              <div
                class="h-3.5 w-3.5 rounded-full shadow-md md:h-4 md:w-4"
                :style="{
                  backgroundColor: [
                    '#242424',
                    '#5f5f5b',
                    '#b9b9b2',
                    '#767671',
                    '#d4d4ce',
                    '#3d3d3a'
                  ][i % 6],
                  boxShadow:
                    '0 2px 6px rgba(0,0,0,0.4), inset 0 -1px 3px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)'
                }"
              />
              <div
                class="absolute left-1/2 h-2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gray-400 to-gray-600"
                style="top: 10px"
              />
            </div>

            <div
              class="pointer-events-none absolute -top-0.5 -left-0.5 z-20 h-3 w-6 rotate-[-15deg] bg-[#e7e6e1]/85 shadow-sm"
            />
            <div
              class="pointer-events-none absolute -top-0.5 -right-0.5 z-20 h-3 w-6 rotate-[15deg] bg-[#e7e6e1]/85 shadow-sm"
            />

            <div class="rounded bg-[#e7e6e1] p-1.5 shadow-lg transition-shadow md:p-2">
              <div class="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <img
                  :src="works[card.workIdx]?.image"
                  :alt="works[card.workIdx]?.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="mt-1 md:mt-1.5">
                <p class="truncate text-[6px] leading-tight font-bold text-[#151515] md:text-[8px]">
                  {{ works[card.workIdx]?.title }}
                </p>
                <p class="truncate text-[5px] text-[#666660] md:text-[7px]">
                  {{ works[card.workIdx]?.category }}
                </p>
              </div>
            </div>

            <div
              class="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 rounded bg-[#f4f3ee]/90 px-1.5 py-0.5 whitespace-nowrap shadow-sm md:-bottom-4 md:px-2"
            >
              <span class="font-mono text-[5px] font-bold text-[#202020] uppercase md:text-[7px]">
                Case #{{ i + 1 }}
              </span>
            </div>
          </div>
        </article>

        <div
          v-for="(note, i) in stickyNotes"
          :key="`note-${i}`"
          class="sticky-note absolute z-30 hidden md:block"
          :style="{
            left: `${note.x}%`,
            top: `${note.y}%`,
            transform: `rotate(${note.rotate}deg)`,
            backgroundColor: note.color,
            animationDelay: `${1 + i * 0.2}s`
          }"
        >
          <span
            class="px-2.5 py-1.5 font-mono text-[7px] font-bold text-[#151515] uppercase md:text-[9px]"
          >
            {{ note.text }}
          </span>
        </div>

        <svg class="pointer-events-none absolute inset-0 z-[15] h-full w-full opacity-40">
          <circle
            cx="30%"
            cy="35%"
            r="8%"
            fill="none"
            stroke="#7c7c76"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <circle
            cx="60%"
            cy="65%"
            r="6%"
            fill="none"
            stroke="#7c7c76"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
        </svg>

        <div class="magnifier-scan pointer-events-none absolute z-30 hidden md:block">
          <MagnifyingGlass :size="90" />
        </div>

        <div
          class="absolute inset-0 z-40 flex items-center justify-center bg-[#111111]/0 transition-all duration-500 group-hover:bg-[#111111]/22"
        >
          <div
            class="flex items-center gap-2 rounded-full bg-[#111111]/90 px-6 py-3 text-sm font-bold text-[#f4f3ee] opacity-0 shadow-2xl backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:px-8 md:py-4 md:text-base"
          >
            Enter Investigation Room
            <ArrowRight
              class="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5"
            />
          </div>
        </div>
      </div>
    </div>

    <p class="text-muted mt-8 font-mono text-xs tracking-[0.2em] uppercase">
      {{ works.length }} Active Cases • Click to Investigate
    </p>
  </section>
</template>

<style scoped>
.string-wire {
  opacity: 0;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  animation: wire-draw 1.2s ease-in-out forwards;
}

.case-card {
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  animation-delay: var(--card-delay);
}

.sticky-note {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
  opacity: 0;
  animation: note-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.1) forwards;
}

.magnifier-scan {
  left: 0;
  top: 0;
  animation: magnifier-scan 12s ease-in-out infinite;
  will-change: transform;
}

@keyframes wire-draw {
  from {
    opacity: 0;
    stroke-dashoffset: 220;
  }
  to {
    opacity: 0.7;
    stroke-dashoffset: 0;
  }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes note-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes magnifier-scan {
  0% {
    transform: translate(15%, 20%) rotate(15deg);
  }
  25% {
    transform: translate(55%, 15%) rotate(-10deg);
  }
  50% {
    transform: translate(70%, 50%) rotate(20deg);
  }
  75% {
    transform: translate(35%, 60%) rotate(-15deg);
  }
  100% {
    transform: translate(15%, 20%) rotate(15deg);
  }
}
</style>
