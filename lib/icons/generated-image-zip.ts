import { zipSync } from "fflate";

import type { GeneratedImageSource } from "./readme-image";

// File name for one generated image source inside the download zip, e.g.
// `stack-8col-dark.svg`.
export function getGeneratedImageSourceFileName(
  imageSource: GeneratedImageSource,
): string {
  return `stack-${imageSource.columns}col-${imageSource.theme}.svg`;
}

export type GeneratedImageSourceZipResult = {
  failedCount: number;
  succeededCount: number;
  zipBytes: Uint8Array | null;
};

// Fetches each generated image source's SVG and bundles the successful
// fetches into one zip. Failed fetches are skipped rather than aborting the
// whole bundle; when every fetch fails there is no zip to download.
export async function buildGeneratedImageSourceZip(
  imageSources: readonly GeneratedImageSource[],
): Promise<GeneratedImageSourceZipResult> {
  const zipEntries: Record<string, Uint8Array> = {};
  let failedCount = 0;

  await Promise.all(
    imageSources.map(async (imageSource) => {
      try {
        const response = await fetch(imageSource.url);

        if (!response.ok) {
          throw new Error(
            `Generated image source fetch failed: ${response.status}`,
          );
        }

        zipEntries[getGeneratedImageSourceFileName(imageSource)] =
          new Uint8Array(await response.arrayBuffer());
      } catch {
        failedCount += 1;
      }
    }),
  );

  const succeededCount = imageSources.length - failedCount;

  return {
    failedCount,
    succeededCount,
    zipBytes: succeededCount === 0 ? null : zipSync(zipEntries),
  };
}
