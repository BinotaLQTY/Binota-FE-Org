"use client";

import type { ReactNode } from "react";

import { createContext, useContext, useState } from "react";

// The Binota base color palette (Binance-inspired dark theme)
// to be used by themes rather than directly.
export const colors = {
  // Yellow/Gold (Binance brand)
  "yellow:50": "#FEF9E7",
  "yellow:100": "#FDF0C4",
  "yellow:200": "#FBE49D",
  "yellow:300": "#F9D776",
  "yellow:400": "#F7CA4F",
  "yellow:500": "#F0B90B", // Primary Binance yellow
  "yellow:600": "#D9A70A",
  "yellow:700": "#B38A08",
  "yellow:800": "#8C6C06",
  "yellow:900": "#664F05",
  "yellow:950": "#3D2F03",

  // Dark grays (for dark mode surfaces)
  "gray:50": "#F5F5F5",
  "gray:100": "#EAECEF",
  "gray:200": "#C4C5CB", // Inactive/muted text
  "gray:300": "#A6A9B1",
  "gray:400": "#848E9C",
  "gray:500": "#6A7078",
  "gray:600": "#4E5460",
  "gray:700": "#2B3139",
  "gray:800": "#1E2329",
  "gray:900": "#14151A", // Main background (Binance dark)
  "gray:950": "#0B0E11", // Darkest black (Binance)

  // Orange (for warnings)
  "orange:50": "#FFF8F0",
  "orange:100": "#FFE8D4",
  "orange:200": "#FFD4AD",
  "orange:300": "#FFBE80",
  "orange:400": "#FFA54D",
  "orange:500": "#FF8C1A",
  "orange:600": "#E67300",
  "orange:700": "#B35900",
  "orange:800": "#804000",
  "orange:900": "#4D2600",
  "orange:950": "#331A00",

  // Green (for positive states)
  "green:50": "#E8F7EF",
  "green:100": "#C5EBDA",
  "green:200": "#9EDFC2",
  "green:300": "#6DD3A7",
  "green:400": "#3DC68C",
  "green:500": "#0ECB81", // Binance green
  "green:600": "#0CB072",
  "green:700": "#0A8F5D",
  "green:800": "#086E48",
  "green:900": "#054D33",
  "green:950": "#032B1D",

  // Red (for negative states)
  "red:50": "#FEF1F1",
  "red:100": "#FDDEDE",
  "red:200": "#FAB8B8",
  "red:300": "#F68E8E",
  "red:400": "#F26464",
  "red:500": "#F6465D", // Binance red
  "red:600": "#D93651",
  "red:700": "#B32842",
  "red:800": "#8C1E33",
  "red:900": "#661625",
  "red:950": "#400E17",

  // Blue (for info states)
  "blue:50": "#EBF5FF",
  "blue:100": "#D6EBFF",
  "blue:200": "#ADD6FF",
  "blue:300": "#85C2FF",
  "blue:400": "#5CADFF",
  "blue:500": "#1E9FF2",
  "blue:600": "#1A8AD4",
  "blue:700": "#1575B6",
  "blue:800": "#106098",
  "blue:900": "#0B4A7A",
  "blue:950": "#07355C",

  // Surface colors (dark mode specific)
  "surface:50": "#2B3139",
  "surface:100": "#252930",
  "surface:200": "#1E2329",
  "surface:300": "#181C21",
  "surface:400": "#14151A",
  "surface:500": "#0B0E11",

  // White
  "white": "#FFFFFF",

  // Brand colors (primary)
  "brand:yellow": "#F0B90B",
  "brand:lightYellow": "#FDF0C4",
  "brand:darkYellow": "#B38A08",
  "brand:green": "#0ECB81",
  "brand:red": "#F6465D",
  "brand:cyan": "#1E9FF2",
  "brand:blue": "#1E9FF2",
  "brand:darkBlue": "#1575B6",

  // Legacy brand color aliases (for backward compatibility)
  "brand:purple": "#F0B90B",
  "brand:lightPurple": "#FDF0C4",
  "brand:darkPurple": "#B38A08",
  "brand:golden": "#F0B90B",
  "brand:coral": "#F6465D",
  "brand:brown": "#8C6C06",
};

// Dark theme (Binance-inspired). This is the only theme.
// Colors are meant to be used by components via useTheme().

// Some notes about naming conventions:
// - "xContent" is the color used over a "x" background (text, icons or outlines).
// - "xHint" is the color used to hint that "x" is interactive (generally on hover).
// - "xActive" is the color used to indicate that "x" is being interacted with (generally on press).
// - "xSurface" is the color used for the surface of "x" (generally the background).
export const darkTheme = {
  name: "dark" as const,
  colors: {
    // Primary accent (Binance yellow)
    accent: "yellow:500",
    accentActive: "yellow:600",
    accentContent: "gray:950", // Dark text on yellow
    accentHint: "yellow:400",

    // Backgrounds
    background: "gray:900", // #14151A - main dark background
    backgroundActive: "gray:800",
    surface: "gray:800", // Cards and panels
    surfaceAlt: "gray:700", // Elevated surfaces

    // Borders
    border: "gray:700",
    borderSoft: "gray:800",

    // Content/Text
    content: "white", // Primary text
    contentAlt: "gray:200", // #C4C5CB - secondary/inactive text
    contentAlt2: "gray:400", // Muted text
    dimmed: "gray:500",

    // Controls (buttons, inputs)
    controlBorder: "yellow:500",
    controlBorderStrong: "yellow:500",
    controlSurface: "gray:800",
    controlSurfaceAlt: "gray:700",

    // Info surfaces
    hint: "gray:800",
    infoSurface: "gray:800",
    infoSurfaceBorder: "gray:700",
    infoSurfaceContent: "gray:100",

    // Fields (inputs)
    fieldBorder: "gray:700",
    fieldBorderFocused: "yellow:500",
    fieldSurface: "gray:800",

    // Focus states
    focused: "yellow:500",
    focusedSurface: "gray:700",
    focusedSurfaceActive: "gray:600",

    // Strong/highlighted surfaces
    strongSurface: "yellow:500",
    strongSurfaceContent: "gray:950",
    strongSurfaceContentAlt: "gray:800",
    strongSurfaceContentAlt2: "gray:700",

    // Position cards
    position: "gray:800",
    positionContent: "white",
    positionContentAlt: "gray:200",

    // Interactive elements
    interactive: "yellow:500",
    selected: "yellow:500",

    // Negative/Error states (Binance red)
    negative: "red:500",
    negativeStrong: "red:600",
    negativeActive: "red:600",
    negativeContent: "white",
    negativeHint: "red:400",
    negativeSurface: "red:950",
    negativeSurfaceBorder: "red:800",
    negativeSurfaceContent: "red:200",
    negativeSurfaceContentAlt: "red:400",
    negativeInfoSurface: "red:950",
    negativeInfoSurfaceBorder: "red:800",
    negativeInfoSurfaceContent: "red:100",
    negativeInfoSurfaceContentAlt: "gray:200",

    // Positive states (Binance green)
    positive: "green:500",
    positiveAlt: "green:400",
    positiveActive: "green:600",
    positiveContent: "white",
    positiveHint: "green:400",

    // Secondary actions
    secondary: "gray:800",
    secondaryActive: "gray:700",
    secondaryContent: "gray:200",
    secondaryHint: "gray:700",

    // Misc
    separator: "gray:800",
    tableBorder: "gray:700",

    // Warning states
    warning: "orange:500",
    warningAlt: "orange:400",
    warningAltContent: "gray:950",

    // Disabled states
    disabledBorder: "gray:700",
    disabledContent: "gray:500",
    disabledSurface: "gray:800",

    // Brand colors
    brandYellow: "brand:yellow",
    brandYellowContent: "gray:950",
    brandYellowContentAlt: "gray:900",
    brandDarkYellow: "brand:darkYellow",
    brandDarkYellowContent: "gray:950",
    brandDarkYellowContentAlt: "gray:100",
    brandLightYellow: "brand:lightYellow",
    brandGreen: "brand:green",
    brandGreenContent: "gray:950",
    brandGreenContentAlt: "gray:900",
    brandRed: "brand:red",
    brandRedContent: "white",
    brandRedContentAlt: "gray:100",

    // Risk gradient colors (resolved for animations)
    riskGradient1: "#0ECB81", // green
    riskGradient2: "#7ED957",
    riskGradient3: "#F0B90B", // yellow
    riskGradient4: "#FF8C1A",
    riskGradient5: "#F6465D", // red

    riskGradientDimmed1: "red:900",
    riskGradientDimmed2: "orange:900",
    riskGradientDimmed3: "green:900",

    // Loading gradient
    loadingGradient1: "gray:800",
    loadingGradient2: "gray:700",
    loadingGradientContent: "yellow:500",

    // Additional brand colors
    brandCyan: "brand:cyan",
    brandBlue: "brand:blue",
    brandDarkBlue: "brand:darkBlue",

    // Legacy brand color aliases (backward compatibility)
    // These map the old "purple" naming to the new "yellow" colors
    brandPurple: "brand:purple",
    brandPurpleContent: "gray:950",
    brandPurpleContentAlt: "gray:900",
    brandDarkPurple: "brand:darkPurple",
    brandDarkPurpleContent: "gray:950",
    brandDarkPurpleContentAlt: "gray:100",
    brandLightPurple: "brand:lightPurple",
    brandGolden: "brand:golden",
    brandGoldenContent: "gray:950",
    brandGoldenContentAlt: "gray:900",
    brandCoral: "brand:coral",
    brandBrown: "brand:brown",
  } satisfies Record<string, (keyof typeof colors) | `#${string}`>,
} as const;

export type ThemeDescriptor = {
  name: "dark";
  colors: typeof darkTheme.colors;
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
  theme: darkTheme,
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
  const [theme, setTheme] = useState<ThemeDescriptor>(darkTheme);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
