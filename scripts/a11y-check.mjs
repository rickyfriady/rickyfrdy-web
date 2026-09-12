/**
 * Runs axe against the real rendered pages.
 *
 * A script rather than a vitest suite: axe needs a real browser and a running
 * server, neither of which the jsdom unit environment has, and the whole check
 * is one loop over a route list.
 *
 * Serial, not parallel: the dev server compiles routes on demand, so three
 * pages at once just queues behind the same compiler and makes a slow run
 * harder to read.
 */
import { spawn } from 'node:child_process'
import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from 'playwright'

const PORT = 4322
const BASE = `http://localhost:${PORT}`

// One route per distinct layout. /play carries the third palette, and /board
// is the only page whose main content is a canvas.
const routes = ['/', '/projects', '/blog', '/about', '/contact', '/now', '/board', '/play']

const server = spawn('bunx', ['astro', 'dev', '--port', String(PORT)], {
  stdio: 'ignore',
  detached: true,
})
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {
    // already gone
  }
}
process.on('exit', stop)
process.on('SIGINT', () => process.exit(130))

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`dev server did not answer on ${BASE}`)
}

await waitForServer()
const browser = await chromium.launch()
// axe needs an explicit context; a page off browser.newPage() is rejected.
// reducedMotion also stops the GSAP hero reveals, which otherwise get sampled
// mid-fade and reported as contrast failures that no real user ever sees.
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
let failures = 0

for (const route of routes) {
  // Astro's dev server can reload a route the first time it compiles it, which
  // destroys the execution context mid-scan. Settling after load, and retrying
  // once, is cheaper than racing it.
  let violations
  for (let attempt = 1; ; attempt++) {
    try {
      await page.goto(BASE + route, { waitUntil: 'load' })
      await page.waitForTimeout(600)
      ;({ violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze())
      break
    } catch (error) {
      if (attempt === 3) throw error
    }
  }

  if (violations.length === 0) {
    console.log(`ok    ${route}`)
    continue
  }
  failures += violations.length
  console.log(`FAIL  ${route}`)
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`)
    for (const node of v.nodes.slice(0, 3)) console.log(`      ${node.target.join(' ')}`)
    if (v.nodes.length > 3) console.log(`      ... and ${v.nodes.length - 3} more`)
  }
}

await browser.close()
stop()
console.log(failures ? `\n${failures} violation groups` : '\nno violations')
process.exit(failures ? 1 : 0)
