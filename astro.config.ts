import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

export default defineConfig({
  site: 'https://rickyfrdy.my.id',
  output: 'static',
  redirects: {
    // /works merged into /projects; preserve old links
    '/works': '/projects',
    '/id/works': '/id/projects'
  },
  integrations: [mdx(), sitemap(), robotsTxt()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: false }
  },
  vite: {
    // biome-ignore lint/suspicious/noExplicitAny: tailwindcss vite plugin type is incompatible with Vite's PluginOption
    plugins: [tailwindcss() as any],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    },
    esbuild: {
      // Needed for ResumePdf.tsx / ResumePdfAts.tsx (server-side PDF generation via @react-pdf/renderer)
      jsxImportSource: 'react'
    },
    ssr: {
      noExternal: ['@react-pdf/renderer']
    }
  }
})
