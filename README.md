# readme-stack-icons

Compose an ordered stack of technology slugs into one cached SVG image for GitHub profile embeds.

## Editor

The public editor builds a GitHub README-safe HTML snippet from icon slugs,
columns, and gap. The generated snippet uses the current site origin with the
short `/icons` route and `icons`, `columns`, `gap`, and `theme=light` query
params. Base URL and version/cache-busting query params are not exposed as
editor form fields.

## Stack

- **Runtime / package manager:** [Bun](https://bun.sh)
- **App:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Tests:** Vitest, Testing Library, jsdom

## Scripts

| Command         | Purpose             |
| --------------- | ------------------- |
| `bun run dev`   | Local dev server    |
| `bun run build` | Production build    |
| `bun run lint`  | ESLint              |
| `bun run test`  | Vitest (watch mode) |

## Layout

| Path          | Role                                  |
| ------------- | ------------------------------------- |
| `app/`        | Routes, layouts, API route handlers   |
| `components/` | Shared UI                             |
| `lib/`        | Utilities                             |
| `docs/`       | Project documentation and guidelines  |
| `test/`       | Vitest global setup only (`setup.ts`) |

Unit tests are colocated with source files (e.g. `Button.tsx` → `Button.test.tsx`). See [Writing unit tests](docs/guidelines/writing-unit-tests.md).

Path alias `@/` resolves to the repo root (see `vitest.config.ts` and Next config).
