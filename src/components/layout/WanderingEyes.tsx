import type { CSSProperties } from 'react'

const eyeStyle: CSSProperties = {
  display: 'inline-block',
  width: '16px',
  height: '16px',
  borderRadius: '9999px',
  border: '1px solid var(--color-border)',
  backgroundImage: 'radial-gradient(circle 4px, var(--color-accent) 100%, transparent 0)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 0'
}

export default function WanderingEyes() {
  return (
    <a
      href="/"
      className="text-foreground font-display inline-flex items-center gap-2 text-lg font-light tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span className="we-eye" style={eyeStyle} />
        <span className="we-eye" style={eyeStyle} />
      </span>
      Ricki Friadi
    </a>
  )
}
