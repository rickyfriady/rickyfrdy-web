import { describe, expect, it } from 'vitest'
import { contactSchema } from '@/utils/contactSchema'

describe('contactSchema', () => {
  it('accepts valid input', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki Friadi',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined()
    }
  })

  it('rejects short name (< 2 chars)', () => {
    const result = contactSchema.safeParse({
      name: 'R',
      email: 'ricki@example.com',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki',
      email: 'not-an-email',
      message: 'Hello, I would like to get in touch.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined()
    }
  })

  it('rejects short message (< 10 chars)', () => {
    const result = contactSchema.safeParse({
      name: 'Ricki',
      email: 'ricki@example.com',
      message: 'Hi',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined()
    }
  })

  it('rejects missing fields', () => {
    const result = contactSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
