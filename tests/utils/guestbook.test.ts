import { describe, expect, it } from 'vitest'
import { isRateLimited, sanitizeMessage, validateEntry } from '@/utils/guestbook'
import { MESSAGE_MAX } from '@/utils/guestbookSchema'

describe('sanitizeMessage()', () => {
  it('strips all HTML/script markup', () => {
    expect(sanitizeMessage('<script>alert(1)</script>hi')).toBe('hi')
    expect(sanitizeMessage('<b>bold</b> text')).toBe('bold text')
    expect(sanitizeMessage('<img src=x onerror=alert(1)>')).toBe('')
  })
})

describe('validateEntry()', () => {
  it('accepts and sanitizes a valid message', () => {
    const res = validateEntry({ message: 'Hello <b>there</b>!' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.cleanMessage).toBe('Hello there!')
  })

  it('rejects too-short and too-long messages', () => {
    expect(validateEntry({ message: 'a' }).ok).toBe(false)
    expect(validateEntry({ message: 'x'.repeat(MESSAGE_MAX + 1) }).ok).toBe(false)
  })

  it('rejects when the honeypot is filled', () => {
    const res = validateEntry({ message: 'legit message', website: 'http://spam' })
    expect(res.ok).toBe(false)
  })

  it('rejects a message that is empty after sanitization', () => {
    const res = validateEntry({ message: '<script></script>' })
    expect(res.ok).toBe(false)
  })

  it('rejects non-object payloads', () => {
    expect(validateEntry(null).ok).toBe(false)
    expect(validateEntry('nope').ok).toBe(false)
  })
})

describe('isRateLimited()', () => {
  it('allows up to max then blocks within the window', () => {
    const store = new Map<string, number[]>()
    const opts = { windowMs: 1000, max: 3, now: 1000 }
    expect(isRateLimited('ip', store, opts)).toBe(false) // 1
    expect(isRateLimited('ip', store, opts)).toBe(false) // 2
    expect(isRateLimited('ip', store, opts)).toBe(false) // 3
    expect(isRateLimited('ip', store, opts)).toBe(true) // 4 → over
  })

  it('resets after the window passes', () => {
    const store = new Map<string, number[]>()
    for (let i = 0; i < 5; i++) isRateLimited('ip', store, { windowMs: 1000, max: 3, now: 1000 })
    expect(isRateLimited('ip', store, { windowMs: 1000, max: 3, now: 3000 })).toBe(false)
  })

  it('tracks keys independently', () => {
    const store = new Map<string, number[]>()
    const opts = { windowMs: 1000, max: 1, now: 1000 }
    expect(isRateLimited('a', store, opts)).toBe(false)
    expect(isRateLimited('b', store, opts)).toBe(false)
    expect(isRateLimited('a', store, opts)).toBe(true)
  })
})
