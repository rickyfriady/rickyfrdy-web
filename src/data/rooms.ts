import type { Room } from '@/models'

/**
 * Three rooms, not six.
 *
 * There are five projects and one published article. Six themed rooms over
 * that much content is mostly empty corridor. Each room here holds enough to
 * feel populated, and adding a fourth later is a data edit — the renderer
 * reads the grid and never knows a room by name.
 *
 * Grid legend: `#` solid · `.` walkable floor · `+` door tile.
 * Objects carry `{ kind, slug }` only. Titles and summaries are resolved from
 * `projects.ts`, the blog collection, and `experience.ts` at build time, so a
 * retitled project cannot leave a stale name inside the game.
 */
export const rooms = [
  {
    id: 'case-room',
    name: { en: 'Case Room', id: 'Ruang Kasus' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................+',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '####################'
    ],
    spawn: { x: 9, y: 6 },
    objects: [
      {
        id: 'file-singel',
        x: 3,
        y: 2,
        sprite: 'shelf',
        binding: { kind: 'project', slug: 'singel-app' }
      },
      {
        id: 'file-microsite',
        x: 7,
        y: 2,
        sprite: 'shelf',
        binding: { kind: 'project', slug: 'microsite-pinjaman' }
      },
      {
        id: 'file-kamila',
        x: 11,
        y: 2,
        sprite: 'shelf',
        binding: { kind: 'project', slug: 'kamila' }
      },
      {
        id: 'file-aira',
        x: 3,
        y: 8,
        sprite: 'shelf',
        binding: { kind: 'project', slug: 'aira-reconciliation' }
      },
      {
        id: 'file-chatbot',
        x: 7,
        y: 8,
        sprite: 'shelf',
        binding: { kind: 'project', slug: 'chatbot-kukerta' }
      },
      {
        id: 'npc-laura',
        x: 13,
        y: 8,
        sprite: 'npc-laura',
        binding: { kind: 'npc', slug: 'npc-laura' }
      }
    ],
    doors: [{ x: 19, y: 6, to: 'archive', entry: { x: 1, y: 6 } }]
  },
  {
    id: 'archive',
    name: { en: 'Archive', id: 'Arsip' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '+..................+',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '####################'
    ],
    spawn: { x: 9, y: 6 },
    objects: [
      {
        id: 'note-nestjs',
        x: 6,
        y: 3,
        sprite: 'cabinet',
        binding: { kind: 'post', slug: 'microservices-with-nestjs' }
      }
    ],
    doors: [
      { x: 0, y: 6, to: 'case-room', entry: { x: 18, y: 6 } },
      { x: 19, y: 6, to: 'records', entry: { x: 1, y: 6 } }
    ]
  },
  {
    id: 'records',
    name: { en: 'Records', id: 'Rekaman' },
    grid: [
      '####################',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '+..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '#..................#',
      '####################'
    ],
    spawn: { x: 9, y: 6 },
    objects: [
      {
        id: 'rec-pegadaian',
        x: 4,
        y: 3,
        sprite: 'desk',
        binding: { kind: 'experience', slug: 'PT. Pegadaian' }
      },
      {
        id: 'rec-freelance',
        x: 9,
        y: 3,
        sprite: 'desk',
        binding: { kind: 'experience', slug: 'Freelance' }
      },
      {
        id: 'rec-skj',
        x: 14,
        y: 3,
        sprite: 'desk',
        binding: { kind: 'experience', slug: 'PT. Sumatera Kalimantan Jaya' }
      },
      {
        id: 'npc-rivaldy',
        x: 9,
        y: 8,
        sprite: 'npc-rivaldy',
        binding: { kind: 'npc', slug: 'npc-rivaldy' }
      }
    ],
    doors: [{ x: 0, y: 6, to: 'archive', entry: { x: 18, y: 6 } }]
  }
] satisfies Room[]

export const roomById: Record<string, Room> = Object.fromEntries(rooms.map((r) => [r.id, r]))
