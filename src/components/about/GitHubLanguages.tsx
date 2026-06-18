import type { LanguageStat } from '@/utils/github'

interface Props {
  languages: LanguageStat[]
}

export default function GitHubLanguages({ languages }: Props) {
  if (languages.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5 md:p-6">
      <p className="text-foreground mb-4 text-sm font-semibold">Most Used Languages</p>

      {/* Stacked bar — taller, rounded segments */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="relative h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${lang.percentage}%`,
              background: lang.color
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Legend — compact side-by-side items */}
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {languages.map((lang) => (
          <li key={lang.name} className="flex items-center gap-1.5">
            <span
              className="block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: lang.color }}
            />
            <span className="text-foreground font-mono text-[11px] leading-none">{lang.name}</span>
            <span className="text-muted font-mono text-[11px] leading-none">
              {lang.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
