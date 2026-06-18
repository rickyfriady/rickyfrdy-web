import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GitHubPinnedRepos from '@/components/about/GitHubPinnedRepos'

describe('GitHubPinnedRepos', () => {
  const repos = [
    {
      name: 'rickyfrdy-web',
      description: 'Personal portfolio built with Astro and Tailwind.',
      url: 'https://github.com/rickyfrdy/rickyfrdy-web',
      stars: 2,
      forks: 0,
      primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
      topics: ['astro', 'tailwind', 'portfolio']
    },
    {
      name: 'nestjs-factory-microservices',
      description: 'NestJS microservices with Factory pattern.',
      url: 'https://github.com/rickyfrdy/nestjs-factory-microservices',
      stars: 4,
      forks: 1,
      primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
      topics: ['nestjs', 'microservices']
    }
  ]

  it('renders heading', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    expect(screen.getByText('Pinned Repositories')).toBeInTheDocument()
  })

  it('renders repo names as links', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', repos[0].url)
    expect(links[1]).toHaveAttribute('href', repos[1].url)
  })

  it('renders descriptions', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    expect(
      screen.getByText('Personal portfolio built with Astro and Tailwind.')
    ).toBeInTheDocument()
    expect(screen.getByText('NestJS microservices with Factory pattern.')).toBeInTheDocument()
  })

  it('renders primary language', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    const langLabels = screen.getAllByText('TypeScript')
    expect(langLabels.length).toBeGreaterThanOrEqual(2)
  })

  it('renders stars count when > 0', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders forks count when > 0', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders topic tags', () => {
    render(<GitHubPinnedRepos repos={repos} />)
    expect(screen.getByText('astro')).toBeInTheDocument()
    expect(screen.getByText('tailwind')).toBeInTheDocument()
    expect(screen.getByText('nestjs')).toBeInTheDocument()
  })

  it('returns null for empty array', () => {
    const { container } = render(<GitHubPinnedRepos repos={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('handles repo with null primaryLanguage and no topics', () => {
    const minimalRepos = [
      {
        name: 'minimal-repo',
        description: null,
        url: 'https://github.com/user/minimal-repo',
        stars: 0,
        forks: 0,
        primaryLanguage: null,
        topics: []
      }
    ]
    render(<GitHubPinnedRepos repos={minimalRepos} />)
    expect(screen.getByText('minimal-repo')).toBeInTheDocument()
  })
})
