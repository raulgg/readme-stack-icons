"use client";

import { Check } from "lucide-react";
import { Toaster as SonnerToaster, toast } from "sonner";

const TOAST_DURATION_MS = 2200;

// A single shared id makes a new toast replace the visible one and reset
// its auto-dismiss timer instead of stacking.
const APP_TOAST_ID = "app-toast";

function showToast(message: string) {
  toast(message, {
    id: APP_TOAST_ID,
    icon: (
      <Check
        aria-hidden="true"
        className="size-4 text-accent-bright"
        strokeWidth={2.5}
      />
    ),
  });
}

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      duration={TOAST_DURATION_MS}
      visibleToasts={1}
    />
  );
}

export { showToast, Toaster };
