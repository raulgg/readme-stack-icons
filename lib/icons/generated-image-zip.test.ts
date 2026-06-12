import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildGeneratedImageSourceZip,
  getGeneratedImageSourceFileName,
} from "./generated-image-zip";
import type { GeneratedImageSource } from "./readme-image";

const { zipSyncMock } = vi.hoisted(() => ({
  zipSyncMock: vi.fn(
    (_zipEntries: Record<string, Uint8Array>) => new Uint8Array([1, 2, 3]),
  ),
}));

vi.mock("fflate", () => ({
  zipSync: zipSyncMock,
}));

function buildImageSource(
  overrides: Partial<GeneratedImageSource>,
): GeneratedImageSource {
  return {
    columns: 4,
    minWidthPx: null,
    theme: "light",
    url: "/icons?icons=react&theme=light",
    ...overrides,
  };
}

function mockSvgResponse(svgText: string): Response {
  return new Response(svgText, {
    headers: { "Content-Type": "image/svg+xml" },
    status: 200,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  zipSyncMock.mockClear();
});

describe("getGeneratedImageSourceFileName", () => {
  it("should name the file from columns and theme when given a generated image source", () => {
    // Given
    const imageSource = buildImageSource({ columns: 8, theme: "dark" });

    // When
    const fileName = getGeneratedImageSourceFileName(imageSource);

    // Then
    expect(fileName).toBe("stack-8col-dark.svg");
  });
});

describe("buildGeneratedImageSourceZip", () => {
  it("should feed the zip one correctly named entry per source when every fetch succeeds", async () => {
    // Given
    const imageSources = [
      buildImageSource({ columns: 4, theme: "light" }),
      buildImageSource({ columns: 8, minWidthPx: 768, theme: "dark" }),
    ];
    const fetchMock = vi.fn(async (url: string) =>
      mockSvgResponse(`<svg data-url="${url}"/>`),
    );
    vi.stubGlobal("fetch", fetchMock);

    // When
    const result = await buildGeneratedImageSourceZip(imageSources);

    // Then
    expect(fetchMock).toHaveBeenCalledWith(imageSources[0].url);
    expect(fetchMock).toHaveBeenCalledWith(imageSources[1].url);
    expect(result).toMatchObject({ failedCount: 0, succeededCount: 2 });
    expect(result.zipBytes).toEqual(new Uint8Array([1, 2, 3]));

    const zipEntries = zipSyncMock.mock.calls[0][0];
    expect(Object.keys(zipEntries).sort()).toEqual([
      "stack-4col-light.svg",
      "stack-8col-dark.svg",
    ]);
    expect(new TextDecoder().decode(zipEntries["stack-4col-light.svg"])).toBe(
      `<svg data-url="${imageSources[0].url}"/>`,
    );
  });

  it("should skip failed fetches but zip the succeeded ones when some fetches fail", async () => {
    // Given
    const imageSources = [
      buildImageSource({ columns: 4, theme: "light" }),
      buildImageSource({ columns: 4, theme: "dark", url: "/icons?broken" }),
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url === "/icons?broken"
          ? new Response("nope", { status: 500 })
          : mockSvgResponse("<svg/>"),
      ),
    );

    // When
    const result = await buildGeneratedImageSourceZip(imageSources);

    // Then
    expect(result).toMatchObject({ failedCount: 1, succeededCount: 1 });
    expect(result.zipBytes).not.toBeNull();
    expect(Object.keys(zipSyncMock.mock.calls[0][0])).toEqual([
      "stack-4col-light.svg",
    ]);
  });

  it("should return no zip bytes when every fetch fails", async () => {
    // Given
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    // When
    const result = await buildGeneratedImageSourceZip([
      buildImageSource({}),
      buildImageSource({ theme: "dark" }),
    ]);

    // Then
    expect(result).toEqual({
      failedCount: 2,
      succeededCount: 0,
      zipBytes: null,
    });
    expect(zipSyncMock).not.toHaveBeenCalled();
  });
});
