import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'

// Note: @unhead/vue and vue-router are injected automatically by vite-ssg.
// Only register plugins vite-ssg doesn't handle.
export function registerAppProviders(app: VueApp): void {
  app.use(createPinia())
  app.use(MotionPlugin)
}
