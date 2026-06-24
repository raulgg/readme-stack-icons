import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadmeCardHeader } from "./ReadmeCardHeader";

describe("ReadmeCardHeader", () => {
  it("should render the README tab label", () => {
    // Given / When
    render(<ReadmeCardHeader />);

    // Then
    expect(screen.getByText("README")).toBeInTheDocument();
  });

  it("should render the actions slot when provided", () => {
    // Given / When
    render(
      <ReadmeCardHeader actions={<button type="button">Download</button>} />,
    );

    // Then
    expect(
      screen.getByRole("button", { name: "Download" }),
    ).toBeInTheDocument();
  });
});
