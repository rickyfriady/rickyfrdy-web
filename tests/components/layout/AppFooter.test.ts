import AppFooter from '@/components/layout/AppFooter.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

function makeRouter(path = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }]
  })
  router.push(path)
  return router
}

describe('AppFooter', () => {
  it('renders the colophon text', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppFooter, { global: { plugins: [router] } })
    expect(screen.getByText(/Ricki Friadi/)).toBeInTheDocument()
    expect(screen.getByText(/Built with Vue 3/)).toBeInTheDocument()
  })

  it('renders GitHub social link', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppFooter, { global: { plugins: [router] } })
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rickyfrdy')
  })

  it('renders LinkedIn social link', async () => {
    const router = makeRouter()
    await router.isReady()
    render(AppFooter, { global: { plugins: [router] } })
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink).toBeInTheDocument()
  })
})
