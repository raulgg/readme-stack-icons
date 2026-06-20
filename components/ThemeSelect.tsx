"use client";

import { MonitorIcon, MoonIcon, SunIcon, type LucideIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ThemeSelectValue = "dark" | "light" | "system";

const themeOptions: Record<
  ThemeSelectValue,
  { icon: LucideIcon; label: string }
> = {
  dark: { icon: MoonIcon, label: "Dark" },
  light: { icon: SunIcon, label: "Light" },
  system: { icon: MonitorIcon, label: "System" },
};

const lightDarkValues = [
  "light",
  "dark",
] as const satisfies readonly ThemeSelectValue[];

const triggerVariantClasses = {
  card: "bg-card",
  surface: "bg-surface-3",
} as const;

type ThemeSelectProps = {
  ariaLabel: string;
  onValueChange: (value: ThemeSelectValue) => void;
  showSystemOption?: boolean;
  triggerVariant?: keyof typeof triggerVariantClasses;
  value: ThemeSelectValue;
};

export function ThemeSelect({
  ariaLabel,
  onValueChange,
  showSystemOption = false,
  triggerVariant = "surface",
  value,
}: ThemeSelectProps) {
  const optionValues: ThemeSelectValue[] = showSystemOption
    ? [...lightDarkValues, "system"]
    : [...lightDarkValues];
  const TriggerIcon = showSystemOption
    ? null
    : value === "dark"
      ? MoonIcon
      : SunIcon;

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "w-auto gap-1.5 px-2",
          triggerVariantClasses[triggerVariant],
        )}
      >
        {showSystemOption ? (
          <>
            <SunIcon aria-hidden className="dark:hidden" size={16} />
            <MoonIcon aria-hidden className="hidden dark:block" size={16} />
          </>
        ) : (
          TriggerIcon && <TriggerIcon aria-hidden size={16} />
        )}
        <span className="sr-only">{themeOptions[value].label}</span>
      </SelectTrigger>
      <SelectContent align="end">
        {optionValues.map((optionValue) => {
          const option = themeOptions[optionValue];

          return (
            <SelectItem key={optionValue} value={optionValue}>
              <span className="flex items-center gap-2.5">
                <option.icon aria-hidden size={16} />
                {option.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
