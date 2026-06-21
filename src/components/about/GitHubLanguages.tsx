import type { LanguageStat } from '@/utils/github'

interface Props {
  languages: LanguageStat[]
}

export default function GitHubLanguages({ languages }: Props) {
  if (languages.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 md:p-6">
      <p className="text-foreground mb-3 text-sm font-semibold">Most Used Languages</p>

      {/* Stacked bar — 4px minimum on mobile */}
      <div className="flex h-[4px] md:h-3.5 w-full overflow-hidden rounded-full bg-secondary">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="relative h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${lang.percentage}%`,
              background: lang.color
            }}
            role="img"
            aria-label={`${lang.name}: ${lang.percentage}%`}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Legend — compact, wraps on mobile */}
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Language breakdown">
        {languages.map((lang) => (
          <li key={lang.name} className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: lang.color }}
              aria-hidden="true"
            />
            <span className="text-foreground font-mono text-[9px] leading-none sm:text-[10px]">
              {lang.name}
            </span>
            <span className="text-muted font-mono text-[9px] leading-none sm:text-[10px]">
              {lang.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
