"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { match, P } from "ts-pattern";
import { css, cx } from "../../styled-system/css";
import { useTheme } from "../Theme/Theme";

export type ButtonProps = {
  label: ReactNode;
  maxWidth?: number;
  mode?: "primary" | "secondary" | "tertiary" | "positive" | "negative";
  shape?: "rounded" | "rectangular";
  size?: "mini" | "small" | "medium" | "large";
  wide?: boolean;
};

export function Button({
  className,
  label,
  maxWidth,
  mode = "secondary",
  shape = "rectangular",
  size = "medium",
  style,
  wide,
  ...props
}: ComponentPropsWithoutRef<"button"> & ButtonProps) {
  const buttonStyles = useButtonStyles({ mode, shape, size });
  return (
    <button
      className={cx(buttonStyles.className, className)}
      style={{
        maxWidth,
        width: wide ? "100%" : undefined,
        ...buttonStyles.styles,
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          // prevents a jump due to the border when the button gets disabled
          padding: props.disabled ? 0 : "0 1px",
          textTransform: "uppercase",
          letterSpacing: 0.55,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function useButtonStyles({
  mode = "secondary",
  size = "medium",
}: {
  mode: ButtonProps["mode"];
  size: ButtonProps["size"];
  shape: ButtonProps["shape"];
}) {
  const { color } = useTheme();

  const geometry = match(size)
    .with("mini", () => ({
      height: 24,
      padding: "0 16px",
      fontSize: 12,
      borderRad8ius: 0,
    }))
    .with("small", () => ({
      height: 28,
      padding: "0 28px",
      fontSize: 12,
      borderRadius: 0,
    }))
    .with("medium", () => ({
      height: 36,
      padding: "0 40px",
      fontSize: 15,
      borderRadius: 0,
    }))
    .with("large", () => ({
      height: 48,
      padding: "0 56px",
      fontSize: 17,
      borderRadius: 0,
    }))
    .exhaustive();

  const colors = match(mode)
    .with("primary", () => ({
      // boxShadow: `
      //               0 21px 21px rgba(138, 0, 196, 0.13),
      //               0 13px 8px rgba(138, 0, 196, 0.13),
      //               0 5px 5px rgba(138, 0, 196, 0.34),
      //               0 2px 3px rgba(138, 0, 196, 0.21)
      //             `,
      "--color": color("accentContent"),
      "--background": color("accent"),
      // "--backgroundHover": color("accentHint"),
      "--backgroundHover": color("accent"),
      "--backgroundPressed": color("accentActive"),
    }))
    .with(P.union("secondary", "tertiary"), (mode) => ({
      "--color": color("secondaryContent"),
      "--background": mode === "secondary" ? color("secondary") : "transparent",
      "--backgroundHover": color("secondaryHint"),
      "--backgroundPressed": color("secondaryActive"),
    }))
    .with("negative", () => ({
      "--color": color("negativeContent"),
      "--background": color("negative"),
      "--backgroundHover": color("negativeHint"),
      "--backgroundPressed": color("negativeActive"),
    }))
    .with("positive", () => ({
      "--color": color("positiveContent"),
      "--background": color("positive"),
      "--backgroundHover": color("positiveHint"),
      "--backgroundPressed": color("positiveActive"),
    }))
    .exhaustive();

  const className = css({
    // boxShadow: `
    // 0 24px 10px rgba(138, 0, 196, 0.01),
    // 0 14px 8px rgba(138, 0, 196, 0.05),
    // 0 6px 6px rgba(138, 0, 196, 0.08),
    // 0 2px 3px rgba(138, 0, 196, 0.1)
    //               `,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "background 50ms",
    color: "var(--color)",
    textDecoration: "none",
    background: {
      base: "var(--background)",
      _hover: "var(--backgroundHover)",
      _active: "var(--backgroundPressed)",
    },
    _active: {
      _enabled: {
        translate: "0 1px",
      },
    },
    _focusVisible: {
      outline: "2px solid token(colors.focused)",
    },
    _disabled: {
      color: "disabledContent",
      background: {
        base: "disabledSurface",
        _hover: "disabledSurface",
        _active: "disabledSurface",
      },
      cursor: "not-allowed",
      border: "1px solid token(colors.disabledBorder)",
    },
  });

  return {
    className,
    styles: {
      ...geometry,
      ...colors,

      // primary mode background === focus ring color
      outlineOffset: mode === "primary" ? 2 : 0,
    },
  };
}
