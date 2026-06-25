import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { showToast, Toaster } from "./sonner";

describe("Toaster", () => {
  it("should show the toast message when showToast is called", async () => {
    // Given
    render(<Toaster />);

    // When
    act(() => {
      showToast("Icons image code copied");
    });

    // Then
    expect(
      await screen.findByText("Icons image code copied"),
    ).toBeInTheDocument();
  });

  it("should replace the visible toast when a new toast is shown", async () => {
    // Given
    render(<Toaster />);
    act(() => {
      showToast("First message");
    });
    await screen.findByText("First message");

    // When
    act(() => {
      showToast("Second message");
    });

    // Then
    expect(await screen.findByText("Second message")).toBeInTheDocument();
    expect(screen.queryByText("First message")).not.toBeInTheDocument();
  });
});
