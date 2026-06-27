export interface Collaborator {
  name: string
  role: string
  photo?: string
  linkedin?: string
  website?: string
  /** Featured collaborators surface in the bento grid; rest go in the "Show more" list. */
  featured?: boolean
  /** Short pull quote — shown only when featured. */
  quote?: string
}
