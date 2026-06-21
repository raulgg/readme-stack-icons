import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "StackIcons";
export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180,
};

export default async function AppleIcon() {
  const svg = await readFile(
    join(process.cwd(), "assets/stack-icons-logo.svg"),
    "utf8",
  );
  const logoUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#ffffff",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <img alt="" height={180} src={logoUrl} width={180} />
    </div>,
    size,
  );
}
