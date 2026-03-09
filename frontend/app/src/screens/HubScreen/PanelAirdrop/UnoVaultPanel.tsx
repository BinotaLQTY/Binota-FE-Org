"use client";

import { Amount } from "@/src/comps/Amount/Amount";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import { useUnoVault } from "@/src/services/Airdrop";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { Button, HFlex, Tabs, TextInput, VFlex } from "@binota/uikit";

export function UnoVaultPanel() {
  const { isConnected, address } = useAccount();
  const txFlow = useTransactionFlow();
  const {
    mode,
    setMode,
    inputValue,
    setInputValue,
    parsedAmount,
    isValidAmount,
    validationError,
    unoBalance,
    stakedUno,
    isLoading,
    setMaxAmount,
  } = useUnoVault();

  const handleSubmit = () => {
    if (!isValidAmount || !parsedAmount || !address) return;

    txFlow.start({
      flowId: "unoVaultDeposit",
      backLink: ["/hub/airdrop", "Back to Airdrop"],
      successLink: ["/hub/airdrop", "Back to Airdrop"],
      successMessage: mode === "deposit"
        ? "Successfully staked UNO!"
        : "Successfully unstaked UNO!",
      amount: parsedAmount,
      mode,
    });
  };

  if (!isConnected) {
    return (
      <div
        className={css({
          padding: "48px 24px",
          textAlign: "center",
          color: "contentAlt",
        })}
      >
        Connect your wallet to stake UNO
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px",
        })}
      >
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <VFlex gap={24}>
      <div
        className={css({
          fontSize: 16,
          fontWeight: 600,
        })}
      >
        UNO Staking Vault
      </div>

      {/* Balance display */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        })}
      >
        <div
          className={css({
            padding: "16px",
            background: "fieldSurface",
            borderRadius: 8,
          })}
        >
          <div className={css({ fontSize: 12, color: "contentAlt", marginBottom: 4 })}>
            Available UNO
          </div>
          <div className={css({ fontSize: 20, fontWeight: 500 })}>
            {unoBalance ? <Amount value={unoBalance} format="compact" /> : "0"}
          </div>
        </div>
        <div
          className={css({
            padding: "16px",
            background: "fieldSurface",
            borderRadius: 8,
          })}
        >
          <div className={css({ fontSize: 12, color: "contentAlt", marginBottom: 4 })}>
            Staked UNO
          </div>
          <div className={css({ fontSize: 20, fontWeight: 500, color: "accent" })}>
            {stakedUno ? <Amount value={stakedUno} format="compact" /> : "0"}
          </div>
        </div>
      </div>

      {/* Tabs for deposit/withdraw */}
      <Tabs
        items={[
          { label: "Stake", panelId: "stake", tabId: "t-stake" },
          { label: "Unstake", panelId: "unstake", tabId: "t-unstake" },
        ]}
        selected={mode === "deposit" ? 0 : 1}
        onSelect={(index) => {
          setMode(index === 0 ? "deposit" : "withdraw");
          setInputValue("");
        }}
      />

      {/* Input field */}
      <VFlex gap={8}>
        <HFlex justifyContent="space-between" alignItems="center">
          <label
            className={css({
              fontSize: 14,
              fontWeight: 500,
            })}
          >
            {mode === "deposit" ? "Amount to stake" : "Amount to unstake"}
          </label>
          <button
            type="button"
            onClick={setMaxAmount}
            className={css({
              fontSize: 12,
              color: "accent",
              background: "none",
              border: "none",
              cursor: "pointer",
              _hover: {
                textDecoration: "underline",
              },
            })}
          >
            Max
          </button>
        </HFlex>

        <TextInput
          value={inputValue}
          onChange={setInputValue}
          placeholder="0.00"
        />

        {validationError && (
          <div
            className={css({
              fontSize: 13,
              color: "negative",
            })}
          >
            {validationError}
          </div>
        )}
      </VFlex>

      {/* Submit button */}
      <Button
        mode="primary"
        size="large"
        wide
        disabled={!isValidAmount}
        onClick={handleSubmit}
        label={mode === "deposit" ? "Stake UNO" : "Unstake UNO"}
      />

      {/* Info text */}
      <div
        className={css({
          fontSize: 13,
          color: "contentAlt",
          textAlign: "center",
          lineHeight: 1.5,
        })}
      >
        {mode === "deposit"
          ? "Staking UNO boosts your airdrop allocation. Your staked tokens remain locked until you unstake."
          : "Unstaking UNO will reduce your airdrop allocation boost."}
      </div>
    </VFlex>
  );
}
