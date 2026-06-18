import { useMemo, useState } from 'react'
import AnimatedGradient from '@/components/animated-gradient'
import FeaturedBadge from '@/components/ui/FeaturedBadge'
import type { Project } from '@/data/projects'
import { type Lang, t } from '@/i18n/ui'
import { getSkillIconUrl } from '@/utils/skillIcon'

interface Props {
  projects: Project[]
  lang?: Lang
}

type CategoryFilter = 'all' | Project['category']
type SortOrder = 'featured' | 'recent' | 'year'

export default function ProjectsGrid({ projects, lang }: Props) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'work'>('all')
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
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter)
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
  }, [projects, category, tech, sortBy, typeFilter])

  function reset() {
    setTypeFilter('all')
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
              {t(lang ?? 'en', 'filter.type')}
            </p>
            <div className="space-y-1">
              {(['all', 'project', 'work'] as const).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setTypeFilter(ft)}
                  className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                    typeFilter === ft
                      ? 'bg-secondary text-foreground'
                      : 'text-muted hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {ft === 'all'
                    ? t(lang ?? 'en', 'filter.all')
                    : ft === 'project'
                      ? t(lang ?? 'en', 'filter.projects')
                      : t(lang ?? 'en', 'filter.works')}
                </button>
              ))}
            </div>
          </div>

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

          <p className="text-muted font-mono text-[10px]">{filtered.length} items</p>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="border-border flex flex-col items-center rounded-2xl border p-12 text-center">
            <p className="text-muted mb-4 text-sm">No items match your filters</p>
            <button type="button" onClick={reset} className="text-accent text-sm hover:underline">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((project) => {
              const cardBody = (
                <>
                  {/* Left accent bar */}
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-accent origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

                  {/* Right decoration */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-44 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-l from-secondary/90 via-secondary/40 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background:
                          'linear-gradient(135deg, transparent 55%, color-mix(in oklch, var(--color-border) 60%, transparent) 55%)'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      {project.company && (
                        <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                          {project.company}
                        </span>
                      )}
                      {project.company && (
                        <span className="text-border select-none text-[10px]">·</span>
                      )}
                      <span className="diff-tag">{project.category.replace('-', ' ')}</span>
                      <span className="diff-tag">{project.year}</span>
                      {project.featured && <FeaturedBadge label="Featured" />}
                    </div>

                    <h3 className="text-foreground group-hover:text-accent truncate text-base font-semibold leading-snug transition-colors duration-200">
                      {project.title}
                    </h3>

                    {project.role && (
                      <p className="text-muted mt-0.5 truncate font-mono text-xs">{project.role}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {project.keyMetric && (
                        <>
                          <span className="text-accent font-mono text-[10px]">
                            {project.keyMetric}
                          </span>
                          {project.technologies.length > 0 && (
                            <span className="text-border select-none text-[10px]">·</span>
                          )}
                        </>
                      )}
                      {project.technologies.slice(0, 3).map((t) => {
                        const url = getSkillIconUrl(t)
                        return url ? (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-secondary/30 px-2 py-1 font-mono text-xs text-muted"
                          >
                            <img
                              src={url}
                              alt={t}
                              title={t}
                              width="16"
                              height="16"
                              className="rounded-sm"
                              loading="lazy"
                            />
                            {t}
                          </span>
                        ) : (
                          <span
                            key={t}
                            className="bg-secondary text-muted rounded-lg px-2 py-1 font-mono text-xs"
                          >
                            {t}
                          </span>
                        )
                      })}
                      {project.technologies.length > 3 && (
                        <span className="text-muted font-mono text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Logo placeholder */}
                  <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                    <span className="text-muted font-mono text-xs uppercase">
                      {(project.company ?? project.title).charAt(0)}
                    </span>
                  </div>
                </>
              )

              return project.featured ? (
                <div key={project.slug} className="relative rounded-xl p-[2px]">
                  <AnimatedGradient
                    config={{ preset: 'Lava', speed: 12 }}
                    radius="12px"
                    noise={{ opacity: 0.12 }}
                    style={{ zIndex: 0 }}
                  />
                  <a
                    href={`/projects/${project.slug}`}
                    className="glass-card group relative z-10 flex items-center gap-4 overflow-hidden rounded-[10px] px-5 py-4 no-underline transition-colors duration-200"
                  >
                    {cardBody}
                  </a>
                </div>
              ) : (
                <a
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="glass-card group relative flex items-center gap-4 overflow-hidden rounded-xl px-5 py-4 no-underline transition-colors duration-200 hover:border-accent/50"
                >
                  {cardBody}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
