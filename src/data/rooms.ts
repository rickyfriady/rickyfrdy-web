import type { Room } from '@/models'

/**
 * The valley and the three buildings you can walk into.
 *
 * The valley is the front door: every destination on the site is a building,
 * a signpost, or a crop in it. The Workshop, the Journal and the Records hall
 * have interiors holding the individual pieces of work; the About house, the
 * Post office and the notice board are signposts straight to their pages. A
 * building and its route are the same content at two addresses, so every
 * signpost carries its canonical URL and nothing redirects.
 *
 * Authoring format: terrain is rows of tile codes (legend in
 * `utils/game/tiles.ts`), and edges are picked from neighbours at render time,
 * so a pond or a road is a blob of `~` or `=` rather than hand-placed corner
 * pieces. The one constraint that follows: water has no inner-corner art, so
 * ponds stay convex.
 *
 * Objects carry `{ kind, slug }` only. Titles and summaries are resolved from
 * `projects.ts`, the blog collection, `experience.ts` and the page labels at
 * build time, so a retitled project cannot leave a stale name in the world.
 */
export const rooms = [
  {
    id: 'valley',
    name: { en: 'The Valley', id: 'Lembah' },
    grid: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'T,,,,,,,,,,*,,,,,,,,,"",,,,*,,,,,,,,,,,T',
      'T,,,rrrrr,,,,,T,,,,,,,T,,,,,,,rrrrr,,,,T',
      'T,,,RRRRR,,,,,,,,,T,,,,,,,,,,,RRRRR,,,,T',
      'T,*,WWDWW,,,,,,,,,,,,,,,,T,,,,WWDWW,,,,T',
      'T,,,,,============================,,*,,T',
      'T,,,,,============================,,,,,T',
      'TCCCCCCCCCvvvvCCCCCSSCCCCCvvvvCCCCCCCCCT',
      'T,,,,,,,,,,,,,,,,,,==,,,,,,,,,,,,,,,,,,T',
      'T,,,rrrrr,,,ggggg,,==,,ggggggg,,,,,,,,,T',
      'T,T,RRRRR,T,GGGGGo,==o,GGGGGGG,,,,,T,,,T',
      'T,,,WW+WW,,,QQ+QQ,,==,,QQQ+QQQ,,,,,,,T,T',
      'T,,",,==,,,",,==,,,==,,,,,==,,,,,",,,,,T',
      'T======================================T',
      'T======================================T',
      'T,,,,,,,,,,,,,,,,,,==,,,,,,,,,,,,,,*,,,T',
      'T,,fffffffffff,,,,,==,,,o,,,,,,,o,,,,,,T',
      'T,,,,,,,,,,,,,,,T,,==,,,,,~~~~~~,,,,,,,T',
      'T,*,%,%,%,%,%,,,,,,==,*,,,~~~~~~,T,,,,,T',
      'T,,,,,,,,,,,,,,,*,,==,,,,,~~~~~~,,,,,,,T',
      'T,,fffffffffff,,,,,==,,,",~~~~~~,,,,,,,T',
      'T,,,,,,,,,,,,,,,,,,==,,,,,,,,,,,,,T,,,,T',
      'T,,,,o,,,,,,,,,o,,,==,,T,,,,,,,,,,,,,,,T',
      'T,,,,,,,T,,,,,,,,,,==,,,,,,,,,*,,,,,,,,T',
      'T,,T,,,,,,,,,T,,,",==,,,,,,,T,,,,,,,,,,T',
      'T,,,,,,,,*,,,,,,,,,==,,,,,,,,,,",,,,T,,T',
      'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    spawn: { x: 19.1, y: 16 },
    objects: [
      {
        id: 'sign-about',
        x: 8,
        y: 5,
        sprite: 'tile:town:83',
        binding: { kind: 'route', slug: '/about' }
      },
      {
        id: 'sign-contact',
        x: 34,
        y: 5,
        sprite: 'tile:town:83',
        binding: { kind: 'route', slug: '/contact' }
      },
      {
        id: 'sign-projects',
        x: 8,
        y: 12,
        sprite: 'tile:town:83',
        binding: { kind: 'route', slug: '/projects' }
      },
      {
        id: 'sign-blog',
        x: 16,
        y: 12,
        sprite: 'tile:town:83',
        binding: { kind: 'route', slug: '/blog' }
      },
      {
        id: 'sign-experience',
        x: 28,
        y: 12,
        sprite: 'tile:town:83',
        binding: { kind: 'route', slug: '/experience' }
      },
      {
        id: 'notice-board',
        x: 22,
        y: 15,
        sprite: 'tile:town:57',
        binding: { kind: 'route', slug: '/board' }
      },
      // One crop per project. How grown it is comes from the project's own
      // date at render time; nothing about growth is stored here.
      {
        id: 'crop-singel',
        x: 4,
        y: 18,
        sprite: 'crop',
        binding: { kind: 'project', slug: 'singel-app' }
      },
      {
        id: 'crop-microsite',
        x: 6,
        y: 18,
        sprite: 'crop',
        binding: { kind: 'project', slug: 'microsite-pinjaman' }
      },
      {
        id: 'crop-kamila',
        x: 8,
        y: 18,
        sprite: 'crop',
        binding: { kind: 'project', slug: 'kamila' }
      },
      {
        id: 'crop-aira',
        x: 10,
        y: 18,
        sprite: 'crop',
        binding: { kind: 'project', slug: 'aira-reconciliation' }
      },
      {
        id: 'crop-chatbot',
        x: 12,
        y: 18,
        sprite: 'crop',
        binding: { kind: 'project', slug: 'chatbot-kukerta' }
      }
    ],
    doors: [
      { x: 6, y: 11, to: 'workshop', entry: { x: 9, y: 10 } },
      { x: 14, y: 11, to: 'journal', entry: { x: 9, y: 10 } },
      { x: 26, y: 11, to: 'records', entry: { x: 9, y: 10 } }
    ]
  },
  {
    id: 'workshop',
    name: { en: 'Workshop', id: 'Bengkel' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#########+##########'
    ],
    spawn: { x: 9, y: 9 },
    objects: [
      {
        id: 'shelf-singel',
        x: 3,
        y: 2,
        sprite: 'tile:farm:76',
        binding: { kind: 'project', slug: 'singel-app' }
      },
      {
        id: 'shelf-microsite',
        x: 7,
        y: 2,
        sprite: 'tile:farm:76',
        binding: { kind: 'project', slug: 'microsite-pinjaman' }
      },
      {
        id: 'shelf-kamila',
        x: 11,
        y: 2,
        sprite: 'tile:farm:76',
        binding: { kind: 'project', slug: 'kamila' }
      },
      {
        id: 'shelf-aira',
        x: 15,
        y: 2,
        sprite: 'tile:farm:76',
        binding: { kind: 'project', slug: 'aira-reconciliation' }
      },
      {
        id: 'shelf-chatbot',
        x: 3,
        y: 7,
        sprite: 'tile:farm:76',
        binding: { kind: 'project', slug: 'chatbot-kukerta' }
      }
    ],
    doors: [{ x: 9, y: 11, to: 'valley', entry: { x: 6.1, y: 12.1 } }]
  },
  {
    id: 'journal',
    name: { en: 'Journal', id: 'Jurnal' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#########+##########'
    ],
    spawn: { x: 9, y: 9 },
    objects: [
      {
        id: 'desk-nestjs',
        x: 6,
        y: 3,
        sprite: 'tile:farm:98',
        binding: { kind: 'post', slug: 'microservices-with-nestjs' }
      }
    ],
    doors: [{ x: 9, y: 11, to: 'valley', entry: { x: 14.1, y: 12.1 } }]
  },
  {
    id: 'records',
    name: { en: 'Records Hall', id: 'Balai Catatan' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#########+##########'
    ],
    spawn: { x: 9, y: 9 },
    objects: [
      {
        id: 'counter-pegadaian',
        x: 4,
        y: 3,
        sprite: 'tile:farm:100',
        binding: { kind: 'experience', slug: 'PT. Pegadaian' }
      },
      {
        id: 'counter-freelance',
        x: 9,
        y: 3,
        sprite: 'tile:farm:100',
        binding: { kind: 'experience', slug: 'Freelance' }
      },
      {
        id: 'counter-skj',
        x: 14,
        y: 3,
        sprite: 'tile:farm:100',
        binding: { kind: 'experience', slug: 'PT. Sumatera Kalimantan Jaya' }
      }
    ],
    doors: [{ x: 9, y: 11, to: 'valley', entry: { x: 26.1, y: 12.1 } }]
  }
] satisfies Room[]

export const roomById: Record<string, Room> = Object.fromEntries(rooms.map((r) => [r.id, r]))
