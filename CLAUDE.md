<!-- antislop:start -->
## antislop
For UI work, read `DESIGN.md` first for direction, then apply antislop as the filter.
For UI, copy, people, mobile layout, or code comments work, load the antislop skill for the task:
- Core filter, always on: `antislop`
- UI / visual: `antislop-ui`
- Copy & text: `antislop-copywriting`
- People: `antislop-human`
- Mobile / responsive: `antislop-layoutmobile`
- Code comments: `antislop-code`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

<!-- design-routing:start -->
## Design skills: which one owns the task

Five design skills are installed and they overlap. Load the ONE that owns the
request, plus antislop. Loading three at once produces contradictory direction,
not better design.

| The request | Load |
|---|---|
| Any UI, copy, or layout work | `antislop` (core, always) + its task skill below |
| Craft pass on existing UI: polish, audit, critique, harden, animate, typeset | `impeccable` |
| A new marketing surface: landing page, portfolio section, hero | `design-taste-frontend` |
| Rebuilding a page that already ships | `redesign-existing-projects` |
| Brand artefacts: logo systems, identity boards | `brandkit` |
| Motion and transitions | `motion-design` (principles) or `transitions-dev` (CSS recipes) |
| Picking a style, palette, or font pairing from scratch | `ui-ux-pro-max` |

`high-end-visual-design` and `design-taste-frontend-v1` were removed from this
project: both push a generic premium-agency look that fights DESIGN.md. If a
future task genuinely needs one, reinstall it from tasteskill.dev rather than
working around its absence.

**DESIGN.md outranks every skill.** These skills supply method; DESIGN.md
supplies the direction. Where a skill's default aesthetic contradicts DESIGN.md
(soft shadows, large radii, glassmorphism, blue or green accents, smooth
easing), DESIGN.md wins and the conflict gets said out loud, not silently
split.

Hard constraints no skill may override, each enforced by a test or a token:
- Radius is 0. Every `--radius-*` token is zeroed in `global.css`.
- Easing is `steps()`, never a cubic bezier.
- One accent. The retired blue (hue 220) and green (hue 160) do not come back.
- Contrast is enforced by `tests/styles/palette-contrast.test.ts`, in all three
  palettes. Run it after any token change.

### impeccable

Run `node .claude/skills/impeccable/scripts/context.mjs` once per session before
its first use, cwd at the project root. `scripts/doctor.mjs` checks the setup.
Its `live` mode needs a dev server: `bun run dev`.

### Skill sources

`.claude/` and `skills-lock.json` are gitignored, so skills are per-machine and
a fresh clone has none of them. Sources: impeccable is impeccable.style
(`npx impeccable`); `design-taste-frontend`, `brandkit` and
`redesign-existing-projects` come from tasteskill.dev (`Leonxlnx/taste-skill`).
<!-- design-routing:end -->
