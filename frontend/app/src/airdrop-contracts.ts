import type { Address } from "@/src/types";

import { erc20Abi } from "viem";

// Import all airdrop ABIs
import { LpAdapterV2 } from "@/src/abi/LpAdapterV2";
import { OneVaultAdapterV2 } from "@/src/abi/OneVaultAdapterV2";
import { SonetaSpAdapterV2 } from "@/src/abi/SonetaSpAdapterV2";
import { StaMilestoneControllerV2 } from "@/src/abi/StaMilestoneControllerV2";
import { StaRewardsControllerV2 } from "@/src/abi/StaRewardsControllerV2";
import { EAdapters, EAdapterType, ADAPTER_CONFIGS } from "@/src/config/adapters";

// Import env vars
import {
  CONTRACT_BOLD_TOKEN,
  CONTRACT_NTA_REWARDS_CONTROLLER,
  CONTRACT_NTA_MILESTONE_CONTROLLER,
  CONTRACT_NTA_TOKEN,
  CONTRACT_UNO_VAULT_ADAPTER,
  CONTRACT_LP_ADAPTER_DEX_A,
  CONTRACT_LP_ADAPTER_DEX_B,
  CONTRACT_SP_ADAPTER_BNB,
} from "@/src/env";

/**
 * Core airdrop contract ABIs
 * Note: NtaToken and B1Token use standard ERC20 ABI
 */
const AIRDROP_ABIS = {
  NtaRewardsController: StaRewardsControllerV2,
  NtaMilestoneController: StaMilestoneControllerV2,
  NtaToken: erc20Abi,
  B1Token: erc20Abi,
} as const;

type AirdropContractName = keyof typeof AIRDROP_ABIS;

/**
 * Core airdrop contract addresses from environment
 */
const AIRDROP_ADDRESSES: Record<AirdropContractName, Address | undefined> = {
  NtaRewardsController: CONTRACT_NTA_REWARDS_CONTROLLER,
  NtaMilestoneController: CONTRACT_NTA_MILESTONE_CONTROLLER,
  NtaToken: CONTRACT_NTA_TOKEN,
  B1Token: CONTRACT_BOLD_TOKEN,
};

/**
 * Adapter contract addresses from environment
 */
const ADAPTER_ADDRESSES: Record<EAdapters, Address | undefined> = {
  [EAdapters.BNB_SP]: CONTRACT_SP_ADAPTER_BNB,
  [EAdapters.DEX_A_LP]: CONTRACT_LP_ADAPTER_DEX_A,
  [EAdapters.DEX_B_LP]: CONTRACT_LP_ADAPTER_DEX_B,
  [EAdapters.B1_VAULT]: CONTRACT_UNO_VAULT_ADAPTER,
};

/**
 * Get a core airdrop contract (RewardsController, MilestoneController, NtaToken)
 * Returns null if the contract address is not configured
 */
export function getAirdropContract<CN extends AirdropContractName>(
  name: CN
): { abi: (typeof AIRDROP_ABIS)[CN]; address: Address } | null {
  const address = AIRDROP_ADDRESSES[name];
  if (!address) {
    return null;
  }

  return {
    abi: AIRDROP_ABIS[name],
    address,
  };
}

/**
 * Get an adapter contract with the correct ABI based on adapter type
 * - Stability Pool adapters use SonetaSpAdapterV2
 * - Liquidity Pool adapters use LpAdapterV2
 * - B1 Vault adapter uses OneVaultAdapterV2
 *
 * Returns null if the adapter address is not configured
 */
export function getAdapterContract(
  adapter: EAdapters
): { abi: typeof SonetaSpAdapterV2 | typeof LpAdapterV2 | typeof OneVaultAdapterV2; address: Address } | null {
  const address = ADAPTER_ADDRESSES[adapter];
  if (!address) {
    return null;
  }

  const config = ADAPTER_CONFIGS[adapter];

  // Select the correct ABI based on adapter type
  const abi =
    config.type === EAdapterType.STABILITY_POOL
      ? SonetaSpAdapterV2
      : config.type === EAdapterType.LIQUIDITY_POOL
        ? LpAdapterV2
        : OneVaultAdapterV2;

  return {
    abi,
    address,
  };
}

/**
 * Check if airdrop contracts are configured
 * When not configured, the app should use mock data
 */
export function isAirdropContractsConfigured(): boolean {
  return !!CONTRACT_NTA_REWARDS_CONTROLLER;
}

/**
 * Get all configured adapter contracts
 * Returns only adapters that have addresses configured
 */
export function getConfiguredAdapters(): EAdapters[] {
  return Object.entries(ADAPTER_ADDRESSES)
    .filter(([_, address]) => !!address)
    .map(([adapter]) => adapter as EAdapters);
}
