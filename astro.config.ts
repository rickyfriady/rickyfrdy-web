import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

export default defineConfig({
  site: 'https://rickyfrdy.my.id',
  output: 'static',
  integrations: [mdx(), react(), sitemap(), robotsTxt()],
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: tailwindcss vite plugin type is incompatible with Vite's PluginOption
    plugins: [tailwindcss() as any],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  }
})
