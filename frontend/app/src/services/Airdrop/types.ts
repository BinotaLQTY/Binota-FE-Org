import type { Address, Dnum } from "@/src/types";
import type { EAdapters } from "@/src/config/adapters";
import type { EMilestone } from "@/src/config/milestones";

/**
 * Per-adapter user share data
 */
export type AdapterShare = {
  /** The adapter type */
  adapter: EAdapters;
  /** User's deposited amount in the adapter (B1 for SP, LP tokens for LP, BNT for vault) */
  userDeposit: Dnum;
  /** User's share of the adapter's total deposits (0-1) */
  sharePercent: Dnum;
  /** User's pending BNT rewards from this adapter */
  pendingRewards: Dnum;
};

/**
 * Global adapter totals (for milestone tracking)
 */
export type AdapterTotal = {
  /** The adapter type */
  adapter: EAdapters;
  /** Total deposits in the adapter (in deposit token) */
  totalDeposits: Dnum;
  /** Total deposits converted to B1 equivalent (for milestone calculation) */
  totalB1Equivalent: Dnum;
};

/**
 * Milestone progress data
 */
export type MilestoneData = {
  /** Current milestone achieved (or undefined if none) */
  currentMilestone: EMilestone | undefined;
  /** Next milestone to achieve (or undefined if all achieved) */
  nextMilestone: EMilestone | undefined;
  /** Progress percentage towards next milestone (0-100) */
  progressPercent: number;
  /** Amount of B1 needed to reach next milestone */
  amountToNext: Dnum;
  /** Current reward multiplier */
  rewardMultiplier: number;
  /** All achieved milestones */
  achievedMilestones: EMilestone[];
  /** Total B1 deposited globally across all adapters */
  totalGlobalDeposits: Dnum;
};

/**
 * User's airdrop allocation data
 */
export type UserAllocation = {
  /** Total pending BNT rewards across all adapters */
  totalPendingRewards: Dnum;
  /** User's share of total airdrop (0-1) */
  globalSharePercent: Dnum;
  /** Per-adapter breakdown */
  adapterShares: AdapterShare[];
  /** Whether user has any claimable rewards */
  hasClaimableRewards: boolean;
  /** Last claim timestamp (if any) */
  lastClaimAt: number | null;
};

/**
 * B1 Vault specific data
 */
export type B1VaultData = {
  /** User's B1 balance (not staked) */
  b1Balance: Dnum;
  /** User's staked B1 in vault */
  stakedB1: Dnum;
  /** Total B1 staked in vault globally */
  totalStakedB1: Dnum;
  /** User's share of vault (0-1) */
  vaultSharePercent: Dnum;
  /** Pending BNT rewards from vault staking */
  pendingVaultRewards: Dnum;
};

/**
 * Airdrop context value
 */
export type AirdropContextValue = {
  // User allocation data
  userAllocation: UserAllocation | null;
  isLoadingUserAllocation: boolean;

  // Milestone data
  milestoneData: MilestoneData | null;
  isLoadingMilestoneData: boolean;

  // Global adapter totals
  adapterTotals: AdapterTotal[];
  isLoadingAdapterTotals: boolean;

  // B1 Vault data
  b1VaultData: B1VaultData | null;
  isLoadingB1VaultData: boolean;

  // Status
  isConnected: boolean;
  userAddress: Address | null;

  // Actions
  refetchAll: () => void;
  refetchUserAllocation: () => void;
  refetchMilestoneData: () => void;
};

/**
 * B1 Vault context value
 */
export type B1VaultContextValue = {
  // Current mode
  mode: "deposit" | "withdraw";
  setMode: (mode: "deposit" | "withdraw") => void;

  // Input state
  inputValue: string;
  setInputValue: (value: string) => void;
  parsedAmount: Dnum | null;

  // Validation
  isValidAmount: boolean;
  validationError: string | null;

  // Balances
  b1Balance: Dnum | null;
  stakedB1: Dnum | null;

  // Max amounts
  maxDeposit: Dnum | null;
  maxWithdraw: Dnum | null;

  // Loading states
  isLoading: boolean;

  // Actions
  setMaxAmount: () => void;
  clearInput: () => void;
};

/**
 * Claim airdrop request type (for transaction flow)
 */
export type ClaimAirdropRequest = {
  flowId: "claimAirdrop";
  backLink: [string, string];
  userAddress: Address;
  pendingRewards: Dnum;
  adaptersToClaim: EAdapters[];
};

/**
 * B1 vault deposit request type (for transaction flow)
 */
export type B1VaultDepositRequest = {
  flowId: "b1VaultDeposit";
  backLink: [string, string];
  userAddress: Address;
  amount: Dnum;
  mode: "deposit" | "withdraw";
};
