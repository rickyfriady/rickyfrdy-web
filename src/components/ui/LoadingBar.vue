<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const visible = ref(false)
const width = ref(0)
let trickleTimer: ReturnType<typeof setInterval> | null = null
let completeTimer: ReturnType<typeof setTimeout> | null = null

function start() {
  if (trickleTimer) clearInterval(trickleTimer)
  if (completeTimer) clearTimeout(completeTimer)
  visible.value = true
  width.value = 8
  trickleTimer = setInterval(() => {
    if (width.value < 82) {
      width.value += Math.random() * 12
    }
  }, 250)
}

function complete() {
  if (trickleTimer) clearInterval(trickleTimer)
  width.value = 100
  completeTimer = setTimeout(() => {
    visible.value = false
    width.value = 0
  }, 380)
}

const router = useRouter()
router.beforeEach(start)
router.afterEach(complete)

onUnmounted(() => {
  if (trickleTimer) clearInterval(trickleTimer)
  if (completeTimer) clearTimeout(completeTimer)
})
</script>

<template>
  <Transition name="loading-bar">
    <div
      v-if="visible"
      class="pointer-events-none fixed top-0 left-0 z-[9998] h-[3px] rounded-r-full"
      :style="{
        width: `${Math.min(width, 100)}%`,
        background: 'var(--color-accent)',
        transition: 'width 0.2s ease-out',
        boxShadow: '0 0 8px color-mix(in oklch, var(--color-accent) 60%, transparent)'
      }"
    />
  </Transition>
</template>

<style scoped>
.loading-bar-leave-active {
  transition: opacity 0.3s ease;
}
.loading-bar-leave-to {
  opacity: 0;
}
</style>
