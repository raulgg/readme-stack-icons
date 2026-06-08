# Readme Stack Icons

Readme Stack Icons lets users compose technology icon slugs into GitHub README-safe image embeds with configurable layout.

## Language

**Breakpoint**:
A viewport width threshold that changes the generated icon layout at and above a specific pixel width. Breakpoints are represented as `min-width` thresholds with their own column count.
_Avoid_: Media query, range, tier

**Base layout**:
The fallback icon layout used when no breakpoint matches. A single-layout embed has only a base layout, while a responsive embed has a base layout plus one or more breakpoint-specific layouts.
_Avoid_: Default layout, mobile breakpoint

**Column layout**:
A configurable icon grid layout with a column count and an optional breakpoint. The base column layout has no breakpoint and is identified by a `null` minimum width, while breakpoint-specific column layouts have a `min-width` pixel threshold.
_Avoid_: Layout rule, column preset, responsive layout

Generated README HTML emits breakpoint-specific sources from widest to narrowest so the browser selects the first matching source.

Column layout identity belongs to the layout values themselves, not to generated IDs. UI-only keys may be used while editing, but generated IDs are not part of the column layout language.

**Single layout**:
An embed layout with exactly one base column layout and no breakpoints.
_Avoid_: Non-responsive layout, simple mode

**Responsive layout**:
An embed layout with a base column layout plus one or more breakpoint-specific column layouts. The default responsive layout uses 12 base columns and 18 columns from 768px upward.
_Avoid_: Breakpoint mode, advanced layout
