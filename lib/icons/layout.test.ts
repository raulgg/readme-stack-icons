import { describe, expect, it } from "vitest";

import { getIconGridDimensions, getIconGridLayout } from "./layout";

describe("icon layout", () => {
  it("should compute single-row dimensions when icon count is less than columns", () => {
    // Given
    const layout = {
      columns: 16,
      gap: 8,
      iconCount: 3,
      iconSize: 40,
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
      iconSize: 40,
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
      iconSize: 40,
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

  it("should scale dimensions and placements when a larger icon size is configured", () => {
    // Given
    const layout = {
      columns: 2,
      gap: 12,
      iconCount: 5,
      iconSize: 56,
    };

    // When
    const gridLayout = getIconGridLayout(layout);

    // Then
    expect(gridLayout).toEqual({
      height: 192,
      placements: [
        { height: 56, index: 0, width: 56, x: 0, y: 0 },
        { height: 56, index: 1, width: 56, x: 68, y: 0 },
        { height: 56, index: 2, width: 56, x: 0, y: 68 },
        { height: 56, index: 3, width: 56, x: 68, y: 68 },
        { height: 56, index: 4, width: 56, x: 0, y: 136 },
      ],
      width: 124,
    });
  });

  it("should compute compact dimensions when one icon is rendered", () => {
    // Given
    const layout = {
      columns: 16,
      gap: 8,
      iconCount: 1,
      iconSize: 40,
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
