import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getIconAssetPath,
  getIconBySlug,
  getIconLabel,
  getIconLabels,
  iconRegistry,
  isIconSlug,
  listIconCategories,
  listIconSlugs,
  listRegisteredIcons,
  listRegisteredIconsByCategory,
} from "./registry";
import type { IconCategory, IconRegistryEntry } from "./registry";

describe("icon registry", () => {
  it("should return icon metadata when a registered slug is looked up", () => {
    // Given
    const slug = "github";

    // When
    const icon = getIconBySlug(slug);

    // Then
    expect(icon).toEqual({
      slug: "github",
      label: "GitHub",
      category: "Tools",
      light: "assets/icons/github.svg",
      dark: "assets/icons/github-dark.svg",
    });
  });

  it("should expose labels for downstream generated text when a registered slug is looked up", () => {
    // Given
    const slug = "typescript";

    // When
    const label = getIconLabel(slug);

    // Then
    expect(label).toBe("TypeScript");
  });

  it("should preserve profile order when the registry is listed", () => {
    // Given / When
    const icons = listRegisteredIcons();
    const iconSlugs = listIconSlugs();

    // Then
    expect(icons).toHaveLength(49);
    expect(icons.map((icon) => icon.slug)).toEqual(iconSlugs);
    expect(iconSlugs.at(-5)).toBe("cursor");
    expect(iconSlugs.at(-1)).toBe("openclaw");
  });

  it("should resolve dark variants with a light fallback when theme-specific assets are requested", () => {
    // Given
    const darkVariantSlug = "react";
    const lightOnlySlug = "typescript";

    // When
    const darkAssetPath = getIconAssetPath({
      slug: darkVariantSlug,
      theme: "dark",
    });
    const fallbackAssetPath = getIconAssetPath({
      slug: lightOnlySlug,
      theme: "dark",
    });

    // Then
    expect(darkAssetPath).toBe("assets/icons/react-dark.svg");
    expect(fallbackAssetPath).toBe("assets/icons/typescript.svg");
  });

  it("should expose ordered labels when downstream text is generated from slugs", () => {
    // Given
    const slugs = ["typescript", "react", "nextjs", "unknown"];

    // When
    const labels = getIconLabels(slugs);

    // Then
    expect(labels).toEqual(["TypeScript", "React", "Next.js"]);
  });

  it("should identify known slugs when user input is checked", () => {
    // Given
    const knownSlug = "codex";
    const unknownSlug = "not-real";
    const inheritedPropertyName = "toString";

    // When / Then
    expect(isIconSlug(knownSlug)).toBe(true);
    expect(isIconSlug(unknownSlug)).toBe(false);
    expect(isIconSlug(inheritedPropertyName)).toBe(false);
  });

  it("should expose picker filter chips in stable order when icon categories are listed", () => {
    // Given / When
    const categories = listIconCategories();

    // Then
    expect(categories).toEqual([
      "Languages",
      "Frameworks",
      "Databases",
      "Cloud",
      "Tools",
    ]);
  });

  it("should return only matching icons in registry order when registered icons are filtered by category", () => {
    // Given
    const category: IconCategory = "Databases";

    // When
    const databaseIcons = listRegisteredIconsByCategory(category);

    // Then
    expect(databaseIcons.map((icon) => icon.slug)).toEqual([
      "prisma",
      "postgresql",
      "neon",
      "redis",
      "mongodb",
      "mysql",
    ]);
    expect(databaseIcons.every((icon) => icon.category === category)).toBe(
      true,
    );
  });

  it("should cover every registered icon exactly once when each category filter is combined", () => {
    // Given
    const categories = listIconCategories();

    // When
    const filteredSlugs = categories.flatMap((category) =>
      listRegisteredIconsByCategory(category).map((icon) => icon.slug),
    );

    // Then
    expect(filteredSlugs.toSorted()).toEqual(listIconSlugs().toSorted());
  });

  it("should assign a valid category when every registry entry is inspected", () => {
    // Given
    const validCategories = new Set<string>(listIconCategories());
    const registryEntries: IconRegistryEntry[] = Object.values(iconRegistry);

    // When
    const invalidCategoryLabels = registryEntries
      .filter((entry) => !validCategories.has(entry.category))
      .map((entry) => entry.label);

    // Then
    expect(registryEntries.length).toBeGreaterThan(0);
    expect(invalidCategoryLabels).toEqual([]);
  });

  it("should reference committed SVG files when registry assets are listed", () => {
    // Given
    const registryEntries: IconRegistryEntry[] = Object.values(iconRegistry);
    const assetPaths = registryEntries.flatMap((icon) =>
      icon.dark === undefined ? [icon.light] : [icon.light, icon.dark],
    );

    // When
    const missingAssetPaths = assetPaths.filter(
      (assetPath) => !existsSync(path.join(process.cwd(), assetPath)),
    );

    // Then
    expect(missingAssetPaths).toEqual([]);
    expect(registryEntries.some((icon) => icon.dark !== undefined)).toBe(true);
  });
});
