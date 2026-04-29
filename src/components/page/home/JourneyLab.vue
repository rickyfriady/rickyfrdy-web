<script setup lang="ts">
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface JourneyItem {
  id: string
  year: string
  month: string
  title: string
  description: string
  tags: string[]
}

const journeyData: JourneyItem[] = [
  {
    id: 'journey-2021-apr',
    year: '2021',
    month: 'April',
    title: 'First Production Ship',
    description:
      'Joined PT. Sumatera Kalimantan Jaya and shipped a full company profile website in 14 days, plus an MPOS inventory app with a 3-person team.',
    tags: ['PHP', 'Codeigniter', 'Bootstrap']
  },
  {
    id: 'journey-2021-sep',
    year: '2021',
    month: 'September',
    title: 'Freelance Full-Stack',
    description:
      'Started freelancing — built responsive web apps for clients using React.js, Node.js, and Express.js, integrating MongoDB, MySQL, and PostgreSQL backends.',
    tags: ['React.js', 'Node.js', 'Express.js']
  },
  {
    id: 'journey-2023',
    year: '2023',
    month: 'May',
    title: 'Joined PT. Pegadaian',
    description:
      'Hired as Software Engineer. Translated business requirements into technical specs and contributed to CSR Web App, B2B Web App, KAMILA, and Microsite Pinjaman.',
    tags: ['Vue.js', 'NestJS', 'TypeScript']
  },
  {
    id: 'journey-2024',
    year: '2024',
    month: 'January',
    title: 'Microservices & Micro-Frontend',
    description:
      'Revamped legacy monolith to NestJS microservices. Contributed to company-wide Micro-Frontend Architecture on Singel APP, achieving ≥80% test coverage with Vitest.',
    tags: ['NestJS', 'Micro-Frontend', 'CI/CD']
  }
]

const activeIndex = ref(0)
const isPaused = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentItem = computed(() => journeyData[activeIndex.value] ?? journeyData[0])

function next() {
  activeIndex.value = (activeIndex.value + 1) % journeyData.length
}

function prev() {
  activeIndex.value = activeIndex.value === 0 ? journeyData.length - 1 : activeIndex.value - 1
}

function goTo(index: number) {
  activeIndex.value = index
}

function togglePause() {
  isPaused.value = !isPaused.value
}

function startAutoPlay() {
  if (intervalId) return
  intervalId = setInterval(() => {
    if (!isPaused.value) next()
  }, 4200)
}

function stopAutoPlay() {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}

onMounted(() => startAutoPlay())
onUnmounted(() => stopAutoPlay())
</script>

<template>
  <section
    class="border-border relative overflow-hidden rounded-2xl border p-7 md:p-9"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <div class="paper-grid pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06]" />
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <p class="eyebrow mb-2">Journey Lab</p>
        <h2 class="title-display text-2xl md:text-3xl">
          Milestones That <span class="title-accent">Shaped My Work</span>
        </h2>
      </div>
      <button
        class="text-muted hover:text-foreground rounded-lg p-2 transition-colors"
        :aria-label="isPaused ? 'Resume autoplay' : 'Pause autoplay'"
        @click="togglePause"
      >
        <Play v-if="isPaused" class="h-4 w-4" />
        <Pause v-else class="h-4 w-4" />
      </button>
    </div>

    <!-- Content -->
    <Transition
      mode="out-in"
      enter-active-class="transition duration-400"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-250"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div :key="currentItem.id">
        <div class="mb-4 flex items-baseline gap-3">
          <span class="title-display text-accent text-4xl md:text-5xl">{{ currentItem.year }}</span>
          <span class="text-muted text-sm">{{ currentItem.month }}</span>
        </div>

        <h3 class="text-xl font-semibold md:text-2xl">{{ currentItem.title }}</h3>
        <p class="text-muted mt-3 text-sm leading-relaxed">{{ currentItem.description }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in currentItem.tags"
            :key="tag"
            class="border-border bg-secondary rounded-md border px-2.5 py-1 text-xs font-medium"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- Controls -->
    <div class="border-border mt-6 flex items-center justify-between border-t pt-4">
      <div class="flex items-center gap-1.5">
        <button
          v-for="(_, index) in journeyData"
          :key="index"
          class="h-2 rounded-full transition-all duration-400"
          :class="index === activeIndex ? 'bg-accent w-6' : 'bg-border hover:bg-muted w-2'"
          :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
          :aria-label="`Go to milestone ${index + 1}`"
          @click="goTo(index)"
        />
      </div>

      <div class="flex items-center gap-1">
        <button
          class="text-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
          aria-label="Previous"
          @click="prev"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <button
          class="text-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
          aria-label="Next"
          @click="next"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
</template>
