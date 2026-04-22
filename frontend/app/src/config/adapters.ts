import type { BranchId, CollateralSymbol } from "@/src/types";

/**
 * Source IDs for NtaRewardsController
 * These are keccak256 hashes of the source names used to identify each adapter
 */
export const SOURCE_IDS = {
  SOURCE_NTA: "0x0000000000000000000000000000000000000000000000000000000000000001",
  SOURCE_LP_DEX_A: "0x0000000000000000000000000000000000000000000000000000000000000002",
  SOURCE_LP_DEX_B: "0x0000000000000000000000000000000000000000000000000000000000000003",
  SOURCE_SP_BNB: "0x0000000000000000000000000000000000000000000000000000000000000004",
} as const;

/**
 * Enum for all adapter types
 */
export enum EAdapterType {
  STABILITY_POOL = "STABILITY_POOL",
  LIQUIDITY_POOL = "LIQUIDITY_POOL",
  B1_VAULT = "B1_VAULT",
}

/**
 * Enum for all adapters
 */
export enum EAdapters {
  // Stability Pool Adapters
  BNB_SP = "BNB_SP",
  // Liquidity Pool Adapters
  DEX_A_LP = "DEX_A_LP",
  DEX_B_LP = "DEX_B_LP",
  // B1 Vault Adapter
  B1_VAULT = "B1_VAULT",
}

/**
 * Adapter configuration type
 */
export type TAdapterConfig = {
  /** Display name for the adapter */
  name: string;
  /** Type of adapter (SP, LP, or UNO_VAULT) */
  type: EAdapterType;
  /** The underlying collateral symbol (for SP adapters) */
  collateralSymbol?: CollateralSymbol;
  /** Branch ID for stability pool adapters */
  branchId?: BranchId;
  /** The token users deposit into the adapter */
  depositToken: "B1" | "NTA" | "LP";
  /** Source ID for NtaRewardsController (bytes32 identifier) */
  sourceId: `0x${string}`;
  /** Description for UI */
  description: string;
};

/**
 * All adapter configurations
 */
export const ADAPTER_CONFIGS: { [key in EAdapters]: TAdapterConfig } = {
  // Stability Pool Adapters - wrap StabilityPool contracts
  [EAdapters.BNB_SP]: {
    name: "BNB Stability Pool",
    type: EAdapterType.STABILITY_POOL,
    collateralSymbol: "BNB",
    branchId: 0,
    depositToken: "B1",
    sourceId: SOURCE_IDS.SOURCE_SP_BNB,
    description: "Deposit B1 in the BNB stability pool to earn NTA rewards",
  },
  // Liquidity Pool Adapters - wrap LP gauge/staking contracts
  [EAdapters.DEX_A_LP]: {
    name: "DEX A B1-USDC LP",
    type: EAdapterType.LIQUIDITY_POOL,
    depositToken: "LP",
    sourceId: SOURCE_IDS.SOURCE_LP_DEX_A,
    description: "Stake B1-USDC LP tokens to earn NTA rewards",
  },
  [EAdapters.DEX_B_LP]: {
    name: "DEX B B1-BNB LP",
    type: EAdapterType.LIQUIDITY_POOL,
    depositToken: "LP",
    sourceId: SOURCE_IDS.SOURCE_LP_DEX_B,
    description: "Stake B1-BNB LP tokens to earn NTA rewards",
  },
  // B1 Vault Adapter - for staking B1 tokens
  [EAdapters.B1_VAULT]: {
    name: "B1 Staking Vault",
    type: EAdapterType.B1_VAULT,
    depositToken: "B1",
    sourceId: SOURCE_IDS.SOURCE_NTA,
    description: "Stake B1 tokens to boost your airdrop allocation",
  },
};

/**
 * List of all Stability Pool adapters
 */
export const SP_ADAPTERS: EAdapters[] = [
  EAdapters.BNB_SP,
];

/**
 * List of all Liquidity Pool adapters
 */
export const LP_ADAPTERS: EAdapters[] = [EAdapters.DEX_A_LP, EAdapters.DEX_B_LP];

/**
 * List of all adapters (for iteration)
 */
export const ALL_ADAPTERS: EAdapters[] = [
  ...SP_ADAPTERS,
  ...LP_ADAPTERS,
  EAdapters.B1_VAULT,
];

/**
 * Map from collateral symbol to SP adapter
 */
const COLLATERAL_TO_SP_ADAPTER: Partial<Record<CollateralSymbol, EAdapters>> = {
  BNB: EAdapters.BNB_SP,
};

/**
 * Get the SP adapter for a given collateral symbol
 * @param symbol The collateral symbol (BNB)
 * @returns The adapter enum, or undefined if no adapter exists for this symbol
 */
export function getSpAdapterByCollateral(
  symbol: CollateralSymbol
): EAdapters | undefined {
  return COLLATERAL_TO_SP_ADAPTER[symbol];
}

/**
 * Get the adapter configuration
 * @param adapter The adapter enum
 * @returns The adapter configuration
 */
export function getAdapterConfig(adapter: EAdapters): TAdapterConfig {
  return ADAPTER_CONFIGS[adapter];
}

/**
 * Check if an adapter is a Stability Pool adapter
 */
export function isSpAdapter(adapter: EAdapters): boolean {
  return ADAPTER_CONFIGS[adapter].type === EAdapterType.STABILITY_POOL;
}

/**
 * Check if an adapter is a Liquidity Pool adapter
 */
export function isLpAdapter(adapter: EAdapters): boolean {
  return ADAPTER_CONFIGS[adapter].type === EAdapterType.LIQUIDITY_POOL;
}

/**
 * Check if an adapter is the B1 Vault adapter
 */
export function isB1VaultAdapter(adapter: EAdapters): boolean {
  return ADAPTER_CONFIGS[adapter].type === EAdapterType.B1_VAULT;
}

/**
 * Get all source IDs for NtaRewardsController
 * @returns Array of all source IDs (bytes32)
 */
export function getAllSourceIds(): `0x${string}`[] {
  return ALL_ADAPTERS.map((adapter) => ADAPTER_CONFIGS[adapter].sourceId);
}

/**
 * Get source ID for a specific adapter
 * @param adapter The adapter enum
 * @returns The source ID (bytes32)
 */
export function getAdapterSourceId(adapter: EAdapters): `0x${string}` {
  return ADAPTER_CONFIGS[adapter].sourceId;
}
