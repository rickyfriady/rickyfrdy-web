import BlogPage from '@/components/page/blog/BlogPage.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

function makeRouter(path = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/blog', component: { template: '<div />' } }
    ]
  })
  router.push(path)
  return router
}

describe('BlogPage', () => {
  it('renders Coming Soon heading', async () => {
    const router = makeRouter('/blog')
    await router.isReady()
    render(BlogPage, { global: { plugins: [router] } })
    expect(screen.getByRole('heading', { name: /coming soon/i })).toBeInTheDocument()
  })

  it('renders the field notes chapter label', async () => {
    const router = makeRouter('/blog')
    await router.isReady()
    render(BlogPage, { global: { plugins: [router] } })
    expect(screen.getByText(/§ 01 — Field Notes/i)).toBeInTheDocument()
  })

  it('does not render any article links', async () => {
    const router = makeRouter('/blog')
    await router.isReady()
    render(BlogPage, { global: { plugins: [router] } })
    expect(screen.queryAllByRole('link', { name: /read article/i })).toHaveLength(0)
  })

  it('renders a back-to-home link', async () => {
    const router = makeRouter('/blog')
    await router.isReady()
    render(BlogPage, { global: { plugins: [router] } })
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
  })
})
