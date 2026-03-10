"use client";

import type { ReactNode } from "react";

import { createContext, useContext, useState } from "react";

// The Binota base color palette, meant
// to be used by themes rather than directly.
export const colors = {
  // Gold (based on Binance/Pantone palette)
  "yellow:50": "#fffdf5",
  "yellow:100": "#fff9e6",
  "yellow:200": "#fff3d6",
  "yellow:300": "#ffe8b3",
  "yellow:400": "#ffb204",
  "yellow:500": "#f8bb00",
  "yellow:600": "#f0b90b",
  "yellow:700": "#e69f00",
  "yellow:800": "#c78500",
  "yellow:900": "#8b5e00",
  "yellow:950": "#0c0e12",

  // Gray
  "gray:50": "#F5F6F8",
  "gray:100": "#EDEFF2",
  "gray:200": "#DDE0E8",
  "gray:300": "#C8CDD9",
  "gray:400": "#B1B7C8",
  "gray:500": "#9EA2B8",
  "gray:600": "#878AA4",
  "gray:700": "#73748F",
  "gray:800": "#5F6174",
  "gray:900": "#50525F",
  "gray:950": "#2F3037",

  // Orange
  "orange:50": "#FFFBEB",
  "orange:100": "#FFD6C7",
  "orange:200": "#FFBBA3",
  "orange:300": "#FFA07E",
  "orange:400": "#FF8559",
  "orange:500": "#FF6B35",
  "orange:600": "#D1582C",
  "orange:700": "#A34522",
  "orange:800": "#743119",
  "orange:900": "#461E0F",
  "orange:950": "#402108",

  // Green
  "green:50": "#ECFDF5",
  "green:100": "#D1FAE5",
  "green:200": "#A7F3D0",
  "green:300": "#6EE7B7",
  "green:400": "#34D399",
  "green:500": "#10B981",
  "green:600": "#059669",
  "green:700": "#047857",
  "green:800": "#065F46",
  "green:900": "#064E3B",
  "green:950": "#082B12",

  // Red
  "red:50": "#FFF1F2",
  "red:100": "#FFE4E6",
  "red:200": "#FECDD3",
  "red:300": "#FDA4AF",
  "red:400": "#FB7185",
  "red:500": "#F43F5E",
  "red:600": "#E11D48",
  "red:700": "#BE123C",
  "red:800": "#9F1239",
  "red:900": "#881337",
  "red:950": "#471608",

  // brown
  "brown:50": "#F8F6F4",

  // desert
  "desert:50": "#FAF9F7",
  "desert:100": "#EFECE5",
  "desert:950": "#2C231E",

  // White
  "white": "#FFFFFF",

  // Brand colors
  "brand:purple": "#f8bb00",
  "brand:lightPurple": "#fff3d6",
  "brand:darkPurple": "#e69f00",
  "brand:green": "#63D77D",
  "brand:golden": "#F5D93A",
  "brand:cyan": "#95CBF3",
  "brand:coral": "#FB7C59",
  "brand:brown": "#DBB79B",
};

// The light theme, which is the only theme for now. These
// colors are meant to be used by components via useTheme(),
// so that the theme can be changed at runtime.

// Some notes about naming conventions:
// - "xContent" is the color used over a "x" background (text, icons or outlines).
// - "xHint" is the color used to hint that "x" is interactive (generally on hover).
// - "xActive" is the color used to indicate that "x" is being interacted with (generally on press).
// - "xSurface" is the color used for the surface of "x" (generally the background).
export const lightTheme = {
  name: "light" as const,
  colors: {
    accent: "yellow:500",
    accentActive: "yellow:600",
    accentContent: "yellow:950",
    accentHint: "yellow:400",
    background: "white",
    backgroundActive: "gray:50",
    border: "gray:200",
    borderSoft: "gray:100",
    content: "gray:950",
    contentAlt: "gray:600",
    contentAlt2: "gray:500",
    controlBorder: "yellow:200",
    controlBorderStrong: "yellow:800",
    controlSurface: "yellow:50",
    controlSurfaceAlt: "gray:200",
    hint: "brown:50",
    infoSurface: "desert:50",
    infoSurfaceBorder: "desert:100",
    infoSurfaceContent: "desert:950",
    dimmed: "gray:400",
    fieldBorder: "yellow:200",
    fieldBorderFocused: "yellow:400",
    fieldSurface: "yellow:50",
    focused: "yellow:500",
    focusedSurface: "yellow:100",
    focusedSurfaceActive: "yellow:200",
    strongSurface: "yellow:800",
    strongSurfaceContent: "yellow:950",
    strongSurfaceContentAlt: "gray:500",
    strongSurfaceContentAlt2: "gray:100",
    position: "#2E2E3D",
    positionContent: "white",
    positionContentAlt: "gray:500",
    interactive: "yellow:800",
    negative: "red:500",
    negativeStrong: "red:600",
    negativeActive: "red:600",
    negativeContent: "white",
    negativeHint: "red:400",
    negativeSurface: "red:50",
    negativeSurfaceBorder: "red:100",
    negativeSurfaceContent: "red:900",
    negativeSurfaceContentAlt: "red:400",
    negativeInfoSurface: "red:50",
    negativeInfoSurfaceBorder: "red:200",
    negativeInfoSurfaceContent: "red:950",
    negativeInfoSurfaceContentAlt: "gray:600",
    positive: "green:500",
    positiveAlt: "green:400",
    positiveActive: "green:600",
    positiveContent: "white",
    positiveHint: "green:400",
    secondary: "yellow:50",
    secondaryActive: "yellow:200",
    secondaryContent: "yellow:500",
    secondaryHint: "yellow:100",
    selected: "yellow:500",
    separator: "gray:50",
    surface: "white",
    tableBorder: "gray:100",
    warning: "orange:400",
    warningAlt: "orange:300",
    warningAltContent: "yellow:800",
    disabledBorder: "gray:200",
    disabledContent: "gray:500",
    disabledSurface: "gray:50",
    brandPurple: "brand:purple",
    brandPurpleContent: "yellow:950",
    brandPurpleContentAlt: "yellow:900",
    brandDarkPurple: "brand:darkPurple",
    brandDarkPurpleContent: "yellow:950",
    brandDarkPurpleContentAlt: "gray:50",
    brandLightPurple: "brand:lightPurple",
    brandGolden: "brand:golden",
    brandGoldenContent: "orange:950",
    brandGoldenContentAlt: "orange:800",
    brandGreen: "brand:green",
    brandGreenContent: "green:950",
    brandGreenContentAlt: "green:800",

    // colors are resolved so we can animate them
    riskGradient1: "#63D77D", // green:400
    riskGradient2: "#B8E549",
    riskGradient3: "#F1C91E", // yellow:400
    riskGradient4: "#FFA12B",
    riskGradient5: "#FB7C59", // red:400

    riskGradientDimmed1: "red:100",
    riskGradientDimmed2: "orange:100",
    riskGradientDimmed3: "green:100",

    loadingGradient1: "yellow:50",
    loadingGradient2: "yellow:100",
    loadingGradientContent: "yellow:400",

    // not used yet
    brandCyan: "brand:cyan",
    brandCoral: "brand:coral",
    brandBrown: "brand:brown",
  } satisfies Record<string, (keyof typeof colors) | `#${string}`>,
} as const;

export type ThemeDescriptor = {
  name: "light"; // will be "light" | "dark" once dark mode is added
  colors: typeof lightTheme.colors; // lightTheme acts as a reference for types
};
export type ThemeColorName = keyof ThemeDescriptor["colors"];

export function themeColor(theme: ThemeDescriptor, name: ThemeColorName) {
  const themeColor = theme.colors[name];

  if (themeColor.startsWith("#")) {
    return themeColor;
  }

  if (themeColor in colors) {
    return colors[themeColor as keyof typeof colors];
  }

  throw new Error(`Color ${themeColor} not found in theme`);
}

const ThemeContext = createContext({
  theme: lightTheme,
  setTheme: (_: ThemeDescriptor) => {},
});

export function useTheme() {
  const { theme, setTheme } = useContext(ThemeContext);
  return {
    color: (name: ThemeColorName) => themeColor(theme, name),
    setTheme,
    theme,
  };
}

export function Theme({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeDescriptor>(lightTheme);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
