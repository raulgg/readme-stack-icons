export type NormalizedSvgAsset = {
  attributes: string;
  body: string;
  viewBox: string;
};

export function normalizeTrustedSvgAsset({
  occurrence,
  slug,
  sourceSvg,
}: {
  occurrence: number;
  slug: string;
  sourceSvg: string;
}): NormalizedSvgAsset {
  const strippedSvg = stripDocumentMarkup(sourceSvg).trim();

  rejectExternalReferences(strippedSvg);

  const { rootAttributes, body } = extractRootSvg(strippedSvg);
  const viewBox = readAttribute(rootAttributes, "viewBox") ?? deriveViewBox(rootAttributes);
  const preserveAspectRatio =
    readAttribute(rootAttributes, "preserveAspectRatio") ?? "xMidYMid meet";
  const idPrefix = `icon-${slug}-${occurrence}`;
  const idMap = collectPrefixedIds(`${rootAttributes} ${body}`, idPrefix);

  return {
    attributes: serializeRootAttributes(
      rewriteInternalIdReferences(rootAttributes, idMap),
      {
        preserveAspectRatio,
        viewBox,
      },
    ),
    body: rewriteInternalIdReferences(body.trim(), idMap),
    viewBox,
  };
}

function stripDocumentMarkup(sourceSvg: string): string {
  return sourceSvg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!doctype\b[\s\S]*?(?:\[[\s\S]*?\]\s*)?>/gi, "");
}

function extractRootSvg(svg: string): {
  body: string;
  rootAttributes: string;
} {
  const rootStart = svg.search(/<svg\b/i);

  if (rootStart === -1 || svg.slice(0, rootStart).trim()) {
    throw new Error("Icon asset must be an SVG document.");
  }

  const rootOpenEnd = findTagEnd(svg, rootStart);
  const rootOpenTag = svg.slice(rootStart, rootOpenEnd + 1);

  if (/\/\s*>$/.test(rootOpenTag)) {
    throw new Error("Icon asset must be an SVG document with inner markup.");
  }

  const rootAttributes = rootOpenTag.replace(/^<svg\b/i, "").replace(/>$/, "");
  let depth = 1;
  let cursor = rootOpenEnd + 1;

  while (cursor < svg.length) {
    const tagStart = svg.indexOf("<", cursor);

    if (tagStart === -1) {
      break;
    }

    if (!/^<\/?svg\b/i.test(svg.slice(tagStart))) {
      cursor = tagStart + 1;
      continue;
    }

    const tagEnd = findTagEnd(svg, tagStart);
    const tag = svg.slice(tagStart, tagEnd + 1);

    if (/^<\/svg\s*>$/i.test(tag)) {
      depth -= 1;

      if (depth === 0) {
        const trailingMarkup = svg.slice(tagEnd + 1).trim();

        if (trailingMarkup) {
          throw new Error("Icon asset must be an SVG document.");
        }

        return {
          body: svg.slice(rootOpenEnd + 1, tagStart),
          rootAttributes,
        };
      }
    } else if (!/\/\s*>$/.test(tag)) {
      depth += 1;
    }

    cursor = tagEnd + 1;
  }

  throw new Error("Icon asset must be an SVG document.");
}

function findTagEnd(svg: string, tagStart: number): number {
  let quote: string | undefined;

  for (let index = tagStart + 1; index < svg.length; index += 1) {
    const character = svg[index];

    if (quote) {
      if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === `"` || character === "'") {
      quote = character;
      continue;
    }

    if (character === ">") {
      return index;
    }
  }

  throw new Error("Icon asset must be an SVG document.");
}

function serializeRootAttributes(
  attributes: string,
  normalizedAttributes: {
    preserveAspectRatio: string;
    viewBox: string;
  },
): string {
  const retainedAttributes = Array.from(
    attributes.matchAll(/\s*([:\w-]+)=(["'])(.*?)\2/g),
  )
    .filter(([, name]) => !/^(?:height|preserveAspectRatio|viewBox|width|x|y)$/i.test(name))
    .map(([, name, quote, value]) => `${name}=${quote}${value}${quote}`);

  return [
    ...retainedAttributes,
    `viewBox="${normalizedAttributes.viewBox}"`,
    `preserveAspectRatio="${normalizedAttributes.preserveAspectRatio}"`,
  ].join(" ");
}

function deriveViewBox(rootAttributes: string): string {
  const width = readNumericAttribute(rootAttributes, "width");
  const height = readNumericAttribute(rootAttributes, "height");

  if (width === undefined || height === undefined) {
    throw new Error("Icon asset must include a viewBox or numeric width and height.");
  }

  return `0 0 ${width} ${height}`;
}

function readAttribute(attributes: string, name: string): string | undefined {
  const match = attributes.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2];
}

function readNumericAttribute(
  attributes: string,
  name: string,
): number | undefined {
  const value = readAttribute(attributes, name);

  if (!value) {
    return undefined;
  }

  const match = value.match(/^(\d+(?:\.\d+)?)(?:px)?$/);
  return match ? Number(match[1]) : undefined;
}

function rejectExternalReferences(svg: string): void {
  if (/<image\b/i.test(svg)) {
    throw new Error("Icon asset must not include image references.");
  }

  if (/\b(?:href|src)=["'](?!#)[^"']+["']/i.test(svg)) {
    throw new Error("Icon asset must not include external references.");
  }

  if (/@import\b|url\((?!["']?#)/i.test(svg)) {
    throw new Error("Icon asset must not include external references.");
  }
}

function collectPrefixedIds(svg: string, prefix: string): Map<string, string> {
  const ids = Array.from(svg.matchAll(/\bid=(["'])([^"']+)\1/g), (match) => match[2]);

  return new Map(ids.map((id) => [id, `${prefix}-${id}`]));
}

function rewriteInternalIdReferences(
  svg: string,
  idMap: ReadonlyMap<string, string>,
): string {
  return Array.from(idMap).reduce((rewrittenSvg, [id, prefixedId]) => {
    const escapedId = escapeRegExp(id);

    return rewrittenSvg
      .replace(
        new RegExp(`\\bid=(["'])${escapedId}\\1`, "g"),
        (_, quote: string) => `id=${quote}${prefixedId}${quote}`,
      )
      .replace(
        new RegExp(`url\\((["']?)#${escapedId}\\1\\)`, "g"),
        (_, quote: string) => `url(${quote}#${prefixedId}${quote})`,
      )
      .replace(
        /\b(aria-describedby|aria-labelledby)=(["'])([^"']*)\2/g,
        (match, name: string, quote: string, value: string) => {
          const rewrittenValue = value
            .split(/\s+/)
            .map((token) => (token === id ? prefixedId : token))
            .join(" ");

          return rewrittenValue === value
            ? match
            : `${name}=${quote}${rewrittenValue}${quote}`;
        },
      )
      .replace(new RegExp(`\\b(?:href|xlink:href)=(["'])#${escapedId}\\1`, "g"), (match) =>
        match.replace(`#${id}`, `#${prefixedId}`),
      );
  }, svg);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
