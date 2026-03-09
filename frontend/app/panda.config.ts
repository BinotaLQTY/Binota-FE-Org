import type { Preset } from "@pandacss/dev";

import { liquityUiKitPreset } from "@binota/uikit/panda.config";
import { defineConfig, defineGlobalStyles, definePreset } from "@pandacss/dev";
import { BREAKPOINTS } from "./src/breakpoints";

export default defineConfig({
  preflight: true, // CSS reset
  jsxFramework: "react", // needed for panda to extract props named `css`
  globalFontface: {
    Kaypro: {
      src: 'url(/assets/Web437_Kaypro2K_G.woff) format("woff")',
      fontWeight: 400,
      fontStyle: "normal",
      fontDisplay: "swap",
    },
  },
  globalVars: {
    fontFamily: {
      "--font-kaypro-heading": "Kaypro, serif",
    },
  },
  presets: [
    liquityUiKitPreset as Preset, // `as Preset` prevents a type error: "Expression produces a union type that is too complex to represent."
    definePreset({
      name: "liquity-app",
      theme: {
        extend: {
          breakpoints: {
            small: `${BREAKPOINTS.small}px`,
            medium: `${BREAKPOINTS.medium}px`,
            large: `${BREAKPOINTS.large}px`,
          },
          tokens: {
            fonts: {
              kaypro: {
                value: "var(--font-kaypro-heading), Kaypro, serif",
              },
            },
          },
        },
      },
    }),
  ],
  exclude: [],
  outdir: "styled-system",
  include: ["../uikit/src/**/*.tsx", "./src/**/*.{ts,tsx}", "./*.tsx"],
  globalCss: defineGlobalStyles({
    "html, body": {
      height: "100%",
      minWidth: 360,
      lineHeight: 1.5,
      fontSize: 16,
      fontWeight: 500,
      color: "content",
      background: "background",
    },
    html: {
      overflowX: "auto",
      overflowY: "scroll",
    },
    // "html, body, *, button, a, input": {
    //   cursor: "url('/assets/Arrow.svg'), auto",
    // },

    // "button.progress": {
    //   cursor: "url('/assets/Hourglass.svg'), auto",
    // },
    // "button:hover, a:hover, input:hover, .hover:hover": {
    //   cursor: "url('/assets/Pointer.svg') !important, auto",
    // },
    // "input:focus, .focus:focus": {
    //   cursor: "url('/assets/Text.svg') !important, auto",
    // },
    // "button:focus, a:focus": {
    //   cursor: "url('/assets/Pointer.svg'), auto",
    // },
    // ".disabled, a:disabled, input:disabled, button:disabled, button.disabled, button[disabled=disabled], input[disabled=disabled]": {
    //   cursor: "url('/assets/Forbidden.svg') !important, auto",
    // },
  }),
});
