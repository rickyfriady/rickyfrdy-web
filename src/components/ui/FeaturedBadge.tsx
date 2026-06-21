interface Props {
  label: string
}

export default function FeaturedBadge({ label }: Props) {
  return (
    <span
      className="inline-flex items-center justify-center gap-1"
      role="img"
      aria-label={`${label} project`}
    >
      <span className="t-icon-swap" data-state="a">
        <svg
          className="t-icon size-[16px] shrink-0"
          data-icon="a"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2 7h7l-5.5 4.2L18 20l-6-4.2L6 20l2.5-6.8L3 9h7l2-7z" />
        </svg>
        <svg
          className="t-icon size-[16px] shrink-0"
          data-icon="b"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </span>
      <span className="eyebrow">{label}</span>
    </span>
  )
}
