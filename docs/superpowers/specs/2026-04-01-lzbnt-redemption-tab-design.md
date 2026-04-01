# lzBNT Redemption Tab Design

**Date:** 2026-04-01
**Status:** Approved
**Reference:** Moneta-FE-Org lzNTA implementation

## Overview

Add an lzBNT redemption tab to the Hub section, allowing users to convert LayerZero-wrapped BNT tokens to native BNT at a 1:1 ratio with no fees.

## Requirements

- Users can redeem lzBNT for BNT at 1:1 ratio
- No redemption fees
- Display user's lzBNT balance with "Max" button
- Validate: wallet connected, amount > 0, sufficient balance
- Show "Not Available" when contract not configured
- Support mobile dropdown navigation in Hub
- Use BINOTA icon for lzBNT display

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HubScreen.tsx                             │
│  (Tab navigation + mobile dropdown + panel routing)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PanelRedeem.tsx                           │
│  (UI component wrapped in RedeemProvider)                    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐
│ RedeemProvider   │ │ FlowButton   │ │ redeem-contracts.ts │
│ (State context)  │ │ (TX trigger) │ │ (Contract config)   │
└──────────────────┘ └──────────────┘ └─────────────────────┘
              │               │               │
              ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│              TransactionFlow.tsx + redeemLzBnt.tsx           │
│  (Flow registration + execution + UI components)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LzBNT.ts (ABI)                            │
│  (ERC20 + redeem function)                                   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

### New Files

| File | Purpose |
|------|---------|
| `src/abi/LzBNT.ts` | Contract ABI (ERC20 + redeem function) |
| `src/services/Hub/RedeemProvider.tsx` | State management context |
| `src/screens/HubScreen/PanelRedeem.tsx` | UI panel component |
| `src/tx-flows/redeemLzBnt.tsx` | Transaction flow declaration |
| `src/redeem-contracts.ts` | Contract configuration helpers |

### Modified Files

| File | Changes |
|------|---------|
| `src/env.ts` | Add CONTRACT_LZBNT_TOKEN env var |
| `src/services/TransactionFlow.tsx` | Register redeemLzBnt flow |
| `src/screens/HubScreen/HubScreen.tsx` | Add lzBNT tab + mobile dropdown |

## Component Specifications

### PanelRedeem.tsx

- Wrapped in `<RedeemProvider>`
- Input field for redemption amount
- Balance display with "Max" button
- Output section showing BNT to receive (1:1)
- Exchange rate info (1 lzBNT = 1 BNT, no fees)
- Validation error display
- FlowButton triggering `redeemLzBnt` flow
- "About Redeem" info section
- Uses `<TokenIcon symbol="BINOTA" />` for lzBNT display
- Shows "lzBNT Redemption Not Available" when not configured

### RedeemProvider.tsx

**State:**
- `redeemAmount: Dnum` - Amount to redeem
- `lzBntBalance: Dnum | null` - User's lzBNT balance
- `isLoadingBalance: boolean` - Loading state
- `isConfigured: boolean` - Whether contract is configured

**Validation:**
- Wallet must be connected
- Amount must be > 0
- Amount must be <= balance

**Actions:**
- `setRedeemAmount(amount: Dnum)` - Update amount
- `setMaxAmount()` - Set to full balance

**Hooks:**
- Uses `useReadContract` to fetch lzBNT balance via `balanceOf(address)`

### redeemLzBnt.tsx

**Request Schema:**
```typescript
{
  flowId: "redeemLzBnt",
  amount: Dnum,
  backLink: ["/hub/redeem", "Back to Redeem"],
  successLink: ["/hub/redeem", "Go to Redeem"],
  successMessage: string,
}
```

**Flow Steps:**
1. `redeemLzBnt` - Calls `redeem(amount)` on lzBNT contract

**Components:**
- `Summary` - Shows redemption amount and expected BNT
- `Details` - Transaction details for review

### redeem-contracts.ts

```typescript
export function getLzBntContract(): { abi: typeof LzBNT; address: Address } | null
export function isLzBntConfigured(): boolean
```

### LzBNT.ts (ABI)

ERC20 standard functions:
- `balanceOf(address)`
- `decimals()`
- `name()`
- `symbol()`
- `totalSupply()`
- `allowance(owner, spender)`
- `approve(spender, amount)`
- `transfer(to, amount)`
- `transferFrom(from, to, amount)`

Plus lzBNT-specific:
- `redeem(amount)` - Converts lzBNT to BNT

### HubScreen.tsx Changes

**Tabs:**
```typescript
const TABS = [
  { label: "Bridge", id: "bridge" },
  { label: "Points", id: "points" },
  { label: "Airdrop", id: "airdrop" },
  { label: "lzBNT", id: "redeem" },
];
```

**Mobile Support:**
- Use `useBreakpointName()` to detect mobile
- Render `<Dropdown>` on mobile, `<Tabs>` on desktop
- Same pattern as Moneta's HubScreen

**Subtitle Update:**
```
"Bridge UNO across chains, track your points, check your airdrop and redeem lzBNT."
```

## Environment Configuration

### env.ts Schema Addition
```typescript
// lzBNT redemption contract (optional - when not set, redeem feature is disabled)
CONTRACT_LZBNT_TOKEN: v.optional(vAddress()),
```

### .env.local
```
NEXT_PUBLIC_CONTRACT_LZBNT_TOKEN=0x3f3a338b0213f3a5ee39a046d452ff3f875117c7
```

**Note:** This is the BSC lzBNT address. The contract will only work when the app is configured for BSC (or when a Monad-compatible lzBNT contract is deployed and this address is updated). The feature gracefully shows "Not Available" if the contract doesn't exist on the current chain.

## TransactionFlow Registration

Add to `src/services/TransactionFlow.tsx`:
- Import `redeemLzBnt` and `RedeemLzBntRequest`
- Add to `FlowRequestMap` type
- Add to `FlowIdSchema` union
- Add to `flows` object

## Data Flow

1. User navigates to Hub → lzBNT tab
2. PanelRedeem mounts, RedeemProvider fetches lzBNT balance
3. User enters amount (or clicks Max)
4. RedeemProvider validates input
5. User clicks "Redeem lzBNT" button
6. FlowButton triggers redeemLzBnt flow
7. Transaction flow shows Summary → Details → Execution
8. Contract `redeem(amount)` is called
9. User receives BNT tokens at 1:1 ratio
10. Success message displayed, user returns to Hub

## Error Handling

- **Not configured:** Show "lzBNT Redemption Not Available" panel
- **Wallet not connected:** Validation error "Connect wallet to redeem"
- **Insufficient balance:** Validation error "Insufficient lzBNT balance"
- **Zero amount:** Button disabled, no error shown
- **Transaction failure:** Standard flow error handling

## Testing Considerations

- Test with contract not configured (graceful degradation)
- Test validation states (no wallet, zero amount, insufficient balance)
- Test max button functionality
- Test mobile dropdown navigation
- Test transaction flow completion
