import type { SearchResult } from '@/utils/ragSearch'

export interface RagPrompt {
  system: string
  user: string
}

export const RAG_REFUSAL = "I don't have information about that on this site."

/**
 * Build a context-only prompt for the generative RAG answer. The system prompt
 * constrains the model to the retrieved context and to refuse otherwise; the
 * user message carries the numbered sources so the model can cite them.
 */
export function buildRagPrompt(query: string, results: SearchResult[]): RagPrompt {
  const sources = results.map((r, i) => `[${i + 1}] ${r.title} (${r.url})\n${r.text}`).join('\n\n')

  const system = [
    "You are a helpful assistant answering questions about Ricki Friadi's portfolio site.",
    'Answer ONLY using the numbered sources provided. Do not use outside knowledge.',
    `If the sources do not contain the answer, reply exactly: "${RAG_REFUSAL}"`,
    'Cite the sources you use inline with their bracketed numbers, e.g. [1].',
    'Be concise (2-4 sentences).'
  ].join(' ')

  const user = `Question: ${query}\n\nSources:\n${sources}`
  return { system, user }
}

/**
 * Whether retrieval is strong enough to attempt generation. If the best score
 * is below the floor, the caller should short-circuit to RAG_REFUSAL rather
 * than ask the model to answer from weak context.
 */
export function hasSufficientContext(results: SearchResult[], floor = 0.3): boolean {
  return results.length > 0 && results[0].score >= floor
}
