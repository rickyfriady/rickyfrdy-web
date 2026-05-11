import { useMemo, useState } from 'react'
import type { Project } from '@/data/projects'

interface Props {
  projects: Project[]
}

type CategoryFilter = 'all' | Project['category']
type SortOrder = 'featured' | 'recent' | 'year'

export default function ProjectsGrid({ projects }: Props) {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [tech, setTech] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOrder>('featured')

  const allTechs = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      for (const t of p.technologies) set.add(t)
    }
    return Array.from(set).sort()
  }, [projects])

  const filtered = useMemo(() => {
    let result = projects

    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }
    if (tech !== 'all') {
      result = result.filter((p) =>
        p.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase()))
      )
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return b.year - a.year
    })
  }, [projects, category, tech, sortBy])

  function reset() {
    setCategory('all')
    setTech('all')
    setSortBy('featured')
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar filters */}
      <aside className="lg:w-56 lg:flex-shrink-0">
        <div className="border-border sticky top-24 space-y-6 rounded-2xl border p-5">
          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">
              Category
            </p>
            <div className="space-y-1">
              {(['all', 'web-app', 'api', 'tool', 'open-source'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                    category === c
                      ? 'bg-secondary text-foreground'
                      : 'text-muted hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {c === 'all' ? 'All' : c.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">
              Sort
            </p>
            <div className="space-y-1">
              {(['featured', 'recent', 'year'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                    sortBy === s
                      ? 'bg-secondary text-foreground'
                      : 'text-muted hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.16em] uppercase">
              Technology
            </p>
            <select
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All technologies</option>
              {allTechs.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-muted hover:text-foreground w-full font-mono text-xs transition-colors"
          >
            Reset filters
          </button>

          <p className="text-muted font-mono text-[10px]">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="border-border flex flex-col items-center rounded-2xl border p-12 text-center">
            <p className="text-muted mb-4 text-sm">No projects match your filters</p>
            <button type="button" onClick={reset} className="text-accent text-sm hover:underline">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((project) => (
              <a
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="border-border hover:border-accent/40 group relative flex h-full flex-col rounded-2xl border transition-all duration-300 no-underline"
              >
                <div className="bg-secondary text-muted flex aspect-video items-center justify-center rounded-t-2xl px-4">
                  <span className="font-mono text-xs tracking-[0.08em] uppercase">
                    {project.title}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="title-display group-hover:text-accent text-xl leading-tight transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="bg-accent text-background flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
                    {project.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="diff-tag">
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="diff-tag">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                  {project.keyMetric && (
                    <p className="text-accent mt-4 text-xs font-semibold">{project.keyMetric}</p>
                  )}
                  <div className="text-muted mt-auto flex items-center justify-between pt-4 text-xs font-medium tracking-wide uppercase">
                    <span>{project.category.replace('-', ' ')}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
