import { readFileSync } from "node:fs";
import path from "node:path";

import { getIconAssetPath } from "@/lib/icons/registry";
import { parseIconRequest } from "@/lib/icons/request";
import type { ParsedIconRequest } from "@/lib/icons/request";

export const runtime = "nodejs";

const iconSize = 48;

function errorSvg(errors: readonly string[]): string {
  const escapedMessage = escapeXml(errors.join(" "));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-labelledby="title desc">
  <title id="title">Invalid README Stack Icons request</title>
  <desc id="desc">${escapedMessage}</desc>
  <rect width="640" height="120" rx="12" fill="#fff1f2"/>
  <text x="24" y="52" fill="#9f1239" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="700">Invalid icon request</text>
  <text x="24" y="84" fill="#9f1239" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16">${escapedMessage}</text>
</svg>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

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
    return new Response(errorSvg(parsedRequest.errors), {
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
