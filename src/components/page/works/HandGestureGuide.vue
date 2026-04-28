<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div class="bg-foreground/30 absolute inset-0 backdrop-blur-sm" @click="emit('close')" />

    <div
      class="border-border bg-secondary relative z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-xl"
    >
      <div class="px-6 pt-6 pb-2 text-center">
        <h3 class="text-foreground mb-1 text-lg font-bold">Gesture Controls</h3>
        <p class="text-muted text-xs">Enable camera access to interact</p>
      </div>

      <div class="grid grid-cols-2 gap-3 px-6 py-4">
        <article class="guide-card">
          <div class="guide-visual">
            <img
              src="/images/gestures/hand-open.png"
              alt="Move cursor"
              class="guide-hand guide-move"
            />
          </div>
          <h4 class="guide-title">Move Cursor</h4>
          <p class="guide-text">Show your open hand and move it around to control the cursor.</p>
        </article>

        <article class="guide-card">
          <div class="guide-visual relative">
            <img
              src="/images/gestures/hand-prepinch.png"
              alt="Pre pinch"
              class="guide-hand guide-fade-open"
            />
            <img
              src="/images/gestures/hand-pinch.png"
              alt="Pinch"
              class="guide-hand guide-fade-pinch"
            />
          </div>
          <h4 class="guide-title">Pinch To Select</h4>
          <p class="guide-text">Pinch thumb + index finger over card to open details.</p>
        </article>

        <article class="guide-card">
          <div class="guide-visual">
            <img
              src="/images/gestures/hand-pinch.png"
              alt="Drag board"
              class="guide-hand guide-drag"
            />
          </div>
          <h4 class="guide-title">Drag Board</h4>
          <p class="guide-text">Pinch empty space and move your hand to pan the board.</p>
        </article>

        <article class="guide-card">
          <div class="guide-visual relative">
            <img
              src="/images/gestures/hand-pinch.png"
              alt="Zoom left hand"
              class="guide-hand guide-zoom-left"
            />
            <img
              src="/images/gestures/hand-pinch.png"
              alt="Zoom right hand"
              class="guide-hand guide-zoom-right"
            />
          </div>
          <h4 class="guide-title">Two-Hand Zoom</h4>
          <p class="guide-text">Pinch both hands. Move apart to zoom in, together to zoom out.</p>
        </article>
      </div>

      <div class="px-6 pt-2 pb-6">
        <Button
          as="button"
          variant="unstyled"
          class="bg-accent text-background hover:bg-foreground w-full rounded-lg py-3 text-xs font-medium transition-colors"
          @click="emit('close')"
        >
          Start Exploring
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-card {
  border: 1px solid color-mix(in oklab, var(--color-border) 85%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in oklab, var(--color-background) 88%, transparent);
  padding: 1rem;
  text-align: center;
}

.guide-visual {
  height: 4rem;
  width: 4rem;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-hand {
  width: 4rem;
  height: 4rem;
  object-fit: contain;
}

.guide-title {
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-foreground);
}

.guide-text {
  font-size: 10px;
  line-height: 1.2;
  color: var(--color-muted);
}

.guide-move {
  animation: hand-move 3s ease-in-out infinite;
}

.guide-drag {
  animation: hand-drag 2.4s ease-in-out infinite;
}

.guide-fade-open,
.guide-fade-pinch,
.guide-zoom-left,
.guide-zoom-right {
  position: absolute;
}

.guide-fade-open {
  animation: fade-open 2.5s ease-in-out infinite;
}

.guide-fade-pinch {
  animation: fade-pinch 2.5s ease-in-out infinite;
}

.guide-zoom-left {
  transform: scaleX(-1);
  animation: zoom-left 2s ease-in-out infinite;
}

.guide-zoom-right {
  animation: zoom-right 2s ease-in-out infinite;
}

@keyframes hand-move {
  0% {
    transform: translate(0, 0);
  }
  30% {
    transform: translate(8px, -6px);
  }
  65% {
    transform: translate(-5px, 4px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes hand-drag {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(12px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes fade-open {
  0%,
  30%,
  90%,
  100% {
    opacity: 1;
  }
  40%,
  80% {
    opacity: 0;
  }
}

@keyframes fade-pinch {
  0%,
  30%,
  90%,
  100% {
    opacity: 0;
  }
  40%,
  80% {
    opacity: 1;
  }
}

@keyframes zoom-left {
  0%,
  100% {
    transform: translateX(-20px) scaleX(-1);
  }
  50% {
    transform: translateX(-12px) scaleX(-1);
  }
}

@keyframes zoom-right {
  0%,
  100% {
    transform: translateX(20px);
  }
  50% {
    transform: translateX(12px);
  }
}
</style>
