"use client";

import { colors, darkTheme } from "@binota/uikit";
import { ColorGroup } from "./shared";

export default function ThemeFixture() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: 64,
        background: "#14151A",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            width: "100%",
            gap: 80,
          }}
        >
          <ColorGroup
            name="Dark Theme (Binance)"
            mode="vertical"
            colors={Object.fromEntries(
              Object
                .entries(darkTheme.colors)
                .map(([key, value]) => [
                  key,
                  typeof value === "string" && value.startsWith("#")
                    ? value
                    : colors[value as keyof typeof colors],
                ]),
            )}
            secondary={(name) => darkTheme.colors[name as keyof typeof darkTheme.colors]}
          />
        </div>
      </div>
    </div>
  );
}
