import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ADD_ICONS_IMAGE_CODE_PLACEHOLDER,
  FIX_ERRORS_IMAGE_CODE_PLACEHOLDER,
  IconsImageCodePanel,
  tokenizeIconsImageCode,
} from "./IconsImageCodePanel";

const ICONS_IMAGE_CODE = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="http://localhost:3000/icons?s=react%2Cnextjs&amp;cols=4&amp;gap=8&amp;size=48&amp;theme=dark" />
  <img src="http://localhost:3000/icons?s=react%2Cnextjs&amp;cols=4&amp;gap=8&amp;size=48&amp;theme=light" alt="React, Next.js" title="React, Next.js" />
</picture>`;

describe("tokenizeIconsImageCode", () => {
  it("should reproduce the exact icons image code when token texts are concatenated", () => {
    // Given / When
    const tokens = tokenizeIconsImageCode(ICONS_IMAGE_CODE);

    // Then
    expect(tokens.map((token) => token.text).join("")).toBe(ICONS_IMAGE_CODE);
  });

  it("should classify tags, attributes, string values, and punctuation when tokenizing picture markup", () => {
    // Given / When
    const tokens = tokenizeIconsImageCode(
      '<source media="(prefers-color-scheme: dark)" />',
    );

    // Then
    expect(tokens).toEqual([
      { kind: "punctuation", text: "<" },
      { kind: "tag", text: "source" },
      { kind: "text", text: " " },
      { kind: "attribute", text: "media" },
      { kind: "punctuation", text: "=" },
      { kind: "punctuation", text: '"' },
      { kind: "string", text: "(prefers-color-scheme: dark)" },
      { kind: "punctuation", text: '"' },
      { kind: "text", text: " " },
      { kind: "punctuation", text: "/>" },
    ]);
  });
});

describe("IconsImageCodePanel", () => {
  it("should render highlighted code matching the clipboard payload when icons image code exists", () => {
    // Given
    render(
      <IconsImageCodePanel
        onCopy={vi.fn()}
        iconsImageCode={ICONS_IMAGE_CODE}
      />,
    );

    // When — panel renders open by default (render is the action)

    // Then
    expect(screen.getByLabelText("Icons image code")).toHaveTextContent(
      "picture",
    );
    expect(screen.getByLabelText("Icons image code").textContent).toBe(
      ICONS_IMAGE_CODE,
    );
  });

  it("should omit aria-controls on the disclosure button when the code is collapsed", () => {
    // Given
    render(
      <IconsImageCodePanel
        onCopy={vi.fn()}
        iconsImageCode={ICONS_IMAGE_CODE}
      />,
    );
    const disclosureButton = screen.getByRole("button", {
      name: "Image code · <picture>",
    });

    // When
    fireEvent.click(disclosureButton);

    // Then
    expect(disclosureButton).not.toHaveAttribute("aria-controls");
  });

  it("should point aria-controls at the code block id when the code is expanded", () => {
    // Given
    render(
      <IconsImageCodePanel
        onCopy={vi.fn()}
        iconsImageCode={ICONS_IMAGE_CODE}
      />,
    );
    const disclosureButton = screen.getByRole("button", {
      name: "Image code · <picture>",
    });
    const codeBlock = screen.getByLabelText("Icons image code");

    // When — panel renders open by default (render is the action)

    // Then
    expect(disclosureButton).toHaveAttribute("aria-controls", codeBlock.id);
  });

  it("should hide the code and its copy button when the disclosure collapses", () => {
    // Given
    render(
      <IconsImageCodePanel
        onCopy={vi.fn()}
        iconsImageCode={ICONS_IMAGE_CODE}
      />,
    );

    // When
    fireEvent.click(
      screen.getByRole("button", { name: "Image code · <picture>" }),
    );

    // Then
    expect(screen.queryByLabelText("Icons image code")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Copy image code" }),
    ).not.toBeInTheDocument();
  });

  it("should render code without a copy button when showCopyButton is false", () => {
    // Given
    render(
      <IconsImageCodePanel
        iconsImageCode={ICONS_IMAGE_CODE}
        showCopyButton={false}
      />,
    );

    // Then
    expect(screen.getByLabelText("Icons image code")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Copy image code" }),
    ).not.toBeInTheDocument();
  });

  describe("copied feedback", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    function getCopyButton() {
      return screen.getByRole("button", { name: "Copy image code" });
    }

    it("should show Copied temporarily when copying succeeds", async () => {
      // Given
      vi.useFakeTimers();
      render(
        <IconsImageCodePanel
          onCopy={vi.fn().mockResolvedValue(true)}
          iconsImageCode={ICONS_IMAGE_CODE}
        />,
      );

      // When
      await act(async () => {
        fireEvent.click(getCopyButton());
      });

      // Then — feedback shows, then reverts after the timeout
      expect(
        screen.getByRole("button", { name: "Copied" }),
      ).toBeInTheDocument();
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(
        screen.queryByRole("button", { name: "Copied" }),
      ).not.toBeInTheDocument();
      expect(getCopyButton()).toBeInTheDocument();
    });

    it("should keep showing Copy when copying fails", async () => {
      // Given
      render(
        <IconsImageCodePanel
          onCopy={vi.fn().mockResolvedValue(false)}
          iconsImageCode={ICONS_IMAGE_CODE}
        />,
      );

      // When
      await act(async () => {
        fireEvent.click(getCopyButton());
      });

      // Then
      expect(getCopyButton()).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Copied" }),
      ).not.toBeInTheDocument();
    });
  });

  it("should show the empty placeholder and disable copying when icons image code is empty", () => {
    // Given
    render(
      <IconsImageCodePanel
        emptyPlaceholder={ADD_ICONS_IMAGE_CODE_PLACEHOLDER}
        onCopy={vi.fn()}
        iconsImageCode=""
      />,
    );

    // When — panel renders without code (render is the action)

    // Then
    expect(screen.getByLabelText("Icons image code").textContent).toBe(
      ADD_ICONS_IMAGE_CODE_PLACEHOLDER,
    );
    expect(
      screen.getByRole("button", { name: "Copy image code" }),
    ).toBeDisabled();
  });

  it("should render a custom empty placeholder when provided", () => {
    // Given
    render(
      <IconsImageCodePanel
        emptyPlaceholder={FIX_ERRORS_IMAGE_CODE_PLACEHOLDER}
        onCopy={vi.fn()}
        iconsImageCode=""
      />,
    );

    // Then
    expect(screen.getByLabelText("Icons image code").textContent).toBe(
      FIX_ERRORS_IMAGE_CODE_PLACEHOLDER,
    );
  });
});
