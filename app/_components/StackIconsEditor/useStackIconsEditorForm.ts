"use client";

import React from "react";

import { parseIconRequest } from "@/lib/icons/parse-request";
import { escapeXml } from "@/lib/utils";

import {
  DEFAULT_RESPONSIVE_COLUMN_LAYOUTS,
  DEFAULT_STACK_ICONS_EDITOR_STATE,
  type ColumnLayout,
  type LayoutMode,
  type StackIconsEditorState,
} from "./state";

type CopyGeneratedHtmlStatus = "failed" | "idle" | "succeeded";
type LayoutMemoryState = {
  singleColumnLayout: ColumnLayout;
  responsiveColumnLayouts: ColumnLayout[];
};

function getBaseColumnLayout(state: StackIconsEditorState) {
  return state.columnLayouts[0];
}

function buildPageQuery(state: StackIconsEditorState): string {
  const params = new URLSearchParams();

  params.set("icons", state.icons);
  params.set("layout", state.layoutMode);
  params.set("column-layouts", JSON.stringify(state.columnLayouts));
  params.set("gap", state.gap);
  params.set("include-dark-theme", String(state.includeDarkTheme));
  params.set("preview-theme", state.previewTheme);

  return params.toString();
}

function buildInitialLayoutMemory(
  initialState: StackIconsEditorState,
): LayoutMemoryState {
  return {
    singleColumnLayout:
      initialState.layoutMode === "single"
        ? { ...getBaseColumnLayout(initialState) }
        : { ...getBaseColumnLayout(DEFAULT_STACK_ICONS_EDITOR_STATE) },
    responsiveColumnLayouts:
      initialState.layoutMode === "responsive"
        ? initialState.columnLayouts.map((layout) => ({ ...layout }))
        : DEFAULT_RESPONSIVE_COLUMN_LAYOUTS.map((layout) => ({ ...layout })),
  };
}

function buildIconRequestParams(
  state: StackIconsEditorState,
  columns = getBaseColumnLayout(state).columns,
): URLSearchParams {
  const params = new URLSearchParams();

  params.set("icons", state.icons);
  params.set("columns", columns);
  params.set("gap", state.gap);

  return params;
}

function isAllIconState(state: StackIconsEditorState): boolean {
  const rawIcons = state.icons.trim();

  return rawIcons === "all";
}

function buildIconsUrl(
  state: StackIconsEditorState,
  currentOrigin: string,
): string {
  if (currentOrigin === "") {
    return "";
  }

  const url = new URL("/icons", currentOrigin);
  url.search = buildIconRequestParams(state).toString();
  url.searchParams.set("theme", state.previewTheme);

  return url.toString();
}

function buildReadmeImageUrl(
  state: StackIconsEditorState,
  currentOrigin: string,
  theme: "dark" | "light",
  columns = getBaseColumnLayout(state).columns,
): string {
  if (currentOrigin === "") {
    return "";
  }

  const url = new URL("/icons", currentOrigin);
  const params = new URLSearchParams();

  if (!isAllIconState(state)) {
    params.set("icons", state.icons);
  }

  params.set("columns", columns);
  params.set("gap", state.gap);
  params.set("theme", theme);

  url.search = params.toString();

  return url.toString();
}

function buildReadmeHtml(
  state: StackIconsEditorState,
  currentOrigin: string,
): string {
  const parsedRequest = parseIconRequest(buildIconRequestParams(state));

  if (!parsedRequest.success) {
    return "";
  }

  const fallbackUrl = buildReadmeImageUrl(state, currentOrigin, "light");

  if (fallbackUrl === "") {
    return "";
  }

  const labels = isAllIconState(state)
    ? "All stack icons"
    : parsedRequest.data.icons.map((icon) => icon.label).join(", ");
  const darkSourceUrl = state.includeDarkTheme
    ? buildReadmeImageUrl(state, currentOrigin, "dark")
    : "";
  const sources: string[] = [];

  if (darkSourceUrl !== "") {
    sources.push(
      `  <source media="(prefers-color-scheme: dark)" srcset="${escapeXml(darkSourceUrl)}" />`,
    );
  }

  const sourceMarkup = sources.length === 0 ? "" : `${sources.join("\n")}\n`;

  return `<picture>
${sourceMarkup}  <img src="${escapeXml(fallbackUrl)}" alt="${escapeXml(labels)}" title="${escapeXml(labels)}" width="100%" />
</picture>`;
}

function subscribeToCurrentOrigin() {
  return () => {};
}

function getCurrentOrigin() {
  return window.location.origin;
}

function getServerOriginSnapshot() {
  return "";
}

export function useStackIconsEditorForm(initialState: StackIconsEditorState) {
  const currentOrigin = React.useSyncExternalStore(
    subscribeToCurrentOrigin,
    getCurrentOrigin,
    getServerOriginSnapshot,
  );
  const [editorState, setEditorState] =
    React.useState<StackIconsEditorState>(initialState);
  const [previewState, setPreviewState] =
    React.useState<StackIconsEditorState | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [copyGeneratedHtmlStatus, setCopyGeneratedHtmlStatus] =
    React.useState<CopyGeneratedHtmlStatus>("idle");
  const [layoutMemory, setLayoutMemory] = React.useState<LayoutMemoryState>(
    () => buildInitialLayoutMemory(initialState),
  );
  const previewGenerationId = React.useRef(0);

  const generatedUrl =
    previewState === null ? "" : buildIconsUrl(previewState, currentOrigin);
  const generatedHtml =
    previewState === null ? "" : buildReadmeHtml(previewState, currentOrigin);

  function updateField<Field extends keyof StackIconsEditorState>(
    field: Field,
    value: StackIconsEditorState[Field],
  ) {
    const nextState = {
      ...editorState,
      [field]: value,
    };

    setEditorState(nextState);

    const nextQuery = buildPageQuery(nextState);
    const nextUrl = `${window.location.pathname}?${nextQuery}`;

    window.history.replaceState(null, "", nextUrl);

    if (field === "previewTheme") {
      setPreviewState((currentPreviewState) =>
        currentPreviewState === null
          ? null
          : {
              ...currentPreviewState,
              previewTheme: value as StackIconsEditorState["previewTheme"],
            },
      );
    }
  }

  function updateBaseColumns(columns: string) {
    const nextState: StackIconsEditorState = {
      ...editorState,
      columnLayouts: [
        { ...getBaseColumnLayout(editorState), columns },
        ...editorState.columnLayouts.slice(1),
      ],
    };

    setEditorState(nextState);

    const nextQuery = buildPageQuery(nextState);
    const nextUrl = `${window.location.pathname}?${nextQuery}`;

    window.history.replaceState(null, "", nextUrl);
  }

  function updateFirstBreakpointLayout(
    field: keyof ColumnLayout,
    value: string,
  ) {
    const firstBreakpointLayout = editorState.columnLayouts[1];

    if (firstBreakpointLayout === undefined) {
      return;
    }

    const nextState: StackIconsEditorState = {
      ...editorState,
      columnLayouts: [
        getBaseColumnLayout(editorState),
        { ...firstBreakpointLayout, [field]: value },
        ...editorState.columnLayouts.slice(2),
      ],
    };

    setEditorState(nextState);

    const nextQuery = buildPageQuery(nextState);
    const nextUrl = `${window.location.pathname}?${nextQuery}`;

    window.history.replaceState(null, "", nextUrl);
  }

  function switchLayoutMode(layoutMode: LayoutMode) {
    if (layoutMode === editorState.layoutMode) {
      return;
    }

    const nextMemory: LayoutMemoryState = {
      singleColumnLayout:
        editorState.layoutMode === "single"
          ? { ...getBaseColumnLayout(editorState) }
          : layoutMemory.singleColumnLayout,
      responsiveColumnLayouts:
        editorState.layoutMode === "responsive"
          ? editorState.columnLayouts.map((layout) => ({ ...layout }))
          : layoutMemory.responsiveColumnLayouts,
    };
    const nextColumnLayouts =
      layoutMode === "single"
        ? [{ ...nextMemory.singleColumnLayout }]
        : nextMemory.responsiveColumnLayouts.map((layout) => ({ ...layout }));
    const nextState: StackIconsEditorState = {
      ...editorState,
      layoutMode,
      columnLayouts: nextColumnLayouts,
    };

    setLayoutMemory(nextMemory);
    setEditorState(nextState);

    const nextQuery = buildPageQuery(nextState);
    const nextUrl = `${window.location.pathname}?${nextQuery}`;

    window.history.replaceState(null, "", nextUrl);
  }

  function generatePreview() {
    previewGenerationId.current += 1;

    const parsedRequest = parseIconRequest(buildIconRequestParams(editorState));

    if (!parsedRequest.success) {
      setPreviewState(null);
      setValidationErrors(parsedRequest.errors);
      setCopyGeneratedHtmlStatus("idle");
      return;
    }

    setPreviewState(editorState);
    setValidationErrors([]);
    setCopyGeneratedHtmlStatus("idle");
  }

  async function copyGeneratedHtml() {
    const copyPreviewGenerationId = previewGenerationId.current;
    const clipboard = navigator.clipboard;

    if (generatedHtml === "" || clipboard === undefined) {
      setCopyGeneratedHtmlStatus("failed");
      return;
    }

    try {
      await clipboard.writeText(generatedHtml);
      if (copyPreviewGenerationId !== previewGenerationId.current) {
        return;
      }
      setCopyGeneratedHtmlStatus("succeeded");
    } catch {
      if (copyPreviewGenerationId !== previewGenerationId.current) {
        return;
      }
      setCopyGeneratedHtmlStatus("failed");
    }
  }

  return {
    copyGeneratedHtml,
    copyGeneratedHtmlStatus,
    generatePreview,
    generatedHtml,
    generatedUrl,
    state: editorState,
    switchLayoutMode,
    updateBaseColumns,
    updateField,
    updateFirstBreakpointLayout,
    validationErrors,
  };
}
