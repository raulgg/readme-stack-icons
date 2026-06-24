export type StackIconsPreviewTheme = "dark" | "light";

// Fixed image-theme stage colors. These deliberately ignore the UI chrome
// theme: the stage recreates what the generated image source looks like on a
// light or dark GitHub README background (Primer canvas-default plus the
// dark border-default).
export const STAGE_COLORS: Record<
  StackIconsPreviewTheme,
  { backgroundColor: string; borderColor?: string }
> = {
  light: { backgroundColor: "#ffffff" },
  dark: { backgroundColor: "#0d1117", borderColor: "#30363d" },
};
