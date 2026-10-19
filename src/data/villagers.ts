import type { Villager } from '@/models'

/**
 * Fictional villagers: scenery that walks.
 *
 * They are kept apart from `quests.ts` on purpose. A collaborator is a real
 * person with a schedule, a quest and a name; a villager is none of those, so
 * it lives in its own list with its own type and nothing here can reach the
 * destination list, the quest log or the character sheet.
 *
 * Spots sit beside fences, props and fields, off the roads and away from every
 * door and signpost. `tests/data/villagers.test.ts` checks that.
 */
export const villagers = [
  {
    id: 'farmer-1',
    archetype: 'farmer',
    sheet: 'villager-farmer-wheat',
    room: 'valley',
    spots: [
      { x: 3, y: 22 },
      { x: 8, y: 22 },
      { x: 13, y: 22 },
      { x: 8, y: 20 }
    ],
    remarks: [
      { en: 'Good soil this year.', id: 'Tanahnya subur tahun ini.' },
      { en: 'Rain by evening, I think.', id: 'Sepertinya hujan menjelang sore.' },
      { en: 'Mind the rows.', id: 'Hati-hati dengan barisannya.' }
    ]
  },
  {
    id: 'farmer-2',
    archetype: 'farmer',
    sheet: 'villager-farmer-sky',
    room: 'valley',
    spots: [
      { x: 25, y: 29 },
      { x: 31, y: 28 },
      { x: 36, y: 22 }
    ],
    remarks: [
      { en: 'The pond is full again.', id: 'Kolamnya penuh lagi.' },
      { en: 'Slow work is good work.', id: 'Pelan-pelan, hasilnya bagus.' }
    ]
  },
  {
    id: 'child-1',
    archetype: 'child',
    sheet: 'villager-child-peach',
    room: 'valley',
    spots: [
      { x: 25, y: 21 },
      { x: 26, y: 25 },
      { x: 32, y: 26 },
      { x: 34, y: 20 }
    ],
    remarks: [
      { en: 'Race you to the pond!', id: 'Ayo balapan ke kolam!' },
      { en: 'I found a smooth stone.', id: 'Aku menemukan batu yang licin.' }
    ]
  },
  {
    id: 'child-2',
    archetype: 'child',
    sheet: 'villager-child-mint',
    room: 'valley',
    spots: [
      { x: 10, y: 26 },
      { x: 16, y: 28 },
      { x: 7, y: 25 }
    ],
    remarks: [
      { en: 'Shh, a butterfly.', id: 'Sst, ada kupu-kupu.' },
      { en: 'Tag, you are it.', id: 'Kena, sekarang kamu yang jaga.' }
    ]
  },
  {
    id: 'shopkeeper-1',
    archetype: 'shopkeeper',
    sheet: 'villager-shopkeeper-plum',
    room: 'valley',
    spots: [
      { x: 11, y: 15 },
      { x: 18, y: 15 },
      { x: 24, y: 15 },
      { x: 31, y: 15 }
    ],
    remarks: [
      { en: 'Fresh bread by noon.', id: 'Roti segar menjelang siang.' },
      { en: 'Nothing on the shelf today.', id: 'Hari ini rak masih kosong.' }
    ]
  },
  {
    id: 'wanderer-1',
    archetype: 'wanderer',
    sheet: 'villager-wanderer-dusk',
    room: 'valley',
    spots: [
      { x: 6, y: 28 },
      { x: 12, y: 29 },
      { x: 27, y: 28 },
      { x: 34, y: 29 }
    ],
    remarks: [
      { en: 'The road is long and the grass is soft.', id: 'Jalannya panjang, rumputnya empuk.' },
      { en: 'Just passing through.', id: 'Hanya lewat.' }
    ]
  }
] satisfies Villager[]
