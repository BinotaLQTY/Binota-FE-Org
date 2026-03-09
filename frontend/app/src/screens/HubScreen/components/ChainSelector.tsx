"use client";

import {
  HUB_CHAIN_ICONS,
  HUB_CHAIN_NAMES,
  type HubChainId,
} from "@/src/hub-utils";
import { css } from "@/styled-system/css";
import { IconChevronDown } from "@binota/uikit";
import Image from "next/image";
import { useRef, useState } from "react";

type ChainSelectorProps = {
  value: HubChainId | null;
  options: HubChainId[];
  onChange: (chainId: HubChainId) => void;
  label?: string;
  disabled?: boolean;
};

export function ChainSelector({
  value,
  options,
  onChange,
  label,
  disabled = false,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (chainId: HubChainId) => {
    onChange(chainId);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={css({
        position: "relative",
        width: "100%",
      })}
      onBlur={handleBlur}
    >
      {label && (
        <div
          className={css({
            fontSize: 12,
            color: "contentAlt",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          })}
        >
          {label}
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "fieldSurface",
          border: "1px solid token(colors.fieldBorder)",
          borderRadius: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 0.15s, background 0.15s",
          _hover: {
            borderColor: disabled ? "fieldBorder" : "content",
          },
          _focusVisible: {
            outline: "2px solid token(colors.accent)",
            outlineOffset: 2,
          },
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 12,
          })}
        >
          {value && (
            <ChainIcon chainId={value} size={24} />
          )}
          <span className={css({ fontWeight: 500 })}>
            {value ? HUB_CHAIN_NAMES[value] : "Select chain"}
          </span>
        </div>
        <div
          className={css({
            transition: "transform 0.15s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            display: "flex",
            alignItems: "center",
          })}
        >
          <IconChevronDown size={20} />
        </div>
      </button>

      {isOpen && options.length > 0 && (
        <div
          className={css({
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "fieldSurface",
            border: "1px solid token(colors.fieldBorder)",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          })}
        >
          {options.map((chainId) => (
            <button
              key={chainId}
              type="button"
              onClick={() => handleSelect(chainId)}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "12px 16px",
                background: chainId === value ? "controlSurface" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
                _hover: {
                  background: "controlSurface",
                },
              })}
            >
              <ChainIcon chainId={chainId} size={24} />
              <span>{HUB_CHAIN_NAMES[chainId]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChainIcon({
  chainId,
  size = 24,
}: {
  chainId: HubChainId;
  size?: number;
}) {
  return (
    <Image
      src={HUB_CHAIN_ICONS[chainId]}
      alt={HUB_CHAIN_NAMES[chainId]}
      width={size}
      height={size}
    />
  );
}
