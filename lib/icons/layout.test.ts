import { describe, expect, it } from "vitest";

import { getIconGridDimensions, getIconGridLayout, iconSize } from "./layout";

describe("icon layout", () => {
  it("should expose the fixed MVP icon size when layout constants are read", () => {
    // Given / When
    const fixedIconSize = iconSize;

    // Then
    expect(fixedIconSize).toBe(40);
  });

  it("should compute single-row dimensions when icon count is less than columns", () => {
    // Given
    const layout = {
      columns: 16,
      gap: 8,
      iconCount: 3,
    };

    // When
    const dimensions = getIconGridDimensions(layout);

    // Then
    expect(dimensions).toEqual({
      height: 40,
      width: 136,
    });
  });

  it("should compute multi-row dimensions when icon count exceeds columns", () => {
    // Given
    const layout = {
      columns: 2,
      gap: 12,
      iconCount: 5,
    };

    // When
    const dimensions = getIconGridDimensions(layout);

    // Then
    expect(dimensions).toEqual({
      height: 144,
      width: 92,
    });
  });

  it("should place icons by row using the configured columns and gap", () => {
    // Given
    const layout = {
      columns: 2,
      gap: 12,
      iconCount: 5,
    };

    // When
    const gridLayout = getIconGridLayout(layout);

    // Then
    expect(gridLayout).toEqual({
      height: 144,
      placements: [
        { height: 40, index: 0, width: 40, x: 0, y: 0 },
        { height: 40, index: 1, width: 40, x: 52, y: 0 },
        { height: 40, index: 2, width: 40, x: 0, y: 52 },
        { height: 40, index: 3, width: 40, x: 52, y: 52 },
        { height: 40, index: 4, width: 40, x: 0, y: 104 },
      ],
      width: 92,
    });
  });

  it("should compute compact dimensions when one icon is rendered", () => {
    // Given
    const layout = {
      columns: 16,
      gap: 8,
      iconCount: 1,
    };

    // When
    const dimensions = getIconGridDimensions(layout);

    // Then
    expect(dimensions).toEqual({
      height: 40,
      width: 40,
    });
  });
});
