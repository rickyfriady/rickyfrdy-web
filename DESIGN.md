# DESIGN.md

Direction for this site. Transcribed, not invented: every decision below was
already made and is already shipped. Sources are the archived OpenSpec specs
(`openspec/specs/pixel-design-system`, `display-font-identity`, `world-theme`,
`button-styling`) and the token block in `src/styles/global.css`.

If any line here does not match what you actually want, correct it. This file
outranks inference, and it is what the next piece of UI work reads first.

## Identity

**CASE FILE.** A pixel-art detective desk. The premise is that a visitor
evaluating a developer is already doing detective work, gathering evidence and
connecting it, so the site names that rather than imposing an unrelated
metaphor. Detective supplies the fiction (case files, evidence, a corkboard with
red string); JRPG supplies the interface vocabulary (menu cursors, dialogue
boxes, stat panels) so navigation needs nothing learned.

Audience: recruiters and clients, plus engineers who read the source.

## The rule that governs everything

**Theme carries the concept; content stays literal.** In-fiction language is
confined to page names, frames, textures, and sounds. Headings, project titles,
metrics, dates, and calls to action stay plainly worded. An evidence card shows
the real project title and real technologies, never "EXHIBIT A, CLASSIFIED".

This is what keeps the concept from standing between a recruiter and the work.
Its companion rule: the game is an additional door, never the only one. Every
project, article, and PDF stays reachable, crawlable, and fast without touching
`/play` or `/board`.

## Palette

Low-chroma warm neutrals, two themes, one saturated accent. No literal colour
values anywhere; everything references tokens in `global.css`.

| Role | Light ("Meja Siang") | Dark ("Arsip Malam") |
|---|---|---|
| background | `oklch(.93 .015 85)` | `oklch(.16 .012 60)` |
| surface | `oklch(.86 .022 80)` | `oklch(.24 .018 55)` |
| border | `oklch(.55 .030 75)` | `oklch(.55 .020 55)` |
| foreground | `oklch(.22 .015 60)` | `oklch(.92 .015 85)` |
| accent | `oklch(.48 .160 30)` | `oklch(.68 .150 30)` |

`--color-thread` is theme-constant and deliberately separate from the accent, so
the red string that marks connection cannot be mistaken for ordinary chrome.

A third palette, `.world`, is scoped to `/play`: near-black ground, gold accent.
It redefines only existing roles, so no component knows which palette is active.

Retired and not to return: the blue (hue 220) and green (hue 160) accents.

Contrast is enforced by test, not by eye:
`tests/styles/palette-contrast.test.ts` holds every text role to 4.5:1 and every
graphic role to 3:1 against all three grounds, in all three palettes.

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

- **Corner radius: zero.** Not "small". Zero.
- **Spacing on a 4/8 pixel grid.**
- **One 9-slice frame** for every panel, replacing per-component panel styles.
- **Stepped motion** (`steps()`), not eased easing.
- Sprites render pixelated at integer scale; illustrated art renders smooth at
  fractional scale. The path is chosen by which directory the file sits in.

## Sound

Four events only: hover, open, palette, submit. Synthesised with Web Audio from
oscillator envelopes, so no audio assets ship. Off by default, persisted, and
silent under `prefers-reduced-motion`. No background music.

## Dials

ENERGY 2 / RHYTHM 2 / MOTION 2.

Read as: a personal portfolio for recruiters and engineers, in a pixel-detective
visual language. Confident enough to be memorable, restrained enough that the
work stays readable. Sections vary where the content varies. Motion is stepped
and purposeful, never ambient.

## Known open questions

- Whether `.world` is promoted site-wide by moving one class to `<html>`.
- Whether a light variant of the world palette is wanted.
- Whether the Kenney CC0 character art stays: it is isometric and soft-shaded
  against a flat top-down pixel scene, and that clash has not been judged on
  screen yet.
