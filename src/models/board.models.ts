/**
 * The investigation board's card contract — deliberately thin.
 *
 * The board only ever needs a title, a category, tech tags, and a URL. Keeping
 * it to that is what lets the destination pages (`/blog`, `/experience`,
 * `/about`) get their own bespoke designs later without the board having to
 * change at all.
 */
export interface BoardCard {
  /** Stable unique id, used as the React key and the thread endpoint. */
  id: string
  title: string
  /** Human-readable category shown on the card face. */
  category: string
  /** Drives thread connections. Two cards sharing a tag get a thread. */
  tags: string[]
  /** Destination, already localized. */
  url: string
  /** Broad kind, used for grouping and the mobile stack ordering. */
  kind: 'subject' | 'exhibit' | 'note' | 'record'
  /** Deterministic position on the board canvas, in canvas units. */
  x: number
  y: number
}

/** A red string between two cards that share at least one tag. */
export interface BoardThread {
  from: string
  to: string
  /** The tags responsible, so the UI can explain the connection. */
  shared: string[]
}
