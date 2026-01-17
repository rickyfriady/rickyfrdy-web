<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface Stat {
  label: string
  value: number
  suffix: string
  duration: number
}

const stats: Stat[] = [
  { label: 'Years Experience', value: 4, suffix: '+', duration: 2000 },
  { label: 'Projects Completed', value: 25, suffix: '+', duration: 2500 },
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
    
    // Easing function for smooth animation
    const easeOutQuad = (t: number) => t * (2 - t)
    const easedProgress = easeOutQuad(progress)
    
    animatedValues.value[index] = Math.floor(start + (end - start) * easedProgress)
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

function startAnimations() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  
  stats.forEach((stat, index) => {
    setTimeout(() => {
      animateValue(index, 0, stat.value, stat.duration)
    }, index * 100)
  })
}

onMounted(() => {
  if (container.value) {
    useIntersectionObserver(
      container,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          startAnimations()
        }
      },
      { threshold: 0.5 }
    )
  }
})
</script>

<template>
  <div 
    ref="container"
    class="grid grid-cols-2 md:grid-cols-4 gap-6"
  >
    <div
      v-for="(stat, index) in stats"
      :key="stat.label"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :delay="index * 100"
      class="text-center p-6 rounded-lg bg-secondary/50 border border-border hover:border-accent transition-colors"
    >
      <div class="text-3xl md:text-4xl font-bold text-accent mb-2">
        {{ animatedValues[index] }}{{ stat.suffix }}
      </div>
      <div class="text-sm text-muted">
        {{ stat.label }}
      </div>
    </div>
  </div>
</template>
