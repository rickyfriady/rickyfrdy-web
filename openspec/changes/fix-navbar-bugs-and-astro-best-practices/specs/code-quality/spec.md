## ADDED Requirements

### Requirement: Content collection schema validation
The project SHALL define and enforce Zod schemas for all content collections used with `astro:content`.

#### Scenario: Blog collection has schema
- **WHEN** running `astro build` or `astro check`
- **THEN** `src/content/config.ts` SHALL define a `blog` collection with Zod validation for `title`, `description`, `pubDate`, `tags`, `draft`
- **AND** any MDX file with missing or invalid frontmatter SHALL fail the build

#### Scenario: Projects collection has schema
- **WHEN** running `astro build` or `astro check`
- **THEN** `src/content/config.ts` SHALL define a `projects` collection with at minimum `slug` validation
- **AND** any MDX file with missing or invalid frontmatter SHALL fail the build

#### Scenario: Existing content complies with schema
- **WHEN** schema is applied
- **THEN** all existing MDX files in `src/content/blog/` and `src/content/projects/` SHALL pass validation
- **AND** no build errors SHALL be introduced by schema enforcement

### Requirement: Base URL uses runtime value
The `<base>` tag SHALL use `Astro.site` instead of a hardcoded URL string.

#### Scenario: Base tag uses Astro.site
- **WHEN** visiting any page in dev or production
- **THEN** `<base href>` SHALL equal `Astro.site` resolved value, not `https://rickyfrdy.my.id`

### Requirement: Reduced motion respected
All animation changes SHALL respect `prefers-reduced-motion: reduce`.

#### Scenario: Animation logic checks reduced motion
- **WHEN** user has `prefers-reduced-motion: reduce`
- **THEN** no new animation logic SHALL create visible motion
- **AND** existing reduced motion checks SHALL remain intact
