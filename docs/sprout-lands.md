# Sprout Lands — licence position and premium upgrade note

Status: **not in use.** No Sprout Lands file is committed to this repository, and
none should be until the blocker below is resolved.

Local copy for evaluation only:
`~/dev/personal/Sprout Lands - UI Pack - Basic pack` (Cup Nooble, free basic tier)

## The blocker

Both the free and the paid tier carry the same clause:

> This asset pack can't be resold or redistributed even if modified.

This repository is **public**. Committing the sprites publishes the raw PNGs at a
URL anyone can `git clone` or download individually — which is redistribution in
the plain sense of the word, regardless of what the site then renders. Buying the
premium pack does **not** fix this: premium lifts the commercial restriction, not
the redistribution one.

It also collides head-on with a requirement we already wrote, in
`specs/npc-character-art`:

> Art SHALL be committed inside the repository under the illustrated path. No
> build or render step SHALL depend on an asset pack located outside the
> repository.

Those two cannot both hold. Either the art is committed (violating the licence)
or it is fetched from outside the repo (violating our own spec).

## Tier comparison

| | Free basic | Premium (US$3.99+) |
|---|---|---|
| Commercial use | ✗ non-commercial only | ✓ any project |
| Redistribution | ✗ | ✗ *(unchanged)* |
| Modification | ✓ | ✓ |
| Character animation | "simple" | 6 types × 4 directions = 24 |
| Tools, animals, objects | minimal | expanded |
| Size | 299 KB | 2.1 MB |

A portfolio that exists to get its owner hired is, at best, an arguable
non-commercial project. The premium tier removes that argument for $3.99 and is
worth buying on that basis alone — but it is not what unblocks committing.

## What premium would unlock, if bought

The reason to want it is **single-artist consistency**. Mixing Kenney tiles with a
third-party character set leaves a visible seam at 16px; one artist for world and
people does not. Premium's 24 directional animations are also the exact shape
`sprites.ts` already models (`frameWidth`, `animations`, `frameDuration`), so the
pipeline needs no change to consume them.

Concretely it would supply:

- **Characters with a real walk cycle** in four directions, replacing the current
  single-angle Kenney renders — the thing standing between stationary NPCs and a
  world that reads as inhabited.
- **Tilling, chopping, watering animations**, which is the vocabulary a
  Harvest-Moon-style loop would need if projects are ever modelled as crops.
- **A UI kit** (dialogue frames, buttons, icons, speech bubbles, an 8×14 pixel
  font) that would replace hand-rolled CSS panel chrome with art matching the
  world.

## Routes out of the blocker

1. **Don't use Sprout Lands.** Stay on CC0 — Kenney Tiny Town/Tiny Farm for the
   world, a CC0 character set for people. Zero licence risk, zero cost, and the
   existing guard tests keep working unchanged. **Recommended default.**
2. **Ask Cup Nooble.** The read_me invites exactly this: *"If you want to make
   something commercial with these sprites contact me."* Written permission to
   ship the art inside a public repository would resolve it cleanly, and should be
   recorded in the licence manifest alongside the entry.
3. **Keep the art out of git.** Serve it from a private store or fetch at build.
   This respects the licence but breaks the "no build depends on an outside pack"
   requirement, so that spec would need amending first — deliberately, not by
   accident.
4. **Make the repository private.** Resolves redistribution, costs the portfolio
   its public source, which is part of its value as a work sample.

## The gap this exposed

`tests/assets/licences.test.ts` verifies that every illustrated file **has** a
licence entry. It does not verify that the recorded licence **permits** what we do
with it. A non-commercial, no-redistribution asset would pass the whole suite
today while being a violation.

Worth adding: a permission field on the manifest entry that fails the build for
any committed file whose licence does not allow being published in a public
repository. That turns this note into a test. Sketch below.

## Sketched fix — permissions on the manifest

Not three booleans on every entry: that is boilerplate, and boilerplate gets
filled in wrongly. Make the common case cost nothing and the dangerous case
impossible to leave undeclared.

```ts
/**
 * What a licence lets us do with a file we commit.
 *
 * `redistributable` is the one that bites: this repository is public, so every
 * committed asset is downloadable by anyone. A licence forbidding redistribution
 * cannot have its files live here, whatever the site then renders.
 */
interface Permissions {
  /** May the raw file be published where anyone can download it? */
  redistributable: boolean
  /** May it be used in a project that earns money — a portfolio included? */
  commercial: boolean
  /** May it be recoloured, cropped, re-palettised? */
  derivative: boolean
}

/** Licences whose terms are unambiguous and public. No need to restate them. */
const KNOWN: Record<string, Permissions> = {
  'CC0-1.0':      { redistributable: true, commercial: true,  derivative: true  },
  'CC-BY-4.0':    { redistributable: true, commercial: true,  derivative: true  },
  'CC-BY-SA-4.0': { redistributable: true, commercial: true,  derivative: true  },
  'CC-BY-ND-4.0': { redistributable: true, commercial: true,  derivative: false },
  'CC-BY-NC-4.0': { redistributable: true, commercial: false, derivative: true  },
  'MIT':          { redistributable: true, commercial: true,  derivative: true  }
}
```

The type gains **one optional field**, not three:

```ts
| {
    file: string
    author: string
    source: string
    licence: string
    attribution: string
    maxBytes?: number
    /**
     * Required only when `licence` is not in KNOWN — a bespoke or proprietary
     * pack must state its terms rather than have them guessed.
     */
    permissions?: Permissions
  }
```

The four existing Kenney entries change by zero characters, because `CC0-1.0` is
looked up. A pack with bespoke terms cannot be added without someone typing
`redistributable: false`, and at that point the test stops them.

### The test

```ts
it('refuses committed art that its licence forbids publishing', () => {
  const violations = assetLicences
    .filter((e) => e.author !== 'owner')
    .map((e) => ({ e, p: KNOWN[e.licence] ?? e.permissions }))
    .filter(({ p }) => !p || !p.redistributable)
    .map(({ e, p }) =>
      !p
        ? `${e.file}: licence "${e.licence}" is unknown and declares no permissions`
        : `${e.file}: "${e.licence}" forbids redistribution, but this repo is public`
    )

  expect(violations, violations.join('\n')).toEqual([])
})
```

| Situation | Result |
|---|---|
| Kenney CC0 committed | passes silently |
| Sprout Lands committed | **fails** — forbids redistribution, repo is public |
| Unknown licence, no permissions | **fails** — cannot be forgotten |
| Owner-authored | skipped; you own it |

### The fact that has to be explicit

`redistributable` only matters *because the repo is public*. State it rather than
imply it:

```ts
/** Flip if this repository ever goes private; the bar changes with it. */
const REPO_IS_PUBLIC = true
```

Without that constant, someone who later makes the repo private gets a failing
test for a reason that is no longer true, and no way to see why.

### Deliberately not enforced

- **`commercial`** — whether a portfolio counts as commercial is a judgement, not
  something a test should decide. Record it; do not fail on it.
- **`derivative`** — only relevant at the moment someone edits a file, which no
  test can observe. Record it as a note to a future self.

One field enforced, two recorded. The enforced one is the only one with a clear,
checkable, and currently-violated answer.

### Honest cost

Roughly 40 lines and one test, whose entire present-day purpose is to prevent
something we now know not to do. Its value is six months from now, when this
conversation is forgotten and a good-looking pack gets dropped into
`src/assets/illustrated/`.
