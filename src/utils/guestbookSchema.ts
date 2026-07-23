import { z } from 'zod'

export const MESSAGE_MAX = 280
export const MESSAGE_MIN = 2

/** Payload accepted from the client when creating an entry. */
export const guestbookCreateSchema = z.object({
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, 'Message is too short')
    .max(MESSAGE_MAX, 'Message is too long'),
  // Honeypot: must be empty. Bots tend to fill every field.
  website: z.string().max(0).optional().default('')
})

export type GuestbookCreateInput = z.infer<typeof guestbookCreateSchema>

/** A stored/rendered entry. */
export interface GuestbookEntry {
  id: string
  authorId: string
  authorName: string
  message: string
  createdAt: string
  hidden: boolean
}
