import { registerAppProviders } from '@/components/providers'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)

registerAppProviders(app)

app.mount('#app')
