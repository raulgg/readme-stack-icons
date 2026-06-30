import { describe, expect, it } from "vitest";

import {
  addIconSlugs,
  parseIconSlugs,
  removeIconSlugs,
  toggleIconSlug,
} from "./icon-slugs";

describe("icon slugs", () => {
  it("should parse comma-separated icon slugs", () => {
    expect(parseIconSlugs(" react,nextjs , ")).toEqual(["react", "nextjs"]);
  });

  it("should toggle a slug in and out of the list", () => {
    expect(toggleIconSlug(["react"], "nextjs")).toEqual(["react", "nextjs"]);
    expect(toggleIconSlug(["react", "nextjs"], "react")).toEqual(["nextjs"]);
  });

  it("should append only missing slugs while preserving order", () => {
    expect(addIconSlugs(["react"], ["nextjs", "react", "astro"])).toEqual([
      "react",
      "nextjs",
      "astro",
    ]);
  });

  it("should remove only the requested slugs", () => {
    expect(removeIconSlugs(["react", "nextjs", "astro"], ["nextjs"])).toEqual([
      "react",
      "astro",
    ]);
  });
});
