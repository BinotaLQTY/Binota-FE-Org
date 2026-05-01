import type { ReactNode } from "react";

import { useBreakpointName } from "@/src/breakpoints";
import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { jsonStringifyWithDnum } from "@/src/dnum-utils";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { css } from "@/styled-system/css";
import { Button } from "@binota/uikit";

type FlowRequest = Parameters<
  ReturnType<typeof useTransactionFlow>["start"]
>[0];

type FlowRequestParam = FlowRequest | null | undefined;

export function FlowButton({
  disabled,
  footnote,
  label,
  request,
  size = "large",
}: {
  disabled?: boolean;
  footnote?: ReactNode;
  label?: string;
  request?: (() => FlowRequestParam) | FlowRequestParam;
  size?: "medium" | "large" | "small" | "mini";
}) {
  const txFlow = useTransactionFlow();
  const breakpointName = useBreakpointName();
  return (
    <>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 48,
        })}
      >
        <ConnectWarningBox />
        <Button
          className="flow-button"
          disabled={disabled || !request}
          label={label ?? "Next: Summary"}
          mode="primary"
          size={
            size === "large" && breakpointName === "small" ? "medium" : size
          }
          wide
          style={
            size === "large"
              ? {
                  height: breakpointName === "small" ? 56 : 72,
                  fontSize: breakpointName === "small" ? 20 : 24,
                  // borderRadius: breakpointName === "small" ? 56 : 120,
                }
              : {}
          }
          onClick={() => {
            // Debug logging for ICRBelowMCR investigation
            console.log("[FlowButton] onClick - request before eval:", request);
            console.log("[FlowButton] onClick - request type:", typeof request);

            if (typeof request === "function") {
              request = request();
              console.log("[FlowButton] onClick - request after function call:", request);
            }

            if (request) {
              console.log("[FlowButton] onClick - final request:", jsonStringifyWithDnum(request));
              if ("boldAmount" in request && request.boldAmount) {
                const boldAmount = request.boldAmount as [bigint, number];
                console.log("[FlowButton] onClick - boldAmount[0]:", boldAmount[0]?.toString());
              }
              txFlow.start(request);
            }
          }}
        />
      </div>
      {footnote && (
        <div
          className={css({
            fontSize: 14,
            textAlign: "center",
          })}
        >
          {footnote}
        </div>
      )}
    </>
  );
}
