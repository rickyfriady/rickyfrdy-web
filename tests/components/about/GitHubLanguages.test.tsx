import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GitHubLanguages from '@/components/about/GitHubLanguages'

describe('GitHubLanguages', () => {
  const languages = [
    { name: 'TypeScript', color: '#3178c6', percentage: 68 },
    { name: 'Vue', color: '#41b883', percentage: 15 },
    { name: 'CSS', color: '#563d7c', percentage: 9 },
    { name: 'JavaScript', color: '#f1e05a', percentage: 5 },
    { name: 'Shell', color: '#89e051', percentage: 3 }
  ]

  it('renders heading', () => {
    render(<GitHubLanguages languages={languages} />)
    expect(screen.getByText('Most Used Languages')).toBeInTheDocument()
  })

  it('renders each language name', () => {
    render(<GitHubLanguages languages={languages} />)
    for (const lang of languages) {
      expect(screen.getByText(lang.name)).toBeInTheDocument()
    }
  })

  it('renders each language percentage', () => {
    render(<GitHubLanguages languages={languages} />)
    for (const lang of languages) {
      expect(screen.getByText(`${lang.percentage}%`)).toBeInTheDocument()
    }
  })

  it('renders stacked bar with correct widths', () => {
    render(<GitHubLanguages languages={languages} />)
    const bars = document.querySelectorAll('[style*="width"]')
    expect(bars).toHaveLength(languages.length)
    expect(bars[0]).toHaveStyle({ width: '68%' })
    expect(bars[1]).toHaveStyle({ width: '15%' })
  })

  it('returns null for empty array', () => {
    const { container } = render(<GitHubLanguages languages={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it.each([
    { name: 'Rust', color: '#dea584', percentage: 100 }
  ])('handles single language: $name', ({ name, color, percentage }) => {
    render(<GitHubLanguages languages={[{ name, color, percentage }]} />)
    expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
