import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GeneratedImageSource } from "@/lib/icons/readme-image";
import {
  DownloadImagesPopover,
  getDownloadZipFileName,
} from "./DownloadImagesPopover";

const { showToastMock } = vi.hoisted(() => ({ showToastMock: vi.fn() }));

vi.mock("@/components/ui/sonner", () => ({
  showToast: showToastMock,
}));

const RESPONSIVE_IMAGE_SOURCES: GeneratedImageSource[] = [
  { columns: 4, minWidthPx: null, theme: "light", url: "/icons?c=4&t=light" },
  { columns: 4, minWidthPx: null, theme: "dark", url: "/icons?c=4&t=dark" },
  { columns: 8, minWidthPx: 768, theme: "light", url: "/icons?c=8&t=light" },
  { columns: 8, minWidthPx: 768, theme: "dark", url: "/icons?c=8&t=dark" },
];

const SINGLE_LAYOUT_IMAGE_SOURCES = RESPONSIVE_IMAGE_SOURCES.slice(0, 2);

function renderPopover(
  imageSources: readonly GeneratedImageSource[] = RESPONSIVE_IMAGE_SOURCES,
  isDisabled = false,
) {
  return render(
    <DownloadImagesPopover
      generatedImageSources={imageSources}
      isDisabled={isDisabled}
    />,
  );
}

function openPopover() {
  fireEvent.click(screen.getByRole("button", { name: "Download" }));
}

function mockSuccessfulSvgFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("<svg/>", { status: 200 })),
  );
}

beforeEach(() => {
  vi.stubGlobal("URL", {
    ...URL,
    createObjectURL: vi.fn(() => "blob:stackicons"),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  showToastMock.mockClear();
});

describe("DownloadImagesPopover", () => {
  it("should build a filename with a compact UTC timestamp", () => {
    expect(getDownloadZipFileName(new Date("2026-06-21T14:30:52.123Z"))).toBe(
      "stack-icons-20260621T143052Z.zip",
    );
  });

  it("should disable the Download button when downloading is not possible", () => {
    // Given / When
    renderPopover(RESPONSIVE_IMAGE_SOURCES, true);

    // Then
    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
  });

  it("should show one all-checked matrix row per unique column layout when the popover opens", () => {
    // Given
    renderPopover();

    // When
    openPopover();

    // Then — one row per column layout, light/dark pair grouped
    expect(screen.getByText("Base")).toBeInTheDocument();
    expect(screen.getByText("4 columns")).toBeInTheDocument();
    expect(screen.getByText("≥ 768")).toBeInTheDocument();
    expect(screen.getByText("8 columns")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
    checkboxes.forEach((checkbox) =>
      expect(checkbox).toHaveAttribute("aria-checked", "true"),
    );
    expect(screen.getByText("4 of 4 selected")).toBeInTheDocument();
  });

  it("should show a single row when only the base column layout exists", () => {
    // Given
    renderPopover(SINGLE_LAYOUT_IMAGE_SOURCES);

    // When
    openPopover();

    // Then
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByText("2 of 2 selected")).toBeInTheDocument();
  });

  it("should update the live count when a cell is unchecked and reset all cells when reopened", () => {
    // Given
    renderPopover();
    openPopover();

    // When — uncheck one cell
    fireEvent.click(screen.getByRole("checkbox", { name: "Base dark" }));

    // Then
    expect(screen.getByText("3 of 4 selected")).toBeInTheDocument();

    // When — close and reopen
    openPopover();
    openPopover();

    // Then — matrix reset to all checked
    expect(screen.getByText("4 of 4 selected")).toBeInTheDocument();
  });

  it("should close on outside mousedown but stay open on inside mousedown", () => {
    // Given
    renderPopover();
    openPopover();

    // When — mousedown inside the popover
    fireEvent.mouseDown(screen.getByText("Download images"));

    // Then
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // When — mousedown outside
    fireEvent.mouseDown(document.body);

    // Then
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should toast and keep the popover open when downloading with zero cells selected", () => {
    // Given
    renderPopover(SINGLE_LAYOUT_IMAGE_SOURCES);
    openPopover();
    fireEvent.click(screen.getByRole("checkbox", { name: "Base light" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Base dark" }));

    // When
    fireEvent.click(screen.getByRole("button", { name: "Download .zip" }));

    // Then
    expect(showToastMock).toHaveBeenCalledWith("Select at least one variant");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should download one zip of the selected sources and close when every fetch succeeds", async () => {
    // Given
    mockSuccessfulSvgFetch();
    let downloadedFileName = "";
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadedFileName = this.download;
      });
    renderPopover();
    openPopover();

    // When
    fireEvent.click(screen.getByRole("button", { name: "Download .zip" }));

    // Then
    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith("Downloading 4 images"),
    );
    expect(fetch).toHaveBeenCalledTimes(4);
    RESPONSIVE_IMAGE_SOURCES.forEach((imageSource) =>
      expect(fetch).toHaveBeenCalledWith(imageSource.url),
    );
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(downloadedFileName).toMatch(/^stack-icons-\d{8}T\d{6}Z\.zip$/);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    anchorClick.mockRestore();
  });

  it("should download the partial zip and report the failures when some fetches fail", async () => {
    // Given
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url === "/icons?c=8&t=dark"
          ? new Response("nope", { status: 500 })
          : new Response("<svg/>", { status: 200 }),
      ),
    );
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    renderPopover();
    openPopover();

    // When
    fireEvent.click(screen.getByRole("button", { name: "Download .zip" }));

    // Then
    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith("Downloaded 3, 1 failed"),
    );
    expect(anchorClick).toHaveBeenCalledTimes(1);

    anchorClick.mockRestore();
  });

  it("should toast an error and download nothing when every fetch fails", async () => {
    // Given
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    renderPopover();
    openPopover();

    // When
    fireEvent.click(screen.getByRole("button", { name: "Download .zip" }));

    // Then
    await waitFor(() =>
      expect(showToastMock).toHaveBeenCalledWith(
        "Download failed — could not fetch any images",
      ),
    );
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
