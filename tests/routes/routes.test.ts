import { routes } from '@/router'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({ history: createWebHistory(), routes })

describe('router', () => {
  it('registers expected route names', () => {
    const names = router
      .getRoutes()
      .map((route) => route.name)
      .filter((name): name is string => typeof name === 'string')

    expect(names).toEqual(
      expect.arrayContaining([
        'home',
        'about',
        'experience',
        'projects',
        'project-detail',
        'blog',
        'blog-post',
        'contact'
      ])
    )
  })

  it('resolves page routes to expected names', () => {
    expect(router.resolve('/').name).toBe('home')
    expect(router.resolve('/projects').name).toBe('projects')
    expect(router.resolve('/projects/sample-slug').name).toBe('project-detail')
  })
})
