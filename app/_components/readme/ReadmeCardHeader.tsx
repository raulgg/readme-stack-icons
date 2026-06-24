import { BookOpenIcon } from "lucide-react";
import type { ReactNode } from "react";

type ReadmeCardHeaderProps = {
  actions?: ReactNode;
};

export function ReadmeCardHeader({ actions }: ReadmeCardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 border-b pl-5 pr-3">
      <span className="relative flex items-center gap-2 py-[13px] text-sm font-semibold">
        <BookOpenIcon aria-hidden="true" className="h-4 w-4 text-ink-2" />
        README
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-accent"
        />
      </span>
      {actions}
    </div>
  );
}
