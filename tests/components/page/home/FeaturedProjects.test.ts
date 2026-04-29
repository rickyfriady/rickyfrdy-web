import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('FeaturedProjects', () => {
  it('renders a file-path header for each project', () => {
    render(FeaturedProjects)
    expect(screen.getByText('~/projects/singel-app/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/microsite-pinjaman/')).toBeInTheDocument()
    expect(screen.getByText('~/projects/kamila-app/')).toBeInTheDocument()
  })

  it('renders metric lines with arrow prefix', () => {
    render(FeaturedProjects)
    expect(screen.getByText('→ ≥80% unit test coverage, CI/CD enforced')).toBeInTheDocument()
  })

  it('renders case study links', () => {
    render(FeaturedProjects)
    const caseLinks = screen.getAllByRole('link', { name: /read case study/i })
    expect(caseLinks).toHaveLength(3)
  })

  it('renders project title when no image is provided', () => {
    render(FeaturedProjects)
    expect(screen.getByRole('heading', { name: 'Singel APP — Pegadaian Kita' })).toBeInTheDocument()
  })
})
