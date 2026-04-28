import type { Project, ProjectFilter } from '@/types/project'
import { computed, ref } from 'vue'

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<ProjectFilter>('all')
  const selectedTech = ref<string>('all')
  const sortBy = ref<'featured' | 'recent' | 'year'>('featured')

  async function fetchProjects() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/projects.json')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      projects.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const filteredProjects = computed(() => {
    let filtered = projects.value

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory.value)
    }

    // Filter by technology
    if (selectedTech.value !== 'all') {
      filtered = filtered.filter((p) =>
        p.technologies.some((tech) => tech.toLowerCase().includes(selectedTech.value.toLowerCase()))
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy.value === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy.value === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.year - a.year
      }
    })

    return sorted
  })

  const featuredProjects = computed(() => projects.value.filter((p) => p.featured).slice(0, 3))

  const allTechnologies = computed(() => {
    const techSet = new Set<string>()
    projects.value.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  })

  function getProjectBySlug(slug: string): Project | undefined {
    return projects.value.find((p) => p.slug === slug)
  }

  function setCategory(category: ProjectFilter) {
    selectedCategory.value = category
  }

  function setTechnology(tech: string) {
    selectedTech.value = tech
  }

  function setSortBy(sort: 'featured' | 'recent' | 'year') {
    sortBy.value = sort
  }

  function resetFilters() {
    selectedCategory.value = 'all'
    selectedTech.value = 'all'
    sortBy.value = 'featured'
  }

  return {
    projects,
    loading,
    error,
    selectedCategory,
    selectedTech,
    sortBy,
    filteredProjects,
    featuredProjects,
    allTechnologies,
    fetchProjects,
    getProjectBySlug,
    setCategory,
    setTechnology,
    setSortBy,
    resetFilters
  }
}
