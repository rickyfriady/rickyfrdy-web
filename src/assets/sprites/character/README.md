# Character sprites — 32x32

`subject.png` — the avatar used in the hero and as the centre card on the board.

Still undecided (open question in `design.md`): whether this replaces the real
photograph everywhere, or whether the sprite fronts the home page while `/about`
keeps the real photo. Recruiters generally respond to a real face, so the split is
the likelier answer.

32x32, no animation frames. If an idle animation is wanted later, add
`subject-idle-2.png` etc. and drive it with CSS `steps()` — do not bake a spritesheet
until there is a reason to.
