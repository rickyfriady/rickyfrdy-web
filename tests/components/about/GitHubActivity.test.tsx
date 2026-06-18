import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GitHubActivity from '@/components/about/GitHubActivity'

/** Raw GitHub API response shape that fetchRecentEvents parses */
const rawApiEvents = [
  {
    id: '1',
    type: 'PushEvent',
    repo: {
      name: 'rickyfriady/some-repo',
      url: 'https://api.github.com/repos/rickyfriady/some-repo'
    },
    payload: { commits: [{ message: 'fix: resolve auth bug\n\nDetails' }] },
    created_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'CreateEvent',
    repo: {
      name: 'rickyfriady/new-project',
      url: 'https://api.github.com/repos/rickyfriady/new-project'
    },
    payload: { ref_type: 'branch', ref: 'feat/foo' },
    created_at: '2025-06-14T08:00:00Z'
  },
  {
    id: '3',
    type: 'PullRequestEvent',
    repo: {
      name: 'rickyfriady/other-repo',
      url: 'https://api.github.com/repos/rickyfriady/other-repo'
    },
    payload: { action: 'opened', pull_request: { title: 'Add new feature' } },
    created_at: '2025-06-13T12:00:00Z'
  },
  {
    id: '4',
    type: 'WatchEvent',
    repo: {
      name: 'external/awesome-lib',
      url: 'https://api.github.com/repos/external/awesome-lib'
    },
    payload: {},
    created_at: '2025-06-12T09:00:00Z'
  },
  {
    id: '5',
    type: 'ForkEvent',
    repo: {
      name: 'rickyfriady/forked-repo',
      url: 'https://api.github.com/repos/rickyfriady/forked-repo'
    },
    payload: {},
    created_at: '2025-06-11T16:00:00Z'
  }
]

function mockFetch(data: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data)
  } as Response)
}

describe('GitHubActivity', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows skeleton loading state initially', () => {
    mockFetch(rawApiEvents)
    const { container } = render(<GitHubActivity />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders heading', async () => {
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it('renders event messages after fetch resolves', async () => {
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    await waitFor(() => {
      expect(screen.getByText('fix: resolve auth bug')).toBeInTheDocument()
    })
    expect(screen.getByText('Created branch feat/foo')).toBeInTheDocument()
    expect(screen.getByText('Add new feature')).toBeInTheDocument()
    expect(screen.getByText('Starred repo')).toBeInTheDocument()
    expect(screen.getByText('Forked repo')).toBeInTheDocument()
  })

  it('renders repo names as links', async () => {
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      // First link should be the first event's repo link, then the "View all" link
      expect(links[0]).toHaveAttribute('href', 'https://github.com/rickyfriady/some-repo')
    })
  })

  it('renders "View all activity →" link', () => {
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    expect(screen.getByText('View all activity →')).toBeInTheDocument()
  })

  it('renders relative timestamps for events', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-06-16T12:00:00Z').getTime())
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    await waitFor(() => {
      // Events on Jun 11-15 → "1d ago" through "5d ago"
      const timeEls = screen.getAllByText(/\d+[mhd] ago/)
      expect(timeEls.length).toBeGreaterThan(0)
    })
  })

  it('shows empty state when no events returned', async () => {
    mockFetch([])
    render(<GitHubActivity />)
    await waitFor(() => {
      expect(screen.getByText('No recent activity found.')).toBeInTheDocument()
    })
  })

  it('shows empty state on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('fail'))
    render(<GitHubActivity />)
    await waitFor(() => {
      expect(screen.getByText('No recent activity found.')).toBeInTheDocument()
    })
  })

  it('renders event icons for each event type', async () => {
    mockFetch(rawApiEvents)
    render(<GitHubActivity />)
    await waitFor(() => {
      expect(screen.getByText('fix: resolve auth bug')).toBeInTheDocument()
    })
    const icons = document.querySelectorAll('[style*="color-mix"]')
    expect(icons.length).toBe(rawApiEvents.length)
  })
})
