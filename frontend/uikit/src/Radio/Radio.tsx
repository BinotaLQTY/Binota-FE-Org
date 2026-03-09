"use client";

import type { CSSProperties } from "react";

import { a, useTransition } from "@react-spring/web";
import { useEffect, useRef } from "react";
import { css, cx } from "../../styled-system/css";
import { useTheme } from "../Theme/Theme";
import { useRadioGroup } from "./RadioGroup";

export function Radio({
  appearance = "radio",
  checked: checkedProp,
  disabled,
  id,
  index,
  onChange,
  tabIndex,
}: {
  appearance?: "radio" | "checkbox";
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  index?: number;
  onChange?: (checked: boolean) => void;
  tabIndex?: number;
}) {
  const input = useRef<null | HTMLButtonElement>(null);
  const radioGroup = useRadioGroup(index);
  const inRadioGroup = radioGroup !== null;
  const checked =
    checkedProp ?? (inRadioGroup && index === radioGroup.selected);
  const { color } = useTheme();

  if (!onChange) {
    if (!inRadioGroup || index === undefined) {
      throw new Error(
        "Radio requires an onChange handler or to be in a RadioGroup with the index prop being set."
      );
    }
    onChange = (checked) => {
      if (checked) radioGroup.select(index);
    };
  }

  const handleClick = () => {
    if (onChange && !disabled) {
      onChange(!checked);
    }
  };

  const firstRender = useRef(true);
  useEffect(() => {
    if (checked && inRadioGroup && !firstRender.current) {
      input.current?.focus();
    }
    firstRender.current = false;
  }, [checked, inRadioGroup]);

  const checkTransition = useTransition(checked, {
    config: {
      mass: 1,
      tension: 2400,
      friction: 100,
    },
    initial: {
      tickColor: color(disabled ? "disabledBorder" : "controlSurface"),
      ringColor: color("accent"),
      tickProgress: 0,
    },
    from: {
      tickColor: color(disabled ? "disabledBorder" : "controlSurface"),
      ringColor: color("accent"),
      tickProgress: 1,
    },
    enter: {
      tickProgress: 0,
    },
    leave: {
      tickColor: color(disabled ? "disabledBorder" : "controlSurface"),
      ringColor: color("controlBorder"),
      tickProgress: 1,
    },
  });

  return (
    <button
      ref={input}
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={radioGroup?.onKeyDown}
      tabIndex={
        tabIndex ??
        (radioGroup &&
        (radioGroup.focusableIndex === undefined ||
          index === radioGroup.focusableIndex)
          ? 0
          : -1)
      }
      className={cx(
        "group",
        css({
          position: "relative",
          display: "inline-block",
          width: 24,
          height: 24,
          outline: 0,
          cursor: "pointer",
          // boxShadow: `
          //           0 24px 10px rgba(138, 0, 196, 0.01),
          //           0 14px 8px rgba(138, 0, 196, 0.05),
          //           0 6px 6px rgba(138, 0, 196, 0.09),
          //           0 2px 3px rgba(138, 0, 196, 0.1)
          //         `,
        })
      )}
    >
      <div
        className={css({
          position: "absolute",
          inset: 0,
          background: "controlSurface",
          border: "1px solid token(colors.controlBorder)",
          _groupActive: {
            borderColor: "accentActive",
          },
          _groupDisabled: {
            background: "disabledSurface",
            borderColor: "disabledBorder!",
          },
        })}
        style={{
          borderRadius: 0,
        }}
      />
      <div
        // focus ring
        className={css({
          display: "none",
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "background",
          outline: "2px solid token(colors.focused)",
          _groupFocusVisible: {
            display: "block",
          },
        })}
        style={{
          borderRadius: 0,
          outlineOffset: appearance === "radio" ? 3 : 2,
        }}
      />
      {checkTransition(
        (style, checked) =>
          checked &&
          (appearance === "radio" ? (
            <a.div
              className={css({
                position: "absolute",
                inset: 0,
                background: "var(--ringColor)",
                borderRadius: 0,
                _groupActive: {
                  background: "accentActive",
                  "& > div": {
                    transform: "scale(0.9)",
                  },
                },
                _groupDisabled: {
                  background: "disabledSurface!",
                  border: "1px solid token(colors.disabledBorder)!",
                  "& > div": {
                    transform: "scale(1)!",
                  },
                },
              })}
              style={
                {
                  "--ringColor": style.ringColor,
                } as CSSProperties
              }
            >
              <div
                className={css({
                  position: "absolute",
                  inset: 0,
                })}
              >
                <a.div
                  className={css({
                    position: "absolute",
                    inset: 0,
                  })}
                  style={{
                    background: style.tickColor,
                    scale: style.tickProgress.to(
                      [0, 1],
                      [
                        0.4, // 8px
                        0.9, // 18px
                      ]
                    ),
                    borderRadius: "0",
                  }}
                />
              </div>
            </a.div>
          ) : (
            <a.div
              className={css({
                position: "absolute",
                inset: 0,
                background: "var(--ringColor)",
                borderRadius: 0,
                _groupActive: {
                  background: "accentActive",
                  "& > div": {
                    transform: "scale(0.9)",
                  },
                },
                _groupDisabled: {
                  background: "disabledSurface!",
                  border: "1px solid token(colors.disabledBorder)!",
                  "& > div": {
                    transform: "scale(1)!",
                  },
                },
              })}
              style={{
                ...({
                  "--ringColor": style.ringColor,
                } as CSSProperties),

                opacity: style.tickProgress.to([0, 1], [1, 0]),
              }}
            >
              <div
                className={css({
                  position: "absolute",
                  inset: 0,
                })}
              >
                <a.div
                  className={css({
                    position: "absolute",
                    inset: 0,
                  })}
                  style={{
                    color: style.tickColor,
                    opacity: style.tickProgress.to([0, 1], [1, 0]),
                    scale: style.tickProgress.to([0, 1], [1, 0]),
                  }}
                >
                  <Tick />
                </a.div>
              </div>
            </a.div>
          ))
      )}
    </button>
  );
}

function Tick() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        fill="currentColor"
        fillRule="evenodd"
        d="m18.5 6.676-8.263 12.12-5.02-4.392 1.58-1.806 2.982 2.607 6.737-9.881 1.984 1.352Z"
      />
    </svg>
  );
}
