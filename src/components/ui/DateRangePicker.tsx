import { useEffect, useMemo, useRef, useState } from 'react'
import {
  addDays,
  formatDayMonth,
  formatFull,
  formatMonthYear,
  fromISO,
  type ISODate,
  monthGrid,
  nextFriday,
  nightsBetween,
  todayISO
} from '@/utils/dateRange'

export interface DateRange {
  checkIn: ISODate | null
  checkOut: ISODate | null
}

interface Props {
  /** First selectable day. Defaults to today; earlier days render disabled. */
  min?: ISODate
  value?: DateRange
  onChange?: (range: DateRange) => void
  labels?: Partial<typeof defaultLabels>
}

const defaultLabels = {
  title: 'Trip dates',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  addDate: 'Add date',
  addDates: 'Add dates',
  pickCheckOut: 'Pick check-out',
  night: 'night',
  nights: 'nights',
  clear: 'Clear',
  previousMonth: 'Previous month',
  nextMonth: 'Next month'
}

/**
 * The four shortcuts from the reference. `friday` anchors the weekend preset to
 * the coming Friday rather than to whatever day happens to be selected, which
 * is the only way "Weekend" can mean a weekend; the night-count presets extend
 * from the current check-in so tapping one adjusts a trip instead of moving it.
 */
const presets = [
  { id: 'weekend', label: 'Weekend', nights: 2, anchor: 'friday' },
  { id: 'short', label: '3 nights', nights: 3, anchor: 'checkIn' },
  { id: 'week', label: '1 week', nights: 7, anchor: 'checkIn' },
  { id: 'fortnight', label: '2 weeks', nights: 14, anchor: 'checkIn' }
] as const

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size)
  )
}

export default function DateRangePicker({ min, value, onChange, labels }: Props) {
  const t = { ...defaultLabels, ...labels }
  const today = useMemo(() => todayISO(), [])
  const floor = min ?? today

  const [internal, setInternal] = useState<DateRange>({ checkIn: null, checkOut: null })
  const range = value ?? internal
  const { checkIn, checkOut } = range

  const [cursor, setCursor] = useState<ISODate>(checkIn ?? floor)
  const [focused, setFocused] = useState<ISODate>(checkIn ?? floor)
  const [hover, setHover] = useState<ISODate | null>(null)
  const gridRef = useRef<HTMLTableElement>(null)
  // Focus follows arrow keys, but only once the grid already owns focus —
  // otherwise opening the picker would rip focus out of whatever came before.
  const shouldFocus = useRef(false)

  const commit = (next: DateRange) => {
    if (!value) setInternal(next)
    onChange?.(next)
  }

  const cursorDate = fromISO(cursor)
  const days = monthGrid(cursorDate.getUTCFullYear(), cursorDate.getUTCMonth())
  const monthStart = `${cursor.slice(0, 7)}-01`

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus()
  }, [focused])

  const select = (day: ISODate) => {
    if (day < floor) return
    if (!checkIn || checkOut || day <= checkIn) commit({ checkIn: day, checkOut: null })
    else commit({ checkIn, checkOut: day })
    setHover(null)
  }

  const move = (delta: number) => {
    const next = addDays(focused, delta)
    if (next < floor) return
    shouldFocus.current = true
    setFocused(next)
    if (next.slice(0, 7) !== cursor.slice(0, 7)) setCursor(next)
  }

  const goToMonth = (delta: number) => {
    const d = fromISO(monthStart)
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1))
      .toISOString()
      .slice(0, 10)
    setCursor(next)
    setFocused(next < floor ? floor : next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -28,
      PageDown: 28
    }
    if (e.key in steps) {
      e.preventDefault()
      move(steps[e.key])
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const weekday = (fromISO(focused).getUTCDay() + 6) % 7
      move(e.key === 'Home' ? -weekday : 6 - weekday)
    } else if (e.key === 'Escape' && checkIn && !checkOut) {
      commit({ checkIn: null, checkOut: null })
    }
  }

  // The end of the band while the second date is still being chosen, so the
  // grid shows the trip the pointer is about to commit to.
  const previewEnd = checkOut ?? (checkIn && hover && hover > checkIn ? hover : null)
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0

  const applyPreset = (preset: (typeof presets)[number]) => {
    const base = checkIn && checkIn >= floor ? checkIn : floor
    const start = preset.anchor === 'friday' ? nextFriday(base) : base
    commit({ checkIn: start, checkOut: addDays(start, preset.nights) })
    setCursor(start)
    setFocused(start)
  }

  const activePreset = presets.find(
    (p) =>
      nights === p.nights &&
      (p.anchor !== 'friday' || (checkIn && fromISO(checkIn).getUTCDay() === 5))
  )

  const status = !checkIn
    ? t.addDates
    : !checkOut
      ? t.pickCheckOut
      : `${nights} ${nights === 1 ? t.night : t.nights}`

  return (
    <section className="evidence-panel text-foreground max-w-sm min-w-[280px] p-2 font-sans sm:p-4">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg">{t.title}</h2>
        <p
          aria-live="polite"
          className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase ${
            checkOut ? 'text-accent' : 'text-muted'
          }`}
        >
          {status}
        </p>
      </header>

      <div className="evidence-card mt-3 grid grid-cols-2">
        {(
          [
            [t.checkIn, checkIn],
            [t.checkOut, checkOut]
          ] as const
        ).map(([label, day], i) => (
          <div key={label} className={i === 1 ? 'border-border border-l-2 p-3' : 'p-3'}>
            <span className="chapter-label block">{label}</span>
            <span className={`mt-1 block text-base ${day ? 'text-foreground' : 'text-muted'}`}>
              {day ? formatDayMonth(day) : t.addDate}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={monthStart <= floor}
          aria-label={t.previousMonth}
          className="border-border text-foreground hover:bg-secondary focus-visible:ring-accent h-11 w-11 border-2 font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30"
        >
          {'<'}
        </button>
        <h3 aria-live="polite" className="font-display text-base">
          {formatMonthYear(cursor)}
        </h3>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label={t.nextMonth}
          className="border-border text-foreground hover:bg-secondary focus-visible:ring-accent h-11 w-11 border-2 font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {'>'}
        </button>
      </div>

      {/* A calendar is tabular data, so it is a table: <th scope="col"> and the
          row/cell structure carry the semantics that role="grid" would
          otherwise have to reconstruct by hand. */}
      <table
        ref={gridRef}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover(null)}
        className="mt-3 w-full table-fixed border-collapse"
      >
        <caption className="sr-only">{formatMonthYear(cursor)}</caption>
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day} scope="col" className="chapter-label py-2 font-normal">
                <abbr title={day} className="no-underline">
                  {day[0]}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chunk(days, 7).map((week) => (
            <tr key={week.find(Boolean) ?? 'lead'}>
              {week.map((day, column) => {
                // A calendar row is seven fixed columns that never reorder, so
                // the column index is a stable key for the leading blanks.
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-position cell
                if (!day) return <td key={`pad-${column}`} />

                const disabled = day < floor
                const isEdge =
                  day === checkIn || day === checkOut || (day === previewEnd && !checkOut)
                const inBand = Boolean(checkIn && previewEnd && day > checkIn && day < previewEnd)

                return (
                  <td key={day} className="p-0">
                    <button
                      type="button"
                      data-date={day}
                      disabled={disabled}
                      tabIndex={day === focused ? 0 : -1}
                      onFocus={() => setFocused(day)}
                      onClick={() => select(day)}
                      onMouseEnter={() => setHover(day)}
                      aria-label={formatFull(day)}
                      aria-pressed={isEdge || inBand}
                      className={[
                        'relative h-11 w-full font-mono text-sm transition-colors',
                        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none',
                        disabled && 'text-muted cursor-not-allowed opacity-40',
                        !disabled && isEdge && 'bg-accent text-background',
                        !disabled && !isEdge && inBand && 'bg-accent/20 text-foreground',
                        !disabled && !isEdge && !inBand && 'hover:bg-secondary'
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {fromISO(day).getUTCDate()}
                      {day === today && !isEdge ? (
                        <span
                          aria-hidden="true"
                          className="bg-thread absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2"
                        />
                      ) : null}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-border mt-4 flex flex-wrap items-center gap-2 border-t-2 pt-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            aria-pressed={activePreset?.id === preset.id}
            className={`menu-cursor border-border focus-visible:ring-accent min-h-[44px] border-2 px-3 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none ${
              activePreset?.id === preset.id
                ? 'bg-accent text-background'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            commit({ checkIn: null, checkOut: null })
            setHover(null)
          }}
          disabled={!checkIn}
          className="text-muted hover:text-foreground focus-visible:ring-accent ml-auto min-h-[44px] px-2 font-mono text-xs underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:text-muted"
        >
          {t.clear}
        </button>
      </div>
    </section>
  )
}
