"use client";

import type { ReactNode } from "react";
import type { AirdropContextValue } from "./types";

import { useAirdropData, useMilestoneData, useAdapterTotals } from "@/src/airdrop-utils";
import { useAccount } from "@/src/wagmi-utils";
import { createContext, useContext } from "react";

const AirdropContext = createContext<AirdropContextValue | null>(null);

export function useAirdrop(): AirdropContextValue {
  const context = useContext(AirdropContext);
  if (!context) {
    throw new Error("useAirdrop must be used within an AirdropProvider");
  }
  return context;
}

export function AirdropProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const userAllocationQuery = useAirdropData(address ?? null);
  const milestoneDataQuery = useMilestoneData();
  const adapterTotalsQuery = useAdapterTotals();

  const value: AirdropContextValue = {
    // User allocation
    userAllocation: userAllocationQuery.data ?? null,
    isLoadingUserAllocation: userAllocationQuery.isLoading,

    // Milestone data
    milestoneData: milestoneDataQuery.data ?? null,
    isLoadingMilestoneData: milestoneDataQuery.isLoading,

    // Adapter totals
    adapterTotals: adapterTotalsQuery.data ?? [],
    isLoadingAdapterTotals: adapterTotalsQuery.isLoading,

    // B1 Vault data (loaded separately via B1VaultProvider)
    b1VaultData: null,
    isLoadingB1VaultData: false,

    // Status
    isConnected: !!address,
    userAddress: address ?? null,

    // Actions
    refetchAll: () => {
      userAllocationQuery.refetch();
      milestoneDataQuery.refetch();
      adapterTotalsQuery.refetch();
    },
    refetchUserAllocation: () => {
      userAllocationQuery.refetch();
    },
    refetchMilestoneData: () => {
      milestoneDataQuery.refetch();
    },
  };

  return (
    <AirdropContext.Provider value={value}>{children}</AirdropContext.Provider>
  );
}
