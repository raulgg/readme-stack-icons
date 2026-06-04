"use client";

import React from "react";

import type { StackIconsEditorState } from "./state";

function buildPageQuery(state: StackIconsEditorState): string {
  const params = new URLSearchParams();

  params.set("icons", state.icons);
  params.set("columns", state.columns);
  params.set("gap", state.gap);

  return params.toString();
}

function buildIconsUrl(
  state: StackIconsEditorState,
  currentOrigin: string,
): string {
  if (currentOrigin === "") {
    return "";
  }

  const url = new URL("/icons", currentOrigin);

  url.searchParams.set(
    "icons",
    state.icons.trim() === "" ? "all" : state.icons,
  );
  url.searchParams.set("columns", state.columns);
  url.searchParams.set("gap", state.gap);

  return url.toString();
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
  const [state, setState] = React.useState<StackIconsEditorState>(initialState);

  const generatedUrl = buildIconsUrl(state, currentOrigin);

  function updateField<Field extends keyof StackIconsEditorState>(
    field: Field,
    value: StackIconsEditorState[Field],
  ) {
    const nextState = {
      ...state,
      [field]: value,
    };

    setState(nextState);

    const nextQuery = buildPageQuery(nextState);
    const nextUrl = `${window.location.pathname}?${nextQuery}`;

    window.history.replaceState(null, "", nextUrl);
  }

  return {
    generatedUrl,
    state,
    updateField,
  };
}
