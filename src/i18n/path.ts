/**
 * Locale path rules, with no dictionary attached, so a client script can import
 * them without bundling every UI string. `ui.ts` re-exports `localizePath` for
 * the server code that already imports it from there.
 */
export type Lang = 'en' | 'id'

export const isIdPath = (pathname: string): boolean =>
  pathname === '/id' || pathname.startsWith('/id/')

/** The page's path without its locale: `/id/about` is `/about`, `/id` is `/`. */
export const stripLocale = (pathname: string): string =>
  pathname.replace(/^\/id(?=\/|$)/, '') || '/'

/** The same page in a locale: `/about` becomes `/id/about`, and `/` becomes `/id`. */
export function localizePath(path: string, lang: Lang): string {
  if (lang !== 'id') return path
  return path === '/' ? '/id' : `/id${path}`
}

/**
 * Pages that exist only in English (DESIGN.md: the blog and case studies are
 * English-only, and so is the changelog), each with the Indonesian page that
 * stands in for it. Every other English page has an `/id/` twin.
 */
const EN_ONLY: readonly (readonly [RegExp, string])[] = [
  [/^\/blog(\/|$)/, '/id'],
  [/^\/projects\/./, '/id/projects'],
  [/^\/changelog(\/|$)/, '/id']
]

/** The current page in the other locale, or the nearest page that exists there. */
export function alternatePath(pathname: string): string {
  if (isIdPath(pathname)) return stripLocale(pathname)
  const standIn = EN_ONLY.find(([pattern]) => pattern.test(pathname))
  return standIn ? standIn[1] : localizePath(pathname, 'id')
}
