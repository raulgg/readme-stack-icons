import React from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ADD_ICONS_IMAGE_CODE_PLACEHOLDER,
  FIX_ERRORS_IMAGE_CODE_PLACEHOLDER,
} from "@/app/_components/readme";

import { DEFAULT_STACK_ICONS_EDITOR_STATE } from "./state";
import { useStackIconsEditorForm } from "./useStackIconsEditorForm";

describe("useStackIconsEditorForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the add-icons placeholder when no icons are selected", () => {
    const { result } = renderHook(() =>
      useStackIconsEditorForm({
        ...DEFAULT_STACK_ICONS_EDITOR_STATE,
        icons: "",
      }),
    );

    expect(result.current.iconsImageCodeEmptyPlaceholder).toBe(
      ADD_ICONS_IMAGE_CODE_PLACEHOLDER,
    );
  });

  it("should return the fix-errors placeholder when icons are present and validation failed", () => {
    const { result } = renderHook(() =>
      useStackIconsEditorForm({
        ...DEFAULT_STACK_ICONS_EDITOR_STATE,
        layoutMode: "single",
        columnLayouts: [{ columns: "1", minWidthPx: null }],
      }),
    );

    expect(result.current.iconsImageCodeEmptyPlaceholder).toBe(
      FIX_ERRORS_IMAGE_CODE_PLACEHOLDER,
    );
  });

  it("should omit a placeholder when icons are present but generation is not blocked by validation", () => {
    vi.spyOn(React, "useSyncExternalStore").mockImplementation(
      (_subscribe, _client, getServerSnapshot) => getServerSnapshot!(),
    );

    const { result } = renderHook(() =>
      useStackIconsEditorForm(DEFAULT_STACK_ICONS_EDITOR_STATE),
    );

    expect(result.current.iconsImageCodeEmptyPlaceholder).toBeUndefined();
  });
});
