import { readFileSync } from "node:fs";
import path from "node:path";

import { renderIconRequestErrorSvg } from "@/lib/icons/error-svg";
import { parseIconRequest } from "@/lib/icons/parse-request";
import { getIconAssetPath } from "@/lib/icons/registry";
import { escapeXml } from "@/lib/icons/svg-utils";
import type { ParsedIconRequest } from "@/lib/icons/parse-request";

export const runtime = "nodejs";

const iconSize = 48;

function renderIconSvg({
  columns,
  gap,
  icons,
  theme,
}: ParsedIconRequest): string {
  const rows = Math.ceil(icons.length / columns);
  const usedColumns = Math.min(columns, icons.length);
  const width = usedColumns * iconSize + (usedColumns - 1) * gap;
  const height = rows * iconSize + (rows - 1) * gap;
  const labels = icons.map((icon) => icon.label).join(", ");
  const iconMarkup = icons
    .map((icon, index) => {
      const x = (index % columns) * (iconSize + gap);
      const y = Math.floor(index / columns) * (iconSize + gap);
      const assetPath = getIconAssetPath({ slug: icon.slug, theme });
      const iconFilename = assetPath.replace("assets/icons/", "");
      const assetSvg = readFileSync(
        path.join(process.cwd(), "assets", "icons", iconFilename),
        "utf8",
      );

      return `<g transform="translate(${x} ${y})">${assetSvg}</g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">README Stack Icons</title>
  <desc id="desc">${escapeXml(labels)}</desc>
  ${iconMarkup}
</svg>`;
}

export function GET(request: Request) {
  const parsedRequest = parseIconRequest(new URL(request.url).searchParams);

  if (!parsedRequest.success) {
    return new Response(renderIconRequestErrorSvg(parsedRequest.errors), {
      status: 400,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(renderIconSvg(parsedRequest.data), {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
