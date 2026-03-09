"use client";

import type { ReactNode } from "react";
import type { Dnum } from "@/src/types";
import type { UnoVaultContextValue } from "./types";

import { useUnoVaultData } from "@/src/airdrop-utils";
import { useAccount } from "@/src/wagmi-utils";
import * as dn from "dnum";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const UnoVaultContext = createContext<UnoVaultContextValue | null>(null);

export function useUnoVault(): UnoVaultContextValue {
  const context = useContext(UnoVaultContext);
  if (!context) {
    throw new Error("useUnoVault must be used within a UnoVaultProvider");
  }
  return context;
}

export function UnoVaultProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const vaultDataQuery = useUnoVaultData(address ?? null);

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
  const unoBalance = vaultDataQuery.data?.unoBalance ?? null;
  const stakedUno = vaultDataQuery.data?.stakedUno ?? null;

  // Calculate max amounts
  const maxDeposit = unoBalance;
  const maxWithdraw = stakedUno;

  // Validation
  const { isValidAmount, validationError } = useMemo(() => {
    if (!parsedAmount) {
      return { isValidAmount: false, validationError: null };
    }

    if (dn.eq(parsedAmount, 0)) {
      return { isValidAmount: false, validationError: "Amount must be greater than 0" };
    }

    if (mode === "deposit") {
      if (!unoBalance) {
        return { isValidAmount: false, validationError: "Unable to load UNO balance" };
      }
      if (dn.gt(parsedAmount, unoBalance)) {
        return { isValidAmount: false, validationError: "Insufficient UNO balance" };
      }
    } else {
      if (!stakedUno) {
        return { isValidAmount: false, validationError: "Unable to load staked UNO" };
      }
      if (dn.gt(parsedAmount, stakedUno)) {
        return { isValidAmount: false, validationError: "Insufficient staked UNO" };
      }
    }

    return { isValidAmount: true, validationError: null };
  }, [parsedAmount, mode, unoBalance, stakedUno]);

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

  const value: UnoVaultContextValue = {
    mode,
    setMode,
    inputValue,
    setInputValue,
    parsedAmount,
    isValidAmount,
    validationError,
    unoBalance,
    stakedUno,
    maxDeposit,
    maxWithdraw,
    isLoading: vaultDataQuery.isLoading,
    setMaxAmount,
    clearInput,
  };

  return (
    <UnoVaultContext.Provider value={value}>{children}</UnoVaultContext.Provider>
  );
}
