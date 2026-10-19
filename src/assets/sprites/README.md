# Sprites

Hand-drawn pixel art. Every sprite is registered by **existing as a file** — the
loaders build their maps from these directories, so there is no list to keep in sync,
and a slug with no sprite falls back to text rather than showing a broken image.

## Universal rules

- **No anti-aliasing.** Every pixel is fully opaque or fully transparent.
- **Displayed at integer scale only** (16px source → 32px or 48px on screen). Anything
  else, and `image-rendering: pixelated` produces uneven edges.
- **Palette-aware.** Sprites sit on `--color-surface`; keep contrast against both the
  light ("Siang") and dark ("Malam") surfaces, since a single PNG cannot follow the
  theme. Prefer mid-tone shapes that read on both.
- **Do not draw what CSS can do.** Rules, checkerboards, scanlines, grain, progress
  bars, shadows, and panel frames are all CSS. Sprites are for icons and characters
  only. (The panel frame in particular is already a CSS utility, `pixel-frame` — it is
  theme-aware, which a PNG could never be.)

## Directories

| Directory   | Size  | Count | Loader                                    |
|-------------|-------|-------|-------------------------------------------|
| `tech/`     | 16x16 | 38    | `getSkillIconUrl()` / `getSpriteBySlug()` |
| `ui/`       | 16x16 | 6     | see `ui/README.md`                        |
| `category/` | 16x16 | 4     | see `category/README.md`                  |
| `character/`| 16-32 | 5+    | see `character/README.md`; `*-walk.png` are 64x72 directional sheets |
| `tiles/`    | 16x16 | 4 sheets | `utils/game/tiles.ts` (frame index per tile code); `props.png` is drawn here |
| `backdrop/` | strips | 2 | `components/game/Backdrop.tsx`: `hills.png` 64x24 and `treeline.png` 48x16 per season, one row each, repeating along x |

Total: 49 sprites, plus the sheets drawn in this repository (listed below). Note this is larger than the 25 the proposal estimated — the tech
icon set turned out to be 38 slugs, not 12. The fallback behaviour is what makes that
survivable: draw them in any order, ship at any point.

## Drawn in this repository

Some sheets are not borrowed: they are drawn as text grids in `scripts/art/` and
rendered by `node scripts/build-world-art.mjs`. The PNGs are committed, so a
build never runs the script. Edit the drawing, re-run, commit both.

- **Characters** are 16x24, in a 64x72 sheet: rows are down, up and left, four
  frames each (stand, left foot, stand, right foot). Facing right is the left row
  mirrored at render time. Frame 0 of a row is the idle pose.
- **No shadow pixels.** The ground shadow is CSS, so it does not dip with the body.
- **Palette**: outlines are a dark tint (`scripts/art/palette.mjs`), never `#000`.
- **Gen 3 is a reference for proportion and tone, not a source.** Do not trace,
  recolour or palette-match any Nintendo sprite. Every file is the owner's own
  work and takes an `owner` entry in `src/data/asset-licences.ts`.
- Each sheet is declared in `src/data/sprites.ts`; `tests/assets/world-art.test.ts`
  checks its size and that no pixel is anti-aliased.
