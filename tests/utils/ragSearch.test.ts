import { describe, expect, it } from 'vitest'
import { chunkDoc, stripMarkdown } from '@/utils/chunk'
import { buildRagPrompt, hasSufficientContext, RAG_REFUSAL } from '@/utils/ragAnswer'
import { cosineSimilarity, type EmbeddingIndex, rankChunks } from '@/utils/ragSearch'

describe('stripMarkdown()', () => {
  it('removes code fences, links, and markup', () => {
    const out = stripMarkdown('# Title\n\n```js\ncode\n```\n\n[link](https://x.com) and **bold**')
    expect(out).not.toContain('```')
    expect(out).not.toContain('](')
    expect(out).toContain('link')
    expect(out).toContain('bold')
  })
})

describe('chunkDoc()', () => {
  const doc = { id: 'blog:x', title: 'X', url: '/blog/x/', body: '' }

  it('produces chunks carrying source metadata', () => {
    const chunks = chunkDoc({ ...doc, body: 'Alpha paragraph.\n\nBeta paragraph.' }, 1000)
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks[0]).toMatchObject({ id: 'blog:x', title: 'X', url: '/blog/x/', index: 0 })
  })

  it('splits long content into multiple chunks', () => {
    const long = Array.from(
      { length: 20 },
      (_, i) => `Paragraph number ${i} with some words.`
    ).join('\n\n')
    const chunks = chunkDoc({ ...doc, body: long }, 200)
    expect(chunks.length).toBeGreaterThan(1)
    for (const [i, c] of chunks.entries()) expect(c.index).toBe(i)
  })
})

describe('cosineSimilarity()', () => {
  it('is 1 for identical vectors and 0 for orthogonal', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1)
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0)
  })

  it('returns 0 for mismatched or empty vectors', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2])).toBe(0)
    expect(cosineSimilarity([], [])).toBe(0)
  })
})

const index: EmbeddingIndex = {
  model: 'test',
  dim: 2,
  chunks: [
    { id: 'a', title: 'A', url: '/a/', index: 0, text: 'a0', vector: [1, 0] },
    { id: 'a', title: 'A', url: '/a/', index: 1, text: 'a1', vector: [0.9, 0.1] },
    { id: 'b', title: 'B', url: '/b/', index: 0, text: 'b0', vector: [0, 1] }
  ]
}

describe('rankChunks()', () => {
  it('ranks by similarity and dedupes by source', () => {
    // [1,1] is closest to a1 ([0.9,0.1]), then a0/b tie — a wins its source, then b.
    const res = rankChunks([1, 1], index, { topK: 5, minScore: 0.1 })
    expect(res.map((r) => r.id)).toEqual(['a', 'b'])
    expect(res[0].score).toBeGreaterThan(res[1].score)
  })

  it('drops results below minScore (out-of-scope query)', () => {
    const res = rankChunks([-1, 0], index, { minScore: 0.2 })
    expect(res).toHaveLength(0)
  })

  it('can keep multiple chunks per source when dedupe disabled', () => {
    const res = rankChunks([1, 0], index, { topK: 5, minScore: 0.1, dedupeBySource: false })
    expect(res.filter((r) => r.id === 'a')).toHaveLength(2)
  })
})

describe('buildRagPrompt() / hasSufficientContext()', () => {
  const results = [{ ...index.chunks[0], score: 0.8 }]

  it('constrains to sources and includes refusal instruction', () => {
    const { system, user } = buildRagPrompt('what is A?', results)
    expect(system).toContain(RAG_REFUSAL)
    expect(user).toContain('what is A?')
    expect(user).toContain('[1]')
  })

  it('gates generation on retrieval strength', () => {
    expect(hasSufficientContext(results, 0.3)).toBe(true)
    expect(hasSufficientContext([{ ...index.chunks[0], score: 0.1 }], 0.3)).toBe(false)
    expect(hasSufficientContext([], 0.3)).toBe(false)
  })
})
