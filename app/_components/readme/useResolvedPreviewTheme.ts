"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import type { StackIconsPreviewTheme } from "./preview-theme";

const subscribeToHydration = () => () => {};

export function useResolvedPreviewTheme(): StackIconsPreviewTheme {
  const { resolvedTheme } = useTheme();
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return isHydrated && resolvedTheme === "dark" ? "dark" : "light";
}
