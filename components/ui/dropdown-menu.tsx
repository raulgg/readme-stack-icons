"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
  contentId: string;
  isOpen: boolean;
  openMenu: () => void;
  toggleMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(componentName: string) {
  const context = React.useContext(DropdownMenuContext);

  if (context === null) {
    throw new Error(`${componentName} must be used within a DropdownMenu.`);
  }

  return context;
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentId = React.useId();

  const closeMenu = React.useCallback(
    (options?: { focusTrigger?: boolean }) => {
      setIsOpen(false);

      if (options?.focusTrigger === true) {
        triggerRef.current?.focus();
      }
    },
    [],
  );
  const openMenu = React.useCallback(() => setIsOpen(true), []);
  const toggleMenu = React.useCallback(
    () => setIsOpen((currentIsOpen) => !currentIsOpen),
    [],
  );

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      const root = rootRef.current;

      if (
        root !== null &&
        event.target instanceof Node &&
        !root.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isOpen]);

  const contextValue = React.useMemo<DropdownMenuContextValue>(
    () => ({
      closeMenu,
      contentId,
      isOpen,
      openMenu,
      toggleMenu,
      triggerRef,
    }),
    [closeMenu, contentId, isOpen, openMenu, toggleMenu],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className="relative inline-flex" ref={rootRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

type DropdownMenuTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

function DropdownMenuTrigger({
  asChild = false,
  onClick,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuTriggerProps) {
  const { contentId, isOpen, openMenu, toggleMenu, triggerRef } =
    useDropdownMenuContext("DropdownMenuTrigger");
  const Comp = asChild ? Slot : "button";

  function composeTriggerRef(node: HTMLButtonElement | null) {
    triggerRef.current = node;

    if (typeof ref === "function") {
      ref(node);
    } else if (ref !== null && ref !== undefined) {
      ref.current = node;
    }
  }

  return (
    <Comp
      aria-controls={isOpen ? contentId : undefined}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      data-state={isOpen ? "open" : "closed"}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          toggleMenu();
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (!event.defaultPrevented && event.key === "ArrowDown") {
          event.preventDefault();
          openMenu();
        }
      }}
      ref={composeTriggerRef}
      {...props}
    />
  );
}

type DropdownMenuContentProps = React.ComponentProps<"div"> & {
  align?: "end" | "start";
};

function DropdownMenuContent({
  align = "start",
  children,
  className,
  onKeyDown,
  ...props
}: DropdownMenuContentProps) {
  const { closeMenu, contentId, isOpen } = useDropdownMenuContext(
    "DropdownMenuContent",
  );
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const firstItem = menuRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([disabled])',
    );

    firstItem?.focus();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ focusTrigger: true });
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])',
      ) ?? [],
    );

    if (items.length === 0) {
      return;
    }

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[currentIndex <= 0 ? items.length - 1 : currentIndex - 1].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  }

  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
      id={contentId}
      onKeyDown={handleKeyDown}
      ref={menuRef}
      role="menu"
      {...props}
    >
      {children}
    </div>
  );
}

type DropdownMenuItemProps = React.ComponentProps<"button"> & {
  closeOnSelect?: boolean;
};

function DropdownMenuItem({
  className,
  closeOnSelect = true,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { closeMenu } = useDropdownMenuContext("DropdownMenuItem");

  return (
    <button
      className={cn(
        "flex w-full select-none items-center gap-2 whitespace-nowrap rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && closeOnSelect) {
          closeMenu({ focusTrigger: true });
        }
      }}
      role="menuitem"
      type="button"
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
