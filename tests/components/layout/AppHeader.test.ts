import AppHeader from '@/components/layout/AppHeader.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

function makeRouter(path = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/about', component: { template: '<div />' } },
      { path: '/works', component: { template: '<div />' } },
      { path: '/projects', component: { template: '<div />' } },
      { path: '/contact', component: { template: '<div />' } }
    ]
  })
  router.push(path)
  return router
}

describe('AppHeader', () => {
  it('renders logo text', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getByText('Ricki')).toBeInTheDocument()
    expect(screen.getByText('Friadi')).toBeInTheDocument()
  })

  it('renders all 5 nav links', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /about/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /works/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /projects/i })[0]).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /contact/i })[0]).toBeInTheDocument()
  })

  it('marks the active route link with the accent border class', async () => {
    const router = makeRouter('/about')
    await router.isReady()
    const { container } = render(AppHeader, { global: { plugins: [router] } })
    const activeLinks = container.querySelectorAll('.border-accent')
    expect(activeLinks.length).toBeGreaterThan(0)
  })

  it('renders Start a Project CTA in the left rail', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppHeader, { global: { plugins: [router] } })
    expect(screen.getByRole('link', { name: /start a project/i })).toBeInTheDocument()
  })
})
