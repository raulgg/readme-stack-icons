# 0003 — shadcn primitives are restyled to Primer, and Button speaks a Primer vocabulary

Date: 2026-06-13
Status: accepted

## Context

This app is a deliberate GitHub Primer recreation built on shadcn primitives. The primitives in `components/ui` (Button, Slider, and friends) keep shadcn's component structure and API, but their colors come from this project's Primer design tokens — CSS variables in `app/globals.css` consumed through `tailwind.config.ts` (`bg-surface-2`, `text-ink`, `bg-accent`, the `--button-bg-hover` token, and so on).

Stock shadcn defaults do not match Primer. The most visible divergence: shadcn's `ghost` and `outline` button variants hover to **accent-blue**, while Primer secondary and icon buttons hover to a **subtle gray**. Until now the editor also hand-rolled its standalone action buttons (the Download trigger, the Download .zip button) with bespoke Tailwind classes, so the same button idiom was expressed in several places at once.

## Decision

- shadcn primitives in `components/ui` are intentionally restyled to Primer tokens, not left at stock shadcn defaults.
- `Button` is the single source of truth for button styling. Its `cva` variants express a **Primer vocabulary**:
  - `ghost` and `outline` hover to subtle Primer gray (`bg-surface-2` / `--button-bg-hover`) instead of accent-blue, and `outline` drops the accent text flip.
  - An `iconSm` size (`h-8 w-8`) is added for compact icon-only buttons.
  - A `destructiveGhost` variant is added — muted by default, destructive fill on hover — for inline remove/delete actions.
  - `default` (accent/primary solid), `secondary`, and `destructive` keep their existing meaning.
- The editor's standalone action buttons route through `Button` rather than hand-rolling classes, so the Primer idiom lives in one place.

## Consequences

- Adding a button anywhere reaches for `Button` and inherits on-brand Primer hovers for free; no one re-derives the gray-hover idiom by hand.
- Diverging from upstream shadcn makes "regenerate this primitive via the shadcn CLI" lossy — a regenerate would reintroduce accent-blue hovers and drop the added size/variant. This is accepted in exchange for on-brand consistency; the primitives are owned, not vendored.
- The `destructiveGhost` variant ships unused here; RS-113 consumes it when the Layout section's Remove breakpoint button is routed through `Button`.

## Alternatives considered

- **Keep stock shadcn variants and override per-usage with classNames**: every call site re-states the gray hover, and any missed call site silently hovers accent-blue. Rejected — defeats the single-source-of-truth goal.
- **Fork shadcn into a wrapper layer that re-skins on top of the stock primitive**: extra indirection for no benefit when we already own the primitive files. Rejected.
