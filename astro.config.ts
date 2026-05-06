import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

export default defineConfig({
  site: 'https://rickifriadi.dev',
  output: 'static',
  integrations: [react(), sitemap(), robotsTxt()],
  vite: {
    // @ts-expect-error — @tailwindcss/vite type incompatible with Astro's bundled Vite version
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  }
})
