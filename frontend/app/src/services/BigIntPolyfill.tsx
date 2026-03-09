"use client";

// Global BigInt serialization polyfill for React 19 development mode
// React 19's internal logging uses JSON.stringify() which fails on BigInt values
// This polyfill must run before React hydrates to prevent serialization errors

if (
  typeof BigInt !== "undefined"
  && !(BigInt.prototype as unknown as { toJSON?: () => string }).toJSON
) {
  // eslint-disable-next-line no-extend-native -- Intentional polyfill for JSON.stringify BigInt support
  (BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function() {
    return this.toString();
  };
}

export function BigIntPolyfill({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
