# UI sprites — 16x16

Filenames are the identifiers: `search.png`, `language.png`, `theme.png`, `sound.png`,
`external-link.png`, `arrow.png`.

These replace the inline SVG icons currently in the header, command palette, and
footer. Until a sprite exists the existing SVG stays in place, so this set can be
adopted one icon at a time.

Draw at 16x16 on a 1px grid. These render at 16px (1x) in dense chrome, so legibility
at native size matters more here than in any other set — test by looking at the raw
file, not a zoomed view.
