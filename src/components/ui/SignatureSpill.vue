<script setup lang="ts">
import opentype from 'opentype.js'
import { computed, ref, watch } from 'vue'

interface SignatureSpillProps {
  text?: string
  color?: string
  fontSize?: number
  duration?: number
  delay?: number
  className?: string
  inView?: boolean
  once?: boolean
  hoverTrigger?: boolean
}

const props = withDefaults(defineProps<SignatureSpillProps>(), {
  text: 'Signature',
  color: '#000',
  fontSize: 14,
  duration: 1.5,
  delay: 0,
  className: undefined,
  inView: false,
  once: true,
  hoverTrigger: false
})

interface PathData {
  d: string
  length: number
}

const paths = ref<PathData[]>([])
const width = ref(300)
const height = 100
const horizontalPadding = computed(() => props.fontSize * 0.1)
const topMargin = computed(() => Math.max(5, (height - props.fontSize) / 2))
const baseline = computed(() => Math.min(height - 5, topMargin.value + props.fontSize))
const maskId = `signature-reveal-${Math.random().toString(36).slice(2, 10)}`
const isHovered = ref(false)

let runId = 0

function loadFont(path: string): Promise<opentype.Font> {
  return new Promise((resolve, reject) => {
    opentype.load(path, (error, font) => {
      if (error || !font) {
        reject(error ?? new Error('Unknown font loading error'))
        return
      }
      resolve(font)
    })
  })
}

// Calculate SVG path length using SVG standard
function getPathLength(pathData: string): number {
  if (typeof document === 'undefined') return 0
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', pathData)
  return path.getTotalLength()
}

async function buildPaths(): Promise<void> {
  const currentRun = ++runId

  try {
    const fontPaths = [
      '/LastoriaBoldRegular.otf',
      './LastoriaBoldRegular.otf',
      `${window.location.origin}/LastoriaBoldRegular.otf`
    ]

    let font: opentype.Font | null = null

    for (const path of fontPaths) {
      try {
        font = await loadFont(path)
        break
      } catch {
        // Keep trying fallbacks until one succeeds.
      }
    }

    if (!font) throw new Error('Font could not be loaded from any path')

    let x = horizontalPadding.value
    const nextPaths: PathData[] = []

    for (const char of props.text) {
      const glyph = font.charToGlyph(char)
      const path = glyph.getPath(x, baseline.value, props.fontSize)
      const pathStr = path.toPathData(3)
      const pathLength = getPathLength(pathStr)

      nextPaths.push({
        d: pathStr,
        length: pathLength
      })

      const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm
      x += advanceWidth * (props.fontSize / font.unitsPerEm)
    }

    if (currentRun !== runId) return

    paths.value = nextPaths
    width.value = x + horizontalPadding.value
  } catch {
    if (currentRun !== runId) return

    paths.value = []
    width.value = props.text.length * props.fontSize * 0.6
  }
}

function getInitialState(length: number) {
  return {
    strokeDashoffset: length,
    opacity: 0
  }
}

function getAnimateState(length: number, index: number) {
  return {
    strokeDashoffset: 0,
    opacity: 1,
    transition: {
      strokeDashoffset: {
        delay: props.delay + index * 0.2,
        duration: props.duration,
        ease: 'easeInOut'
      },
      opacity: {
        delay: props.delay + index * 0.2 + 0.01,
        duration: 0.01
      }
    }
  }
}

function getMotionTarget(length: number, index: number) {
  if (props.hoverTrigger) {
    return isHovered.value ? getAnimateState(length, index) : getInitialState(length)
  }

  if (props.inView) {
    return undefined
  }

  return getAnimateState(length, index)
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  if (!props.once) {
    isHovered.value = false
  }
}

watch(() => [props.text, props.fontSize], buildPaths, { immediate: true })
</script>

<template>
  <svg
    :key="paths.length"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    :class="className"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <defs>
      <mask :id="maskId" maskUnits="userSpaceOnUse">
        <path
          v-for="(data, i) in paths"
          v-motion
          :key="`mask-${i}`"
          :d="data.d"
          stroke="white"
          :stroke-width="fontSize * 0.22"
          fill="none"
          :stroke-dasharray="data.length"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          :initial="getInitialState(data.length)"
          :enter="getMotionTarget(data.length, i)"
          :visible="inView && !once ? getAnimateState(data.length, i) : undefined"
          :visibleOnce="inView && once ? getAnimateState(data.length, i) : undefined"
        />
      </mask>
    </defs>

    <path
      v-for="(data, i) in paths"
      v-motion
      :key="`stroke-${i}`"
      :d="data.d"
      :stroke="color"
      stroke-width="2"
      fill="none"
      :stroke-dasharray="data.length"
      vector-effect="non-scaling-stroke"
      stroke-linecap="butt"
      stroke-linejoin="round"
      :initial="getInitialState(data.length)"
      :enter="getMotionTarget(data.length, i)"
      :visible="inView && !once ? getAnimateState(data.length, i) : undefined"
      :visibleOnce="inView && once ? getAnimateState(data.length, i) : undefined"
    />

    <g :mask="`url(#${maskId})`">
      <path v-for="(data, i) in paths" :key="`fill-${i}`" :d="data.d" :fill="color" />
    </g>
  </svg>
</template>
