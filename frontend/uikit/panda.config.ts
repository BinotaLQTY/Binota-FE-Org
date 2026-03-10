import { defineConfig, definePreset } from "@pandacss/dev";
import { colors, darkTheme } from "./src/Theme/Theme";

const tokenColors = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => [
    key,
    { value },
  ]),
);

const semanticColors = Object.fromEntries(
  Object.entries(darkTheme.colors).map(([key, value]) => [
    key,
    {
      value: value.startsWith("#") ? value : `{colors.${value}}`,
    },
  ]),
);

export const liquityUiKitPreset = definePreset({
  name: "liquity-ui-kit",
  theme: {
    extend: {
      breakpoints: {
        small: "360px",
        medium: "624px",
        large: "960px",
      },
    },
    tokens: {
      colors: tokenColors,
      fonts: {
        body: {
          value: "Geist, sans-serif",
        },
      },
    },
    semanticTokens: {
      colors: semanticColors,
    },
  },
});

export default defineConfig({
  preflight: true, // CSS reset
  presets: [liquityUiKitPreset],
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],
  outdir: "styled-system",
});
