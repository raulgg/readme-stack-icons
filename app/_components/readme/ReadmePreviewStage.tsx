import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { STAGE_COLORS, type StackIconsPreviewTheme } from "./preview-theme";

type ReadmePreviewStageProps = {
  bordered?: boolean;
  children: ReactNode;
  previewTheme: StackIconsPreviewTheme;
};

export function ReadmePreviewStage({
  bordered = false,
  children,
  previewTheme,
}: ReadmePreviewStageProps) {
  return (
    <div
      className={cn(
        "flex max-w-full items-center justify-center overflow-x-auto px-4 py-[22px] sm:px-[26px] sm:py-[30px]",
        bordered && "rounded-[6px] border",
      )}
      data-preview-theme={previewTheme}
      style={STAGE_COLORS[previewTheme]}
    >
      {children}
    </div>
  );
}
