import type { BranchId, CollateralSymbol } from "@/src/types";

/**
 * Source IDs for NtaRewardsController
 * These are keccak256 hashes of the source names used to identify each adapter
 */
export const SOURCE_IDS = {
  SOURCE_NTA: "0x0000000000000000000000000000000000000000000000000000000000000001",
  SOURCE_LP_DEX_A: "0x0000000000000000000000000000000000000000000000000000000000000002",
  SOURCE_LP_DEX_B: "0x0000000000000000000000000000000000000000000000000000000000000003",
  SOURCE_SP_MON: "0x0000000000000000000000000000000000000000000000000000000000000004",
  SOURCE_SP_SHMON: "0x0000000000000000000000000000000000000000000000000000000000000005",
  SOURCE_SP_SMON: "0x0000000000000000000000000000000000000000000000000000000000000006",
  SOURCE_SP_GMON: "0x0000000000000000000000000000000000000000000000000000000000000007",
} as const;

/**
 * Enum for all adapter types
 */
export enum EAdapterType {
  STABILITY_POOL = "STABILITY_POOL",
  LIQUIDITY_POOL = "LIQUIDITY_POOL",
  UNO_VAULT = "UNO_VAULT",
}

/**
 * Enum for all adapters
 */
export enum EAdapters {
  // Stability Pool Adapters
  MON_SP = "MON_SP",
  SHMON_SP = "SHMON_SP",
  SMON_SP = "SMON_SP",
  GMON_SP = "GMON_SP",
  // Liquidity Pool Adapters
  DEX_A_LP = "DEX_A_LP",
  DEX_B_LP = "DEX_B_LP",
  // UNO Vault Adapter
  UNO_VAULT = "UNO_VAULT",
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
  depositToken: "UNO" | "NTA" | "LP";
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
  [EAdapters.MON_SP]: {
    name: "MON Stability Pool",
    type: EAdapterType.STABILITY_POOL,
    collateralSymbol: "MON",
    branchId: 0,
    depositToken: "UNO",
    sourceId: SOURCE_IDS.SOURCE_SP_MON,
    description: "Deposit UNO in the MON stability pool to earn NTA rewards",
  },
  [EAdapters.SHMON_SP]: {
    name: "shMON Stability Pool",
    type: EAdapterType.STABILITY_POOL,
    collateralSymbol: "shMON",
    branchId: 1,
    depositToken: "UNO",
    sourceId: SOURCE_IDS.SOURCE_SP_SHMON,
    description: "Deposit UNO in the shMON stability pool to earn NTA rewards",
  },
  [EAdapters.SMON_SP]: {
    name: "sMON Stability Pool",
    type: EAdapterType.STABILITY_POOL,
    collateralSymbol: "sMON",
    branchId: 2,
    depositToken: "UNO",
    sourceId: SOURCE_IDS.SOURCE_SP_SMON,
    description: "Deposit UNO in the sMON stability pool to earn NTA rewards",
  },
  [EAdapters.GMON_SP]: {
    name: "gMON Stability Pool",
    type: EAdapterType.STABILITY_POOL,
    collateralSymbol: "gMON",
    branchId: 3,
    depositToken: "UNO",
    sourceId: SOURCE_IDS.SOURCE_SP_GMON,
    description: "Deposit UNO in the gMON stability pool to earn NTA rewards",
  },
  // Liquidity Pool Adapters - wrap LP gauge/staking contracts
  [EAdapters.DEX_A_LP]: {
    name: "DEX A UNO-USDC LP",
    type: EAdapterType.LIQUIDITY_POOL,
    depositToken: "LP",
    sourceId: SOURCE_IDS.SOURCE_LP_DEX_A,
    description: "Stake UNO-USDC LP tokens to earn NTA rewards",
  },
  [EAdapters.DEX_B_LP]: {
    name: "DEX B UNO-MON LP",
    type: EAdapterType.LIQUIDITY_POOL,
    depositToken: "LP",
    sourceId: SOURCE_IDS.SOURCE_LP_DEX_B,
    description: "Stake UNO-MON LP tokens to earn NTA rewards",
  },
  // UNO Vault Adapter - for staking UNO tokens
  [EAdapters.UNO_VAULT]: {
    name: "UNO Staking Vault",
    type: EAdapterType.UNO_VAULT,
    depositToken: "UNO",
    sourceId: SOURCE_IDS.SOURCE_NTA,
    description: "Stake UNO tokens to boost your airdrop allocation",
  },
};

/**
 * List of all Stability Pool adapters
 */
export const SP_ADAPTERS: EAdapters[] = [
  EAdapters.MON_SP,
  EAdapters.SHMON_SP,
  EAdapters.SMON_SP,
  EAdapters.GMON_SP,
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
  EAdapters.UNO_VAULT,
];

/**
 * Map from collateral symbol to SP adapter
 */
const COLLATERAL_TO_SP_ADAPTER: Partial<Record<CollateralSymbol, EAdapters>> = {
  MON: EAdapters.MON_SP,
  shMON: EAdapters.SHMON_SP,
  sMON: EAdapters.SMON_SP,
  gMON: EAdapters.GMON_SP,
};

/**
 * Get the SP adapter for a given collateral symbol
 * @param symbol The collateral symbol (MON, shMON, sMON, gMON)
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
 * Check if an adapter is the UNO Vault adapter
 */
export function isUnoVaultAdapter(adapter: EAdapters): boolean {
  return ADAPTER_CONFIGS[adapter].type === EAdapterType.UNO_VAULT;
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
