"use client";

/**
 * Kinds emitted by {@link tokenizeReadmeImageCode}. Each maps to a syntax
 * highlighting token class in the consumers (see `TOKEN_CLASSES`).
 */
export type ReadmeImageCodeTokenKind =
  | "attribute"
  | "punctuation"
  | "string"
  | "tag"
  | "text";

export type ReadmeImageCodeToken = {
  kind: ReadmeImageCodeTokenKind;
  text: string;
};

const TAG_NAME = /^[a-zA-Z][\w-]*/;
const ATTRIBUTE_NAME = /^[a-zA-Z][\w:-]*/;

/**
 * Tokenizes an HTML README snippet into a flat list of syntax tokens.
 *
 * The tokenizer is intentionally small: it only understands the subset of
 * HTML used by the generated `<picture>` markup (tags, attributes, quoted
 * attribute values, and the surrounding punctuation / whitespace text). It is
 * deliberately resilient — any unrecognised character is emitted as a `text`
 * token so the joined token text is always identical to the input.
 */
export function tokenizeReadmeImageCode(code: string): ReadmeImageCodeToken[] {
  const tokens: ReadmeImageCodeToken[] = [];
  let index = 0;

  const push = (kind: ReadmeImageCodeTokenKind, text: string) => {
    if (text === "") {
      return;
    }
    const previous = tokens[tokens.length - 1];
    if (previous && previous.kind === kind) {
      previous.text += text;
      return;
    }
    tokens.push({ kind, text });
  };

  while (index < code.length) {
    const char = code[index];

    if (char === "<") {
      // Opening punctuation, optional `/`, then the tag name.
      let punctuation = "<";
      index += 1;
      if (code[index] === "/") {
        punctuation += "/";
        index += 1;
      }
      push("punctuation", punctuation);

      const nameMatch = code.slice(index).match(TAG_NAME);
      if (nameMatch) {
        push("tag", nameMatch[0]);
        index += nameMatch[0].length;
      }

      // Attributes and values until the closing `>`.
      while (index < code.length && code[index] !== ">") {
        const inner = code[index];

        if (inner === "/") {
          push("punctuation", "/");
          index += 1;
          continue;
        }

        if (inner === "=") {
          push("punctuation", "=");
          index += 1;
          continue;
        }

        if (inner === '"' || inner === "'") {
          const quote = inner;
          let value = quote;
          index += 1;
          while (index < code.length && code[index] !== quote) {
            value += code[index];
            index += 1;
          }
          if (index < code.length) {
            value += quote;
            index += 1;
          }
          push("string", value);
          continue;
        }

        if (/\s/.test(inner)) {
          let whitespace = "";
          while (index < code.length && /\s/.test(code[index])) {
            whitespace += code[index];
            index += 1;
          }
          push("text", whitespace);
          continue;
        }

        const attributeMatch = code.slice(index).match(ATTRIBUTE_NAME);
        if (attributeMatch) {
          push("attribute", attributeMatch[0]);
          index += attributeMatch[0].length;
          continue;
        }

        // Unknown character inside a tag — emit verbatim so output round-trips.
        push("text", inner);
        index += 1;
      }

      if (code[index] === ">") {
        push("punctuation", ">");
        index += 1;
      }
      continue;
    }

    // Plain text between tags (including newlines and indentation).
    let text = "";
    while (index < code.length && code[index] !== "<") {
      text += code[index];
      index += 1;
    }
    push("text", text);
  }

  return tokens;
}
