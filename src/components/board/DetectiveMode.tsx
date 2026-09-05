import { useEffect, useState } from 'react'
import type { GestureStatus } from './useHandGesture'

interface Props {
  status: GestureStatus
  active: boolean
  onChange: (active: boolean) => void
  labels: Record<string, string>
}

/**
 * The opt-in control for webcam gesture tracking.
 *
 * Two rules shape this component. The disclosure is shown *before*
 * `getUserMedia` is ever called, because a portfolio asking for camera access
 * without explanation is alarming and people rightly refuse. And it renders
 * nothing at all on touch or small viewports — holding a phone in one hand
 * while gesturing at the front camera is not a real interaction, and offering
 * a feature that then fails is worse than never offering it.
 */
export default function DetectiveMode({ status, active, onChange, labels }: Props) {
  const [eligible, setEligible] = useState(false)
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    const check = () =>
      setEligible(
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
          window.innerWidth >= 768 &&
          typeof navigator.mediaDevices?.getUserMedia === 'function'
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!eligible) return null

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => (active ? onChange(false) : setAsking((v) => !v))}
        className="menu-cursor border-border text-foreground hover:bg-secondary inline-flex min-h-[44px] items-center gap-2 border-2 px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase transition-colors focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none"
        aria-expanded={asking}
      >
        {status === 'loading' ? labels.loading : active ? labels.disable : labels.enable}
        {active ? <span className="detective-live-dot" aria-hidden="true" /> : null}
      </button>

      {asking && !active ? (
        <div className="evidence-panel mt-3 max-w-md p-4">
          <p className="text-muted text-sm leading-relaxed">{labels.privacy}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setAsking(false)
                onChange(true)
              }}
              className="bg-accent text-background inline-flex min-h-[44px] items-center px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase"
            >
              {labels.start}
            </button>
            <button
              type="button"
              onClick={() => setAsking(false)}
              className="border-border text-foreground inline-flex min-h-[44px] items-center border-2 px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase"
            >
              {labels.cancel}
            </button>
          </div>
        </div>
      ) : null}

      {/* Failure is a supported outcome, not an error state: say what happened
          and point out that nothing was actually lost. */}
      {status === 'denied' || status === 'unavailable' ? (
        <p className="text-muted mt-3 max-w-md text-sm leading-relaxed" role="status">
          {status === 'denied' ? labels.denied : labels.unavailable}
        </p>
      ) : null}

      {active ? (
        <p
          className="text-muted mt-3 font-mono text-[10px] tracking-[0.1em] uppercase"
          role="status"
        >
          {labels.live} · {labels.hint}
        </p>
      ) : null}
    </div>
  )
}
