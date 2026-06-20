import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "./ThemeProvider";
import { UiThemeMenu } from "./UiThemeMenu";

function renderUiThemeMenu() {
  render(
    <ThemeProvider>
      <UiThemeMenu />
    </ThemeProvider>,
  );
}

function getUiThemeSelect() {
  return screen.getByRole("combobox", { name: "UI theme" });
}

function openUiThemeSelect() {
  fireEvent.click(getUiThemeSelect());
}

function selectUiThemeOption(name: "Light" | "Dark" | "System") {
  openUiThemeSelect();
  fireEvent.click(screen.getByRole("option", { name }));
}

describe("UiThemeMenu", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.removeAttribute("style");
    window.localStorage.clear();
  });

  it("should show the Light, Dark, and System options when the trigger is clicked", () => {
    // Given
    renderUiThemeMenu();

    // When
    openUiThemeSelect();

    // Then
    expect(screen.getByRole("option", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "System" })).toBeInTheDocument();
  });

  it("should show System when no theme preference is stored", async () => {
    // Given — fresh visitor, nothing in localStorage
    renderUiThemeMenu();

    // Then
    await waitFor(() => {
      expect(getUiThemeSelect()).toHaveTextContent("System");
    });
  });

  it("should apply the dark theme to the page when the Dark option is selected", async () => {
    // Given
    renderUiThemeMenu();

    // When
    selectUiThemeOption("Dark");

    // Then
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  it("should persist the preference when the Dark option is selected", async () => {
    // Given
    renderUiThemeMenu();

    // When
    selectUiThemeOption("Dark");

    // Then
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("dark");
    });
  });

  it("should persist the system preference when System is selected after a static theme", async () => {
    // Given — user previously pinned dark
    renderUiThemeMenu();
    selectUiThemeOption("Dark");
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });

    // When
    selectUiThemeOption("System");

    // Then — OS reports light (matchMedia shim matches: false)
    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("system");
    });
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass("dark");
    });
  });

  it("should close the menu when an option is selected", async () => {
    // Given
    renderUiThemeMenu();
    openUiThemeSelect();

    // When
    fireEvent.click(screen.getByRole("option", { name: "Light" }));

    // Then
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "Light" }),
      ).not.toBeInTheDocument();
    });
  });

  it("should close the menu when Escape is pressed", async () => {
    // Given
    renderUiThemeMenu();
    openUiThemeSelect();

    // When
    fireEvent.keyDown(document, { key: "Escape" });

    // Then
    await waitFor(() => {
      expect(
        screen.queryByRole("option", { name: "Light" }),
      ).not.toBeInTheDocument();
    });
  });
});
