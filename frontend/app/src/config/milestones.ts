import { parseEther } from "viem";

/**
 * Enum for milestone tiers
 */
export enum EMilestone {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  PLATINUM = 3,
  DIAMOND = 4,
  COSMIC = 5,
}

/**
 * Milestone configuration type
 */
export type TMilestoneConfig = {
  /** Display name for the milestone */
  name: string;
  /** Description of the milestone reward/benefit */
  description: string;
  /** UNO token threshold required to reach this milestone (in wei) */
  threshold: bigint;
  /** Display threshold for UI (in UNO tokens) */
  thresholdDisplay: number;
  /** NTA reward multiplier for this tier */
  rewardMultiplier: number;
  /** Color for UI display */
  color: string;
};

/**
 * Milestone configurations
 * Thresholds represent total UNO deposited across all adapters
 */
export const MILESTONE_CONFIGS: { [key in EMilestone]: TMilestoneConfig } = {
  [EMilestone.BRONZE]: {
    name: "Bronze",
    description: "First milestone achieved! 1x NTA rewards",
    threshold: parseEther("1000000"),
    thresholdDisplay: 1_000_000,
    rewardMultiplier: 1.0,
    color: "#CD7F32",
  },
  [EMilestone.SILVER]: {
    name: "Silver",
    description: "Silver tier! 1.25x NTA rewards",
    threshold: parseEther("5000000"),
    thresholdDisplay: 5_000_000,
    rewardMultiplier: 1.25,
    color: "#C0C0C0",
  },
  [EMilestone.GOLD]: {
    name: "Gold",
    description: "Gold tier! 1.5x NTA rewards",
    threshold: parseEther("10000000"),
    thresholdDisplay: 10_000_000,
    rewardMultiplier: 1.5,
    color: "#FFD700",
  },
  [EMilestone.PLATINUM]: {
    name: "Platinum",
    description: "Platinum tier! 1.75x NTA rewards",
    threshold: parseEther("25000000"),
    thresholdDisplay: 25_000_000,
    rewardMultiplier: 1.75,
    color: "#E5E4E2",
  },
  [EMilestone.DIAMOND]: {
    name: "Diamond",
    description: "Diamond tier! 2x NTA rewards",
    threshold: parseEther("75000000"),
    thresholdDisplay: 75_000_000,
    rewardMultiplier: 2.0,
    color: "#B9F2FF",
  },
  [EMilestone.COSMIC]: {
    name: "Cosmic",
    description: "Final milestone achieved! 2x NTA rewards",
    threshold: parseEther("150000000"),
    thresholdDisplay: 150_000_000,
    rewardMultiplier: 2.0,
    color: "#9B59B6",
  },
};

/**
 * Ordered list of milestones (lowest to highest)
 */
export const MILESTONES_ORDERED: EMilestone[] = [
  EMilestone.BRONZE,
  EMilestone.SILVER,
  EMilestone.GOLD,
  EMilestone.PLATINUM,
  EMilestone.DIAMOND,
  EMilestone.COSMIC,
];

/**
 * Get milestone configuration
 * @param milestone The milestone enum
 * @returns The milestone configuration
 */
export function getMilestoneConfig(milestone: EMilestone): TMilestoneConfig {
  return MILESTONE_CONFIGS[milestone];
}

/**
 * Get the current milestone tier based on total UNO deposited
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns The current milestone tier, or undefined if no milestone reached
 */
export function getCurrentMilestone(
  totalUnoDeposited: bigint
): EMilestone | undefined {
  // Iterate from highest to lowest to find the highest achieved milestone
  for (let i = MILESTONES_ORDERED.length - 1; i >= 0; i--) {
    const milestone = MILESTONES_ORDERED[i];
    if (
      milestone !== undefined &&
      totalUnoDeposited >= MILESTONE_CONFIGS[milestone].threshold
    ) {
      return milestone;
    }
  }
  return undefined;
}

/**
 * Get the next milestone tier to achieve
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns The next milestone tier to achieve, or undefined if all milestones reached
 */
export function getNextMilestone(
  totalUnoDeposited: bigint
): EMilestone | undefined {
  for (const milestone of MILESTONES_ORDERED) {
    if (totalUnoDeposited < MILESTONE_CONFIGS[milestone].threshold) {
      return milestone;
    }
  }
  return undefined;
}

/**
 * Calculate progress towards the next milestone
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns Progress percentage (0-100) towards the next milestone, or 100 if all reached
 */
export function getMilestoneProgress(totalUnoDeposited: bigint): number {
  const currentMilestone = getCurrentMilestone(totalUnoDeposited);
  const nextMilestone = getNextMilestone(totalUnoDeposited);

  if (!nextMilestone) {
    return 100; // All milestones reached
  }

  const nextThreshold = MILESTONE_CONFIGS[nextMilestone].threshold;
  const currentThreshold = currentMilestone
    ? MILESTONE_CONFIGS[currentMilestone].threshold
    : BigInt(0);

  const progressRange = nextThreshold - currentThreshold;
  const currentProgress = totalUnoDeposited - currentThreshold;

  if (progressRange === BigInt(0)) {
    return 0;
  }

  // Calculate percentage (multiply by 100 first to maintain precision)
  const percentage = Number((currentProgress * BigInt(100)) / progressRange);
  return Math.min(Math.max(percentage, 0), 100);
}

/**
 * Get amount needed to reach the next milestone
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns Amount needed in wei, or 0 if all milestones reached
 */
export function getAmountToNextMilestone(totalUnoDeposited: bigint): bigint {
  const nextMilestone = getNextMilestone(totalUnoDeposited);

  if (!nextMilestone) {
    return BigInt(0);
  }

  const nextThreshold = MILESTONE_CONFIGS[nextMilestone].threshold;
  return nextThreshold - totalUnoDeposited;
}

/**
 * Get all achieved milestones
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns Array of achieved milestone enums
 */
export function getAchievedMilestones(totalUnoDeposited: bigint): EMilestone[] {
  return MILESTONES_ORDERED.filter(
    (milestone) => totalUnoDeposited >= MILESTONE_CONFIGS[milestone].threshold
  );
}

/**
 * Get the current reward multiplier based on achieved milestone
 * @param totalUnoDeposited Total UNO tokens deposited across all adapters (in wei)
 * @returns The reward multiplier (1.0 if no milestone reached)
 */
export function getCurrentRewardMultiplier(totalUnoDeposited: bigint): number {
  const currentMilestone = getCurrentMilestone(totalUnoDeposited);
  if (!currentMilestone) {
    return 1.0;
  }
  return MILESTONE_CONFIGS[currentMilestone].rewardMultiplier;
}
