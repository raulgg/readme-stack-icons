# Naming Conventions

Naming does not change how code executes, but inconsistent names make developer mistakes more likely. Use names that make intent clear without needing to inspect every call site.

## Consistent Terms

Pick one spelling for domain terms and keep it everywhere.

| Avoid        | Prefer |
| ------------ | ------ |
| `URL`, `Uri` | `Url`  |
| `SVG`        | `Svg`  |
| `API`        | `Api`  |
| `ID`         | `Id`   |

Examples:

```ts
const iconsUrl = buildIconsUrl(state);
const requestId = crypto.randomUUID();
```

## Specific Names

Avoid generic names when the value has a more specific role.

| Avoid    | Prefer                          |
| -------- | ------------------------------- |
| `token`  | `refreshToken`, `accessToken`   |
| `api`    | `serverApi`, `iconsApi`         |
| `userId` | `myUserId`, `targetUserId`      |
| `data`   | `iconRequest`, `registeredIcon` |

When a returned property is generic, rename it at the boundary:

```ts
const { userId: targetUserId } = getUserProfileTarget();
```

## No Abbreviations

Write complete words unless the abbreviation is the domain term used everywhere.

| Avoid         | Prefer               |
| ------------- | -------------------- |
| `btn`         | `button`             |
| `cfg`         | `configuration`      |
| `idx`         | `index`              |
| `webPmtStrat` | `webPaymentStrategy` |

## Object Shape Names

Do not create objects whose key repeats the object name.

| Avoid               | Prefer        |
| ------------------- | ------------- |
| `userId.userId`     | `user.userId` |
| `iconSlug.iconSlug` | `icon.slug`   |
| `request.request`   | `iconRequest` |

## Booleans

Boolean names should read as true-or-false statements. Use one of these prefixes:

- `is`: `isDeleted`, `isLoading`, `isIconSlug`
- `has`: `hasDeletedPhoto`, `hasNextPage`, `hasMounted`
- `should`: `shouldBeDeleted`, `shouldRenderPreview`
- `can`: `canSubmit`, `canRetry`

Avoid neutral nouns for booleans:

| Avoid     | Prefer       |
| --------- | ------------ |
| `deleted` | `isDeleted`  |
| `preview` | `hasPreview` |
| `retry`   | `canRetry`   |

## Constants

Use `UPPER_SNAKE_CASE` for fixed module-level configuration constants.

```ts
const DEFAULT_COLUMNS = "16";
const MAX_ICON_SLUGS = 1000;
```

Use `camelCase` for local values, derived values, and values whose contents vary at runtime.

```ts
const generatedUrl = buildIconsUrl(state);
const requestedSlugs = parseRawIconSlugs(rawIcons);
```

## Components And Hooks

React component exports and files use `PascalCase`.

```tsx
export function StackIconsEditor() {}
```

Hooks use `camelCase` and start with `use`.

```ts
function useIconQueryState() {}
```
