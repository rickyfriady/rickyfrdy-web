import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : 1,
  reporter: CI
    ? [['html', { outputFolder: 'playwright-report' }], ['github']]
    : [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || (CI ? 'http://localhost:4321' : 'https://rickyfrdy.my.id'),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  // In CI, start the preview server before tests
  ...(CI && {
    webServer: {
      command: 'bun run preview',
      port: 4321,
      reuseExistingServer: true,
      timeout: 30000
    }
  }),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
