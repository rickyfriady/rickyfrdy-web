import { describe, expect, it } from 'vitest'
import {
  type ChangelogEntry,
  groupEntries,
  parseCommitLine,
  parseCommitLines
} from '@/utils/changelog'

const US = '\x1f'
const line = (hash: string, date: string, subject: string) => `${hash}${US}${date}${US}${subject}`

describe('parseCommitLine()', () => {
  it('parses a conventional commit with scope', () => {
    const entry = parseCommitLine(
      line('abcdef1234', '2026-07-01T10:00:00+07:00', 'feat(nav): add command palette')
    )
    expect(entry).toEqual<ChangelogEntry>({
      hash: 'abcdef1',
      date: '2026-07-01T10:00:00+07:00',
      type: 'feat',
      scope: 'nav',
      subject: 'add command palette'
    })
  })

  it('parses a conventional commit without scope', () => {
    const entry = parseCommitLine(line('1234567', '2026-07-01T10:00:00+07:00', 'fix: correct typo'))
    expect(entry?.type).toBe('fix')
    expect(entry?.scope).toBeUndefined()
  })

  it('handles breaking-change marker (!)', () => {
    const entry = parseCommitLine(
      line('1234567', '2026-07-01T10:00:00+07:00', 'feat(api)!: change response shape')
    )
    expect(entry?.type).toBe('feat')
    expect(entry?.subject).toBe('change response shape')
  })

  it('drops types outside the allowed set', () => {
    expect(
      parseCommitLine(line('1234567', '2026-07-01T10:00:00+07:00', 'refactor(x): rework'))
    ).toBeNull()
    expect(
      parseCommitLine(line('1234567', '2026-07-01T10:00:00+07:00', 'chore: bump deps'))
    ).toBeNull()
  })

  it('drops non-conforming subjects', () => {
    expect(
      parseCommitLine(line('1234567', '2026-07-01T10:00:00+07:00', 'Feature/ricky/v1.2.7 (#53)'))
    ).toBeNull()
  })

  it('returns null for malformed lines', () => {
    expect(parseCommitLine('not a valid line')).toBeNull()
    expect(parseCommitLine('')).toBeNull()
  })
})

describe('parseCommitLines()', () => {
  it('keeps only conforming commits and skips blanks', () => {
    const entries = parseCommitLines([
      line('aaaaaaa', '2026-07-01T10:00:00+07:00', 'feat: one'),
      '',
      line('bbbbbbb', '2026-07-01T10:00:00+07:00', 'chore: ignored'),
      line('ccccccc', '2026-07-01T10:00:00+07:00', 'fix: two')
    ])
    expect(entries).toHaveLength(2)
    expect(entries.map((e) => e.type)).toEqual(['feat', 'fix'])
  })
})

describe('groupEntries()', () => {
  it('groups by type in display order and omits empty groups', () => {
    const entries = parseCommitLines([
      line('aaaaaaa', '2026-07-01T10:00:00+07:00', 'fix: a'),
      line('bbbbbbb', '2026-07-02T10:00:00+07:00', 'feat: b'),
      line('ccccccc', '2026-07-03T10:00:00+07:00', 'feat: c')
    ])
    const groups = groupEntries(entries)
    expect(groups.map((g) => g.type)).toEqual(['feat', 'fix'])
    expect(groups[0].entries).toHaveLength(2)
    expect(groups[1].entries).toHaveLength(1)
  })

  it('returns [] for no entries', () => {
    expect(groupEntries([])).toEqual([])
  })
})
