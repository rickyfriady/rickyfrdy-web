export interface Metric {
  value: string
  label: string
}

export interface CodeSnippet {
  title: string
  description: string
  language: string
  code: string
}

export interface Project {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  featured: boolean
  category: 'web-app' | 'api' | 'tool' | 'open-source'
  type: 'project' | 'work'
  technologies: string[]
  keyMetric?: string
  heroImage?: string
  role?: string
  metrics?: Metric[]
  liveUrl?: string
  githubUrl?: string
  company?: string
  companyLogo?: string
  date: string
  year: number
  challenges: string[]
  solutions: string[]
  results: string[]
  codeSnippets?: CodeSnippet[]
}

export type ProjectCategory = Project['category']
export type ProjectFilter = 'all' | ProjectCategory
export type SortOrder = 'featured' | 'recent' | 'year'
