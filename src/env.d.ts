/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string
  readonly WAKATIME_API_KEY?: string
  /** Server-side only — powers generative RAG answers on /api/ask. */
  readonly ANTHROPIC_API_KEY?: string
}
