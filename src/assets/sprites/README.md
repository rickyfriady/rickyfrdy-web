# CASE FILE sprites

Hand-drawn pixel art. Every sprite is registered by **existing as a file** — the
loaders build their maps from these directories, so there is no list to keep in sync,
and a slug with no sprite falls back to text rather than showing a broken image.

## Universal rules

- **No anti-aliasing.** Every pixel is fully opaque or fully transparent.
- **Displayed at integer scale only** (16px source → 32px or 48px on screen). Anything
  else, and `image-rendering: pixelated` produces uneven edges.
- **Palette-aware.** Sprites sit on `--color-surface`; keep contrast against both the
  light ("Meja Siang") and dark ("Arsip Malam") surfaces, since a single PNG cannot
  follow the theme. Prefer mid-tone shapes that read on both.
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
| `character/`| 32x32 | 1     | see `character/README.md`                 |

Total: 49 sprites. Note this is larger than the 25 the proposal estimated — the tech
icon set turned out to be 38 slugs, not 12. The fallback behaviour is what makes that
survivable: draw them in any order, ship at any point.
