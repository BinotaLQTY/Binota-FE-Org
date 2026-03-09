import type { Address, Dnum } from "@/src/types";
import type {
  AdapterShare,
  AdapterTotal,
  MilestoneData,
  UnoVaultData,
  UserAllocation,
} from "@/src/services/Airdrop/types";

import {
  getAdapterContract,
  getAirdropContract,
  isAirdropContractsConfigured,
} from "@/src/airdrop-contracts";
import {
  ALL_ADAPTERS,
  ADAPTER_CONFIGS,
  EAdapters,
  EAdapterType,
  getAllSourceIds,
} from "@/src/config/adapters";
import {
  EMilestone,
  MILESTONE_CONFIGS,
  getAchievedMilestones,
  getAmountToNextMilestone,
  getCurrentMilestone,
  getCurrentRewardMultiplier,
  getMilestoneProgress,
  getNextMilestone,
} from "@/src/config/milestones";
import { useQuery } from "@tanstack/react-query";
import { useReadContracts } from "wagmi";
import * as dn from "dnum";

// Auto-detect whether to use mock data based on contract configuration
const USE_MOCK_DATA = !isAirdropContractsConfigured();

// Mock data constants
const MOCK_TOTAL_GLOBAL_DEPOSITS: Dnum = [BigInt("8500000000000000000000000"), 18]; // 8.5M UNO

/**
 * Generate mock adapter shares for a user
 */
function generateMockAdapterShares(address: Address): AdapterShare[] {
  // Distribute user deposits across adapters
  const shares: AdapterShare[] = [];

  for (const adapter of ALL_ADAPTERS) {
    const config = ADAPTER_CONFIGS[adapter];

    // Generate random-ish but deterministic values based on address
    const addressNum = parseInt(address.slice(2, 10), 16);
    const adapterIndex = ALL_ADAPTERS.indexOf(adapter);
    const seed = (addressNum + adapterIndex * 1000) % 10000;

    let userDeposit: Dnum;
    let sharePercent: Dnum;
    let pendingRewards: Dnum;

    if (config.type === EAdapterType.STABILITY_POOL) {
      // SP adapters: UNO deposits
      userDeposit = [BigInt(seed * 1e18), 18] as Dnum;
      sharePercent = [BigInt(Math.floor(seed / 100) * 1e14), 18] as Dnum; // 0-1%
      pendingRewards = [BigInt(Math.floor(seed / 10) * 1e17), 18] as Dnum;
    } else if (config.type === EAdapterType.LIQUIDITY_POOL) {
      // LP adapters: LP token deposits
      userDeposit = [BigInt(Math.floor(seed / 2) * 1e18), 18] as Dnum;
      sharePercent = [BigInt(Math.floor(seed / 200) * 1e14), 18] as Dnum;
      pendingRewards = [BigInt(Math.floor(seed / 20) * 1e17), 18] as Dnum;
    } else {
      // UNO Vault
      userDeposit = [BigInt(Math.floor(seed / 5) * 1e18), 18] as Dnum;
      sharePercent = [BigInt(Math.floor(seed / 500) * 1e14), 18] as Dnum;
      pendingRewards = [BigInt(Math.floor(seed / 50) * 1e17), 18] as Dnum;
    }

    shares.push({
      adapter,
      userDeposit,
      sharePercent,
      pendingRewards,
    });
  }

  return shares;
}

/**
 * Generate mock adapter totals (global)
 */
function generateMockAdapterTotals(): AdapterTotal[] {
  return ALL_ADAPTERS.map((adapter, index) => {
    const config = ADAPTER_CONFIGS[adapter];
    const baseAmount = (index + 1) * 500000; // 500K to 3.5M

    let totalDeposits: Dnum;
    let totalUnoEquivalent: Dnum;

    if (config.type === EAdapterType.STABILITY_POOL) {
      totalDeposits = [BigInt(baseAmount * 1e18), 18] as Dnum;
      totalUnoEquivalent = totalDeposits; // 1:1 for SP
    } else if (config.type === EAdapterType.LIQUIDITY_POOL) {
      totalDeposits = [BigInt(Math.floor(baseAmount / 2) * 1e18), 18] as Dnum;
      // LP tokens worth ~2x in UNO equivalent
      totalUnoEquivalent = [BigInt(baseAmount * 1e18), 18] as Dnum;
    } else {
      totalDeposits = [BigInt(Math.floor(baseAmount / 3) * 1e18), 18] as Dnum;
      // UNO vault doesn't contribute to UNO total for milestone calculation
      totalUnoEquivalent = [BigInt(0), 18] as Dnum;
    }

    return {
      adapter,
      totalDeposits,
      totalUnoEquivalent,
    };
  });
}

/**
 * Generate mock user allocation
 */
function generateMockUserAllocation(address: Address): UserAllocation {
  const adapterShares = generateMockAdapterShares(address);

  // Sum up total pending rewards
  const totalPendingRewards = adapterShares.reduce(
    (acc, share) => dn.add(acc, share.pendingRewards),
    [BigInt(0), 18] as Dnum
  );

  // Calculate global share (mock: user has ~0.5% of total)
  const globalSharePercent: Dnum = [BigInt(5e15), 18]; // 0.5%

  return {
    totalPendingRewards,
    globalSharePercent,
    adapterShares,
    hasClaimableRewards: dn.gt(totalPendingRewards, 0),
    lastClaimAt: null,
  };
}

/**
 * Generate mock milestone data
 */
function generateMockMilestoneData(): MilestoneData {
  const totalGlobalDeposits = MOCK_TOTAL_GLOBAL_DEPOSITS;
  const totalBigInt = totalGlobalDeposits[0];

  return {
    currentMilestone: getCurrentMilestone(totalBigInt),
    nextMilestone: getNextMilestone(totalBigInt),
    progressPercent: getMilestoneProgress(totalBigInt),
    amountToNext: [getAmountToNextMilestone(totalBigInt), 18] as Dnum,
    rewardMultiplier: getCurrentRewardMultiplier(totalBigInt),
    achievedMilestones: getAchievedMilestones(totalBigInt),
    totalGlobalDeposits,
  };
}

/**
 * Generate mock UNO vault data
 */
function generateMockUnoVaultData(address: Address): UnoVaultData {
  const addressNum = parseInt(address.slice(2, 10), 16);
  const seed = addressNum % 10000;

  return {
    unoBalance: [BigInt(seed * 100 * 1e18), 18] as Dnum,
    stakedUno: [BigInt(Math.floor(seed / 2) * 100 * 1e18), 18] as Dnum,
    totalStakedUno: [BigInt("5000000000000000000000000"), 18] as Dnum, // 5M UNO
    vaultSharePercent: [BigInt(seed * 1e12), 18] as Dnum,
    pendingVaultRewards: [BigInt(Math.floor(seed / 10) * 1e17), 18] as Dnum,
  };
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Type guard to filter out null values with proper TypeScript narrowing
 */
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * Build contract calls for fetching user airdrop data
 */
function buildAirdropContractCalls(address: Address) {
  const rewardsController = getAirdropContract("NtaRewardsController");
  if (!rewardsController) return null;

  const sourceIds = getAllSourceIds();

  // Build adapter contract calls for user shares and totals
  const adapterSharesCalls = ALL_ADAPTERS.map((adapter) => {
    const contract = getAdapterContract(adapter);
    if (!contract) return null;
    return {
      ...contract,
      functionName: "sharesOf" as const,
      args: [address] as const,
    };
  }).filter(isNotNull);

  const adapterTotalsCalls = ALL_ADAPTERS.map((adapter) => {
    const contract = getAdapterContract(adapter);
    if (!contract) return null;
    return {
      ...contract,
      functionName: "totalShares" as const,
    };
  }).filter(isNotNull);

  return {
    pendingCall: {
      ...rewardsController,
      functionName: "pending" as const,
      args: [address, sourceIds] as const,
    },
    manualCreditsCall: {
      ...rewardsController,
      functionName: "manualCredits" as const,
      args: [address] as const,
    },
    manualClaimedCall: {
      ...rewardsController,
      functionName: "manualClaimed" as const,
      args: [address] as const,
    },
    adapterSharesCalls,
    adapterTotalsCalls,
  };
}

/**
 * Hook to get user's airdrop allocation data
 * Uses real contract calls when configured, falls back to mock data
 */
export function useAirdropData(address: Address | null) {
  // Mock data fallback
  const mockQuery = useQuery({
    queryKey: ["airdropData", "mock", address],
    queryFn: async (): Promise<UserAllocation | null> => {
      if (!address) return null;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateMockUserAllocation(address);
    },
    enabled: USE_MOCK_DATA && !!address,
    staleTime: 30_000,
  });

  // Real contract calls
  const contractCalls = address ? buildAirdropContractCalls(address) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contracts: any[] = contractCalls
    ? [
        contractCalls.pendingCall,
        contractCalls.manualCreditsCall,
        contractCalls.manualClaimedCall,
        ...contractCalls.adapterSharesCalls,
        ...contractCalls.adapterTotalsCalls,
      ]
    : [];

  const contractQuery = useReadContracts({
    contracts,
    allowFailure: true,
    query: {
      enabled: !USE_MOCK_DATA && !!address && !!contractCalls,
      staleTime: 30_000,
      select: (results): UserAllocation | null => {
        if (!results || results.length === 0) return null;

        // Parse results - pending rewards is first result
        const pendingResult = results[0];
        const totalPendingRewards: Dnum =
          pendingResult?.status === "success"
            ? [pendingResult.result as bigint, 18]
            : [BigInt(0), 18];

        // Manual credits (index 1) and manual claimed (index 2)
        const manualCredits =
          results[1]?.status === "success"
            ? (results[1].result as bigint)
            : BigInt(0);
        const manualClaimed =
          results[2]?.status === "success"
            ? (results[2].result as bigint)
            : BigInt(0);
        const unclaimedManual = manualCredits - manualClaimed;

        // Parse adapter shares (starting at index 3)
        const adapterSharesStartIndex = 3;
        const adapterTotalsStartIndex = adapterSharesStartIndex + ALL_ADAPTERS.length;

        const adapterShares: AdapterShare[] = ALL_ADAPTERS.map((adapter, i) => {
          const sharesResult = results[adapterSharesStartIndex + i];
          const totalsResult = results[adapterTotalsStartIndex + i];

          const userShares =
            sharesResult?.status === "success"
              ? (sharesResult.result as bigint)
              : BigInt(0);
          const totalShares =
            totalsResult?.status === "success"
              ? (totalsResult.result as bigint)
              : BigInt(0);

          const sharePercent: Dnum =
            totalShares > BigInt(0)
              ? dn.div([userShares, 18], [totalShares, 18])
              : [BigInt(0), 18];

          return {
            adapter,
            userDeposit: [userShares, 18] as Dnum,
            sharePercent,
            pendingRewards: [BigInt(0), 18] as Dnum, // Per-adapter rewards need separate calculation
          };
        });

        // Calculate global share
        const totalUserShares = adapterShares.reduce(
          (acc, s) => acc + s.userDeposit[0],
          BigInt(0)
        );
        const totalGlobalShares = ALL_ADAPTERS.reduce((acc, _, i) => {
          const result = results[adapterTotalsStartIndex + i];
          return (
            acc +
            (result?.status === "success" ? (result.result as bigint) : BigInt(0))
          );
        }, BigInt(0));

        const globalSharePercent: Dnum =
          totalGlobalShares > BigInt(0)
            ? dn.div([totalUserShares, 18], [totalGlobalShares, 18])
            : [BigInt(0), 18];

        // Add unclaimed manual credits to pending
        const totalWithManual = dn.add(totalPendingRewards, [unclaimedManual, 18]);

        return {
          totalPendingRewards: totalWithManual,
          globalSharePercent,
          adapterShares,
          hasClaimableRewards: dn.gt(totalWithManual, 0),
          lastClaimAt: null,
        };
      },
    },
  });

  // Return the appropriate query based on configuration
  if (USE_MOCK_DATA) {
    return mockQuery;
  }

  return {
    ...contractQuery,
    data: contractQuery.data ?? null,
  };
}

/**
 * Hook to get milestone progress data
 * Uses real contract calls when configured, falls back to mock data
 */
export function useMilestoneData() {
  const milestoneController = getAirdropContract("NtaMilestoneController");

  // Mock data fallback
  const mockQuery = useQuery({
    queryKey: ["milestoneData", "mock"],
    queryFn: async (): Promise<MilestoneData> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return generateMockMilestoneData();
    },
    enabled: USE_MOCK_DATA,
    staleTime: 60_000,
  });

  // Real contract calls
  const contractQuery = useReadContracts({
    contracts: milestoneController
      ? [
          {
            ...milestoneController,
            functionName: "currentMilestone" as const,
          },
          {
            ...milestoneController,
            functionName: "currentTwas" as const,
          },
          {
            ...milestoneController,
            functionName: "thresholdCount" as const,
          },
          {
            ...milestoneController,
            functionName: "paused" as const,
          },
        ]
      : [],
    query: {
      enabled: !USE_MOCK_DATA && !!milestoneController,
      staleTime: 60_000,
      select: (results): MilestoneData => {
        // Parse contract results
        // currentMilestone index from contract (for reference, we derive milestone from TWAS)
        const _currentMilestoneIndex =
          results[0]?.status === "success"
            ? Number(results[0].result as bigint)
            : 0;
        void _currentMilestoneIndex; // Acknowledge we read this but derive milestone from TWAS

        const currentTwas =
          results[1]?.status === "success"
            ? (results[1].result as bigint)
            : BigInt(0);

        // Convert TWAS to total global deposits (TWAS is time-weighted, but we use it as proxy)
        const totalGlobalDeposits: Dnum = [currentTwas, 18];
        const totalBigInt = currentTwas;

        return {
          currentMilestone: getCurrentMilestone(totalBigInt),
          nextMilestone: getNextMilestone(totalBigInt),
          progressPercent: getMilestoneProgress(totalBigInt),
          amountToNext: [getAmountToNextMilestone(totalBigInt), 18] as Dnum,
          rewardMultiplier: getCurrentRewardMultiplier(totalBigInt),
          achievedMilestones: getAchievedMilestones(totalBigInt),
          totalGlobalDeposits,
        };
      },
    },
  });

  if (USE_MOCK_DATA) {
    return mockQuery;
  }

  return {
    ...contractQuery,
    data: contractQuery.data ?? generateMockMilestoneData(), // Fallback to mock if no data
  };
}

/**
 * Hook to get global adapter totals
 * Uses real contract calls when configured, falls back to mock data
 */
export function useAdapterTotals() {
  // Mock data fallback
  const mockQuery = useQuery({
    queryKey: ["adapterTotals", "mock"],
    queryFn: async (): Promise<AdapterTotal[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return generateMockAdapterTotals();
    },
    enabled: USE_MOCK_DATA,
    staleTime: 60_000,
  });

  // Build contract calls for all adapters
  const adapterCalls = ALL_ADAPTERS.map((adapter) => {
    const contract = getAdapterContract(adapter);
    if (!contract) return null;
    return {
      ...contract,
      functionName: "totalShares" as const,
    };
  }).filter(isNotNull);

  // Real contract calls
  const contractQuery = useReadContracts({
    contracts: adapterCalls,
    query: {
      enabled: !USE_MOCK_DATA && adapterCalls.length > 0,
      staleTime: 60_000,
      select: (results): AdapterTotal[] => {
        return ALL_ADAPTERS.map((adapter, index) => {
          const config = ADAPTER_CONFIGS[adapter];
          const result = results[index];

          const totalShares =
            result?.status === "success"
              ? (result.result as bigint)
              : BigInt(0);

          const totalDeposits: Dnum = [totalShares, 18];

          // Calculate UNO equivalent based on adapter type
          let totalUnoEquivalent: Dnum;
          if (config.type === EAdapterType.STABILITY_POOL) {
            totalUnoEquivalent = totalDeposits; // 1:1 for SP
          } else if (config.type === EAdapterType.LIQUIDITY_POOL) {
            // LP tokens worth ~2x in UNO equivalent (simplified)
            totalUnoEquivalent = dn.mul(totalDeposits, 2);
          } else {
            // UNO vault doesn't contribute to UNO total for milestone calculation
            totalUnoEquivalent = [BigInt(0), 18] as Dnum;
          }

          return {
            adapter,
            totalDeposits,
            totalUnoEquivalent,
          };
        });
      },
    },
  });

  if (USE_MOCK_DATA) {
    return mockQuery;
  }

  return {
    ...contractQuery,
    data: contractQuery.data ?? [],
  };
}

/**
 * Hook to get UNO vault data for a user
 * Uses real contract calls when configured, falls back to mock data
 */
export function useUnoVaultData(address: Address | null) {
  const unoToken = getAirdropContract("UnoToken");
  const vaultAdapter = getAdapterContract(EAdapters.UNO_VAULT);

  // Mock data fallback
  const mockQuery = useQuery({
    queryKey: ["unoVaultData", "mock", address],
    queryFn: async (): Promise<UnoVaultData | null> => {
      if (!address) return null;
      await new Promise((resolve) => setTimeout(resolve, 400));
      return generateMockUnoVaultData(address);
    },
    enabled: USE_MOCK_DATA && !!address,
    staleTime: 30_000,
  });

  // Real contract calls
  const contractQuery = useReadContracts({
    contracts:
      unoToken && vaultAdapter && address
        ? [
            {
              ...unoToken,
              functionName: "balanceOf" as const,
              args: [address] as const,
            },
            {
              ...vaultAdapter,
              functionName: "sharesOf" as const,
              args: [address] as const,
            },
            {
              ...vaultAdapter,
              functionName: "totalShares" as const,
            },
          ]
        : [],
    query: {
      enabled: !USE_MOCK_DATA && !!address && !!unoToken && !!vaultAdapter,
      staleTime: 30_000,
      select: (results): UnoVaultData | null => {
        if (!results || results.length < 3) return null;

        const unoBalance =
          results[0]?.status === "success"
            ? (results[0].result as bigint)
            : BigInt(0);
        const stakedUno =
          results[1]?.status === "success"
            ? (results[1].result as bigint)
            : BigInt(0);
        const totalStakedUno =
          results[2]?.status === "success"
            ? (results[2].result as bigint)
            : BigInt(0);

        const vaultSharePercent: Dnum =
          totalStakedUno > BigInt(0)
            ? dn.div([stakedUno, 18], [totalStakedUno, 18])
            : [BigInt(0), 18];

        return {
          unoBalance: [unoBalance, 18] as Dnum,
          stakedUno: [stakedUno, 18] as Dnum,
          totalStakedUno: [totalStakedUno, 18] as Dnum,
          vaultSharePercent,
          pendingVaultRewards: [BigInt(0), 18] as Dnum, // Vault rewards are included in pending rewards
        };
      },
    },
  });

  if (USE_MOCK_DATA) {
    return mockQuery;
  }

  return {
    ...contractQuery,
    data: contractQuery.data ?? null,
  };
}

/**
 * Hook to get user's share in a specific adapter
 */
export function useAdapterShare(address: Address | null, adapter: EAdapters) {
  const airdropData = useAirdropData(address);

  return {
    ...airdropData,
    data: airdropData.data?.adapterShares.find((s) => s.adapter === adapter) ?? null,
  };
}

/**
 * Format milestone name for display
 */
export function formatMilestoneName(milestone: EMilestone): string {
  return MILESTONE_CONFIGS[milestone].name;
}

/**
 * Get milestone color for UI
 */
export function getMilestoneColor(milestone: EMilestone): string {
  return MILESTONE_CONFIGS[milestone].color;
}

/**
 * Format adapter name for display
 */
export function formatAdapterName(adapter: EAdapters): string {
  return ADAPTER_CONFIGS[adapter].name;
}

/**
 * Get adapter description
 */
export function getAdapterDescription(adapter: EAdapters): string {
  return ADAPTER_CONFIGS[adapter].description;
}
