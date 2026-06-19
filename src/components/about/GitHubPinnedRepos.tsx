import { GitFork, Star } from 'lucide-react'
import type { PinnedRepo } from '@/utils/github'

interface Props {
  repos: PinnedRepo[]
}

export default function GitHubPinnedRepos({ repos }: Props) {
  if (repos.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 md:p-6">
      <p className="text-foreground mb-3 text-sm font-semibold">Pinned Repositories</p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3 min-h-[44px] no-underline transition-all duration-200 hover:border-accent/40 hover:bg-background/70 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            aria-label={`View ${repo.name} on GitHub`}
          >
            {/* Header: name + icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-foreground group-hover:text-accent text-sm font-semibold leading-tight transition-colors truncate min-w-0">
                {repo.name}
              </span>
              <svg
                className="text-muted mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-30 transition-opacity group-hover:opacity-70"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-label={`Open ${repo.name} on GitHub`}
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            {/* Description */}
            {repo.description && (
              <p className="text-muted line-clamp-2 text-xs leading-relaxed">{repo.description}</p>
            )}

            {/* Bottom row: language + stars + forks */}
            <div className="mt-auto flex items-center gap-2 flex-wrap">
              {repo.primaryLanguage && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: repo.primaryLanguage.color }}
                  />
                  <span className="text-muted font-mono text-[9px]">
                    {repo.primaryLanguage.name}
                  </span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-1.5 flex-wrap">
                {repo.stars > 0 && (
                  <span className="text-muted flex items-center gap-1 font-mono text-[9px]">
                    <Star className="h-4 w-4" />
                    {repo.stars}
                  </span>
                )}
                {repo.forks > 0 && (
                  <span className="text-muted flex items-center gap-1 font-mono text-[9px]">
                    <GitFork className="h-4 w-4" />
                    {repo.forks}
                  </span>
                )}
              </div>
            </div>

            {/* Topics */}
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {repo.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-accent/20 bg-accent/8 px-1.5 py-0.5 font-mono text-[8px] tracking-wide"
                    style={{
                      color: 'color-mix(in oklch, var(--color-accent) 80%, var(--color-foreground))'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
