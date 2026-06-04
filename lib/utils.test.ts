import { describe, expect, it } from "vitest";

import { cn, escapeXml } from "./utils";

describe("utils", () => {
  it("should merge conditional class names when class values are provided", () => {
    // Given
    const isActive = true;
    const isHidden = false;

    // When
    const className = cn("inline-flex", isActive && "font-medium", {
      hidden: isHidden,
    });

    // Then
    expect(className).toBe("inline-flex font-medium");
  });

  it("should prefer later Tailwind classes when conflicting classes are merged", () => {
    // Given
    const baseClasses = "px-2 text-sm";
    const overrideClasses = "px-4";

    // When
    const className = cn(baseClasses, overrideClasses);

    // Then
    expect(className).toBe("text-sm px-4");
  });

  it("should escape XML-sensitive characters when text is rendered into markup", () => {
    // Given
    const value = '<script data-name="stack">&</script>';

    // When
    const escapedValue = escapeXml(value);

    // Then
    expect(escapedValue).toBe(
      "&lt;script data-name=&quot;stack&quot;&gt;&amp;&lt;/script&gt;",
    );
  });
});
