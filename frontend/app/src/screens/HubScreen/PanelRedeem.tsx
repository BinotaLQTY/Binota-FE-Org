"use client";

import { Amount } from "@/src/comps/Amount/Amount";
import { FlowButton } from "@/src/comps/FlowButton/FlowButton";
import { DNUM_0 } from "@/src/dnum-utils";
import { RedeemProvider, useRedeem } from "@/src/services/Hub/RedeemProvider";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { HFlex, TokenIcon, VFlex } from "@binota/uikit";
import * as dn from "dnum";

export function PanelRedeem() {
  return (
    <RedeemProvider>
      <RedeemContent />
    </RedeemProvider>
  );
}

function RedeemContent() {
  const { address, isConnected } = useAccount();
  const {
    redeemAmount,
    lzBntBalance,
    isLoadingBalance,
    isConfigured,
    validation,
    setRedeemAmount,
    setMaxAmount,
  } = useRedeem();

  const handleAmountChange = (value: string) => {
    if (value === "" || value === "0") {
      setRedeemAmount(DNUM_0);
      return;
    }

    try {
      const parsed = dn.from(value, 18);
      setRedeemAmount(parsed);
    } catch {
      // Invalid input, ignore
    }
  };

  const canSubmit =
    isConnected &&
    isConfigured &&
    validation.isValid &&
    dn.gt(redeemAmount, DNUM_0);

  if (!isConfigured) {
    return (
      <VFlex gap={24}>
        <div
          className={css({
            width: "100%",
            padding: "24px",
            background: "fieldSurface",
            borderRadius: 0,
            border: "1px solid token(colors.fieldBorder)",
            textAlign: "center",
          })}
        >
          <VFlex gap={16}>
            <div className={css({ fontSize: 18, fontWeight: 500 })}>
              lzBNT Redemption Not Available
            </div>
            <div className={css({ color: "contentAlt" })}>
              The lzBNT redemption feature is not currently configured on this network.
            </div>
          </VFlex>
        </div>
      </VFlex>
    );
  }

  return (
    <VFlex gap={24}>
      <div
        className={css({
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          padding: "24px",
          background: "fieldSurface",
          borderRadius: 0,
          border: "1px solid token(colors.fieldBorder)",
        })}
      >
        <VFlex gap={20}>
          <div
            className={css({
              fontSize: 12,
              color: "contentAlt",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            })}
          >
            Redeem lzBNT
          </div>

          <div>
            <div
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              })}
            >
              <span
                className={css({
                  fontSize: 12,
                  color: "contentAlt",
                })}
              >
                Amount
              </span>
              <button
                type="button"
                onClick={setMaxAmount}
                className={css({
                  fontSize: 12,
                  color: "accent",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  _hover: {
                    textDecoration: "underline",
                  },
                })}
              >
                Balance:{" "}
                {isLoadingBalance ? (
                  "..."
                ) : lzBntBalance ? (
                  <Amount value={lzBntBalance} format="2z" />
                ) : (
                  "0"
                )}
              </button>
            </div>

            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "controlSurface",
                borderRadius: 0,
                border: "1px solid token(colors.fieldBorder)",
                minWidth: 0,
              })}
            >
              <input
                type="text"
                value={dn.eq(redeemAmount, DNUM_0) ? "" : dn.format(redeemAmount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={css({
                  flex: 1,
                  minWidth: 0,
                  width: 0,
                  background: "transparent",
                  border: "none",
                  fontSize: 24,
                  fontWeight: 500,
                  outline: "none",
                  _placeholder: {
                    color: "contentAlt",
                  },
                })}
              />
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "controlSurface",
                  borderRadius: 0,
                })}
              >
                <TokenIcon symbol="BINOTA" size={20} />
                <span className={css({ fontWeight: 500 })}>lzBNT</span>
              </div>
            </div>
          </div>
        </VFlex>
      </div>

      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          margin: "-12px 0",
        })}
      >
        <div
          className={css({
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "fieldSurface",
            border: "1px solid token(colors.fieldBorder)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          })}
        >
          ↓
        </div>
      </div>

      <div
        className={css({
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          padding: "16px",
          background: "fieldSurface",
          borderRadius: 0,
          border: "1px solid token(colors.fieldBorder)",
        })}
      >
        <VFlex gap={12}>
          <div
            className={css({
              fontSize: 12,
              color: "contentAlt",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            })}
          >
            Receive BNT
          </div>

          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 12,
            })}
          >
            <span className={css({ color: "contentAlt" })}>You will receive</span>
            <span className={css({ marginLeft: "auto", fontWeight: 500 })}>
              <Amount value={redeemAmount} format="2z" /> BNT
            </span>
          </div>
        </VFlex>
      </div>

      <div
        className={css({
          width: "100%",
          padding: "16px",
          background: "fieldSurface",
          borderRadius: 0,
        })}
      >
        <VFlex gap={12}>
          <HFlex justifyContent="space-between">
            <span className={css({ color: "contentAlt" })}>Exchange Rate</span>
            <span>1 lzBNT = 1 BNT</span>
          </HFlex>
          <HFlex justifyContent="space-between">
            <span className={css({ color: "contentAlt" })}>Fee</span>
            <span>None</span>
          </HFlex>
        </VFlex>
      </div>

      {validation.errorMessage && (
        <div
          className={css({
            width: "100%",
            padding: "12px 16px",
            background: "negative",
            color: "negativeContent",
            borderRadius: 0,
            fontSize: 14,
          })}
        >
          {validation.errorMessage}
        </div>
      )}

      <div className={css({ padding: "0 0 24px 0" })}>
        <FlowButton
          disabled={!canSubmit}
          label="Redeem lzBNT"
          request={
            canSubmit && address
              ? {
                  flowId: "redeemLzBnt",
                  backLink: ["/hub/redeem", "Back to Redeem"],
                  successLink: ["/hub/redeem", "Go to Redeem"],
                  successMessage:
                    "Your lzBNT has been redeemed successfully. You have received BNT tokens.",
                  amount: redeemAmount,
                }
              : undefined
          }
        />
      </div>

      <div
        className={css({
          width: "100%",
          padding: "16px",
          background: "surfaceAlt",
          borderRadius: 8,
          fontSize: 14,
          color: "contentAlt",
        })}
      >
        <VFlex gap={8}>
          <div className={css({ fontWeight: 500, color: "content" })}>
            About Redeem
          </div>
          <p>
            Convert your lzBNT (LayerZero wrapped BNT) tokens to native BNT tokens.
            The redemption is instant and at a 1:1 ratio with no fees.
          </p>
          <p>
            lzBNT tokens are typically received from cross-chain bridging or airdrop
            distributions on other networks.
          </p>
        </VFlex>
      </div>
    </VFlex>
  );
}
