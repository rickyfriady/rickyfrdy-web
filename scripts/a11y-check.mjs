/**
 * Runs axe against the real rendered pages, then checks DESIGN.md's hard
 * constraints as rendered: radius 0 and no blurred shadow. The tokens are
 * zeroed in global.css, but a utility like `rounded` reached past them on the
 * brand link, so only the browser can say what actually paints.
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

// Reuse a dev server when one is already up; 4321 is what `bun run dev` uses.
// Spawning a second one is slower and leaves something to leak.
const EXISTING = 'http://localhost:4321'
const OWN_PORT = 4322

// One route per distinct layout. /play carries the third palette, and /board
// is the only page whose main content is a canvas.
const routes = ['/', '/id/', '/projects', '/projects/singel-app', '/blog', '/about', '/contact', '/now', '/board', '/play']

const reachable = async (url) => {
  try {
    return (await fetch(url)).ok
  } catch {
    return false
  }
}

let server = null
const stop = () => {
  if (!server) return
  try {
    // SIGKILL, not SIGTERM: astro dev does not reliably die on a group TERM,
    // and a survivor holds both the port and its memory until someone finds
    // it by hand. Nothing here needs a graceful shutdown.
    process.kill(-server.pid, 'SIGKILL')
  } catch {
    // already gone
  }
  server = null
}
process.on('exit', stop)
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => process.exit(130))
}

async function resolveBase() {
  if (await reachable(EXISTING)) return EXISTING

  const base = `http://localhost:${OWN_PORT}`
  server = spawn('bunx', ['astro', 'dev', '--port', String(OWN_PORT)], {
    stdio: 'ignore',
    detached: true,
  })
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    if (await reachable(base)) return base
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`dev server did not answer on ${base}`)
}

/** Visible elements that render a corner radius or a shadow with blur. */
const constraintBreaches = (page) =>
  page.evaluate(() => {
    const found = []
    for (const el of document.querySelectorAll('body *')) {
      const box = el.getBoundingClientRect()
      if (!box.width || !box.height) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const name = `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join('.')}`
      if (cs.borderTopLeftRadius !== '0px' || cs.borderBottomRightRadius !== '0px')
        found.push(`radius ${cs.borderTopLeftRadius} on ${name}`)
      if (cs.boxShadow !== 'none') {
        // Strip colour functions, then the third length of each shadow is its blur.
        const shadows = cs.boxShadow.replace(/[a-z]+\([^)]*\)/g, '').split(',')
        if (shadows.some((s) => parseFloat((s.match(/-?[\d.]+px/g) || [])[2] || '0') > 0))
          found.push(`blurred shadow on ${name}`)
      }
    }
    return [...new Set(found)]
  })

const BASE = await resolveBase()
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

  const breaches = []
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(200)
    for (const b of await constraintBreaches(page)) breaches.push(`${b} @${width}`)
  }
  await page.setViewportSize({ width: 1280, height: 720 })

  if (violations.length === 0 && breaches.length === 0) {
    console.log(`ok    ${route}`)
    continue
  }
  failures += violations.length + breaches.length
  console.log(`FAIL  ${route}`)
  for (const b of [...new Set(breaches)].slice(0, 8)) console.log(`  [constraint] ${b}`)
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
