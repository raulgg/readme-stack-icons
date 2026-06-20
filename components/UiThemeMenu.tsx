"use client";

import { useTheme } from "next-themes";

import { ThemeSelect, type ThemeSelectValue } from "./ThemeSelect";

export function UiThemeMenu() {
  const { setTheme, theme } = useTheme();

  return (
    <ThemeSelect
      ariaLabel="UI theme"
      onValueChange={setTheme}
      showSystemOption
      triggerVariant="surface"
      value={(theme ?? "system") as ThemeSelectValue}
    />
  );
}
