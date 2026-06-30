export function parseIconSlugs(icons: string): string[] {
  return icons
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}

export function toggleIconSlug(
  iconSlugs: readonly string[],
  slug: string,
): string[] {
  return iconSlugs.includes(slug)
    ? iconSlugs.filter((selectedSlug) => selectedSlug !== slug)
    : [...iconSlugs, slug];
}

export function addIconSlugs(
  iconSlugs: readonly string[],
  slugsToAdd: readonly string[],
): string[] {
  return [
    ...iconSlugs,
    ...slugsToAdd.filter((slug) => !iconSlugs.includes(slug)),
  ];
}

export function removeIconSlugs(
  iconSlugs: readonly string[],
  slugsToRemove: readonly string[],
): string[] {
  const slugSet = new Set(slugsToRemove);

  return iconSlugs.filter((slug) => !slugSet.has(slug));
}
