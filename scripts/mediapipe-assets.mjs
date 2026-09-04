import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PKG = resolve(ROOT, 'node_modules/@mediapipe/tasks-vision')
const SRC = resolve(PKG, 'wasm')
const DEST = resolve(ROOT, 'public/vendor/mediapipe/wasm')

/** Installed version, read from the package itself so it can never drift. */
export async function mediapipeVersion() {
  try {
    const pkg = JSON.parse(await readFile(resolve(PKG, 'package.json'), 'utf8'))
    return pkg.version
  } catch {
    return null
  }
}

/**
 * Copies the MediaPipe WASM out of node_modules so the site serves it from its
 * own origin.
 *
 * Copying (rather than hardcoding a CDN URL) is what makes version drift
 * impossible: the WASM version *is* the installed package version by
 * construction. The reference implementation this was ported from pinned
 * `0.10.22-rc` in package.json while requesting `0.10.3` WASM from a CDN — it
 * worked, and would have broken silently on the next upgrade.
 *
 * The destination is gitignored: ~32 MB has no business in the repo, and it is
 * reproducible from node_modules on any machine.
 */
export async function syncMediapipeWasm() {
  try {
    await stat(SRC)
  } catch {
    return { copied: false, reason: 'wasm directory not found in node_modules' }
  }
  await rm(DEST, { recursive: true, force: true })
  await mkdir(dirname(DEST), { recursive: true })
  await cp(SRC, DEST, { recursive: true })
  return { copied: true, version: await mediapipeVersion() }
}

// Runnable on its own for debugging: `node scripts/mediapipe-assets.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(await syncMediapipeWasm())
}
