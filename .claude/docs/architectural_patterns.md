# Architectural Patterns

This document describes the architectural patterns, design decisions, and conventions used throughout the Binota frontend codebase.

## 1. Transaction Flow Pattern

Complex blockchain transactions are managed through a declarative flow system.

### Structure
Each flow is defined in `src/tx-flows/` with the following structure:

```typescript
export const flowName: FlowDeclaration<RequestType> = {
  title: "Review & Send Transaction",
  Summary({ request }) { /* Preview component */ },
  Details({ request }) { /* Detailed breakdown */ },
  steps: {
    stepName: {
      name: (ctx) => "Step Display Name",
      Status: StatusComponent,
      commit: async (ctx) => hash,  // Execute transaction
      verify: async (ctx, hash) => {}, // Wait for confirmation
    }
  },
  getSteps: async (ctx) => ["stepName"], // Dynamic step determination
  parseRequest: (data) => RequestType | null, // Validation
};
```

### Examples
- `src/tx-flows/openBorrowPosition.tsx:43-180` - Multi-step with approval
- `src/tx-flows/earnUpdate.tsx` - Stability pool interactions
- `src/tx-flows/stakeDeposit.tsx` - Governance staking

### Registration
All flows must be registered in `src/services/TransactionFlow.tsx:27-48` and `97-119`.

## 2. Multi-Branch Contract Pattern

The protocol supports multiple collateral types, each as a "branch" with its own contracts.

### Branch ID Type
```typescript
// src/types.ts:12
type BranchId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
```

### Contract Access Pattern
```typescript
// Protocol-wide contracts (single instance)
const boldToken = getProtocolContract("BoldToken");

// Branch-specific contracts (per collateral)
const troveManager = getBranchContract(branchId, "TroveManager");
const stabilityPool = getBranchContract(branchId, "StabilityPool");
```

### Implementation
- Contract structure: `src/contracts.ts:111-118`
- Access functions: `src/contracts.ts:181-221`
- Environment config: `src/env.ts:68-85` (per-branch env vars)

## 3. Provider Composition Pattern

The app uses nested React Context providers for state management.

### Provider Hierarchy
Defined in `src/app/layout.tsx`:
```
ReactQuery → UiKit → StoredState → Ethereum → IndicatorManager → Blocking → TransactionFlow → About → AppLayout
```

### Key Providers
| Provider | File | Purpose |
|----------|------|---------|
| `ReactQuery` | `src/services/ReactQuery.tsx` | TanStack Query config |
| `Ethereum` | `src/services/Ethereum.tsx` | Wagmi + ConnectKit setup |
| `StoredState` | `src/services/StoredState.tsx` | Local storage persistence |
| `TransactionFlow` | `src/services/TransactionFlow.tsx` | Transaction orchestration |
| `Prices` | `src/services/Prices.tsx` | Price data context |

## 4. Hook-Based Data Fetching Pattern

Protocol data is fetched via custom hooks that combine React Query with Wagmi.

### Standard Pattern
```typescript
// src/liquity-utils.ts - typical hook structure
export function useEarnPool(branchId: BranchId | null) {
  const wagmiConfig = useWagmiConfig();

  return useQuery({
    queryKey: ["earnPool", branchId, ...],
    queryFn: async () => {
      const data = await readContract(wagmiConfig, {
        ...getBranchContract(branchId, "StabilityPool"),
        functionName: "getTotalBoldDeposits",
      });
      return processedData;
    },
    enabled: branchId !== null,
  });
}
```

### Key Hooks (in `src/liquity-utils.ts`)
- `useLoansByAccount()` - Fetch user's loans via subgraph
- `useEarnPool()` / `useEarnPosition()` - Stability pool data
- `useStakePosition()` - Governance staking position
- `useInterestRateBrackets()` - Interest rate distribution
- `usePredictOpenTroveUpfrontFee()` - Fee estimation

## 5. Valibot Schema Validation Pattern

Runtime validation is used extensively for type safety.

### Environment Validation
```typescript
// src/env.ts:107+
export const EnvSchema = v.pipe(
  v.object({
    CHAIN_ID: v.pipe(v.string(), v.transform(Number)),
    // ... other fields
  }),
  v.transform((env) => processedEnv),
);
```

### Request Validation
```typescript
// src/tx-flows/openBorrowPosition.tsx:30-39
const RequestSchema = createRequestSchema("openBorrowPosition", {
  branchId: vBranchId(),
  owner: vAddress(),
  collAmount: vDnum(),
  boldAmount: vDnum(),
  // ...
});
```

### Custom Validators
Located in `src/valibot-utils.ts`:
- `vAddress()` - Ethereum address
- `vDnum()` - Decimal number
- `vBranchId()` - Branch ID (0-9)

## 6. Screen Component Pattern

Feature screens follow a consistent structure.

### Structure
```
src/screens/FeatureScreen/
├── FeatureScreen.tsx     # Main screen component
├── PanelComponent.tsx    # Sub-panels for different actions
└── components/           # Screen-specific components
```

### Responsibilities
1. Parse route params and validate
2. Fetch required data via hooks
3. Manage local form state
4. Compose UI from reusable components
5. Trigger transaction flows

### Examples
- `src/screens/BorrowScreen/BorrowScreen.tsx:53-150`
- `src/screens/LoanScreen/LoanScreen.tsx`
- `src/screens/EarnPoolScreen/EarnPoolScreen.tsx`

## 7. Prefixed Trove ID Pattern

Trove IDs are prefixed with branch ID for unique identification across branches.

### Format
```typescript
// src/types.ts:15
type PrefixedTroveId = `${BranchId}:${TroveId}`;  // e.g., "0:0x123..."
```

### Utilities
```typescript
// src/liquity-utils.ts:67-84
getPrefixedTroveId(branchId, troveId);  // Create prefixed ID
parsePrefixedTroveId(prefixedId);       // Extract branch + trove ID
```

### Usage
Used in routes, subgraph queries, and as React Query keys.

## 8. Amount Component Pattern

Numeric values are displayed consistently via the Amount component.

### Usage
```typescript
// src/comps/Amount/Amount.tsx
<Amount
  value={dnum}           // Dnum value
  format="2z"            // Format: digits + trailing zeros
  prefix="$"             // Optional prefix
  suffix=" UNO"          // Optional suffix
  percentage={true}      // Multiply by 100 and add %
  fallback="…"           // Loading state
/>
```

### Format Options
- `"2z"` - 2 decimals, strip trailing zeros
- `"compact"` - Abbreviated (1K, 1M)
- `"pct2z"` - Percentage with 2 decimals

## 9. Position Type Pattern

Different position types share a common structure with type discriminators.

### Type Hierarchy
```typescript
// src/types.ts:134-138
type Position = PositionLoan | PositionEarn | PositionStake | PositionSbold;
```

### Type Guards
```typescript
// src/types.ts:95-107
isPositionLoan(position)           // borrow or multiply
isPositionLoanCommitted(position)  // has troveId
isPositionLoanUncommitted(position) // no troveId yet
```

### Rendering Pattern
Position lists use type-specific card components:
- `PositionCardLoan` - Loan positions
- `PositionCardEarn` - Earn positions
- `PositionCardStake` - Stake positions

## 10. Subgraph Query Pattern

GraphQL queries for indexed data follow a consistent structure.

### Query Definition
```typescript
// src/subgraph.ts
const TrovesByAccountQuery = graphql(`
  query TrovesByAccount($account: Bytes!) {
    troves(where: { borrower: $account }) {
      id
      debt
      status
      // ...
    }
  }
`);
```

### Query Function
```typescript
export async function getIndexedTrovesByAccount(account: Address) {
  const { troves } = await graphQuery(TrovesByAccountQuery, {
    account: account.toLowerCase(),
  });
  return troves.map(transformTrove);
}
```

### Error Handling
Subgraph errors are tracked via `src/indicators/subgraph-indicator.ts` and displayed in the UI.

## 11. Form Field Pattern

Form fields use a custom hook for value management.

### Usage
```typescript
// src/form-utils.ts
const deposit = useInputFieldValue(fmtnum, {
  validate: (parsed, value) => ({
    parsed: sanitizedValue,
    value: displayValue,
  }),
});

// Access
deposit.value     // String for display
deposit.parsed    // Dnum for calculations
deposit.isEmpty   // Boolean
deposit.setValue  // Setter function
```

### Integration with InputField
```tsx
<InputField
  value={deposit.value}
  onChange={deposit.setValue}
  // ...
/>
```

## 12. Price Hook Pattern

Token prices are accessed via a dedicated price service.

### Usage
```typescript
// src/services/Prices.tsx
const price = usePrice("MON");  // Returns UseQueryResult<Dnum>

// Access
price.data     // Dnum price value
price.isLoading
price.error
```

### Implementation
Price data is fetched from an external stats API and cached via React Query.
