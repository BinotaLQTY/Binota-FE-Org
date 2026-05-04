import type { Address } from "@/src/types";
import type { Dnum } from "@/src/types";

import { Bridge } from "@/src/abi/Bridge";
import { DNUM_0 } from "@/src/dnum-utils";
import { useQuery } from "@tanstack/react-query";
import * as dn from "dnum";
import { pad } from "viem";
import { useReadContract } from "wagmi";

// =============================================================================
// Chain Configuration
// =============================================================================

export type HubChainId = 1 | 42161 | 8453 | 56;

export const HUB_CHAINS = {
  ETHEREUM: 1,
  ARBITRUM: 42161,
  BASE: 8453,
  BNB: 56,
} as const;

export const HUB_CHAIN_NAMES: Record<HubChainId, string> = {
  1: "Ethereum",
  42161: "Arbitrum",
  8453: "Base",
  56: "BNB Chain",
};

export const HUB_CHAIN_ICONS: Record<HubChainId, string> = {
  1: "/assets/chains/ethereum.svg",
  42161: "/assets/chains/arbitrum.svg",
  8453: "/assets/chains/base.svg",
  56: "/assets/chains/bnb.svg",
};

// LayerZero Endpoint IDs
export const LZ_EID_ENDPOINTS: Record<HubChainId, number> = {
  1: 30101,      // Ethereum
  42161: 30110,  // Arbitrum
  8453: 30184,   // Base
  56: 30102,     // BNB Chain
};

// Native fee asset per chain
export const FEE_ASSET: Record<HubChainId, string> = {
  1: "ETH",
  42161: "ETH",
  8453: "ETH",
  56: "BNB",
};

// RPC URLs for cross-chain reads (for NFT balance checks)
export const CHAIN_RPC_URLS: Record<HubChainId, string> = {
  1: "https://cloudflare-eth.com",
  42161: "https://arb1.arbitrum.io/rpc",
  8453: "https://mainnet.base.org",
  56: "https://bsc-dataseed.binance.org",
};

// =============================================================================
// Bridge Configuration
// =============================================================================

// Bridge contract address (same on all chains - LayerZero OFT)
export const BRIDGE_ADDRESS = "0xE3ce6e0bA2F6CE27aB0C121c3d0f9b9c30F590d7" as Address;

// B1 token addresses per chain
export const B1_TOKEN_ADDRESSES: Record<HubChainId, Address> = {
  1: "0x0000000000000000000000000000000000000000" as Address,      // Placeholder - Ethereum B1
  42161: "0x0000000000000000000000000000000000000000" as Address,  // Placeholder - Arbitrum B1
  8453: "0x0000000000000000000000000000000000000000" as Address,   // Placeholder - Base B1
  56: "0x0000000000000000000000000000000000000000" as Address,     // BNB Chain B1 - same as CONTRACT_BOLD_TOKEN
};

export const BridgeContract = {
  abi: Bridge,
  address: BRIDGE_ADDRESS,
} as const;

// =============================================================================
// Points Configuration
// =============================================================================

// NFT contracts for points multipliers
export const HERO_ID_NFT = {
  address: "0x0596847646cFfC159eE60375E218cf120cb942eC" as Address,
  chainId: HUB_CHAINS.ARBITRUM,
  name: "Hero ID",
};

export const KAMISAMA_NFT = {
  address: "0xB1bbA5e43Cb1aca1E78C3Ec93Fae98a7A3dCeeeF" as Address,
  chainId: HUB_CHAINS.ETHEREUM,
  name: "Kamisama",
};

// Points calculation constants
export const POINTS_PER_NFT = 500;
export const POINTS_PER_TROVE = 100;
export const POINTS_PER_DEBT_UNIT = 1; // per 1 B1 of debt

// =============================================================================
// Bridge Utilities
// =============================================================================

export function isHubChainId(chainId: number): chainId is HubChainId {
  return chainId === 1 || chainId === 42161 || chainId === 8453 || chainId === 56;
}

export function getAvailableDestinationChains(sourceChainId: HubChainId): HubChainId[] {
  const allChains = Object.values(HUB_CHAINS) as HubChainId[];
  return allChains.filter((chainId) => chainId !== sourceChainId);
}

export function getAllHubChains(): HubChainId[] {
  return Object.values(HUB_CHAINS) as HubChainId[];
}

export function getLzEndpointId(chainId: HubChainId): number {
  return LZ_EID_ENDPOINTS[chainId];
}

// Convert address to bytes32 for LayerZero
export function addressToBytes32(address: Address): `0x${string}` {
  return pad(address, { size: 32 });
}

// Build LayerZero send parameters
export function buildSendParams(params: {
  destinationChainId: HubChainId;
  recipientAddress: Address;
  amount: bigint;
  minAmount?: bigint;
}) {
  const { destinationChainId, recipientAddress, amount, minAmount } = params;

  return {
    dstEid: getLzEndpointId(destinationChainId),
    to: addressToBytes32(recipientAddress),
    amountLD: amount,
    minAmountLD: minAmount ?? amount, // Default to same amount (no slippage tolerance)
    extraOptions: "0x" as `0x${string}`,
    composeMsg: "0x" as `0x${string}`,
    oftCmd: "0x" as `0x${string}`,
  };
}

// =============================================================================
// Points Calculation
// =============================================================================

export type TroveForPoints = {
  id: string;
  debt: Dnum;
  status: string;
};

export type PointsBreakdown = {
  trovesCount: number;
  trovePoints: number;
  debtPoints: number;
  heroIdBonus: number;
  kamisamaBonus: number;
  total: number;
};

export function calculatePointsFromTroves(
  troves: TroveForPoints[],
  nftBalances: { heroId: number; kamisama: number },
): PointsBreakdown {
  // Filter active troves only
  const activeTroves = troves.filter((trove) => trove.status === "active");

  // Calculate base points from troves
  const trovePoints = activeTroves.length * POINTS_PER_TROVE;

  // Calculate debt points
  const totalDebt = activeTroves.reduce(
    (sum, trove) => dn.add(sum, trove.debt),
    DNUM_0,
  );
  const debtPoints = Math.floor(dn.toNumber(totalDebt));

  // NFT bonuses
  const heroIdBonus = nftBalances.heroId * POINTS_PER_NFT;
  const kamisamaBonus = nftBalances.kamisama * POINTS_PER_NFT;

  // Total
  const total = trovePoints + debtPoints + heroIdBonus + kamisamaBonus;

  return {
    trovesCount: activeTroves.length,
    trovePoints,
    debtPoints,
    heroIdBonus,
    kamisamaBonus,
    total,
  };
}

// =============================================================================
// Bridge Hooks
// =============================================================================

export function useBridgeFeeQuote(params: {
  destinationChainId: HubChainId | null;
  recipientAddress: Address | null;
  amount: Dnum | null;
  enabled?: boolean;
}) {
  const { destinationChainId, recipientAddress, amount, enabled = true } = params;

  const shouldFetch =
    enabled &&
    destinationChainId !== null &&
    recipientAddress !== null &&
    amount !== null &&
    dn.gt(amount, DNUM_0);

  return useReadContract({
    ...BridgeContract,
    functionName: "quoteSend",
    args: shouldFetch
      ? [
        buildSendParams({
          destinationChainId: destinationChainId!,
          recipientAddress: recipientAddress!,
          amount: amount![0],
        }),
        false, // payInLzToken
      ]
      : undefined,
    query: {
      enabled: shouldFetch,
      refetchInterval: 30_000, // Refetch every 30 seconds
    },
  });
}

export function useB1Balance(chainId: HubChainId | null, address: Address | null) {
  const tokenAddress = chainId ? B1_TOKEN_ADDRESSES[chainId] : null;

  return useReadContract({
    address: tokenAddress ?? undefined,
    abi: [
      {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(tokenAddress && address),
    },
  });
}

export function useB1Allowance(
  chainId: HubChainId | null,
  owner: Address | null,
  spender: Address | null,
) {
  const tokenAddress = chainId ? B1_TOKEN_ADDRESSES[chainId] : null;

  return useReadContract({
    address: tokenAddress ?? undefined,
    abi: [
      {
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "allowance",
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: Boolean(tokenAddress && owner && spender),
    },
  });
}

// =============================================================================
// Points Hooks
// =============================================================================

import {
  getActiveTrovesByBorrower,
  getBorrowerStatsForLeaderboard,
} from "@/src/subgraph";

// Hook to get NFT balances for points calculation
// Uses direct RPC calls to read NFT balances on other chains
export function useNftBalances(address: Address | null) {
  return useQuery({
    queryKey: ["nftBalances", address],
    queryFn: async () => {
      if (!address) {
        return { heroId: 0, kamisama: 0 };
      }

      // Read NFT balances via direct RPC calls to respective chains
      const [heroIdBalance, kamisamaBalance] = await Promise.all([
        fetchNftBalance(address, HERO_ID_NFT.address, CHAIN_RPC_URLS[HERO_ID_NFT.chainId]),
        fetchNftBalance(address, KAMISAMA_NFT.address, CHAIN_RPC_URLS[KAMISAMA_NFT.chainId]),
      ]);

      return {
        heroId: heroIdBalance,
        kamisama: kamisamaBalance,
      };
    },
    enabled: Boolean(address),
    staleTime: 60_000, // Cache for 1 minute
  });
}

// Helper to fetch NFT balance via direct RPC call
async function fetchNftBalance(
  owner: Address,
  nftContract: Address,
  rpcUrl: string,
): Promise<number> {
  try {
    // ERC721 balanceOf call
    const data = `0x70a08231000000000000000000000000${owner.slice(2)}`;

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [
          { to: nftContract, data },
          "latest",
        ],
      }),
    });

    const result = await response.json();
    if (result.error || !result.result) {
      return 0;
    }

    return parseInt(result.result, 16);
  } catch {
    return 0;
  }
}

// Hook to get user's points breakdown
export function useUserPoints(address: Address | null) {
  const nftBalances = useNftBalances(address);

  return useQuery({
    queryKey: ["userPoints", address, nftBalances.data],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      // Get user's active troves from subgraph
      const troves = await getActiveTrovesByBorrower(address);

      // Calculate points breakdown
      const breakdown = calculatePointsFromTroves(troves, nftBalances.data ?? { heroId: 0, kamisama: 0 });

      return breakdown;
    },
    enabled: Boolean(address) && !nftBalances.isLoading,
    staleTime: 30_000, // Cache for 30 seconds
  });
}

// Hook to get the full leaderboard
export function usePointsLeaderboard(userAddress: Address | null) {
  return useQuery({
    queryKey: ["pointsLeaderboard"],
    queryFn: async () => {
      // Get all borrower stats from subgraph
      const borrowerStats = await getBorrowerStatsForLeaderboard();

      // Calculate points for each borrower (without NFT bonuses for now)
      // Note: NFT bonuses would require individual cross-chain calls per user
      // which is expensive. For leaderboard, we show base points only.
      const entries: LeaderboardEntry[] = borrowerStats.map((stats, index) => {
        const trovePoints = stats.trovesCount * POINTS_PER_TROVE;
        const debtPoints = Math.floor(dn.toNumber(stats.totalDebt));
        const points = trovePoints + debtPoints;

        return {
          rank: index + 1,
          address: stats.borrower,
          points,
          trovesCount: stats.trovesCount,
          totalDebt: stats.totalDebt,
        };
      });

      // Sort by points descending and reassign ranks
      entries.sort((a, b) => b.points - a.points);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Find user's entry
      const userEntry = userAddress
        ? entries.find(
          (e) => e.address.toLowerCase() === userAddress.toLowerCase()
        ) ?? null
        : null;

      return {
        entries: entries.slice(0, 100), // Top 100 for display
        userEntry,
        totalParticipants: entries.length,
      } satisfies LeaderboardData;
    },
    staleTime: 60_000, // Cache for 1 minute
  });
}

// =============================================================================
// Leaderboard Types
// =============================================================================

export type LeaderboardEntry = {
  rank: number;
  address: Address;
  points: number;
  trovesCount: number;
  totalDebt: Dnum;
};

export type LeaderboardData = {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry | null;
  totalParticipants: number;
};
