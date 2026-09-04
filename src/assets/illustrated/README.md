# Illustrated assets

Rendered/painted art, as opposed to the pixel sprites in `../sprites/`. **Empty by
design** — nothing here yet, and the scene is complete without it.

## Path selection is by directory, not by a flag

An asset's rendering path is decided by where the file sits, never by a prop threaded
through a component. A file in `../sprites/` is drawn at integer scale with
`image-rendering: pixelated`; a file here is drawn at fractional scale with smooth
interpolation. Moving a file between the two directories changes how it renders and
touches no code.

Precedence, highest first: **illustrated → pixel → drawn CSS fallback.** The drawn
fallback is the floor under both, so every scene stays complete with this directory
and `../sprites/` both empty.

## House rules

- **Nothing ships without a licence entry.** Add the file to
  `src/data/asset-licences.ts` in the same commit. A file here with no entry fails
  `tests/assets/licences.test.ts` by name.
- **Owner-authored art is still recorded**, as `{ author: 'owner' }`. It needs no
  attribution; it does need an entry.
- **Attribution is rendered on the site**, not just kept in this repo — a licence that
  demands credit gets it on a page a visitor can reach.
- **Nothing is copied, traced, or derived** from a third-party site, game, or product.
  The Tree of Savior reference informs *style only*.

## Weight ceiling

400 KB transferred per asset (`DEFAULT_MAX_BYTES`). An asset that earns more declares
its own `maxBytes` in its manifest entry. Over the ceiling fails
`tests/assets/weight.test.ts` by name. Anything below the fold loads lazily and never
blocks first paint.
