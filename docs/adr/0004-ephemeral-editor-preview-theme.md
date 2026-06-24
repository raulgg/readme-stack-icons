# 0004 — Editor preview theme is ephemeral, not URL state

Date: 2026-06-24
Status: accepted

## Context

The column layout preview shows one generated image source at a time for a
selected light or dark **preview theme**. That theme must follow the user's
**UI theme** on first paint and whenever the UI theme changes, while still
letting the user flip the preview independently until the next UI theme change.

Shareable editor URLs already encode icons, layout, spacing, and icon size.
Preview theme is a transient viewing preference — like which breakpoint band
is selected in the preview box — not part of the README image the user copies.
Persisting it in the URL would suggest it affects generated output when README
image code always emits both light and dark sources via `<picture>` media
queries.

## Decision

- Preview theme lives in local React state in `StackIconsEditor` (`previewTheme`
  / `setPreviewTheme`), **not** in `StackIconsEditorState` or shareable URL
  search params.
- On mount and on every resolved UI theme change, preview theme **re-seeds** to
  the resolved UI theme (`useResolvedPreviewTheme`). The user may override it
  with the preview box's `ThemeSelect` until the next UI theme change.
- Re-seeding runs **during render** (compare `lastSeededUiTheme` to
  `resolvedUiTheme` and update state in the same pass), not in a `useEffect`,
  so the seeded value paints without a flash of the previous preview theme.
- The landing `DemoCard` mirrors the UI theme via `useResolvedPreviewTheme`
  only; it exposes no preview-theme control.

## Consequences

- Shared editor URLs reopen with preview theme matching the recipient's current
  UI theme, not the sharer's last preview toggle.
- `buildStackIconsEditorPageQuery` and `getStackIconsEditorInitialState` stay
  free of `preview-theme`; tests assert the param is absent.
- Preview theme semantics match CONTEXT.md: ephemeral, follows UI theme on
  change, user-overridable until the next change.

## Alternatives considered

- **`preview-theme` URL search param**: makes a viewing preference look
  shareable and output-affecting; duplicates what `<picture>` already encodes.
  Rejected.
- **Persist preview theme in `localStorage`**: survives reloads but still does
  not belong in shareable URLs; adds cross-tab sync complexity for little gain.
  Rejected.
- **Re-seed preview theme in `useEffect` on UI theme change**: causes an extra
  paint with the stale preview theme before the effect runs. Rejected.
