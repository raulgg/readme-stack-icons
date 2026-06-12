export type LayoutMode = "single" | "responsive";

export type EditableColumnLayout = {
  columns: string;
  minWidthPx: string | null;
};

type EditableBreakpointColumnLayout = EditableColumnLayout & {
  minWidthPx: string;
};

export type ColumnLayout = {
  columns: number;
  minWidthPx: number | null;
};

export type ColumnLayoutValidationResult =
  | {
      success: true;
      columnLayouts: ColumnLayout[];
    }
  | {
      success: false;
      errors: string[];
    };

const DEFAULT_BASE_COLUMNS = "4";

export const DEFAULT_SINGLE_COLUMN_LAYOUTS: EditableColumnLayout[] = [
  { columns: DEFAULT_BASE_COLUMNS, minWidthPx: null },
];

export const DEFAULT_RESPONSIVE_COLUMN_LAYOUTS: EditableColumnLayout[] = [
  { columns: DEFAULT_BASE_COLUMNS, minWidthPx: null },
  { columns: "8", minWidthPx: "768" },
  { columns: "12", minWidthPx: "1200" },
];

export function getDefaultColumnLayouts(
  layoutMode: LayoutMode,
): EditableColumnLayout[] {
  return copyEditableColumnLayouts(
    layoutMode === "responsive"
      ? DEFAULT_RESPONSIVE_COLUMN_LAYOUTS
      : DEFAULT_SINGLE_COLUMN_LAYOUTS,
  );
}

export function getEditableBaseColumnLayout(
  columnLayouts: readonly EditableColumnLayout[],
): EditableColumnLayout {
  return (
    columnLayouts.find((layout) => layout.minWidthPx === null) ??
    columnLayouts[0] ??
    DEFAULT_SINGLE_COLUMN_LAYOUTS[0]
  );
}

export function getEditableBreakpointColumnLayouts(
  columnLayouts: readonly EditableColumnLayout[],
): Array<{
  layout: EditableBreakpointColumnLayout;
  originalIndex: number;
}> {
  return columnLayouts
    .map((layout, originalIndex) => ({ layout, originalIndex }))
    .filter(
      (
        item,
      ): item is {
        layout: EditableBreakpointColumnLayout;
        originalIndex: number;
      } => item.layout.minWidthPx !== null,
    );
}

export function parseEditableColumnLayouts(
  value: unknown,
  layoutMode: LayoutMode,
): EditableColumnLayout[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return layoutMode === "responsive"
    ? parseResponsiveColumnLayouts(value)
    : parseSingleColumnLayouts(value);
}

export function validateColumnLayouts({
  columnLayouts,
  layoutMode,
}: {
  columnLayouts: readonly EditableColumnLayout[];
  layoutMode: LayoutMode;
}): ColumnLayoutValidationResult {
  const errors: string[] = [];
  const baseLayouts = columnLayouts.filter(
    (layout) => layout.minWidthPx === null,
  );
  const breakpointLayouts = columnLayouts.filter(
    (layout): layout is EditableBreakpointColumnLayout =>
      layout.minWidthPx !== null,
  );
  const parsedBaseLayouts = baseLayouts.map(parseBaseColumnLayout);
  const parsedBreakpointLayouts = breakpointLayouts.flatMap((layout) =>
    parseBreakpointColumnLayout(layout, errors),
  );

  if (columnLayouts.length === 0) {
    errors.push("At least one column layout is required.");
  }

  if (baseLayouts.length !== 1) {
    errors.push("Exactly one base column layout is required.");
  }

  if (
    parsedBaseLayouts.some((layout) => layout === null) ||
    parsedBreakpointLayouts.some((layout) => layout === null)
  ) {
    errors.push("Each column layout must use 2 to 20 columns.");
  }

  const validBreakpointLayouts = parsedBreakpointLayouts.filter(
    (layout): layout is ColumnLayout & { minWidthPx: number } =>
      layout !== null,
  );

  if (
    new Set(validBreakpointLayouts.map((layout) => layout.minWidthPx)).size !==
    validBreakpointLayouts.length
  ) {
    errors.push("Breakpoint px values must be unique.");
  }

  if (
    layoutMode === "single" &&
    (columnLayouts.length !== 1 || columnLayouts[0]?.minWidthPx !== null)
  ) {
    errors.push("Single layout mode must have exactly one base layout.");
  }

  if (layoutMode === "responsive" && validBreakpointLayouts.length === 0) {
    errors.push(
      "Responsive layout mode must have a base layout and at least one breakpoint layout.",
    );
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors: Array.from(new Set(errors)),
    };
  }

  const baseLayout = parsedBaseLayouts.find(
    (layout): layout is ColumnLayout & { minWidthPx: null } => layout !== null,
  );

  return {
    success: true,
    columnLayouts:
      baseLayout === undefined
        ? validBreakpointLayouts
        : [baseLayout, ...validBreakpointLayouts],
  };
}

export function copyEditableColumnLayouts(
  columnLayouts: readonly EditableColumnLayout[],
): EditableColumnLayout[] {
  return columnLayouts.map((layout) => ({ ...layout }));
}

function parseSingleColumnLayouts(
  value: unknown[],
): EditableColumnLayout[] | null {
  if (
    value.length !== 1 ||
    !isEditableColumnLayout(value[0]) ||
    value[0].minWidthPx !== null ||
    parseColumns(value[0].columns) === null
  ) {
    return null;
  }

  return [{ ...value[0] }];
}

function parseResponsiveColumnLayouts(
  value: unknown[],
): EditableColumnLayout[] | null {
  if (value.length < 2 || !value.every(isEditableColumnLayout)) {
    return null;
  }

  const columnLayouts = value as EditableColumnLayout[];
  const baseLayouts = columnLayouts.filter(
    (layout) => layout.minWidthPx === null,
  );

  if (
    baseLayouts.length !== 1 ||
    parseColumns(baseLayouts[0].columns) === null
  ) {
    return null;
  }

  return copyEditableColumnLayouts(columnLayouts);
}

function parseBaseColumnLayout(
  layout: EditableColumnLayout,
): (ColumnLayout & { minWidthPx: null }) | null {
  const columns = parseColumns(layout.columns);

  return columns === null ? null : { columns, minWidthPx: null };
}

function parseBreakpointColumnLayout(
  layout: EditableBreakpointColumnLayout,
  errors: string[],
): Array<(ColumnLayout & { minWidthPx: number }) | null> {
  const hasColumns = layout.columns !== "";
  const hasMinWidth = layout.minWidthPx !== "";

  if (!hasColumns && !hasMinWidth) {
    return [];
  }

  if (!hasColumns || !hasMinWidth) {
    errors.push("Breakpoint rows must include columns and breakpoint px.");
    return [];
  }

  const columns = parseColumns(layout.columns);
  const minWidthPx = parseBreakpointMinWidth(layout.minWidthPx);

  if (minWidthPx === null) {
    errors.push("Breakpoint px must be an integer from 1 to 3840.");
  }

  return [
    columns === null || minWidthPx === null ? null : { columns, minWidthPx },
  ];
}

function isEditableColumnLayout(value: unknown): value is EditableColumnLayout {
  return (
    typeof value === "object" &&
    value !== null &&
    "columns" in value &&
    typeof value.columns === "string" &&
    "minWidthPx" in value &&
    (value.minWidthPx === null || typeof value.minWidthPx === "string")
  );
}

function parseColumns(value: string): number | null {
  const columns = Number(value);

  return Number.isInteger(columns) && columns >= 2 && columns <= 20
    ? columns
    : null;
}

function parseBreakpointMinWidth(value: string): number | null {
  if (value.trim() !== value || value === "") {
    return null;
  }

  const breakpointPx = Number(value);

  return Number.isInteger(breakpointPx) &&
    breakpointPx >= 1 &&
    breakpointPx <= 3840
    ? breakpointPx
    : null;
}
