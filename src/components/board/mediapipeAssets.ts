declare const __MEDIAPIPE_VERSION__: string | null

/** Injected at build time from the installed package — never hardcoded. */
export const MEDIAPIPE_VERSION: string | null =
  typeof __MEDIAPIPE_VERSION__ === 'string' ? __MEDIAPIPE_VERSION__ : null

const SELF_HOSTED = '/vendor/mediapipe/wasm'

/** Model lives on our own origin: it is not published to npm, so there is no CDN peer. */
export const MODEL_URL = '/models/hand_landmarker.task'

/**
 * Where to load the MediaPipe WASM from, in order of preference.
 *
 * Self-hosted first, because it is copied out of `node_modules` at build time
 * and therefore cannot disagree with the JavaScript runtime's version. The CDN
 * entry exists only as a fallback and derives its version from the installed
 * package, so it cannot drift either.
 */
export function wasmSources(): string[] {
  const sources = [SELF_HOSTED]
  if (MEDIAPIPE_VERSION) {
    sources.push(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`)
  }
  return sources
}

/**
 * Resolves a working WASM source by actually trying them in order.
 *
 * Returns null when every source fails, which is a supported outcome rather
 * than an error: Detective Mode simply is not offered, and the board carries
 * on working with mouse, keyboard, and touch.
 */
export async function resolveWasmBase(
  load: (base: string) => Promise<unknown>
): Promise<string | null> {
  for (const base of wasmSources()) {
    try {
      await load(base)
      return base
    } catch {
      // try the next source
    }
  }
  return null
}
