"use client";

import { Amount } from "@/src/comps/Amount/Amount";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import { DNUM_0 } from "@/src/dnum-utils";
import { ChainSelector } from "@/src/screens/HubScreen/components/ChainSelector";
import { useBridge } from "@/src/services/Hub/BridgeProvider";
import { css } from "@/styled-system/css";
import {
  HFlex,
  TokenIcon,
  VFlex,
} from "@binota/uikit";
import * as dn from "dnum";

export function BridgeForm() {
  const {
    amount,
    sourceChainId,
    destinationChainId,
    b1Balance,
    isLoadingBalance,
    fee,
    isLoadingFee,
    feeAsset,
    availableSources,
    availableDestinations,
    errorMessage,
    setAmount,
    setSourceChainId,
    setDestinationChainId,
    setMaxAmount,
  } = useBridge();

  const handleAmountChange = (value: string) => {
    if (value === "" || value === "0") {
      setAmount(DNUM_0);
      return;
    }

    try {
      const parsed = dn.from(value, 18);
      setAmount(parsed);
    } catch {
      // Invalid input, ignore
    }
  };

  return (
    <VFlex gap={24}>
      <div
        className={css({
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
            From
          </div>

          <ChainSelector
            value={sourceChainId}
            options={availableSources}
            onChange={setSourceChainId}
            label="Source Chain"
          />

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
                ) : b1Balance ? (
                  <Amount value={b1Balance} format="2z" />
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
              })}
            >
              <input
                type="text"
                value={dn.eq(amount, DNUM_0) ? "" : dn.format(amount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={css({
                  flex: 1,
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
                <TokenIcon symbol="B1" size={20} />
                <span className={css({ fontWeight: 500 })}>B1</span>
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
            To
          </div>

          <ChainSelector
            value={destinationChainId}
            options={availableDestinations}
            onChange={setDestinationChainId}
            label="Destination Chain"
          />

          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "controlSurface",
              borderRadius: 0,
            })}
          >
            <span className={css({ color: "contentAlt" })}>You will receive</span>
            <span className={css({ marginLeft: "auto", fontWeight: 500 })}>
              <Amount value={amount} format="2z" /> B1
            </span>
          </div>
        </VFlex>
      </div>

      <div
        className={css({
          padding: "16px",
          background: "fieldSurface",
          borderRadius: 0,
        })}
      >
        <VFlex gap={12}>
          <HFlex justifyContent="space-between">
            <span className={css({ color: "contentAlt" })}>Bridge Fee</span>
            <span>
              {isLoadingFee ? (
                <Spinner size={16} />
              ) : fee ? (
                <>
                  <Amount value={fee} format="4z" /> {feeAsset}
                </>
              ) : (
                "—"
              )}
            </span>
          </HFlex>
          <HFlex justifyContent="space-between">
            <span className={css({ color: "contentAlt" })}>Est. Time</span>
            <span>~2-5 minutes</span>
          </HFlex>
        </VFlex>
      </div>

      {errorMessage && (
        <div
          className={css({
            padding: "12px 16px",
            background: "negative",
            color: "negativeContent",
            borderRadius: 0,
            fontSize: 14,
          })}
        >
          {errorMessage}
        </div>
      )}
    </VFlex>
  );
}
