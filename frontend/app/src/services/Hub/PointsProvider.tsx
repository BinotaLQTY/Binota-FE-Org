"use client";

import type { ReactNode } from "react";

import {
  type LeaderboardData,
  type PointsBreakdown,
  useNftBalances,
  usePointsLeaderboard,
  useUserPoints,
} from "@/src/hub-utils";
import { useAccount } from "@/src/wagmi-utils";
import { createContext, useContext } from "react";

export type PointsContextValue = {
  // User's points breakdown
  userPoints: PointsBreakdown | null;
  isLoadingUserPoints: boolean;

  // NFT balances
  nftBalances: { heroId: number; kamisama: number } | null;
  isLoadingNftBalances: boolean;

  // Leaderboard
  leaderboard: LeaderboardData | null;
  isLoadingLeaderboard: boolean;

  // User's rank (if on leaderboard)
  userRank: number | null;

  // Refetch functions
  refetchUserPoints: () => void;
  refetchLeaderboard: () => void;
};

const PointsContext = createContext<PointsContextValue | null>(null);

export function usePoints(): PointsContextValue {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
}

export function PointsProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const nftBalancesQuery = useNftBalances(address ?? null);
  const userPointsQuery = useUserPoints(address ?? null);
  const leaderboardQuery = usePointsLeaderboard(address ?? null);

  const value: PointsContextValue = {
    // User points
    userPoints: userPointsQuery.data ?? null,
    isLoadingUserPoints: userPointsQuery.isLoading,

    // NFT balances
    nftBalances: nftBalancesQuery.data ?? null,
    isLoadingNftBalances: nftBalancesQuery.isLoading,

    // Leaderboard
    leaderboard: leaderboardQuery.data ?? null,
    isLoadingLeaderboard: leaderboardQuery.isLoading,

    // User's rank
    userRank: leaderboardQuery.data?.userEntry?.rank ?? null,

    // Refetch functions
    refetchUserPoints: () => {
      userPointsQuery.refetch();
      nftBalancesQuery.refetch();
    },
    refetchLeaderboard: () => {
      leaderboardQuery.refetch();
    },
  };

  return (
    <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
  );
}
