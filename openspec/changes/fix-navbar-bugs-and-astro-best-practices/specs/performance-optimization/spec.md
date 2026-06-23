## ADDED Requirements

### Requirement: Non-critical React islands use lazy hydration
React components that do not affect above-the-fold layout or initial interactivity SHALL use `client:idle` or `client:visible` directives instead of `client:load`.

#### Scenario: LangSwitcher uses idle hydration
- **WHEN** page loads
- **THEN** `LangSwitcher` component SHALL use `client:idle` directive
- **AND** SHALL not block initial page rendering

#### Scenario: MobileBottomNav uses visible hydration
- **WHEN** page loads
- **THEN** `MobileBottomNav` component SHALL use `client:visible` directive
- **AND** SHALL hydrate only when scrolled into viewport

#### Scenario: HeroPhoto uses idle hydration
- **WHEN** page loads
- **THEN** `HeroPhoto` component SHALL use `client:idle` directive
- **AND** SHALL not block initial page rendering

#### Scenario: ContactForm uses visible hydration
- **WHEN** page loads
- **THEN** `ContactForm` component SHALL use `client:visible` directive
- **AND** SHALL hydrate only when scrolled into viewport

### Requirement: Hero images load eagerly
Images above the fold that contribute to Largest Contentful Paint SHALL use `loading="eager"`.

#### Scenario: Hero images are eager
- **WHEN** page loads
- **THEN** all hero section `<img>` elements SHALL have `loading="eager"` or omit the `loading` attribute entirely

### Requirement: GSAP dynamically loaded
GSAP and ScrollTrigger SHALL be loaded only on pages that use scroll-driven animations, not every page.

#### Scenario: Page without scroll animations skips GSAP
- **WHEN** visiting a page that does not include `PageAnimations.astro`
- **THEN** GSAP and ScrollTrigger SHALL NOT be loaded in the browser

#### Scenario: Page with scroll animations loads GSAP
- **WHEN** visiting a page that includes `PageAnimations.astro`
- **THEN** GSAP and ScrollTrigger SHALL be dynamically imported only when needed
- **AND** animations SHALL work identically to the static import approach
