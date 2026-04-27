<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface Milestone {
  year: string
  title: string
  summary: string
  stack: string[]
}

const milestones: Milestone[] = [
  {
    year: '2022',
    title: 'Backend Foundations',
    summary:
      'Built and shipped API services with authentication, billing flows, and maintainable monorepo conventions.',
    stack: ['Node.js', 'PostgreSQL', 'Docker']
  },
  {
    year: '2023',
    title: 'Scale & Reliability',
    summary:
      'Focused on performance bottlenecks, queue-driven jobs, and safer production rollout strategies.',
    stack: ['TypeScript', 'Redis', 'CI/CD']
  },
  {
    year: '2024',
    title: 'Product-Facing UX',
    summary:
      'Moved up-stack to deliver polished interfaces with stronger interaction design and better information architecture.',
    stack: ['Vue 3', 'Tailwind', 'Design Systems']
  },
  {
    year: '2025',
    title: 'Architecture + Craft',
    summary:
      'Combined system-level backend decisions with premium frontend execution for full lifecycle ownership.',
    stack: ['Architecture', 'DX', 'Performance']
  }
]

const activeIndex = ref(0)
const trackRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

function setCardRef(el: Element | null, index: number) {
  if (el instanceof HTMLElement) cardRefs.value[index] = el
}

function goTo(index: number) {
  const element = cardRefs.value[index]
  if (!element || !trackRef.value) return
  activeIndex.value = index
  trackRef.value.scrollTo({ left: element.offsetLeft - 24, behavior: 'smooth' })
}

onMounted(async () => {
  if (!trackRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      let strongest: { index: number; ratio: number } | null = null
      entries.forEach((entry) => {
        const index = Number((entry.target as HTMLElement).dataset.index ?? '-1')
        if (index < 0) return
        if (!strongest || entry.intersectionRatio > strongest.ratio)
          strongest = { index, ratio: entry.intersectionRatio }
      })
      if (strongest && strongest.ratio > 0.55) activeIndex.value = strongest.index
    },
    { root: trackRef.value, threshold: [0.45, 0.55, 0.7, 0.9] }
  )
  await nextTick()
  cardRefs.value.forEach((card) => observer?.observe(card))
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p class="eyebrow mb-3">Journey Strip</p>
        <h2 class="title-display text-4xl md:text-5xl">What Shaped My Work</h2>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous milestone"
          :disabled="activeIndex === 0"
          @click="goTo(Math.max(activeIndex - 1, 0))"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <span class="text-muted min-w-16 text-center font-mono text-xs">
          {{ activeIndex + 1 }} / {{ milestones.length }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next milestone"
          :disabled="activeIndex === milestones.length - 1"
          @click="goTo(Math.min(activeIndex + 1, milestones.length - 1))"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div
      ref="trackRef"
      class="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
    >
      <article
        v-for="(milestone, index) in milestones"
        :ref="(el) => setCardRef(el, index)"
        :key="milestone.year"
        :data-index="index"
        class="border-border min-h-56 w-[85vw] max-w-[28rem] shrink-0 snap-center rounded-2xl border p-6 transition-all duration-500 md:w-[26rem]"
        :class="
          index === activeIndex
            ? 'border-l-accent border-l-[3px] opacity-100'
            : 'border-l-border border-l-[3px] opacity-50'
        "
        :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
      >
        <p class="text-muted font-mono text-xs tracking-[0.16em]">v{{ milestone.year }}.0</p>
        <h3 class="title-display mt-4 text-2xl leading-tight md:text-3xl">{{ milestone.title }}</h3>
        <p class="text-muted mt-3 text-sm leading-relaxed">{{ milestone.summary }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <span v-for="item in milestone.stack" :key="item" class="diff-tag">
            <span class="text-accent">+&nbsp;</span>{{ item }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
