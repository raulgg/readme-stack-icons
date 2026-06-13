"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Toggle styled to MATCH the outline tabs in tabs.tsx: each item is an
// individually outlined button (border-input, transparent bg). Hover gives a
// neutral muted surface; the selected item highlights with the brand accent —
// accent border, soft accent-soft tint, and accent-ink text — so the active
// item is unmistakable. Accent-colored backgrounds must not transition
// (stale-color bugs), so the toggle transitions color only, never the tint.
const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] border border-input bg-transparent text-[13px] font-medium text-foreground transition-[color] hover:bg-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-accent data-[state=on]:bg-accent-soft data-[state=on]:text-accent-ink",
  {
    variants: {
      size: {
        default: "h-8 px-3",
        // Compact square footprint for icon-only items.
        iconSm: "h-8 w-8 px-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ size, className }))}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
