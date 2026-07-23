import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

const SITE = 'https://rickyfrdy.my.id'

const EN_ID_PAIRS = new Set([
  '/',
  '/about/',
  '/experience/',
  '/projects/',
  '/contact/',
  '/now/',
  '/ask/'
])

const EXCLUDE_EXACT = new Set([
  '/dashboard',
  '/dashboard/',
  '/id/dashboard',
  '/id/dashboard/',
  '/resume',
  '/resume/',
  '/id/resume',
  '/id/resume/'
])

export default defineConfig({
  site: SITE,
  output: 'static',
  redirects: {
    // /works merged into /projects; preserve old links
    '/works': '/projects',
    '/id/works': '/id/projects'
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname
        if (EXCLUDE_EXACT.has(path)) return false
        if (path.startsWith('/blog/tag/')) return false
        if (
          path === '/works' ||
          path === '/works/' ||
          path === '/id/works' ||
          path === '/id/works/'
        )
          return false
        return true
      },
      serialize: (item) => {
        const path = new URL(item.url).pathname
        const normalized = path.endsWith('/') ? path : `${path}/`

        let priority = 0.5
        if (normalized === '/' || normalized === '/id/') priority = 1.0
        else if (/^\/(id\/)?(about|experience|projects|contact)\/$/.test(normalized)) priority = 0.8
        else if (/^\/(id\/)?blog\/$/.test(normalized)) priority = 0.7
        else if (/^\/blog\/.+\/$/.test(normalized) || /^\/projects\/.+\/$/.test(normalized))
          priority = 0.6

        const lastmod = new Date().toISOString()

        let links: { lang: string; url: string }[] | undefined

        const isIdPage = path.startsWith('/id/')
        if (isIdPage) {
          const enPath = path.slice(3) || '/'
          const enNorm = enPath.endsWith('/') ? enPath : `${enPath}/`
          if (EN_ID_PAIRS.has(enNorm)) {
            links = [
              { lang: 'en', url: `${SITE}${enPath}` },
              { lang: 'id', url: `${SITE}${path}` },
              { lang: 'x-default', url: `${SITE}${enPath}` }
            ]
          }
        } else if (EN_ID_PAIRS.has(normalized)) {
          links = [
            { lang: 'en', url: `${SITE}${path}` },
            { lang: 'id', url: `${SITE}/id${path}` },
            { lang: 'x-default', url: `${SITE}${path}` }
          ]
        }

        return { ...item, priority, lastmod, ...(links ? { links } : {}) }
      }
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/dashboard', '/id/dashboard', '/resume-ats.pdf']
        }
      ],
      sitemap: `${SITE}/sitemap-index.xml`
    })
  ],
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
