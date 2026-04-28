import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/project'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'alpha-api',
    title: 'Alpha API',
    shortDescription: 'API project',
    fullDescription: 'Alpha API full description',
    thumbnail: '/a.jpg',
    images: ['/a1.jpg'],
    featured: true,
    category: 'api',
    technologies: ['Node.js', 'TypeScript'],
    date: '2025-01-10',
    year: 2025,
    challenges: ['Scale requests'],
    solutions: ['Caching layer'],
    results: ['2x faster']
  },
  {
    id: '2',
    slug: 'beta-tool',
    title: 'Beta Tool',
    shortDescription: 'Tooling project',
    fullDescription: 'Beta Tool full description',
    thumbnail: '/b.jpg',
    images: ['/b1.jpg'],
    featured: false,
    category: 'tool',
    technologies: ['Vue 3', 'Tailwind'],
    date: '2024-02-20',
    year: 2024,
    challenges: ['UX consistency'],
    solutions: ['Component library'],
    results: ['Delivery speed up']
  }
]

describe('useProjects', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => PROJECTS
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches projects and exposes filtered/sorted state', async () => {
    const store = useProjects()

    await store.fetchProjects()

    expect(store.error.value).toBeNull()
    expect(store.loading.value).toBe(false)
    expect(store.projects.value).toHaveLength(2)
    expect(store.filteredProjects.value[0]?.slug).toBe('alpha-api')

    store.setCategory('tool')
    expect(store.filteredProjects.value).toHaveLength(1)
    expect(store.filteredProjects.value[0]?.slug).toBe('beta-tool')

    store.resetFilters()
    expect(store.selectedCategory.value).toBe('all')
    expect(store.selectedTech.value).toBe('all')
    expect(store.sortBy.value).toBe('featured')
  })
})
