import { registerAppProviders } from '@/components/providers'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import './style.css'

export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ app }) => {
  registerAppProviders(app)
})
