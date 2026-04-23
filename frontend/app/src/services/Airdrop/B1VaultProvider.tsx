"use client";

import type { ReactNode } from "react";
import type { Dnum } from "@/src/types";
import type { B1VaultContextValue } from "./types";

import { useB1VaultData } from "@/src/airdrop-utils";
import { useAccount } from "@/src/wagmi-utils";
import * as dn from "dnum";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const B1VaultContext = createContext<B1VaultContextValue | null>(null);

export function useB1Vault(): B1VaultContextValue {
  const context = useContext(B1VaultContext);
  if (!context) {
    throw new Error("useB1Vault must be used within a B1VaultProvider");
  }
  return context;
}

export function B1VaultProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const vaultDataQuery = useB1VaultData(address ?? null);

  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [inputValue, setInputValue] = useState("");

  // Parse the input value to Dnum
  const parsedAmount = useMemo((): Dnum | null => {
    if (!inputValue || inputValue.trim() === "") {
      return null;
    }
    try {
      const parsed = dn.from(inputValue, 18);
      if (dn.lt(parsed, 0)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }, [inputValue]);

  // Get balances from vault data
  const b1Balance = vaultDataQuery.data?.b1Balance ?? null;
  const stakedB1 = vaultDataQuery.data?.stakedB1 ?? null;

  // Calculate max amounts
  const maxDeposit = b1Balance;
  const maxWithdraw = stakedB1;

  // Validation
  const { isValidAmount, validationError } = useMemo(() => {
    if (!parsedAmount) {
      return { isValidAmount: false, validationError: null };
    }

    if (dn.eq(parsedAmount, 0)) {
      return { isValidAmount: false, validationError: "Amount must be greater than 0" };
    }

    if (mode === "deposit") {
      if (!b1Balance) {
        return { isValidAmount: false, validationError: "Unable to load B1 balance" };
      }
      if (dn.gt(parsedAmount, b1Balance)) {
        return { isValidAmount: false, validationError: "Insufficient B1 balance" };
      }
    } else {
      if (!stakedB1) {
        return { isValidAmount: false, validationError: "Unable to load staked B1" };
      }
      if (dn.gt(parsedAmount, stakedB1)) {
        return { isValidAmount: false, validationError: "Insufficient staked B1" };
      }
    }

    return { isValidAmount: true, validationError: null };
  }, [parsedAmount, mode, b1Balance, stakedB1]);

  // Set max amount based on mode
  const setMaxAmount = useCallback(() => {
    const max = mode === "deposit" ? maxDeposit : maxWithdraw;
    if (max) {
      setInputValue(dn.format(max, { digits: 18, trailingZeros: false }));
    }
  }, [mode, maxDeposit, maxWithdraw]);

  // Clear input
  const clearInput = useCallback(() => {
    setInputValue("");
  }, []);

  const value: B1VaultContextValue = {
    mode,
    setMode,
    inputValue,
    setInputValue,
    parsedAmount,
    isValidAmount,
    validationError,
    b1Balance,
    stakedB1,
    maxDeposit,
    maxWithdraw,
    isLoading: vaultDataQuery.isLoading,
    setMaxAmount,
    clearInput,
  };

  return (
    <B1VaultContext.Provider value={value}>{children}</B1VaultContext.Provider>
  );
}
