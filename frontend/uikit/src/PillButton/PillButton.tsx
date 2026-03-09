"use client";

import type { ComponentPropsWithoutRef } from "react";

import { match } from "ts-pattern";
import { css } from "../../styled-system/css";
import { StatusDot } from "../StatusDot/StatusDot";

export function PillButton({
  label,
  warnLevel,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  label: string;
  warnLevel: "low" | "medium" | "high";
}) {
  return (
    <button
      {...props}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 24,
        padding: "0 12px",
        fontSize: 14,
        fontWeight: 500,
        color: "content",
        background: "controlSurface",
        border: "1px solid token(colors.controlBorder)",
        borderRadius: 0,
        // boxShadow: `
        //             0 24px 10px rgba(138, 0, 196, 0.01),
        //             0 14px 8px rgba(138, 0, 196, 0.05),
        //             0 6px 6px rgba(138, 0, 196, 0.08),
        //             0 2px 3px rgba(138, 0, 196, 0.1)
        //           `,
        cursor: "pointer",
        _focusVisible: {
          outline: "2px solid token(colors.focused)",
          outlineOffset: -1,
        },
        _active: {
          translate: "0 1px",
          background: "token(colors.focusedSurface)",
          border: "1px solid token(colors.focusedSurfaceActive)",
        },
      })}
    >
      <StatusDot
        mode={match(warnLevel)
          .with("low", () => "positive" as const)
          .with("medium", () => "warning" as const)
          .with("high", () => "negative" as const)
          .exhaustive()}
      />
      <div>{label}</div>
    </button>
  );
}
