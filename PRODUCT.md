# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **technical recruiters and hiring managers**, scanning quickly — often on a phone,
often with many candidates open at once. They need to establish, within about a minute, what
Ricki has actually shipped, at what scale, and with which stack.

Secondary: **prospective freelance clients**, evaluating whether he can deliver a whole system
rather than fill a role.

Both audiences arrive cold, without context about Indonesian fintech or PT. Pegadaian, and both
are evaluating rather than browsing.

## Product Purpose

The personal portfolio and resume site of **Ricki Friadi**, a fullstack developer in Jakarta,
Indonesia, published at `https://rickyfrdy.my.id`.

It exists to convert a stranger's short, skeptical visit into a concrete belief that he can build
and maintain production systems — and then into contact. Success is a reply: an interview
request or a project enquiry.

Target markets, confirmed together and all live at once:

- fullstack roles at Indonesian companies (Jakarta, on-site or hybrid);
- remote roles with international companies;
- freelance client projects.

## Positioning

The differentiator is **distributed architecture across both tiers**: micro-frontends *and*
microservices, in production, in regulated Indonesian fintech.

This is a claim most portfolios at this experience level cannot truthfully make. It is specific
work — Module Federation front-ends and NestJS service constellations serving real users at a
state-owned pawnbroker — not a list of familiar technologies. Positioning should lead with that
pairing rather than with a generic fullstack framing.

## Operating Context

- Recruiters skim on mobile, in a tab among many, and leave quickly. Speed and scanability are
  product requirements, not preferences.
- Two languages serve two markets from one site: English at `/`, Indonesian at `/id/`. Indonesian
  copy runs roughly 20–30% longer than the English, so layouts must absorb that.
- The resume exists in two forms with different readers: a designed PDF for humans and a separate
  ATS variant parsed by software. The ATS document is plain Helvetica by necessity and is
  deliberately excluded from any visual treatment applied to the site.
- International visitors have no local context, so evidence has to stand without it.

## Capabilities and Constraints

Shipped:

- project case studies with real metrics; work history; skills; a bilingual "about"
- MDX blog with content collections, tags, RSS, and per-post OG images
- AI site search over blog and project content (build-time embeddings, in-browser query encoding)
- command palette (⌘K) covering routes, actions, and content
- `/now`, changelog with its own feed, live dashboard (GitHub + WakaTime)
- resume in two PDF forms: designed and ATS-safe
- static output, deployed to Vercel

Constraints:

- `output: 'static'` — no server runtime. Any capability needing a backend requires an adapter
  and is therefore a deliberate architectural decision, not an incremental one.
- Package manager is **bun**; `bun.lock` is authoritative and `package.json` pins
  `packageManager: bun@1.4.0`. A stale `package-lock.json` previously coexisted and would have
  made Vercel install with npm from an out-of-date tree; it has been removed.
- Live dashboard data depends on `GITHUB_TOKEN` and `WAKATIME_API_KEY` at build time and degrades
  when absent.

Deferred, not abandoned:

- **Guestbook** — written but inert, held as `.example` files. It needs a server endpoint and
  GitHub OAuth, which the static constraint above makes a real decision. Confirmed as intended
  for later activation; it should not be deleted.

Open decisions:

- `public/images/scene.jpg` is referenced by `/about` but has never existed in the repository. The
  fallback pattern renders instead. Either the photograph gets added or the slot gets retired.

## Brand Commitments

- Name and identity: **Ricki Friadi**; domain `rickyfrdy.my.id`.
- Bilingual EN/ID is a standing commitment, not a feature toggle.
- The ATS resume must stay machine-parseable, whatever the site does visually.
- Accessibility is treated as a commitment rather than a checklist: WCAG AA contrast is
  deliberately maintained (and now guarded by a test), touch targets are 44px, and
  `prefers-reduced-motion` is honored throughout.

## Evidence on Hand

Real, verifiable, and safe to publish as-is (confirmed: no NDA restriction on the work currently
shown, including company name, system names, and metrics):

- **5 project case studies** in `src/data/projects.ts`, all real: Singel APP (Pegadaian Kita),
  Microsite Pinjaman Pegadaian, KAMILA, AIRA Reconciliation, Thesis Chatbot Kukerta — each with
  role, stack, challenges, solutions, and outcome metrics.
- **Named employer**: PT. Pegadaian, a state-owned Indonesian financial institution.
- **Live data**: GitHub contributions and WakaTime coding statistics, fetched at build time.
- **Named collaborators** in `src/data/collaborators.ts` — real people, real roles, real LinkedIn
  profiles and photos.

Absences that must not be papered over:

- **There are no testimonials.** The collaborator list carries names and links but no quotes,
  endorsements, or recommendations. Nothing may be written that implies otherwise.
- **The blog holds exactly one published article** (`microservices-with-nestjs.mdx`), despite a
  full blog system and an AI search built over it. Any design that leans on volume of writing is
  designing for content that does not exist yet.
- No pricing, no client logos beyond the named employer, no press, no awards.

## Product Principles

1. **A recruiter's first minute is the whole product.** Anything that delays what he shipped, at
   what scale, with what stack, is working against the site's only job.
2. **Specific evidence beats capability lists.** "9 independent microservices using the Factory
   pattern" persuades; "experienced with microservices" does not.
3. **Both tiers, or the positioning collapses.** Micro-frontends and microservices together are
   the claim; presenting either alone reduces the site to an ordinary fullstack portfolio.
4. **Two languages, one standard.** Indonesian is not a translation afterthought — it serves a
   primary market and must never be the version that overflows or reads as machine-made.
5. **Never invent evidence.** With one article and no testimonials, the honest response is to
   write more, not to imply more.

## Accessibility & Inclusion

- WCAG AA contrast for text roles and 3:1 for meaningful non-text elements, verified by an
  automated test against the real palette tokens rather than by inspection.
- 44px minimum touch targets, retained through layout changes.
- `prefers-reduced-motion` disables animation and silences interaction sound.
- Bilingual EN/ID with `hreflang` pairing.
- Keyboard operability is required, including on interactive surfaces: content must remain
  reachable and readable with JavaScript unavailable.
