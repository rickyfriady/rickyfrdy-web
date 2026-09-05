import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

/**
 * Mirrors the `define` in `astro.config.ts`. Without it the tests would run
 * against a different configuration than production — which is exactly how a
 * version-drift bug survives a green suite.
 */
function mediapipeVersion(): string | null {
  try {
    return JSON.parse(
      readFileSync(resolve(__dirname, 'node_modules/@mediapipe/tasks-vision/package.json'), 'utf8')
    ).version
  } catch {
    return null
  }
}

export default defineConfig({
  define: {
    __MEDIAPIPE_VERSION__: JSON.stringify(mediapipeVersion())
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.astro']
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: /^@test\/(.*)/, replacement: resolve(__dirname, './tests/$1') }
    ]
  }
})
