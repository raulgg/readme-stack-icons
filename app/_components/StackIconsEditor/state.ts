const DEFAULT_ICONS = "typescript,nextjs,tailwindcss,vercel";
const DEFAULT_COLUMNS = "18";
const DEFAULT_GAP = "8";
const DEFAULT_INCLUDE_DARK_THEME = true;
const DEFAULT_PREVIEW_THEME = "light";

export type StackIconsPreviewTheme = "dark" | "light";
export type ColumnLayout = { columns: string; minWidthPx: string | null };

type EditorState = {
  icons: string;
  layoutMode: "single" | "responsive";
  columnLayouts: ColumnLayout[];
  gap: string;
  includeDarkTheme: boolean;
  previewTheme: StackIconsPreviewTheme;
};

export type StackIconsEditorState = EditorState;

export const DEFAULT_STACK_ICONS_EDITOR_STATE: StackIconsEditorState = {
  icons: DEFAULT_ICONS,
  layoutMode: "single",
  columnLayouts: [{ columns: DEFAULT_COLUMNS, minWidthPx: null }],
  gap: DEFAULT_GAP,
  includeDarkTheme: DEFAULT_INCLUDE_DARK_THEME,
  previewTheme: DEFAULT_PREVIEW_THEME,
};

type SearchParamValue = string | string[] | undefined;

export function getStackIconsEditorInitialState(
  searchParams: Record<string, SearchParamValue>,
): StackIconsEditorState {
  const includeDarkTheme =
    getSearchParamValue(searchParams["include-dark-theme"]) ??
    getSearchParamValue(searchParams.includeDarkTheme);
  const layoutMode = getSearchParamValue(searchParams.layout);
  const columnLayouts = getColumnLayouts(searchParams);
  const shouldUseDefaultLayout =
    (layoutMode !== undefined && layoutMode !== "single") ||
    columnLayouts === null;

  return {
    icons: getSearchParamValue(searchParams.icons) ?? DEFAULT_ICONS,
    layoutMode: "single",
    columnLayouts: shouldUseDefaultLayout
      ? DEFAULT_STACK_ICONS_EDITOR_STATE.columnLayouts
      : (columnLayouts ?? DEFAULT_STACK_ICONS_EDITOR_STATE.columnLayouts),
    gap: getSearchParamValue(searchParams.gap) ?? DEFAULT_GAP,
    includeDarkTheme: includeDarkTheme !== "false",
    previewTheme: getPreviewTheme(searchParams),
  };
}

function getColumnLayouts(
  searchParams: Record<string, SearchParamValue>,
): ColumnLayout[] | null | undefined {
  const rawColumnLayouts = getSearchParamValue(searchParams["column-layouts"]);

  if (rawColumnLayouts === undefined) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawColumnLayouts);

    if (
      !Array.isArray(parsed) ||
      parsed.length !== 1 ||
      !isColumnLayout(parsed[0]) ||
      parsed[0].minWidthPx !== null
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function isColumnLayout(value: unknown): value is ColumnLayout {
  return (
    typeof value === "object" &&
    value !== null &&
    "columns" in value &&
    isValidColumns(value.columns) &&
    "minWidthPx" in value &&
    (value.minWidthPx === null || typeof value.minWidthPx === "string")
  );
}

function isValidColumns(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const columns = Number(value);

  return Number.isInteger(columns) && columns >= 2 && columns <= 20;
}

function getSearchParamValue(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getPreviewTheme(
  searchParams: Record<string, SearchParamValue>,
): StackIconsPreviewTheme {
  const previewTheme =
    getSearchParamValue(searchParams["preview-theme"]) ??
    getSearchParamValue(searchParams.previewTheme);

  return previewTheme === "dark" ? "dark" : DEFAULT_PREVIEW_THEME;
}
