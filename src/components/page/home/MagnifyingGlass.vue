<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 100,
  className: ''
})

const handleLength = computed(() => props.size * 0.55)
const handleWidth = computed(() => props.size * 0.12)
const rimWidth = computed(() => props.size * 0.06)
const center = computed(() => props.size / 2)
const lensRadius = computed(() => center.value - rimWidth.value)
const canvasWidth = computed(() => props.size + handleLength.value * 0.5)
const canvasHeight = computed(() => props.size + handleLength.value * 0.5)
</script>

<template>
  <div
    class="relative"
    :class="className"
    :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
  >
    <svg
      :width="canvasWidth"
      :height="canvasHeight"
      :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rimGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f4f3ee" />
          <stop offset="25%" stop-color="#d8d7d2" />
          <stop offset="50%" stop-color="#a4a49f" />
          <stop offset="75%" stop-color="#d8d7d2" />
          <stop offset="100%" stop-color="#2a2a2a" />
        </linearGradient>

        <linearGradient id="handleGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#090909" />
          <stop offset="20%" stop-color="#171717" />
          <stop offset="50%" stop-color="#2e2e2e" />
          <stop offset="80%" stop-color="#171717" />
          <stop offset="100%" stop-color="#090909" />
        </linearGradient>

        <radialGradient id="glassGradient" cx="0.35" cy="0.35" r="0.6">
          <stop offset="0%" stop-color="rgba(255,255,255,0.32)" />
          <stop offset="40%" stop-color="rgba(225,225,225,0.14)" />
          <stop offset="100%" stop-color="rgba(120,120,120,0.08)" />
        </radialGradient>

        <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)" />
        </filter>
      </defs>

      <g filter="url(#glassShadow)">
        <rect
          :x="center + lensRadius * 0.95"
          :y="center - handleWidth / 2"
          :width="handleLength"
          :height="handleWidth"
          :rx="handleWidth / 2"
          fill="url(#handleGradient)"
          :transform="`rotate(50, ${center}, ${center})`"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="lensRadius + rimWidth * 0.3"
          fill="none"
          stroke="url(#rimGradient)"
          :stroke-width="rimWidth * 0.4"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="lensRadius"
          fill="none"
          stroke="url(#rimGradient)"
          :stroke-width="rimWidth"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="lensRadius - rimWidth / 2"
          fill="rgba(220, 235, 255, 0.12)"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="lensRadius - rimWidth / 2"
          fill="url(#glassGradient)"
        />

        <ellipse
          :cx="center - lensRadius * 0.25"
          :cy="center - lensRadius * 0.3"
          :rx="lensRadius * 0.2"
          :ry="lensRadius * 0.1"
          fill="rgba(255,255,255,0.45)"
          :transform="`rotate(-25, ${center - lensRadius * 0.25}, ${center - lensRadius * 0.3})`"
        />

        <circle
          v-for="angle in [0, 90, 180, 270]"
          :key="angle"
          :cx="center + (lensRadius + rimWidth * 0.05) * Math.cos((angle * Math.PI) / 180)"
          :cy="center + (lensRadius + rimWidth * 0.05) * Math.sin((angle * Math.PI) / 180)"
          :r="rimWidth * 0.2"
          fill="#d8d7d2"
          stroke="#2a2a2a"
          stroke-width="0.5"
        />
      </g>
    </svg>
  </div>
</template>
