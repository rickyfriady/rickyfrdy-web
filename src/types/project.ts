export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  thumbnail: string
  images: string[]
  featured: boolean
  category: 'web-app' | 'api' | 'tool' | 'open-source'
  technologies: string[]
  keyMetric?: string
  liveUrl?: string
  githubUrl?: string
  date: string
  year: number
  challenges: string[]
  solutions: string[]
  results: string[]
  codeSnippets?: CodeSnippet[]
}

export interface CodeSnippet {
  title: string
  description: string
  language: string
  code: string
}

export type ProjectCategory = Project['category']
export type ProjectFilter = 'all' | ProjectCategory | string
