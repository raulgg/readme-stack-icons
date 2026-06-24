import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useTheme } from "next-themes";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/ThemeProvider";

import { useResolvedPreviewTheme } from "./useResolvedPreviewTheme";

function PreviewThemeProbe() {
  const previewTheme = useResolvedPreviewTheme();

  return <output>{previewTheme}</output>;
}

function ThemeControls() {
  const { setTheme } = useTheme();

  return (
    <button onClick={() => setTheme("dark")} type="button">
      Switch to dark
    </button>
  );
}

describe("useResolvedPreviewTheme", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.removeAttribute("style");
    window.localStorage.clear();
  });

  it("should follow the resolved UI theme after hydration", async () => {
    // Given
    render(
      <ThemeProvider>
        <PreviewThemeProbe />
        <ThemeControls />
      </ThemeProvider>,
    );

    // When
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Switch to dark" }));
    });

    // Then
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("dark");
    });
  });
});
