import type { Address, Dnum } from "@/src/types";
import type { EAdapters } from "@/src/config/adapters";
import type { EMilestone } from "@/src/config/milestones";

/**
 * Per-adapter user share data
 */
export type AdapterShare = {
  /** The adapter type */
  adapter: EAdapters;
  /** User's deposited amount in the adapter (UNO for SP, LP tokens for LP, NTA for vault) */
  userDeposit: Dnum;
  /** User's share of the adapter's total deposits (0-1) */
  sharePercent: Dnum;
  /** User's pending NTA rewards from this adapter */
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
  /** Total deposits converted to UNO equivalent (for milestone calculation) */
  totalUnoEquivalent: Dnum;
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
  /** Amount of UNO needed to reach next milestone */
  amountToNext: Dnum;
  /** Current reward multiplier */
  rewardMultiplier: number;
  /** All achieved milestones */
  achievedMilestones: EMilestone[];
  /** Total UNO deposited globally across all adapters */
  totalGlobalDeposits: Dnum;
};

/**
 * User's airdrop allocation data
 */
export type UserAllocation = {
  /** Total pending NTA rewards across all adapters */
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
 * UNO Vault specific data
 */
export type UnoVaultData = {
  /** User's UNO balance (not staked) */
  unoBalance: Dnum;
  /** User's staked UNO in vault */
  stakedUno: Dnum;
  /** Total UNO staked in vault globally */
  totalStakedUno: Dnum;
  /** User's share of vault (0-1) */
  vaultSharePercent: Dnum;
  /** Pending NTA rewards from vault staking */
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

  // UNO Vault data
  unoVaultData: UnoVaultData | null;
  isLoadingUnoVaultData: boolean;

  // Status
  isConnected: boolean;
  userAddress: Address | null;

  // Actions
  refetchAll: () => void;
  refetchUserAllocation: () => void;
  refetchMilestoneData: () => void;
};

/**
 * UNO Vault context value
 */
export type UnoVaultContextValue = {
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
  unoBalance: Dnum | null;
  stakedUno: Dnum | null;

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
 * UNO vault deposit request type (for transaction flow)
 */
export type UnoVaultDepositRequest = {
  flowId: "unoVaultDeposit";
  backLink: [string, string];
  userAddress: Address;
  amount: Dnum;
  mode: "deposit" | "withdraw";
};
