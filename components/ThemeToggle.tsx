"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

import { cn } from "@/lib/utils";

type UiTheme = "dark" | "light";

const subscribeToNothing = () => () => {};

// Hydration-safe mount detection: the server snapshot is false, the client
// snapshot is true, and React reconciles the difference after hydration
// without a mismatch warning.
function useHasMounted() {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/**
 * Segmented Light/Dark control for the UI chrome theme (next-themes).
 * Deliberately separate from the editor's preview theme, which is URL state.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  // next-themes resolves the theme only on the client; until mounted, render
  // both buttons unpressed so server and client markup match.
  const activeTheme: UiTheme | undefined = hasMounted
    ? resolvedTheme === "dark"
      ? "dark"
      : "light"
    : undefined;

  return (
    <div
      aria-label="UI theme"
      className="inline-flex items-center gap-[3px] rounded-[6px] border bg-surface-3 p-[3px]"
      role="group"
    >
      <ThemeToggleButton
        isActive={activeTheme === "light"}
        label="Light"
        onActivate={() => setTheme("light")}
      >
        <Sun aria-hidden size={16} />
      </ThemeToggleButton>
      <ThemeToggleButton
        isActive={activeTheme === "dark"}
        label="Dark"
        onActivate={() => setTheme("dark")}
      >
        <Moon aria-hidden size={16} />
      </ThemeToggleButton>
    </div>
  );
}

type ThemeToggleButtonProps = {
  children: React.ReactNode;
  isActive: boolean;
  label: string;
  onActivate: () => void;
};

function ThemeToggleButton({
  children,
  isActive,
  label,
  onActivate,
}: ThemeToggleButtonProps) {
  return (
    <button
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[7px] border-0 bg-transparent px-[13px] py-[7px] text-[13px] font-semibold text-ink-2 transition-[color] duration-[140ms] hover:text-ink",
        isActive &&
          "bg-background text-ink shadow-button dark:bg-[hsl(var(--button-bg-hover))]",
      )}
      onClick={onActivate}
      type="button"
    >
      {children}
      {label}
    </button>
  );
}
