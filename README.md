# Ricki Portfolio

Portfolio website built with Vue 3, TypeScript, Tailwind, and Vite, now migrated to a Bun-first workflow.

## Stack

- Bun (`bun.lock`, `bun install`)
- Vue 3 + Vue Router + Pinia
- Vite + Tailwind CSS
- Vitest + Testing Library
- ESLint + Prettier + Husky + lint-staged

## Project Structure

```txt
src/
├── components/
│   ├── layout/      # App shell (header/footer/main layout)
│   ├── page/        # Route pages + page-specific sections
│   ├── providers/   # App-level provider registration
│   └── ui/          # Shared UI primitives
├── hooks/           # Reusable logic hooks (useGitHub/useProjects)
├── router/          # Route definitions and meta handling
├── types/           # Shared TypeScript types
└── utils/           # Utilities (cn helper)
tests/
├── components/
├── hooks/
└── routes/
```

## Scripts

- `bun dev` start development server
- `bun build` type-check + production build
- `bun preview` preview production build
- `bun lint` run ESLint
- `bun lint:fix` run ESLint with autofix
- `bun format` run Prettier write
- `bun format:check` run Prettier check
- `bun test` run Vitest watch
- `bun test:run` run Vitest once
- `bun test:coverage` run Vitest with coverage

## Quality Gates

- Pre-commit hook runs `bun lint-staged`.
- `lint-staged` runs ESLint + Prettier on staged files.

## Manual Preview

Use [`MIGRATION_TODO_OPTION3.md`](./MIGRATION_TODO_OPTION3.md) for the full manual verification checklist.
