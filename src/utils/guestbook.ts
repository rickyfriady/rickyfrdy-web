import sanitizeHtml from 'sanitize-html'
import { type GuestbookCreateInput, guestbookCreateSchema } from '@/utils/guestbookSchema'

export interface ValidationOk {
  ok: true
  data: GuestbookCreateInput
  /** Sanitized, plain-text message safe to store and render. */
  cleanMessage: string
}
export interface ValidationErr {
  ok: false
  error: string
}
export type ValidationResult = ValidationOk | ValidationErr

/** Strip ALL markup — guestbook messages are plain text only. */
export function sanitizeMessage(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim()
}

/**
 * Validate + sanitize a create payload. Rejects honeypot hits, bad lengths,
 * and messages that become empty after sanitization.
 */
export function validateEntry(payload: unknown): ValidationResult {
  const parsed = guestbookCreateSchema.safeParse(payload)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  if (parsed.data.website) {
    return { ok: false, error: 'Rejected' } // honeypot filled → bot
  }
  const cleanMessage = sanitizeMessage(parsed.data.message)
  if (cleanMessage.length === 0) {
    return { ok: false, error: 'Message is empty after sanitization' }
  }
  return { ok: true, data: parsed.data, cleanMessage }
}

/**
 * Fixed-window rate limiter over an in-memory map. `now`/`store` are injectable
 * for testing; production callers pass a module-level Map (single instance) or a
 * durable store on multi-instance hosts.
 */
export function isRateLimited(
  key: string,
  store: Map<string, number[]>,
  {
    windowMs = 60_000,
    max = 5,
    now = Date.now()
  }: { windowMs?: number; max?: number; now?: number } = {}
): boolean {
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  store.set(key, recent)
  return recent.length > max
}
