import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, GitBranch, GitFork, GitMerge, Star, Upload, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { RecentEvent } from '@/utils/github'
import { fetchRecentEvents } from '@/utils/github'

const PAGE_SIZE = 5
const relativeTimeCache = new Map<string, string>()

/** @visibleForTesting */
export function clearRelativeTimeCache() {
  relativeTimeCache.clear()
}

function relativeTime(dateStr: string): string {
  const cached = relativeTimeCache.get(dateStr)
  if (cached) return cached
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const result =
    mins < 60
      ? `${mins}m ago`
      : mins < 1440
        ? `${Math.floor(mins / 60)}h ago`
        : mins < 43200
          ? `${Math.floor(mins / 1440)}d ago`
          : new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  relativeTimeCache.set(dateStr, result)
  return result
}

function EventIcon({ type }: { type: RecentEvent['type'] }) {
  const cls = 'h-3 w-3'
  switch (type) {
    case 'push':
      return <Upload className={cls} />
    case 'create':
      return <GitBranch className={cls} />
    case 'pr':
      return <GitMerge className={cls} />
    case 'star':
      return <Star className={cls} />
    case 'fork':
      return <GitFork className={cls} />
    default:
      return <Zap className={cls} />
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-2.5 py-2.5 min-h-[44px]">
      <div className="mt-0.5 h-5 w-5 flex-shrink-0 animate-pulse rounded-full bg-secondary" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}

function EventRow({ event }: { event: RecentEvent }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex items-start gap-2.5 py-2 min-h-[44px]"
    >
      {/* Icon dot — sits on the timeline line */}
      <div
        className="relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
          color: 'var(--color-accent)'
        }}
        aria-hidden="true"
      >
        <EventIcon type={event.type} />
      </div>

      <div className="min-w-0 flex-1 pt-[1px]">
        {event.message && (
          <p className="text-foreground truncate text-xs font-medium leading-snug">
            {event.message}
          </p>
        )}
        <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
          <a
            href={event.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent max-w-[140px] truncate font-mono text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            aria-label={`View ${event.repo} on GitHub`}
          >
            {event.repo}
          </a>
          <span className="text-muted/30 font-mono text-[10px]" aria-hidden="true">
            ·
          </span>
          <span className="text-muted/60 flex-shrink-0 font-mono text-[10px]">
            {relativeTime(event.date)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function GitHubActivity() {
  const [events, setEvents] = useState<RecentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetchRecentEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visible = events.slice(0, visibleCount)
  const hasMore = visibleCount < events.length

  function loadMore() {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, events.length))
  }

  function reset() {
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-foreground text-sm font-semibold">Recent Activity</p>
        {events.length > PAGE_SIZE && (
          <span className="text-muted font-mono text-[9px] tracking-wider">
            {Math.min(visibleCount, events.length)} / {events.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="divide-border divide-y">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted py-6 text-center text-xs">No recent activity found.</p>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[10px] top-2 bottom-2 w-px bg-border/60"
            aria-hidden="true"
          />

          <AnimatePresence mode="popLayout">
            {visible.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </AnimatePresence>

          {/* Show more / show less */}
          {hasMore && (
            <motion.button
              type="button"
              onClick={loadMore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent hover:text-accent-hover mt-1 flex w-full items-center justify-center gap-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              Show {Math.min(PAGE_SIZE, events.length - visibleCount)} more
              <ChevronDown size={12} />
            </motion.button>
          )}

          {!hasMore && visibleCount > PAGE_SIZE && (
            <motion.button
              type="button"
              onClick={reset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted hover:text-foreground mt-1 flex w-full items-center justify-center gap-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              Show less
            </motion.button>
          )}
        </div>
      )}

      <div className="mt-3 border-t border-border/40 pt-3">
        <a
          href="https://github.com/rickyfriady"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          aria-label="View all GitHub activity"
        >
          View all activity →
        </a>
      </div>
    </div>
  )
}
