export interface Collaborator {
  name: string
  role: string
  company: string
  photo?: string
  companyLogo?: string
  linkedin?: string
  website?: string
  /** Featured collaborators surface in the photo/logo card grid; rest go in the "Show more" list. */
  featured?: boolean
}
