export interface EmbeddedChunk {
  id: string
  title: string
  url: string
  index: number
  text: string
  /** Unit-normalized embedding vector */
  vector: number[]
}

export interface SearchResult extends EmbeddedChunk {
  score: number
}

/** The static index shipped with the site. */
export interface EmbeddingIndex {
  model: string
  dim: number
  chunks: EmbeddedChunk[]
}

/**
 * Cosine similarity. Assumes inputs may be unnormalized; divides by norms.
 * When both vectors are already unit-normalized this equals their dot product.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

/**
 * Rank index chunks against a query vector, returning the top-k above `minScore`,
 * de-duplicated so at most one chunk per source doc surfaces (highest score wins).
 */
export function rankChunks(
  query: number[],
  index: EmbeddingIndex,
  {
    topK = 6,
    minScore = 0.2,
    dedupeBySource = true
  }: { topK?: number; minScore?: number; dedupeBySource?: boolean } = {}
): SearchResult[] {
  const scored: SearchResult[] = index.chunks
    .map((chunk) => ({ ...chunk, score: cosineSimilarity(query, chunk.vector) }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)

  if (!dedupeBySource) return scored.slice(0, topK)

  const seen = new Set<string>()
  const deduped: SearchResult[] = []
  for (const r of scored) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    deduped.push(r)
    if (deduped.length >= topK) break
  }
  return deduped
}
