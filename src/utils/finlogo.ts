/**
 * Load SVG strings from the local idn-finlogos package at build time.
 * Uses Vite's import.meta.glob — same approach as FinLogo.astro but
 * usable from React islands.
 *
 * Only logos actually used on the page are bundled.
 */
const iconModules = import.meta.glob<string>('/node_modules/idn-finlogos/dist/icons/*.mjs', {
  eager: true,
  import: 'default'
})

export function getLogoSvg(name: string): string | undefined {
  const key = `/node_modules/idn-finlogos/dist/icons/${name}.mjs`
  return iconModules[key]
}
