import router from '@/router'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import type { App as VueApp } from 'vue'

export function registerAppProviders(app: VueApp): void {
  app.use(createPinia())
  app.use(router)
  app.use(MotionPlugin)
}
