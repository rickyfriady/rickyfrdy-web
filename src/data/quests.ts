import type { Npc, Quest } from '@/models'

/**
 * NPCs and their cases.
 *
 * Identity is derived, never duplicated: `collaborator` must match a name in
 * `src/data/collaborators.ts`, and the scene reads role and company from
 * there. A role change in the source data changes the NPC with no edit here.
 *
 * Hard rule, enforced by review and by test: an NPC representing a real person
 * gives instructions and context only. No testimonial, endorsement, or
 * evaluative claim about the site owner's work may be put in their mouth —
 * these are people with public profiles who can be contacted, and `PRODUCT.md`
 * records that no testimonial exists.
 */
export const npcs = [
  {
    id: 'npc-laura',
    collaborator: 'Laura Elisabeth Sinaga',
    questIds: ['case-review'],
    // A fiction of where a character stands, not a claim about a real
    // person's day: working hours in the Workshop, an evening by the pond.
    schedule: [
      {
        from: 0,
        to: 9,
        away: {
          en: 'Laura is out of the valley. Back at 09:00.',
          id: 'Laura sedang di luar lembah. Kembali pukul 09.00.'
        }
      },
      { from: 9, to: 13, room: 'workshop', x: 13, y: 7 },
      // Same room, so a visitor with the page open at 13:00 sees her walk over.
      { from: 13, to: 17, room: 'workshop', x: 8, y: 5 },
      { from: 17, to: 20, room: 'valley', x: 24, y: 19 },
      {
        from: 20,
        to: 24,
        away: {
          en: 'Laura is out of the valley. Back at 09:00.',
          id: 'Laura sedang di luar lembah. Kembali pukul 09.00.'
        }
      }
    ]
  },
  {
    id: 'npc-rivaldy',
    collaborator: 'Rivaldy Firmansyah',
    questIds: ['archive-run', 'record-check'],
    schedule: [
      {
        from: 0,
        to: 8,
        away: {
          en: 'Rivaldy is out of the valley. Back at 08:00.',
          id: 'Rivaldy sedang di luar lembah. Kembali pukul 08.00.'
        }
      },
      { from: 8, to: 12, room: 'records', x: 9, y: 7 },
      { from: 12, to: 13, room: 'valley', x: 23, y: 15 },
      { from: 13, to: 16, room: 'records', x: 9, y: 7 },
      { from: 16, to: 18, room: 'records', x: 15, y: 6 },
      {
        from: 18,
        to: 24,
        away: {
          en: 'Rivaldy is out of the valley. Back at 08:00.',
          id: 'Rivaldy sedang di luar lembah. Kembali pukul 08.00.'
        }
      }
    ]
  }
] satisfies Npc[]

export const quests = [
  {
    id: 'case-review',
    npcId: 'npc-laura',
    title: { en: 'Unopened shelves', id: 'Rak yang belum dibuka' },
    passages: [
      {
        en: 'Three shelves in the Workshop have not been opened yet: Singel, Microsite, and AIRA.',
        id: 'Tiga rak di Bengkel belum dibuka: Singel, Microsite, dan AIRA.'
      },
      {
        en: 'Open each one and read what it says. I only mark what I have seen.',
        id: 'Buka satu per satu dan baca isinya. Saya hanya menandai yang sudah saya lihat.'
      }
    ],
    completedBy: ['inspect:singel-app', 'inspect:microsite-pinjaman', 'inspect:aira-reconciliation']
  },
  {
    id: 'archive-run',
    npcId: 'npc-rivaldy',
    requires: 'case-review',
    title: { en: 'One page in the Journal', id: 'Satu halaman di Jurnal' },
    passages: [
      {
        en: 'The Journal house has one written piece so far, on microservices.',
        id: 'Rumah Jurnal baru berisi satu tulisan, tentang microservices.'
      },
      {
        en: 'Read it, then find me again. The Records hall is along the same road.',
        id: 'Baca dulu, lalu temui saya lagi. Balai Catatan ada di jalan yang sama.'
      }
    ],
    completedBy: ['inspect:microservices-with-nestjs'],
    destination: '/blog/microservices-with-nestjs'
  },
  {
    id: 'record-check',
    npcId: 'npc-rivaldy',
    requires: 'archive-run',
    title: { en: 'The record', id: 'Catatan kerja' },
    passages: [
      {
        en: 'Three counters in the Records hall, three places Ricki has worked. Check each one and the record is complete.',
        id: 'Tiga meja di Balai Catatan, tiga tempat Ricki pernah bekerja. Periksa semuanya dan catatannya lengkap.'
      }
    ],
    completedBy: [
      'inspect:PT. Pegadaian',
      'inspect:Freelance',
      'inspect:PT. Sumatera Kalimantan Jaya'
    ],
    destination: '/experience'
  }
] satisfies Quest[]
