"use client";

import React from "react";
import { LinkIcon } from "lucide-react";

import type { StackIconsEditorState } from "./state";
import { useStackIconsEditorForm } from "./useStackIconsEditorForm";

export type { StackIconsEditorState } from "./state";

type StackIconsEditorProps = {
  initialState: StackIconsEditorState;
};

export function StackIconsEditor({ initialState }: StackIconsEditorProps) {
  const { generatedUrl, state, updateField } =
    useStackIconsEditorForm(initialState);

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <label
        className="font-mono text-sm font-medium text-card-foreground"
        htmlFor="icons"
      >
        Icon slugs
      </label>
      <textarea
        className="mt-3 min-h-40 w-full resize-none rounded-md border bg-background p-4 font-mono text-sm outline-none ring-ring transition focus:ring-2"
        id="icons"
        onChange={(event) => updateField("icons", event.target.value)}
        value={state.icons}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            className="font-mono text-xs text-muted-foreground"
            htmlFor="columns"
          >
            Columns
          </label>
          <input
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none ring-ring transition focus:ring-2"
            id="columns"
            max={20}
            min={2}
            onChange={(event) => updateField("columns", event.target.value)}
            type="number"
            value={state.columns}
          />
        </div>
        <div>
          <label
            className="font-mono text-xs text-muted-foreground"
            htmlFor="gap"
          >
            Gap
          </label>
          <input
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none ring-ring transition focus:ring-2"
            id="gap"
            max={24}
            min={0}
            onChange={(event) => updateField("gap", event.target.value)}
            type="number"
            value={state.gap}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
          htmlFor="generated-url"
        >
          <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
          SVG URL
        </label>
        <input
          className="mt-1 w-full rounded-md border bg-muted px-3 py-2 font-mono text-sm text-muted-foreground"
          id="generated-url"
          readOnly
          type="text"
          value={generatedUrl}
        />
      </div>
    </div>
  );
}
