import { escapeXml } from "./svg-utils";

const maxVisibleErrorMessageLength = 60;

export function renderIconRequestErrorSvg(errors: readonly string[]): string {
  const message = errors.join(" ");
  const escapedMessage = escapeXml(message);
  const escapedVisibleMessage = escapeXml(
    truncateMessage(message, maxVisibleErrorMessageLength),
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-labelledby="title desc">
  <title id="title">Invalid README Stack Icons request</title>
  <desc id="desc">${escapedMessage}</desc>
  <rect width="640" height="120" fill="#ffffff"/>
  <g transform="translate(32 28) scale(3)" fill="#64748b">
    <path d="M19 3a2 2 0 0 1 2 2v6h-2v2h-2v2h-2v2h-2v2h-2v2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 12v4a2 2 0 0 1-2 2h-4v-2h2v-2h2v-2zm-2-6.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H11v-1h2v-2h2v-2h2V9h2z"/>
  </g>
  <text x="144" y="55" fill="#475569" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="700">Invalid icon request</text>
  <text x="144" y="82" fill="#64748b" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14">${escapedVisibleMessage}</text>
</svg>`;
}

function truncateMessage(message: string, maxLength: number): string {
  if (message.length <= maxLength) {
    return message;
  }

  return `${message.slice(0, maxLength - 3)}...`;
}
