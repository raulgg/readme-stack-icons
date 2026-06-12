import { describe, expect, it } from "vitest";

import {
  DEFAULT_RESPONSIVE_COLUMN_LAYOUTS,
  DEFAULT_SINGLE_COLUMN_LAYOUTS,
  getDefaultColumnLayouts,
  getEditableBaseColumnLayout,
  getEditableBreakpointColumnLayouts,
  getReadmeSourceColumnLayouts,
  parseEditableColumnLayouts,
  validateColumnLayouts,
} from "./column-layout";

describe("column layouts", () => {
  it("should expose default single and responsive column layouts", () => {
    expect(DEFAULT_SINGLE_COLUMN_LAYOUTS).toEqual([
      { columns: "4", minWidthPx: null },
    ]);
    expect(DEFAULT_RESPONSIVE_COLUMN_LAYOUTS).toEqual([
      { columns: "4", minWidthPx: null },
      { columns: "8", minWidthPx: "768" },
      { columns: "12", minWidthPx: "1200" },
    ]);
    expect(getDefaultColumnLayouts("single")).toEqual(
      DEFAULT_SINGLE_COLUMN_LAYOUTS,
    );
    expect(getDefaultColumnLayouts("responsive")).toEqual(
      DEFAULT_RESPONSIVE_COLUMN_LAYOUTS,
    );
  });

  it("should parse a single layout from an editable value", () => {
    expect(
      parseEditableColumnLayouts(
        [{ columns: "6", minWidthPx: null }],
        "single",
      ),
    ).toEqual([{ columns: "6", minWidthPx: null }]);
  });

  it("should parse responsive layouts while preserving user order", () => {
    expect(
      parseEditableColumnLayouts(
        [
          { columns: "12", minWidthPx: null },
          { columns: "20", minWidthPx: "1280" },
          { columns: "16", minWidthPx: "768" },
          { columns: "", minWidthPx: "" },
        ],
        "responsive",
      ),
    ).toEqual([
      { columns: "12", minWidthPx: null },
      { columns: "20", minWidthPx: "1280" },
      { columns: "16", minWidthPx: "768" },
      { columns: "", minWidthPx: "" },
    ]);
  });

  it("should reject malformed editable column layout values", () => {
    expect(parseEditableColumnLayouts({ columns: "6" }, "single")).toBeNull();
    expect(
      parseEditableColumnLayouts([{ columns: 6, minWidthPx: null }], "single"),
    ).toBeNull();
    expect(
      parseEditableColumnLayouts(
        [{ columns: "6", minWidthPx: null }],
        "responsive",
      ),
    ).toBeNull();
  });

  it("should validate a responsive layout into numeric column layouts", () => {
    expect(
      validateColumnLayouts({
        columnLayouts: [
          { columns: "12", minWidthPx: null },
          { columns: "20", minWidthPx: "1280" },
          { columns: "16", minWidthPx: "768" },
        ],
        layoutMode: "responsive",
      }),
    ).toEqual({
      success: true,
      columnLayouts: [
        { columns: 12, minWidthPx: null },
        { columns: 20, minWidthPx: 1280 },
        { columns: 16, minWidthPx: 768 },
      ],
    });
  });

  it("should ignore fully empty breakpoint rows during validation", () => {
    expect(
      validateColumnLayouts({
        columnLayouts: [
          { columns: "12", minWidthPx: null },
          { columns: "18", minWidthPx: "768" },
          { columns: "", minWidthPx: "" },
        ],
        layoutMode: "responsive",
      }),
    ).toEqual({
      success: true,
      columnLayouts: [
        { columns: 12, minWidthPx: null },
        { columns: 18, minWidthPx: 768 },
      ],
    });
  });

  it("should reject partially filled breakpoint rows during validation", () => {
    expect(
      validateColumnLayouts({
        columnLayouts: [
          { columns: "12", minWidthPx: null },
          { columns: "18", minWidthPx: "" },
        ],
        layoutMode: "responsive",
      }),
    ).toEqual({
      success: false,
      errors: [
        "Breakpoint rows must include columns and breakpoint px.",
        "Responsive layout mode must have a base layout and at least one breakpoint layout.",
      ],
    });
  });

  it("should reject duplicate breakpoint values", () => {
    expect(
      validateColumnLayouts({
        columnLayouts: [
          { columns: "12", minWidthPx: null },
          { columns: "18", minWidthPx: "768" },
          { columns: "20", minWidthPx: "768" },
        ],
        layoutMode: "responsive",
      }),
    ).toEqual({
      success: false,
      errors: ["Breakpoint px values must be unique."],
    });
  });

  it("should order README source column layouts from widest to narrowest", () => {
    expect(
      getReadmeSourceColumnLayouts([
        { columns: 12, minWidthPx: null },
        { columns: 16, minWidthPx: 768 },
        { columns: 20, minWidthPx: 1280 },
      ]),
    ).toEqual([
      { columns: 20, minWidthPx: 1280 },
      { columns: 16, minWidthPx: 768 },
    ]);
  });

  it("should find the editable base column layout", () => {
    expect(
      getEditableBaseColumnLayout([
        { columns: "18", minWidthPx: "768" },
        { columns: "12", minWidthPx: null },
      ]),
    ).toEqual({ columns: "12", minWidthPx: null });
  });

  it("should return editable breakpoint layouts in user order", () => {
    expect(
      getEditableBreakpointColumnLayouts([
        { columns: "12", minWidthPx: null },
        { columns: "20", minWidthPx: "1280" },
        { columns: "16", minWidthPx: "768" },
      ]),
    ).toEqual([
      { layout: { columns: "20", minWidthPx: "1280" }, originalIndex: 1 },
      { layout: { columns: "16", minWidthPx: "768" }, originalIndex: 2 },
    ]);
  });
});
