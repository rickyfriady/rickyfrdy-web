<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { onMounted, ref } from 'vue'

interface Stat {
  label: string
  value: number
  suffix: string
  duration: number
}

const stats: Stat[] = [
  { label: 'Years Experience', value: 4, suffix: '+', duration: 2000 },
  { label: 'Projects Shipped', value: 25, suffix: '+', duration: 2500 },
  { label: 'Technologies', value: 15, suffix: '+', duration: 2000 },
  { label: 'GitHub Contributions', value: 500, suffix: '+', duration: 3000 }
]

const animatedValues = ref(stats.map(() => 0))
const hasAnimated = ref(false)
const container = ref<HTMLElement | null>(null)

function animateValue(index: number, start: number, end: number, duration: number) {
  const startTime = performance.now()
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    animatedValues.value[index] = Math.floor(start + (end - start) * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

function startAnimations() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  stats.forEach((stat, index) => {
    setTimeout(() => animateValue(index, 0, stat.value, stat.duration), index * 80)
  })
}

onMounted(() => {
  if (container.value) {
    useIntersectionObserver(
      container,
      ([{ isIntersecting }]) => {
        if (isIntersecting) startAnimations()
      },
      { threshold: 0.4 }
    )
  }
})
</script>

<template>
  <div ref="container" class="border-border border-y py-6">
    <div class="flex flex-wrap items-baseline gap-x-10 gap-y-4">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        v-motion
        :initial="{ opacity: 0, y: 12 }"
        :visible="{ opacity: 1, y: 0 }"
        :delay="index * 80"
        class="flex items-baseline gap-2"
      >
        <span class="title-display text-accent text-4xl md:text-5xl">
          {{ animatedValues[index] }}{{ stat.suffix }}
        </span>
        <span class="text-muted text-sm font-medium">{{ stat.label }}</span>
      </div>
    </div>
  </div>
</template>
