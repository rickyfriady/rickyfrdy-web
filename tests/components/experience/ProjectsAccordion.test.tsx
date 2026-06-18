import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProjectsAccordion from '@/components/experience/ProjectsAccordion'

vi.mock('@/utils/finlogo', () => ({
  getLogoSvg: vi.fn((name: string) => {
    if (name === 'pegadaian') {
      return '<svg>mock</svg>'
    }
    return undefined
  })
}))

const mockProjects = [
  {
    title: 'Singel APP',
    company: 'PT. Pegadaian',
    period: 'Nov 2024 – Present',
    bullets: ['Built micro-frontend modules with Module Federation.'],
    stack: ['Vue 3', 'TypeScript', 'NestJS'],
    companyLogo: 'pegadaian'
  },
  {
    title: 'Thesis Project',
    company: 'Universitas Riau',
    period: '2020',
    bullets: ['Built a Python chatbot', 'Achieved 80% match accuracy'],
    stack: ['Python', 'Flask', 'JavaScript'],
    companyLogo: undefined
  }
]

describe('ProjectsAccordion', () => {
  it('renders project titles', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    expect(screen.getByText('Singel APP')).toBeInTheDocument()
    expect(screen.getByText('Thesis Project')).toBeInTheDocument()
  })

  it('renders company tags', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    expect(screen.getByText('PT. Pegadaian')).toBeInTheDocument()
    expect(screen.getByText('Universitas Riau')).toBeInTheDocument()
  })

  it('renders periods', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    expect(screen.getByText('Nov 2024 – Present')).toBeInTheDocument()
    expect(screen.getByText('2020')).toBeInTheDocument()
  })

  it('content is hidden by default', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    expect(
      screen.queryByText('Built micro-frontend modules with Module Federation.')
    ).not.toBeInTheDocument()
  })

  it('reveals content on click', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    fireEvent.click(screen.getByText('Singel APP'))
    expect(
      screen.getByText('Built micro-frontend modules with Module Federation.')
    ).toBeInTheDocument()
  })

  it('hides content on second click', async () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    fireEvent.click(screen.getByText('Singel APP'))
    expect(
      screen.getByText('Built micro-frontend modules with Module Federation.')
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('Singel APP'))
    await waitFor(() => {
      expect(
        screen.queryByText('Built micro-frontend modules with Module Federation.')
      ).not.toBeInTheDocument()
    })
  })

  it('opens second project while first stays open', async () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    fireEvent.click(screen.getByText('Singel APP'))
    expect(
      screen.getByText('Built micro-frontend modules with Module Federation.')
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('Thesis Project'))
    expect(screen.getByText('Built a Python chatbot')).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.queryByText('Built micro-frontend modules with Module Federation.')
      ).not.toBeInTheDocument()
    })
  })

  it('renders logo via data URI when companyLogo is set', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.some((img) => img.getAttribute('src')?.startsWith('data:image/svg+xml'))).toBe(true)
  })

  it('renders tech stack chips after opening', () => {
    render(<ProjectsAccordion projects={mockProjects} />)
    fireEvent.click(screen.getByText('Singel APP'))
    expect(screen.getByText('Vue 3')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
