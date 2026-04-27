import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('FeaturedProjects', () => {
  it('renders a file-path header for each project', () => {
    render(FeaturedProjects)
    expect(screen.getByText('~/projects/ecommerce-platform/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/api-gateway/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/analytics-dashboard/')).toBeInTheDocument()
  })

  it('renders metric lines with arrow prefix', () => {
    render(FeaturedProjects)
    expect(screen.getByText('→ Handles 10K+ daily transactions')).toBeInTheDocument()
  })

  it('renders case study links', () => {
    render(FeaturedProjects)
    const caseLinks = screen.getAllByRole('link', { name: /read case study/i })
    expect(caseLinks).toHaveLength(3)
  })

  it('renders project title when no image is provided', () => {
    render(FeaturedProjects)
    // All projects have no image in the default data — titles render as headings
    expect(screen.getByRole('heading', { name: 'E-Commerce Platform' })).toBeInTheDocument()
  })
})
