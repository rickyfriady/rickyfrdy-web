# AI site search — how it works & ops

Two layers over the site's own content (blog posts + project case studies):

1. **Semantic search (always on, static).** A build-time embedding index is
   ranked in the browser. No backend, no secret, no per-query cost.
2. **Generative RAG answer (optional).** A Vercel serverless function calls Claude
   to write a short cited answer over the retrieved chunks.

## Data flow

```
/ask page (static)
  │  user question
  ▼
transformers.js in the browser  ──embed──►  cosine rank vs embeddings.json
  │  top-k public chunks (title/url/text/score)
  ▼
POST /api/ask  (Vercel serverless, prerender=false)
  │  buildRagPrompt (context-only) → Claude
  ▼
cited answer  ──►  rendered above the source list
```

The browser does the retrieval, so the endpoint only ever sees **public**
content — the API key never reaches the client.

## Regenerating the index

Whenever blog/project content changes:

```bash
npm run embeddings      # re-embeds → src/data/embeddings.json (commit it)
```

Model: `Xenova/all-MiniLM-L6-v2` (384-dim). To improve Indonesian queries, swap
`MODEL` in `scripts/build-embeddings.ts` and `src/pages/ask.astro` to a
multilingual model (e.g. `Xenova/multilingual-e5-small`) and regenerate.

## Enabling the generative answer

1. Get a key: <https://console.anthropic.com/settings/keys>
2. Set `ANTHROPIC_API_KEY` in Vercel (Project → Settings → Environment Variables),
   or in local `.env` for `astro dev`.
3. Deploy. That's it — the `/ask` UI auto-detects the answer and renders it.

**If the key is unset:** `/api/ask` returns 502 and the UI silently falls back to
semantic results only. Nothing breaks.

## Guardrails (in `src/utils/ragAnswer.ts` + `src/pages/api/ask.ts`)

- Context-only system prompt; refuses (`RAG_REFUSAL`) when sources don't cover the question.
- `hasSufficientContext` short-circuits generation when the top score is too low.
- Rate limit: 8 requests/min per IP (in-memory; swap for a durable store on multi-instance hosts).
- Query capped at 500 chars; max 6 sources; `max_tokens: 400`.
- Model: `claude-haiku-4-5-20251001` (cheap). Change in `src/pages/api/ask.ts`.
