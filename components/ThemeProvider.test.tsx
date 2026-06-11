import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useTheme } from "next-themes";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "./ThemeProvider";

function ThemeProbe() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("dark")}>Switch to dark</button>
      <button onClick={() => setTheme("light")}>Switch to light</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.removeAttribute("style");
    window.localStorage.clear();
  });

  it("should apply the dark class on the html element when the dark theme is selected", async () => {
    // Given
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    // When
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark" }));

    // Then
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  it("should persist the selected theme to localStorage when the theme changes", async () => {
    // Given
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    // When
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark" }));

    // Then
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("dark");
    });
  });

  it("should remove the dark class when switching back to the light theme", async () => {
    // Given
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark" }));
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });

    // When
    fireEvent.click(screen.getByRole("button", { name: "Switch to light" }));

    // Then
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass("dark");
    });
  });

  it("should follow the OS color scheme when no theme has been stored", async () => {
    // Given — no stored theme, OS reports light (matchMedia shim matches: false)
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    // When — first paint resolves the system theme (render is the action)

    // Then
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass("dark");
    });
    expect(window.localStorage.getItem("theme")).not.toBe("dark");
  });
});
