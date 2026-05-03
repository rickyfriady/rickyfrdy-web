import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
    compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths: string[]) {
      return paths.filter((p) => p !== '/works' && !p.includes(':'))
    }
  }
})
