import type { Address } from "@/src/types";

import { LzBNT } from "@/src/abi/LzBNT";
import { CONTRACT_LZBNT_TOKEN } from "@/src/env";

/**
 * Get the lzBNT token contract configuration
 * Returns null if the contract address is not configured
 */
export function getLzBntContract(): { abi: typeof LzBNT; address: Address } | null {
  if (!CONTRACT_LZBNT_TOKEN) {
    return null;
  }
  return {
    abi: LzBNT,
    address: CONTRACT_LZBNT_TOKEN,
  };
}

/**
 * Check if lzBNT redemption is configured
 * When not configured, the redeem feature should be disabled
 */
export function isLzBntConfigured(): boolean {
  return CONTRACT_LZBNT_TOKEN !== null && CONTRACT_LZBNT_TOKEN !== undefined;
}
