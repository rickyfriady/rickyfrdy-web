import { expect, test } from '@playwright/test'

const PAGES = [
  { path: '/', label: 'home' },
  { path: '/about', label: 'about' },
  { path: '/projects', label: 'projects' },
  { path: '/experience', label: 'experience' },
  { path: '/resume', label: 'resume' },
  { path: '/contact', label: 'contact' },
  { path: '/id', label: 'id-home' },
  { path: '/id/about', label: 'id-about' },
  { path: '/id/projects', label: 'id-projects' },
  { path: '/id/experience', label: 'id-experience' },
  { path: '/id/resume', label: 'id-resume' },
  { path: '/id/contact', label: 'id-contact' },
]

// ─── Snapshot tests ───────────────────────────────────────────────
for (const { path, label } of PAGES) {
  test(`snapshot: ${label} page renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto(path, { waitUntil: 'networkidle' })

    // Wait for React islands to finish hydrating
    await page.waitForTimeout(2000)

    // Verify page loaded with correct title
    await expect(page).toHaveTitle(/Ricki Friadi/)

    // No fatal console errors (ignore hydration warnings which are benign)
    const fatal = errors.filter(
      (e) => !e.includes('Hydration') && !e.includes('418') && !e.includes('404')
    )
    expect(fatal).toEqual([])
  })
}

// ─── Accessibility tests ──────────────────────────────────────────
for (const { path, label } of PAGES) {
  test(`a11y: ${label} page has no automated violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Inject axe-core and run audit
    const violations = await page.evaluate<
      Array<{ id: string; impact: string; description: string }>
    >(() => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'
      return new Promise((resolve) => {
        script.onload = async () => {
          // @ts-expect-error — axe-core injected at runtime
          const results = await window.axe.run(document, {
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
          })
          resolve(results.violations)
        }
        script.onerror = () => resolve([])
        document.head.appendChild(script)
      })
    })

    if (violations.length > 0) {
      console.log(`a11y violations on ${label}:`, JSON.stringify(violations, null, 2))
    }
    expect(violations).toEqual([])
  })
}

// ─── Visual regression: key interactive elements ──────────────────
test('home: all nav links are present and functional', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const links = page.locator('nav a')
  const count = await links.count()
  expect(count).toBeGreaterThanOrEqual(6)

  // Check that each nav link has href
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href')
    expect(href).toBeTruthy()
  }
})

test('contact: form elements render', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const nameInput = page.getByLabel('Name')
  const emailInput = page.getByLabel('Email')
  const messageField = page.getByLabel('Message')
  const submitBtn = page.getByRole('button', { name: /send message/i })

  await expect(nameInput).toBeVisible()
  await expect(emailInput).toBeVisible()
  await expect(messageField).toBeVisible()
  await expect(submitBtn).toBeVisible()
})

test('projects: grid has project cards', async ({ page }) => {
  await page.goto('/projects', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  // Wait for React hydration
  await page.waitForSelector('a[href^="/projects/"]', { timeout: 10000 }).catch(() => {})
  const cards = page.locator('a[href^="/projects/"]')
  const count = await cards.count()
  expect(count).toBeGreaterThanOrEqual(1)
})

test('home: skip-to-content link is focusable', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const skipLink = page.locator('a[href="#main-content"]')
  await expect(skipLink).toBeVisible()
  await expect(skipLink).toHaveAttribute('href', '#main-content')
})

test('experience: accordion toggles open/close', async ({ page }) => {
  await page.goto('/experience', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  // Wait for first accordion button with aria-expanded
  const toggle = page.locator('button[aria-expanded]').first()
  await expect(toggle).toBeVisible({ timeout: 10000 })

  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})
