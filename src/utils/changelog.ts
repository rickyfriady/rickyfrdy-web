import { execFileSync } from 'node:child_process'

export interface ChangelogEntry {
  hash: string
  /** ISO date string */
  date: string
  type: string
  scope?: string
  subject: string
}

export interface ChangelogGroup {
  type: string
  label: string
  entries: ChangelogEntry[]
}

/** Conventional-commit types surfaced in the reader-facing changelog, in display order. */
export const CHANGELOG_TYPES: { type: string; label: string }[] = [
  { type: 'feat', label: 'Features' },
  { type: 'fix', label: 'Fixes' },
  { type: 'perf', label: 'Performance' }
]

const TYPE_SET = new Set(CHANGELOG_TYPES.map((t) => t.type))
const FIELD_SEP = '\x1f'
// type(scope)!: subject
const COMMIT_RE = /^(\w+)(?:\(([^)]+)\))?!?:\s+(.+)$/

/** Parse one `hash<US>isoDate<US>subject` line. Returns null for non-conforming commits. */
export function parseCommitLine(line: string): ChangelogEntry | null {
  const parts = line.split(FIELD_SEP)
  if (parts.length < 3) return null
  const [hash, date, ...rest] = parts
  const subjectRaw = rest.join(FIELD_SEP).trim()
  const match = COMMIT_RE.exec(subjectRaw)
  if (!match) return null
  const [, type, scope, subject] = match
  if (!TYPE_SET.has(type)) return null
  return { hash: hash.slice(0, 7), date, type, scope: scope || undefined, subject }
}

/** Parse many lines, dropping any that don't conform. */
export function parseCommitLines(lines: string[]): ChangelogEntry[] {
  return lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map(parseCommitLine)
    .filter((e): e is ChangelogEntry => e !== null)
}

/** Group parsed entries by type in CHANGELOG_TYPES order; empty groups are omitted. */
export function groupEntries(entries: ChangelogEntry[]): ChangelogGroup[] {
  return CHANGELOG_TYPES.map(({ type, label }) => ({
    type,
    label,
    entries: entries.filter((e) => e.type === type)
  })).filter((g) => g.entries.length > 0)
}

/**
 * Read commit history via git at build time and return a flat, newest-first list.
 * Returns [] if git is unavailable (e.g. shallow clone with no history).
 */
export function readChangelogEntries(limit = 100): ChangelogEntry[] {
  try {
    const safeLimit = Math.max(1, Math.floor(limit))
    const raw = execFileSync(
      'git',
      ['log', '--no-merges', '--pretty=format:%H%x1f%aI%x1f%s', '-n', String(safeLimit)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    )
    return parseCommitLines(raw.split('\n'))
  } catch {
    return []
  }
}
