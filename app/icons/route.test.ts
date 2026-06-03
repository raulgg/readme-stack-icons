import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("/icons route", () => {
  it("should return an SVG error image when the icon request is invalid", async () => {
    // Given
    const request = new Request("http://localhost/icons?icons=not-real");

    // When
    const response = GET(request);
    const body = await response.text();

    // Then
    expect(response.status).toBe(400);
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toContain("<svg");
    expect(body).toContain("Invalid icon request");
    expect(body).toContain("Unknown icon slug: not-real.");
    expect(body).not.toMatch(/\b(?:href|src)=/);
  });
});
