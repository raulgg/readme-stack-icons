# StackIcons

Compose an ordered stack of technology slugs into one cached SVG image for GitHub READMEs.

## Editor

The public editor builds a GitHub README-safe HTML snippet from icon slugs,
layout mode, column layouts, and gap. Single layout uses one base column count.
Responsive layout uses a base mobile column count plus one or more breakpoint
rows, each with `Columns` and `Breakpoint px` values.

The editor stores active form state in the page URL. Active layout state uses
`layout` plus JSON-serialized `column-layouts`; inactive single/responsive
layout memory is local to the current editor session.

Generated README HTML still targets the unchanged short `/icons` route. Each
image URL uses the current site origin with `/icons` and the same public API
query params as before: `icons`, `columns`, `gap`, and `theme`. Responsive
HTML emits multiple `<source>` URLs that differ only by `columns` and `theme`;
the `/icons` API itself remains a single-layout SVG endpoint. Base URL and
version/cache-busting query params are not exposed as editor form fields.

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

### Tests

Unit tests run on **Vitest** with Testing Library and jsdom. Use `bun run test` — not `bun test`, which is Bun's separate test runner and is blocked by a `bunfig.toml` preload guard.

Tests are **colocated** next to the file they cover, using the same base name with a `.test` suffix (e.g. `Button.tsx` → `Button.test.tsx`). That applies to components, hooks, utilities, API route handlers, and any other unit under test.

| Path                | Role                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `vitest.config.ts`  | jsdom environment, `@/` alias, setup file                                                         |
| `vitest.setup.ts`   | Shared matchers (`jest-dom`) and jsdom polyfills (`matchMedia`, `PointerEvent`, `ResizeObserver`) |
| `bun-test-guard.ts` | Exits with an error if `bun test` is invoked directly                                             |

Coverage spans the editor UI (`app/_components/StackIconsEditor/`), shared components, the `/icons` API route, and pure logic in `lib/icons/`. Component tests query the DOM by role, label, or accessible name; lib tests call functions directly.

Tests follow **Given – When – Then** structure with names like `should [outcome] when [action]`. See [Writing unit tests](docs/guidelines/writing-unit-tests.md) for conventions and examples.

## Layout

| Path          | Role                                 |
| ------------- | ------------------------------------ |
| `app/`        | Routes, layouts, API route handlers  |
| `components/` | Shared UI                            |
| `lib/`        | Utilities                            |
| `docs/`       | Project documentation and guidelines |

Path alias `@/` resolves to the repo root (see `vitest.config.ts` and Next config).
