import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { skillGroups } from '@/data/skills'

const allSkills = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.label })))

export default function SkillsMatrix() {
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = query
      ? allSkills.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.group.toLowerCase().includes(query.toLowerCase())
        )
      : allSkills

    if (selectedGroup) {
      result = result.filter((s) => s.group === selectedGroup)
    }
    return result
  }, [query, selectedGroup])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const s of filtered) {
      const existing = map.get(s.group) ?? []
      existing.push(s)
      map.set(s.group, existing)
    }
    return [...map.entries()]
  }, [filtered])

  const groups = skillGroups.map((g) => g.label)

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="text-muted/40 pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills…"
            aria-label="Search skills"
            className="border-border bg-secondary text-foreground placeholder:text-muted/50 focus:ring-accent w-full rounded-lg border py-2 pl-9 pr-8 text-sm outline-none focus:ring-2"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted/40 hover:text-muted absolute right-2 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <fieldset aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedGroup(null)}
            className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              !selectedGroup
                ? 'bg-accent text-background'
                : 'bg-secondary text-muted hover:text-foreground'
            }`}
          >
            All
          </button>
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGroup(selectedGroup === g ? null : g)}
              className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                selectedGroup === g
                  ? 'bg-accent text-background'
                  : 'bg-secondary text-muted hover:text-foreground'
              }`}
            >
              {g}
            </button>
          ))}
        </fieldset>
      </div>

      {/* Results count */}
      <p className="text-muted/50 mb-4 font-mono text-[10px]">
        {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        {query && ` matching "${query}"`}
      </p>

      {/* Skills grid — animated */}
      <div className="space-y-6">
        {grouped.length === 0 ? (
          <p className="text-muted py-8 text-center text-sm">No skills match your search.</p>
        ) : (
          grouped.map(([group, skills]) => (
            <div key={group}>
              <p className="text-muted mb-3 font-mono text-[10px] tracking-[0.16em] uppercase">
                {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <div className="glass-card flex h-12 w-12 items-center justify-center p-1.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-sm">
                      <img
                        src={`https://skillicons.dev/icons?i=${skill.icon}`}
                        alt={skill.name}
                        title={skill.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        width="40"
                        height="40"
                      />
                    </div>
                    <span className="text-muted font-mono text-[9px] tracking-[0.06em]">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
