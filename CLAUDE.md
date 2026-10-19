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

impeccable owns design work here. The other installed skills are helpers it
calls, not competing directions: loading several as equals produces
contradictory advice, not better design.

| The request | Use |
|---|---|
| Any UI, copy, or layout work | `antislop` (core, always) + its task skill above |
| Score a page: how good is it, what to fix first | `/design-check [target]` (audit /20 + critique /40) |
| Craft pass: polish, harden, adapt, animate, typeset, clarify, distill | `impeccable` |
| A new surface whose direction is not in DESIGN.md yet | `impeccable` `shape`, then its build commands |
| Brand artefacts: logo systems, identity boards | `brandkit` |
| Motion principles or CSS transition recipes | `motion-design` or `transitions-dev`, with `steps()` easing |

Helpers, never the lead:
- **ui-ux-pro-max** is a lookup for recommendations: `search.py "<keyword>"
  --stack astro`, `--stack react` for islands, `--domain ux`. Its style, colour
  and font domains are not used; DESIGN.md has decided them.
- **taste-skill** supplies `inspect.mjs`, a browser check for the page frame
  (off-centre, blank gaps, edge text, untitled sections). Do not let it lead:
  its `draw.mjs` picks styles and its scroll scenes smooth-scroll, both ruled
  out by DESIGN.md.

Not installed, on purpose: `redesign-existing-projects` (retired upstream into
taste-skill), `high-end-visual-design` and `design-taste-frontend-v1` (a
generic premium-agency look), and oil-ui (direction exploration is settled in
DESIGN.md; it also phones home for updates on every run). Revisit oil-ui when a
surface needs a new direction.

**DESIGN.md outranks every skill.** These skills supply method; DESIGN.md
supplies the direction. Where a skill's default aesthetic contradicts DESIGN.md
(soft shadows, large radii, glassmorphism, blue or green accents, smooth
easing), DESIGN.md wins and the conflict gets said out loud, not silently
split.

Hard constraints no skill may override, each enforced by a test or a token:
- Radius is 0. Every `--radius-*` token is zeroed in `global.css`.
- Easing is `steps()`, never a cubic bezier. Tailwind `ease-*` classes are
  remapped to steps; raw CSS `ease` keywords and GSAP eases are not.
- One text accent (`--color-accent`, forest green) plus one decorative colour
  (`--color-sun`, never under text). The retired blue (hue 220), old green
  (hue 160) and CASE FILE red accent do not come back.
- Contrast is enforced by `tests/styles/palette-contrast.test.ts`, in all three
  palettes. Run it after any token change.

### impeccable

The skill runs its own `impeccable context` step at first use;
`/impeccable doctor` checks the setup. Its `live` mode and `/design-check` need
a dev server: `bun run dev`. Known false positives and decided choices live in
`.impeccable/critique/ignore.md`; critique snapshots and the score trend in
`.impeccable/critique/`.

### Skill sources

`.claude/`, `.agents/`, `.impeccable/`, `openspec/` and `skills-lock.json` are
gitignored, so all of this is per-machine and a fresh clone has none of it.

- impeccable (user plugin): `claude plugin marketplace add pbakaus/impeccable`,
  then `claude plugin install impeccable@impeccable`.
- ui-ux-pro-max (project plugin): `claude plugin marketplace add
  nextlevelbuilder/ui-ux-pro-max-skill`, then `claude plugin install
  ui-ux-pro-max@ui-ux-pro-max-skill --scope project`.
- taste-skill (project plugin, default skill only, not `taste-skill-classics`):
  `claude plugin marketplace add Leonxlnx/taste-skill`, then `claude plugin
  install taste-skill@taste-skill --scope project`.
- `brandkit` moved to `Leonxlnx/imagegen-skills`; `motion-design` is
  `LottieFiles/motion-design-skill`; `transitions-dev` is
  `Jakubantalik/transitions.dev` (`npx skills add <repo>`).
- `/design-check` is `.claude/commands/design-check.md`: it runs impeccable audit
  then critique on a target (default the homepage), adds the hard-constraint
  checks above to audit's Theming score, and gives critique's evidence sub-agent
  a taste-skill `inspect.mjs` run at 1440, 768 and 390. Recreate it from the
  `design-review-loop` OpenSpec change if it is missing.
<!-- design-routing:end -->

## Design Context

Transcribed from `PRODUCT.md` and `DESIGN.md`; they win where this drifts.

- **What it is:** the portfolio and resume site of Ricki Friadi, a fullstack
  developer in Jakarta. Success is a reply: an interview request or a project
  enquiry.
- **Primary audience:** technical recruiters and hiring managers, scanning
  quickly, often on a phone, with many candidates open. Within about a minute
  they need what shipped, at what scale, with which stack. Design for the
  recruiter with ninety seconds and a locked-down laptop who never plays.
- **Secondary audience:** prospective freelance clients judging whether one
  person can deliver a whole system; engineers who read the source.
- **Brand:** a warm pastoral valley you walk, not an office you search. Theme
  carries the concept; content stays literal. Every building is also a plain
  URL, and the destination list renders first, server-side.
- **Proof rules:** specific evidence over capability lists; micro-frontends and
  microservices together, never one alone; never invent evidence (one blog
  article, no testimonials).
- **Must hold:** WCAG AA text contrast, 3:1 for meaningful graphics, 44px touch
  targets, reduced motion disables animation and sound, EN and ID at equal
  quality, keyboard-operable, content readable without JavaScript.
