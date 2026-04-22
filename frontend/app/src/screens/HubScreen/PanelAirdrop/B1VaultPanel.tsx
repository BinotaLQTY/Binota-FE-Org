"use client";

import { Amount } from "@/src/comps/Amount/Amount";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import { useB1Vault } from "@/src/services/Airdrop";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { Button, HFlex, Tabs, TextInput, VFlex } from "@binota/uikit";

export function B1VaultPanel() {
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
    b1Balance,
    stakedB1,
    isLoading,
    setMaxAmount,
  } = useB1Vault();

  const handleSubmit = () => {
    if (!isValidAmount || !parsedAmount || !address) return;

    txFlow.start({
      flowId: "b1VaultDeposit",
      backLink: ["/hub/airdrop", "Back to Airdrop"],
      successLink: ["/hub/airdrop", "Back to Airdrop"],
      successMessage: mode === "deposit"
        ? "Successfully staked B1!"
        : "Successfully unstaked B1!",
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
        Connect your wallet to stake B1
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
        B1 Staking Vault
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
            borderRadius: 0,
          })}
        >
          <div className={css({ fontSize: 12, color: "contentAlt", marginBottom: 4 })}>
            Available B1
          </div>
          <div className={css({ fontSize: 20, fontWeight: 500 })}>
            {b1Balance ? <Amount value={b1Balance} format="compact" /> : "0"}
          </div>
        </div>
        <div
          className={css({
            padding: "16px",
            background: "fieldSurface",
            borderRadius: 0,
          })}
        >
          <div className={css({ fontSize: 12, color: "contentAlt", marginBottom: 4 })}>
            Staked B1
          </div>
          <div className={css({ fontSize: 20, fontWeight: 500, color: "accent" })}>
            {stakedB1 ? <Amount value={stakedB1} format="compact" /> : "0"}
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
        label={mode === "deposit" ? "Stake B1" : "Unstake B1"}
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
          ? "Staking B1 boosts your airdrop allocation. Your staked tokens remain locked until you unstake."
          : "Unstaking B1 will reduce your airdrop allocation boost."}
      </div>
    </VFlex>
  );
}
