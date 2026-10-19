# DESIGN.md

Direction for this site. Transcribed from the `redesign-pastoral-world` OpenSpec
change (proposal, design, and the `pastoral-identity` and `pixel-design-system`
specs) and from the token block in `src/styles/global.css`.

If any line here does not match what you actually want, correct it. This file
outranks inference, and it is what the next piece of UI work reads first.

## Identity

**A valley you walk, not an office you search.** Warm and pastoral: cream,
straw, soil and field green. It replaces CASE FILE, whose cold forensic register
did not match the person the site represents.

Two things make it more than a palette. The world becomes the front door rather
than a side entrance, and the site changes over time on its own: the calendar
sets the season, the visitor's clock sets day and night, a project's date sets
how grown its crop is, and GitHub activity sets the weather. Nothing is stored.

The board survives, re-skinned. Cards, red threads and the spotlight stay,
because "here is a system of related work and one person built all of it" does
not depend on any fiction.

Audience: recruiters and clients, plus engineers who read the source.

## The rule that governs everything

**Theme carries the concept; content stays literal.** In-fiction language is
confined to place names, frames, textures, and sounds. Headings, project titles,
metrics, dates, and calls to action stay plainly worded. A building's panel
shows the real project title, technologies and date.

Its companion rule: every building is also a plain URL. The Workshop is a place
you walk into and `/projects` is the same content at a stable address; neither
redirects to the other. The destination list renders first, server-side, so a
recruiter with ninety seconds and a locked-down laptop never has to play.

## Colors

Warm neutrals, two themes, one text accent, one decorative colour, one thread.
No literal colour values anywhere; everything references tokens in
`global.css`. `src/utils/ogCard.ts` is the one exception, because satori cannot
read custom properties, and its hex values are kept in step by hand.

| Role | Light ("Siang") | Dark ("Malam") |
|---|---|---|
| background | `oklch(.95 .028 88)` cream | `oklch(.18 .018 60)` tilled soil |
| surface | `oklch(.90 .036 86)` straw | `oklch(.25 .022 62)` |
| border | `oklch(.56 .045 65)` | `oklch(.56 .035 65)` |
| foreground | `oklch(.25 .030 55)` soil brown | `oklch(.93 .022 88)` |
| accent | `oklch(.34 .090 150)` forest green | `oklch(.76 .130 150)` |
| sun | `oklch(.57 .130 70)` wheat | `oklch(.80 .140 82)` |

Dark is evening in the same valley, not a second identity.

**The accent is split in two, on purpose.** A sunny accent and legible text
cannot both happen on cream: every yellow, gold or orange measured fails 4.5:1.
So `accent` is the dark green that carries text, links and focus, and `sun`
carries the bright colour of sun, crops and daytime sky at the 3:1 graphic bar.
Text never sits on `sun`.

**The thread is untouched.** `--color-thread` is the same red it has always
been, theme-constant, never text. Green sits about 120 degrees from it, and the
light accent is dark enough that the pair stays apart under protanopia,
deuteranopia and tritanopia simulation. Lighten the light accent and a protanope
sees one colour.

The valley band (on `/` and `/play`) is scoped by `.world`, and its palette
follows the visitor's own clock. `.world` itself is the valley at night: a dark
meadow ground with the same green accent, and what a visitor without
JavaScript sees. By day one of four seasonal palettes takes over (spring
green-cream, summer straw, autumn amber, winter frost), set before first paint
by an inline script from the calendar and the hour. Nothing is stored. Each
redefines only existing roles, so no component knows which palette is active.

Retired and not to return: the blue (hue 220) and old green (hue 160) accents,
and the CASE FILE red accent.

Contrast is enforced by test, not by eye:
`tests/styles/palette-contrast.test.ts` holds every text role to 4.5:1 and
every graphic role (thread, border, sun) to 3:1 against all three grounds, in
the light, dark, night and four seasonal palettes, and checks thread against
accent under three kinds of colourblindness.

## Typography

- **Display and UI**: Pixelify Sans. Chosen because it is a real outline font
  rather than a bitmap, so it survives the `satori` OG image pipeline.
- **Body**: a readable sans. Pixel type is restricted to headings and UI, never
  body copy.
- Pixel headings snap to integer sizes so the glyph grid stays clean.
- `title-accent` differentiates by colour only. No italic.

Not touched by any of this: `resume.pdf` and `resume-ats.pdf` keep Helvetica,
because ATS software parses them and a pixel font is a rejection risk.

## Shape and motion

Unchanged by the redesign.

- **Corner radius: zero.** Not "small". Zero.
- **Spacing on a 4/8 pixel grid.**
- **One 9-slice frame** for every panel, replacing per-component panel styles.
- **Stepped motion** (`steps()`), not eased easing.
- Sprites render pixelated at integer scale; illustrated art renders smooth at
  fractional scale. The path is chosen by which directory the file sits in.

## Art

Third-party art is CC0 or it does not ship, because this repository is public.
The tiles are one artist, Kenney's Tiny series, so the ground shares a palette
and shows no seam at 16px. Art drawn in this repository is the owner's own.

- **Tiles**: Tiny Town and Tiny Farm sheets, plus the 3x3 water set cut from
  Tiny Battle (Tiny Town has no water). 16x16, matching `TILE = 16`.
- **Characters**: the player is drawn in this repository, 16x24 with a
  four-direction, four-frame walk cycle (`hero-walk`, made by `scripts/art/`).
  Ricki, Laura and Rivaldy as NPCs are still three Tiny Dungeon sprites (tiles
  85, 99 and 88), the owner's recorded decision, never inferred from a name.
  Those are single-angle: facing left mirrors the sprite. Drawn art takes an
  `owner` manifest entry rather than a CC0 credit. It sits beside Kenney tiles,
  so it is checked in the real scene in the light, dark and seasonal palettes
  before more is drawn.

All of it sits on the sprite path, rendered pixelated at integer scale. Sprout
Lands is the closest match to the register and is excluded: both tiers forbid
redistribution (`docs/sprout-lands.md`). Every file is recorded in the licence
manifest and guarded by test, and the world stays complete and playable with
every art file removed: each tile falls back to a flat token colour chosen by
what it does (wall, water, door, ground).

## The world

- **Time is read, never stored.** Season from the calendar, day and night from
  the visitor's clock, each project's crop growth from its own date, weather
  from the week's real GitHub activity (settled when it cannot be read).
- **State first, motion second.** Night and weather are a still veil over the
  scene, and that is how they are read. Ambient motion is allowed on top, as
  decoration that carries no information: tree crowns sway, light moves through
  the canopy, villagers wander. It is stepped (`steps()`), driven by CSS, paused
  when it cannot be seen, and absent under reduced motion and below `md`.
- **Characters follow a timetable**, a pure lookup of hour to place. When one
  is away, a signpost at their usual spot says where and when they are back.
- **Villagers are scenery.** A few fictional villagers (a farmer, a child, a
  shopkeeper, a wanderer) walk between fixed spots chosen by the clock, and say
  one short line when you walk up. They have no name, quest, schedule or
  content, never appear in a list or the character sheet, and are not the same
  kind of thing as the collaborators, who are the only people with names.

## Components

Transcribed from the `@utility` blocks in `src/styles/global.css`, which are the
source of truth. Every one of them resolves radius through
`--radius-interactive` (zero) and easing through a `steps()` token, so a
component cannot quietly reintroduce a rounded corner or a smooth curve.

| Component | Utility | Shape and treatment |
|---|---|---|
| Panel | `evidence-panel` | 4px hard frame drawn with four `box-shadow` offsets, `surface` ground. |
| Nested card | `evidence-card` | The same frame at 2px, so a nested card reads lighter than the panel under it. |
| Raw frame | `pixel-frame` | The shared 9-slice primitive the two above are built from. `pixel-frame-thread` swaps the border to `--color-thread` for the attention state; `pixel-frame-inset` drops the ground to `secondary`. |
| Flat panel | `soft-panel` | 2px solid border, `surface` ground. The cheap variant where a frame would be noise. |
| Button | `glass-btn` | 1px transparent border that resolves to `border` on hover with a `secondary` ground. Focus is a 2px `accent` outline at 2px offset, never removed. |
| Selection marker | `menu-cursor` | A CSS triangle in `--color-thread` that snaps in on hover, focus and `[data-active]`. Decorative: it sits alongside the focus ring and never replaces it. |
| Nav shell | `nav-island` | Fixed, centred, 1px border on a `background` ground. |
| Active nav | `nav-island-pill` | Accent at 18 percent with a 2px accent border, carried between pages by `transition:name`. |
| Mobile nav | `mobile-nav-shell`, `mobile-nav-drawer` | 4px border, `background` ground. Heavier than the desktop shell because it sits directly on content. |
| Section heading | `chapter-heading`, `chapter-label` | Top rule plus mono uppercase label at 0.12em tracking. |
| Display title | `title-display` | Pixelify Sans at 0.95 line-height. `title-accent` differentiates by colour only, never italic. |

The `evidence-*` utility names are CASE FILE leftovers; renaming them is part of
the identity cleanup, not the palette.

Interactive chrome is at least 44px on its shortest side. Focus is always
visible and never traded for a decorative marker.

## Sound

Two separate things. Both are off by default, persisted, synthesised with Web
Audio so no audio asset ships, and silent under `prefers-reduced-motion`.

- **Interface sounds**: four events only (hover, open, palette, submit), from
  oscillator envelopes. One toggle in the header.
- **Ambient audio in the valley**: a quiet pastoral loop (sixteen bars at 72 BPM,
  C major pentatonic, composed for this site), wind, now and then a bird, and
  footsteps that ring on a path and thud on grass. Its own control sits under
  the scene, a button and a volume slider, and it is not the header toggle:
  someone who said yes to clicks has not said yes to music.

Ambient audio never begins on its own. A saved opt-in waits for the visitor's
next key press or tap, then fades in over about a second. It plays only while the
valley is on screen and the tab is visible, fades out when either stops being
true, and is absent below `md` and under reduced motion. If the browser has no
Web Audio the control is not shown and nothing else changes.

## Dials

ENERGY 2 / RHYTHM 2 / MOTION 3.

Read as: a personal portfolio for recruiters and engineers, in a warm pastoral
pixel language. Confident enough to be memorable, restrained enough that the
work stays readable. Sections vary where the content varies. Motion rose from 2
to 3 when the valley gained wind, drifting leaves, light and wandering
villagers. It is ambient and optional: stepped, never eased, off under reduced
motion, paused when unseen, and it never carries information. The world's
state (season, hour, weather, crop growth) still comes from real time.

## Decided

- Page names: the Workshop (`/projects`) and the Journal (`/blog`), with the
  rest of the valley's places named to match. Nav labels stay literal.
- The board keeps its cork surface as deliberate contrast; only its copy lost
  the detective vocabulary.
- `/play` survives as its own URL, rendering the same valley as the landing
  page. Nothing redirects.
- All four seasons ship together.
