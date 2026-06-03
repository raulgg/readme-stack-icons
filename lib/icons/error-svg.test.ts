import { describe, expect, it } from "vitest";

import { renderIconRequestErrorSvg } from "./error-svg";

describe("icon request error SVG", () => {
  it("should render readable SVG error text when validation errors are provided", () => {
    // Given
    const errors = ["Unknown icon slug: not-real."];

    // When
    const svg = renderIconRequestErrorSvg(errors);

    // Then
    expect(svg).toContain("<svg");
    expect(svg).toContain("Invalid icon request");
    expect(svg).toContain("Unknown icon slug: not-real.");
    expect(svg).toContain("role=\"img\"");
  });

  it("should escape validation error text when XML-sensitive characters are provided", () => {
    // Given
    const errors = ['Unknown icon slug: <script>&"bad".'];

    // When
    const svg = renderIconRequestErrorSvg(errors);

    // Then
    expect(svg).toContain("&lt;script&gt;&amp;&quot;bad&quot;.");
    expect(svg).not.toContain('<script>&"bad"');
  });

  it("should truncate long visible error text while preserving the full accessible description", () => {
    // Given
    const errors = [
      "Unknown icon slugs: rendeeer, liiinear, fiiigma, fuuuuuge, heyyouu, 123456789.",
    ];

    // When
    const svg = renderIconRequestErrorSvg(errors);

    // Then
    expect(svg).toContain(
      "<desc id=\"desc\">Unknown icon slugs: rendeeer, liiinear, fiiigma, fuuuuuge, heyyouu, 123456789.</desc>",
    );
    expect(svg).toContain(
      ">Unknown icon slugs: rendeeer, liiinear, fiiigma, fuuuuuge...</text>",
    );
  });
});
