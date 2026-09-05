// -----------------------------------------------------------------------------
// Generative RAG endpoint (on-demand). Runs as a Vercel serverless function via
// the @astrojs/vercel adapter; `prerender = false` opts it out of the static build.
//
// Requires the server-side secret ANTHROPIC_API_KEY (set in the Vercel dashboard,
// never exposed to the client). If it is unset the endpoint returns 502 and the
// /ask UI falls back to showing semantic results only.
//
// The client (src/pages/ask.astro) embeds the query and ranks chunks locally, so
// this endpoint only generates over PUBLIC retrieved content — no secret ever
// reaches the browser.
// -----------------------------------------------------------------------------
import type { APIRoute } from 'astro'
import { buildRagPrompt, hasSufficientContext, RAG_REFUSAL } from '@/utils/ragAnswer'
import type { SearchResult } from '@/utils/ragSearch'

export const prerender = false

// --- naive in-memory rate limit (replace with a durable store on multi-instance hosts) ---
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 })
  }

  let body: { query?: string; results?: SearchResult[] }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 })
  }

  const query = (body.query ?? '').toString().slice(0, 500).trim()
  const results = Array.isArray(body.results) ? body.results.slice(0, 6) : []
  if (!query) return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400 })

  if (!hasSufficientContext(results)) {
    return new Response(JSON.stringify({ answer: RAG_REFUSAL, sources: [] }), {
      headers: { 'content-type': 'application/json' }
    })
  }

  const { system, user } = buildRagPrompt(query, results)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': import.meta.env.ANTHROPIC_API_KEY as string
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: user }]
    })
  })

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'upstream' }), { status: 502 })
  }

  const data = await res.json()
  const answer = data?.content?.[0]?.text ?? RAG_REFUSAL
  return new Response(
    JSON.stringify({ answer, sources: results.map((r) => ({ title: r.title, url: r.url })) }),
    { headers: { 'content-type': 'application/json' } }
  )
}
