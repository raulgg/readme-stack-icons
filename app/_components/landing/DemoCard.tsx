"use client";

import React from "react";
import { useTheme } from "next-themes";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { tokenizeReadmeImageCode } from "@/app/_components/StackIconsEditor/ReadmeImageCodePanel";

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
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(FULL_SNIPPET);
    } catch {}
    setIsCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
  }

  const stageStyle: React.CSSProperties =
    theme === "dark"
      ? { backgroundColor: "#16181B", border: "1px solid #2A2D31" }
      : {
          backgroundColor: "#FCFBF8",
          border: "1px solid",
          borderColor: "hsl(var(--border))",
        };

  return (
    <div className="rounded-[6px] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.07em] text-ink-2">
          Live Preview
        </span>
        <span className="rounded-full border border-border bg-surface-3 px-[9px] py-[3px] font-mono text-[10.5px] text-ink-2">
          4 columns · 48px · {theme}
        </span>
      </div>

      <div className="flex flex-col gap-[14px] p-4">
        <div
          className="flex justify-center rounded-[6px] p-[26px]"
          style={stageStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/icons?icons=typescript,react,nextdotjs,tailwindcss,nodedotjs,postgresql,prisma,docker&columns=4&size=48&theme=${theme}`}
            alt="Stack preview"
            className="block"
          />
        </div>

        <div className="flex items-center justify-between px-[2px]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.07em] text-ink-2">
            Readme Code
          </span>
        </div>

        <div className="relative">
          <pre className="max-w-full overflow-x-auto whitespace-pre rounded-[6px] border border-code-bg-2 bg-code-bg px-4 py-[15px] font-mono text-[11.5px] leading-[1.8]">
            <code>
              {tokenizeReadmeImageCode(ABBREVIATED_SNIPPET).map((token, i) => (
                <span
                  key={i}
                  className={TOKEN_CLASSES[token.kind] || undefined}
                >
                  {token.text}
                </span>
              ))}
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
              <CheckIcon aria-hidden size={15} />
            ) : (
              <CopyIcon aria-hidden size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoCard;
