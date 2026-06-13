"use client";

import React from "react";
import {
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { tokenizeReadmeImageCode } from "@/app/_components/StackIconsEditor/ReadmeImageCodePanel";

type PreviewTheme = "light" | "dark";

const STAGE_COLORS: Record<
  PreviewTheme,
  { backgroundColor: string; borderColor?: string }
> = {
  light: { backgroundColor: "#ffffff" },
  dark: { backgroundColor: "#0d1117", borderColor: "#30363d" },
};

const TOKEN_CLASSES = {
  attribute: "text-syntax-attribute",
  punctuation: "text-syntax-punctuation",
  string: "text-syntax-string",
  tag: "text-syntax-tag",
  text: "",
} as const;

const ABBREVIATED_SNIPPET = `<picture>
  <source media="(min-width: 768px) and (prefers-color-scheme: dark)"
          srcset="https://…/icons?…&columns=8&theme=dark" />
  <source media="(min-width: 768px)"
          srcset="https://…/icons?…&columns=8" />
  <img src="https://…/icons?icons=typescript,react,…&columns=4"
       alt="My tech stack" />
</picture>`;

const FULL_SNIPPET = `<picture>
  <source media="(min-width: 768px) and (prefers-color-scheme: dark)"
          srcset="https://stackicons.dev/icons?icons=typescript,react,nextdotjs,tailwindcss,nodedotjs,postgresql,prisma,docker&columns=8&theme=dark" />
  <source media="(min-width: 768px)"
          srcset="https://stackicons.dev/icons?icons=typescript,react,nextdotjs,tailwindcss,nodedotjs,postgresql,prisma,docker&columns=8" />
  <img src="https://stackicons.dev/icons?icons=typescript,react,nextdotjs,tailwindcss,nodedotjs,postgresql,prisma,docker&columns=4"
       alt="My tech stack" />
</picture>`;

export function DemoCard() {
  const { resolvedTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = React.useState<PreviewTheme>("light");
  const [isCodeVisible, setIsCodeVisible] = React.useState(true);
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-seed preview theme when UI theme changes — same contract as the editor.
  React.useEffect(() => {
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      setPreviewTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(FULL_SNIPPET);
    } catch {}
    setIsCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <section className="rounded-[6px] border bg-card text-card-foreground">
      {/* GitHub README-style card header */}
      <div className="flex items-center border-b pl-5 pr-3">
        <span className="relative flex items-center gap-2 py-[13px] text-sm font-semibold">
          <BookOpenIcon aria-hidden="true" className="h-4 w-4 text-ink-2" />
          README
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-accent"
          />
        </span>
      </div>

      {/* Stage */}
      <div className="relative mx-5 mt-[18px]">
        <div
          className="flex max-w-full items-center justify-center overflow-x-auto rounded-[6px] border px-4 py-[22px] sm:px-[26px] sm:py-[30px]"
          style={STAGE_COLORS[previewTheme]}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Stack preview"
            className="block"
            src={`/icons?icons=typescript,react,nextdotjs,tailwindcss,nodedotjs,postgresql,prisma,docker&columns=4&size=48&theme=${previewTheme}`}
          />
        </div>
        {/* Preview theme toggle — same treatment as the editor's stage overlay */}
        <div
          aria-label="Preview theme"
          className="absolute right-2 top-2 inline-flex items-center gap-[3px] rounded-[6px] border bg-surface-3 p-[3px]"
          role="group"
        >
          <PreviewThemeButton
            isActive={previewTheme === "light"}
            label="Light"
            onActivate={() => setPreviewTheme("light")}
          >
            <SunIcon aria-hidden="true" size={15} />
          </PreviewThemeButton>
          <PreviewThemeButton
            isActive={previewTheme === "dark"}
            label="Dark"
            onActivate={() => setPreviewTheme("dark")}
          >
            <MoonIcon aria-hidden="true" size={15} />
          </PreviewThemeButton>
        </div>
      </div>

      <p className="px-5 pb-[18px] pt-[10px] text-center font-mono text-[11.5px] text-ink-3">
        4 columns · 48px icons — exactly what your README shows
      </p>

      {/* Code panel — mirrors ReadmeImageCodePanel structure */}
      <div className="mx-5 mb-5">
        <button
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.07em] text-ink-2"
          onClick={() => setIsCodeVisible((v) => !v)}
          type="button"
        >
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "h-[13px] w-[13px] transition-transform duration-[180ms]",
              !isCodeVisible && "-rotate-90",
            )}
          />
          {"README code · <picture>"}
        </button>
        {isCodeVisible ? (
          <div className="relative mt-3">
            <pre
              aria-label="README image code"
              className="max-w-full overflow-x-auto whitespace-pre rounded-[6px] border border-code-bg-2 bg-code-bg px-4 py-[15px] font-mono text-[12.5px] leading-[1.75]"
            >
              <code>
                {tokenizeReadmeImageCode(ABBREVIATED_SNIPPET).map(
                  (token, i) => (
                    <span
                      className={TOKEN_CLASSES[token.kind] || undefined}
                      key={i}
                    >
                      {token.text}
                    </span>
                  ),
                )}
              </code>
            </pre>
            <button
              aria-label={isCopied ? "Copied" : "Copy README code"}
              aria-live="polite"
              className={cn(
                "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-[6px] border bg-surface-3 transition-[color]",
                isCopied ? "text-accent-ink" : "text-ink-2 hover:text-ink",
              )}
              onClick={handleCopy}
              type="button"
            >
              {isCopied ? (
                <CheckIcon aria-hidden="true" size={15} />
              ) : (
                <CopyIcon aria-hidden="true" size={15} />
              )}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type PreviewThemeButtonProps = {
  children: React.ReactNode;
  isActive: boolean;
  label: string;
  onActivate: () => void;
};

function PreviewThemeButton({
  children,
  isActive,
  label,
  onActivate,
}: PreviewThemeButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-[7px] transition-[color]",
        isActive ? "bg-accent text-white" : "text-ink-2 hover:text-ink",
      )}
      onClick={onActivate}
      type="button"
    >
      {children}
    </button>
  );
}

export default DemoCard;
