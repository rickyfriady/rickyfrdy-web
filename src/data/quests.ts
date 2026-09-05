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
  { id: 'npc-laura', collaborator: 'Laura Elisabeth Sinaga', questIds: ['case-review'] },
  {
    id: 'npc-rivaldy',
    collaborator: 'Rivaldy Firmansyah',
    questIds: ['archive-run', 'record-check']
  }
] satisfies Npc[]

export const quests = [
  {
    id: 'case-review',
    npcId: 'npc-laura',
    title: { en: 'Unverified files', id: 'Berkas belum diperiksa' },
    passages: [
      {
        en: 'Three files in this room have not been opened yet. Singel, Microsite, and AIRA.',
        id: 'Tiga berkas di ruangan ini belum dibuka. Singel, Microsite, dan AIRA.'
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
    title: { en: 'One note in the archive', id: 'Satu catatan di arsip' },
    passages: [
      {
        en: 'Next door there is one written note, on microservices. It is the only one filed so far.',
        id: 'Di ruang sebelah ada satu catatan tertulis, tentang microservices. Baru itu yang diarsipkan.'
      },
      {
        en: 'Read it, then come back. The records room is behind the archive.',
        id: 'Baca dulu, lalu kembali. Ruang rekaman ada di balik arsip.'
      }
    ],
    completedBy: ['inspect:microservices-with-nestjs'],
    destination: '/blog/microservices-with-nestjs'
  },
  {
    id: 'record-check',
    npcId: 'npc-rivaldy',
    requires: 'archive-run',
    title: { en: 'The record', id: 'Rekaman kerja' },
    passages: [
      {
        en: 'Three desks, three places on the record. Check each one and the file is complete.',
        id: 'Tiga meja, tiga tempat di rekaman. Periksa semuanya dan berkasnya lengkap.'
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
