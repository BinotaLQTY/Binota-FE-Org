"use client";

import type { Dnum } from "@/src/types";
import type { ReactNode } from "react";

import { dnum18, DNUM_0 } from "@/src/dnum-utils";
import { getLzBntContract, isLzBntConfigured } from "@/src/redeem-contracts";
import { useAccount } from "@/src/wagmi-utils";
import * as dn from "dnum";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useReadContract } from "wagmi";

type ValidationState = {
  isValid: boolean;
  errorMessage: string | null;
};

export type RedeemContextValue = {
  // State
  redeemAmount: Dnum;
  lzBntBalance: Dnum | null;
  isLoadingBalance: boolean;
  isConfigured: boolean;

  // Validation
  validation: ValidationState;

  // Actions
  setRedeemAmount: (amount: Dnum) => void;
  setMaxAmount: () => void;
};

const RedeemContext = createContext<RedeemContextValue | null>(null);

export function useRedeem(): RedeemContextValue {
  const context = useContext(RedeemContext);
  if (!context) {
    throw new Error("useRedeem must be used within a RedeemProvider");
  }
  return context;
}

export function RedeemProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const [redeemAmount, setRedeemAmountState] = useState<Dnum>(DNUM_0);

  const isConfigured = isLzBntConfigured();
  const lzBntContract = getLzBntContract();

  // Read lzBNT balance
  const balanceQuery = useReadContract({
    ...lzBntContract,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConfigured && !!lzBntContract,
    },
  });

  const lzBntBalance: Dnum | null = balanceQuery.data !== undefined
    ? dnum18(balanceQuery.data as bigint)
    : null;

  // Validation
  const validation: ValidationState = useMemo(() => {
    if (!address) {
      return { isValid: false, errorMessage: "Connect wallet to redeem" };
    }
    if (dn.eq(redeemAmount, DNUM_0)) {
      return { isValid: false, errorMessage: null };
    }
    if (lzBntBalance && dn.gt(redeemAmount, lzBntBalance)) {
      return { isValid: false, errorMessage: "Insufficient lzBNT balance" };
    }
    return { isValid: true, errorMessage: null };
  }, [address, redeemAmount, lzBntBalance]);

  // Actions
  const setRedeemAmount = useCallback((amount: Dnum) => {
    setRedeemAmountState(amount);
  }, []);

  const setMaxAmount = useCallback(() => {
    if (lzBntBalance) {
      setRedeemAmountState(lzBntBalance);
    }
  }, [lzBntBalance]);

  const value: RedeemContextValue = {
    // State
    redeemAmount,
    lzBntBalance,
    isLoadingBalance: balanceQuery.isLoading,
    isConfigured,

    // Validation
    validation,

    // Actions
    setRedeemAmount,
    setMaxAmount,
  };

  return (
    <RedeemContext.Provider value={value}>{children}</RedeemContext.Provider>
  );
}
