import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia, which next-themes and sonner rely on.
if (window.matchMedia === undefined) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom does not implement PointerEvent, which Radix UI primitives rely on.
if (window.PointerEvent === undefined) {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;

    constructor(type: string, props: PointerEventInit = {}) {
      super(type, props);
      this.pointerId = props.pointerId ?? 0;
      this.pointerType = props.pointerType ?? "mouse";
    }
  }

  window.PointerEvent = PointerEventPolyfill as typeof PointerEvent;
}

// jsdom does not implement ResizeObserver, which the Radix slider relies on.
if (window.ResizeObserver === undefined) {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver =
    ResizeObserverPolyfill as unknown as typeof ResizeObserver;
}
