# Component Organization

Use component location and file names to show whether UI is shared across the app or private to one App Router segment.

## File naming

Name React component files with **PascalCase**. Match the main exported component name.

| Component export   | File                         |
| ------------------ | ---------------------------- |
| `Button`           | `Button.tsx`                 |
| `StackIconsEditor` | `StackIconsEditor.tsx`       |
| `IconGridPreview`  | `IconGridPreview.tsx`        |
| `useIconQuery`     | `useIconQuery.ts`            |

Avoid kebab-case for component files, even inside route-private folders.

## Placement

Keep route-specific UI inside the nearest App Router `_components` folder. Use root `components/` only for shared UI that is intentionally reused across unrelated routes or app areas.

| Location                    | Use for                                      |
| --------------------------- | -------------------------------------------- |
| `app/_components/`          | UI private to the root app segment           |
| `app/icons/_components/`    | UI private to the `/icons` segment           |
| `components/`               | Shared app components                        |
| `components/ui/`            | Reusable design-system primitives            |

`_components` is a convention, not a Next.js routing feature requirement. The underscore opts the folder out of routing and signals that the files are implementation details for that route segment.

## Promotion rule

Start components close to the route that owns them. Move a component to root `components/` when it becomes deliberately shared across multiple unrelated segments or when it is a design-system primitive.

When moving a component, move its colocated test with it and keep the same PascalCase base name:

| Source                    | Test                         |
| ------------------------- | ---------------------------- |
| `StackIconsEditor.tsx`    | `StackIconsEditor.test.tsx`  |
| `IconGridPreview.tsx`     | `IconGridPreview.test.tsx`   |
