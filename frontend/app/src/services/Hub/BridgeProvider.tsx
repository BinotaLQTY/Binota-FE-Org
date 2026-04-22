"use client";

import type { Dnum } from "@/src/types";
import type { ReactNode } from "react";

import {
  BRIDGE_ADDRESS,
  FEE_ASSET,
  getAllHubChains,
  getAvailableDestinationChains,
  type HubChainId,
  isHubChainId,
  useBridgeFeeQuote,
  useUnoAllowance,
  useUnoBalance,
} from "@/src/hub-utils";
import { dnum18, DNUM_0 } from "@/src/dnum-utils";
import { useAccount } from "@/src/wagmi-utils";
import * as dn from "dnum";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";

export type BridgeContextValue = {
  // Current state
  amount: Dnum;
  sourceChainId: HubChainId;
  destinationChainId: HubChainId | null;

  // Derived state
  unoBalance: Dnum | null;
  isLoadingBalance: boolean;
  fee: Dnum | null;
  isLoadingFee: boolean;
  feeAsset: string;
  allowance: bigint | null;
  needsApproval: boolean;
  availableSources: HubChainId[];
  availableDestinations: HubChainId[];

  // Validation
  isValidAmount: boolean;
  errorMessage: string | null;

  // Actions
  setAmount: (amount: Dnum) => void;
  setSourceChainId: (chainId: HubChainId) => void;
  setDestinationChainId: (chainId: HubChainId) => void;
  swapChains: () => void;
  setMaxAmount: () => void;
};

const BridgeContext = createContext<BridgeContextValue | null>(null);

export function useBridge(): BridgeContextValue {
  const context = useContext(BridgeContext);
  if (!context) {
    throw new Error("useBridge must be used within a BridgeProvider");
  }
  return context;
}

export function BridgeProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Source chain state - initialized from wallet's current chain
  const [sourceChainId, setSourceChainIdState] = useState<HubChainId>(() => {
    return isHubChainId(currentChainId) ? currentChainId : 56;
  });

  // Sync sourceChainId with wallet chain changes
  useEffect(() => {
    if (isHubChainId(currentChainId)) {
      setSourceChainIdState(currentChainId);
    }
  }, [currentChainId]);

  // State
  const [amount, setAmountState] = useState<Dnum>(DNUM_0);
  const [destinationChainId, setDestinationChainIdState] = useState<HubChainId | null>(null);

  // Available chains (exclude currently selected chain from options)
  const availableSources = useMemo(
    () => getAllHubChains().filter((chainId) => chainId !== sourceChainId),
    [sourceChainId],
  );
  const availableDestinations = useMemo(
    () => getAvailableDestinationChains(sourceChainId),
    [sourceChainId],
  );

  // Auto-select first destination if none selected
  useEffect(() => {
    if (destinationChainId === null && availableDestinations.length > 0) {
      setDestinationChainIdState(availableDestinations[0] ?? null);
    }
  }, [destinationChainId, availableDestinations]);

  // Fetch UNO balance
  const balanceQuery = useUnoBalance(sourceChainId, address ?? null);
  const unoBalance = balanceQuery.data !== undefined ? dnum18(balanceQuery.data) : null;

  // Fetch allowance
  const allowanceQuery = useUnoAllowance(
    sourceChainId,
    address ?? null,
    BRIDGE_ADDRESS,
  );
  const allowance = allowanceQuery.data ?? null;

  // Fetch fee quote
  const feeQuery = useBridgeFeeQuote({
    destinationChainId,
    recipientAddress: address ?? null,
    amount: dn.gt(amount, DNUM_0) ? amount : null,
    enabled: destinationChainId !== null && address !== null,
  });
  const fee = feeQuery.data?.nativeFee !== undefined ? dnum18(feeQuery.data.nativeFee) : null;
  const feeAsset = FEE_ASSET[sourceChainId];

  // Validation
  const needsApproval = useMemo(() => {
    if (!allowance || dn.eq(amount, DNUM_0)) return false;
    return amount[0] > allowance;
  }, [allowance, amount]);

  const isValidAmount = useMemo(() => {
    if (dn.eq(amount, DNUM_0)) return false;
    if (!unoBalance) return false;
    return dn.lte(amount, unoBalance);
  }, [amount, unoBalance]);

  const errorMessage = useMemo(() => {
    if (!address) return "Connect wallet to bridge";
    if (dn.eq(amount, DNUM_0)) return null;
    if (!destinationChainId) return "Select destination chain";
    if (unoBalance && dn.gt(amount, unoBalance)) return "Insufficient UNO balance";
    return null;
  }, [address, amount, destinationChainId, unoBalance]);

  // Actions
  const setAmount = useCallback((newAmount: Dnum) => {
    setAmountState(newAmount);
  }, []);

  const setSourceChainId = useCallback((newSource: HubChainId) => {
    // If new source equals destination, swap them
    if (newSource === destinationChainId && sourceChainId) {
      setDestinationChainIdState(sourceChainId);
    }
    // Trigger wallet network switch
    switchChain({ chainId: newSource });
    setSourceChainIdState(newSource);
  }, [destinationChainId, sourceChainId, switchChain]);

  const setDestinationChainId = useCallback((chainId: HubChainId) => {
    if (chainId !== sourceChainId) {
      setDestinationChainIdState(chainId);
    }
  }, [sourceChainId]);

  const swapChains = useCallback(() => {
    // Swap source and destination, triggering wallet network switch
    if (destinationChainId) {
      const oldSource = sourceChainId;
      switchChain({ chainId: destinationChainId });
      setSourceChainIdState(destinationChainId);
      setDestinationChainIdState(oldSource);
    }
  }, [destinationChainId, sourceChainId, switchChain]);

  const setMaxAmount = useCallback(() => {
    if (unoBalance) {
      setAmountState(unoBalance);
    }
  }, [unoBalance]);

  const value: BridgeContextValue = {
    // Current state
    amount,
    sourceChainId,
    destinationChainId,

    // Derived state
    unoBalance,
    isLoadingBalance: balanceQuery.isLoading,
    fee,
    isLoadingFee: feeQuery.isLoading,
    feeAsset,
    allowance,
    needsApproval,
    availableSources,
    availableDestinations,

    // Validation
    isValidAmount,
    errorMessage,

    // Actions
    setAmount,
    setSourceChainId,
    setDestinationChainId,
    swapChains,
    setMaxAmount,
  };

  return (
    <BridgeContext.Provider value={value}>{children}</BridgeContext.Provider>
  );
}
