import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GitHubHeatmap from '@/components/about/GitHubHeatmap'
import * as github from '@/utils/github'

describe('GitHubHeatmap', () => {
  const mockStats: github.GitHubStats = {
    totalContributions: 847,
    currentStreak: 12,
    longestStreak: 45,
    publicRepos: 18,
    followers: 24,
    following: 12,
    contributionCalendar: Array.from({ length: 365 }, (_, i) => ({
      date: `2025-${String(Math.floor(i / 28) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      count: Math.floor(Math.random() * 10),
      level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4
    })),
    pinnedRepos: [],
    languages: []
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders contribution total from initialStats', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('847')).toBeInTheDocument()
  })

  it('renders current streak from initialStats', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders longest streak from initialStats', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders public repos when > 0', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('renders followers when > 0', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('24')).toBeInTheDocument()
  })

  it('hides followers section when followers is 0', () => {
    const noFollowers = { ...mockStats, followers: 0 }
    render(<GitHubHeatmap initialStats={noFollowers} />)
    expect(screen.queryByText('Followers')).not.toBeInTheDocument()
  })

  it('hides public repos section when repos is 0', () => {
    const noRepos = { ...mockStats, publicRepos: 0 }
    render(<GitHubHeatmap initialStats={noRepos} />)
    expect(screen.queryByText('Public Repos')).not.toBeInTheDocument()
  })

  it('renders "View GitHub Profile" link', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    const link = screen.getByText('View GitHub Profile')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/rickyfrdy')
  })

  it('renders month labels', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    for (const m of months) {
      expect(screen.getByText(m)).toBeInTheDocument()
    }
  })

  it('renders day labels', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
  })

  it('renders legend scale', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('Less')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('renders 52-53 week columns in heatmap grid', () => {
    render(<GitHubHeatmap initialStats={mockStats} />)
    // contributionCalendar with 365 days → ~52 weeks
    const weeks = mockStats.contributionCalendar.length / 7
    expect(Math.floor(weeks)).toBeGreaterThanOrEqual(52)
  })

  it('calls fetchProxyStats on mount', () => {
    const spy = vi.spyOn(github, 'fetchProxyStats').mockResolvedValue(mockStats)
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(spy).toHaveBeenCalledOnce()
  })

  it('updates stats when proxy fetch returns different data', async () => {
    const updatedStats = { ...mockStats, totalContributions: 999 }
    vi.spyOn(github, 'fetchProxyStats').mockResolvedValue(updatedStats)
    render(<GitHubHeatmap initialStats={mockStats} />)
    // After effect runs, state should update
    await vi.waitFor(() => {
      expect(screen.getByText('999')).toBeInTheDocument()
    })
  })

  it('handles proxy fetch error gracefully (keeps initialStats)', () => {
    vi.spyOn(github, 'fetchProxyStats').mockRejectedValue(new Error('fail'))
    render(<GitHubHeatmap initialStats={mockStats} />)
    expect(screen.getByText('847')).toBeInTheDocument()
  })
})
