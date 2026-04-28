<script setup lang="ts">
import { useToast, type ToastItem } from '@/hooks/useToast'
import { CheckCircle, Info, X, XCircle } from 'lucide-vue-next'

const { toasts, dismiss } = useToast()

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info
}

const accentColors: Record<ToastItem['type'], string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: 'var(--color-accent)'
}
</script>

<template>
  <div
    class="pointer-events-none fixed top-4 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2"
    style="min-width: 280px; max-width: 420px; width: max-content"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3"
        style="
          background: color-mix(in oklch, var(--color-background) 92%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 20px oklch(0 0 0 / 0.1);
          width: 100%;
        "
        :style="{
          borderLeft: `3px solid ${accentColors[toast.type]}`
        }"
      >
        <component
          :is="icons[toast.type]"
          class="mt-0.5 h-4 w-4 shrink-0"
          :style="{ color: accentColors[toast.type] }"
        />
        <p class="flex-1 text-sm leading-relaxed" style="color: var(--color-foreground)">
          {{ toast.message }}
        </p>
        <button
          class="shrink-0 rounded p-0.5 transition-colors"
          style="color: var(--color-muted)"
          :style="{ '--hover-color': 'var(--color-foreground)' }"
          aria-label="Dismiss"
          @click="dismiss(toast.id)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.toast-leave-active {
  animation: toast-out 0.25s ease-in both;
  position: absolute;
}
.toast-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
