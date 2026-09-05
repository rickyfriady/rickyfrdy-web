import { describe, expect, it } from 'vitest'
import { collaborators } from '@/data/collaborators'
import { companionReactions } from '@/data/companion'
import { npcs, quests } from '@/data/quests'

describe('quest data', () => {
  it('has a unique stable id per quest', () => {
    const ids = quests.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('carries both EN and ID copy for every title and passage', () => {
    for (const quest of quests) {
      expect(quest.title.en.length, `${quest.id} en title`).toBeGreaterThan(0)
      expect(quest.title.id.length, `${quest.id} id title`).toBeGreaterThan(0)
      for (const [index, passage] of quest.passages.entries()) {
        expect(passage.en.length, `${quest.id} passage ${index} en`).toBeGreaterThan(0)
        expect(passage.id.length, `${quest.id} passage ${index} id`).toBeGreaterThan(0)
      }
    }
  })

  it('never leaves a translation identical to the English, which reads as a missed one', () => {
    for (const quest of quests) {
      expect(quest.title.id, `${quest.id} title is untranslated`).not.toBe(quest.title.en)
    }
  })

  it('declares at least one completion condition per quest', () => {
    for (const quest of quests) {
      expect(quest.completedBy.length, quest.id).toBeGreaterThan(0)
    }
  })

  it('points every prerequisite at a quest that exists', () => {
    const ids = new Set(quests.map((q) => q.id))
    for (const quest of quests) {
      if (quest.requires) expect(ids.has(quest.requires), `${quest.id} requires`).toBe(true)
    }
  })

  it('points every quest at an NPC that exists', () => {
    const ids = new Set(npcs.map((n) => n.id))
    for (const quest of quests) expect(ids.has(quest.npcId), quest.id).toBe(true)
  })
})

describe('NPCs are real people, handled as such', () => {
  it('derives every NPC from the collaborators data', () => {
    const names = new Set(collaborators.map((c) => c.name))
    for (const npc of npcs) expect(names.has(npc.collaborator), npc.id).toBe(true)
  })

  /**
   * `PRODUCT.md` records that this site has no testimonials. An NPC modelled on
   * a real person with a public LinkedIn must not become one by accident.
   */
  it('puts no endorsement or evaluative claim about the owner in a real name', () => {
    const forbidden =
      /\b(best|brilliant|excellent|amazing|talented|genius|recommend|hebat|terbaik|luar biasa|berbakat|merekomendasikan)\b/i
    for (const quest of quests) {
      for (const passage of quest.passages) {
        expect(passage.en, `${quest.id} en`).not.toMatch(forbidden)
        expect(passage.id, `${quest.id} id`).not.toMatch(forbidden)
      }
    }
  })
})

describe('companion reactions', () => {
  it('carries both locales for every route it speaks on', () => {
    for (const [route, copy] of Object.entries(companionReactions)) {
      expect(copy.en.length, route).toBeGreaterThan(0)
      expect(copy.id.length, route).toBeGreaterThan(0)
    }
  })
})
