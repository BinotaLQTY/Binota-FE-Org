# Binota Frontend - Claude Code Guide

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Project Overview

Binota is a fork of [Liquity V2 (Bold)](https://github.com/liquity/bold) - a decentralized borrowing protocol enabling users to mint stablecoins (UNO) against multiple collateral types (MON, MOCKETA). The protocol features user-set interest rates, stability pools, and governance via staking.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Web3:** Wagmi 2, Viem 2, ConnectKit (wallet connection)
- **State:** TanStack React Query 5 (server state), React Context (client state)
- **Styling:** Panda CSS (atomic CSS-in-JS)
- **Validation:** Valibot (runtime schema validation)
- **Numbers:** Dnum (decimal arithmetic for DeFi precision)
- **Data:** GraphQL via subgraph + on-chain reads via Wagmi

## Project Structure

```
frontend/app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── screens/          # Feature screen components (BorrowScreen, LoanScreen, etc.)
│   ├── comps/            # Reusable UI components
│   ├── services/         # Provider components (Ethereum, TransactionFlow, etc.)
│   ├── tx-flows/         # Transaction flow declarations (21 flows)
│   ├── abi/              # Contract ABIs (auto-generated)
│   ├── graphql/          # GraphQL types (code-generated)
│   ├── liquity-*.ts      # Protocol utility hooks and helpers
│   ├── contracts.ts      # Contract management (protocol + branch contracts)
│   ├── subgraph.ts       # GraphQL query functions
│   ├── env.ts            # Environment configuration with Valibot validation
│   └── types.ts          # TypeScript type definitions
frontend/uikit/           # Design system component library
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Route pages: borrow/[collateral], earn/[pool]/[action], loan/[troveId], stake |
| `src/screens/` | Main screen components containing feature logic |
| `src/comps/` | ~63 reusable components (Amount, Field, Positions, etc.) |
| `src/services/` | Context providers for state management |
| `src/tx-flows/` | Declarative transaction flow definitions |
| `src/liquity-utils.ts` | Core protocol hooks (~1000 lines) |

## Build & Development Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack

# Build
pnpm build                  # Full production build (builds deps first)
pnpm build-deps             # Build GraphQL, UIKit, Panda CSS

# Testing & Quality
pnpm test                   # Run Vitest tests
pnpm lint                   # Run oxlint on src/
pnpm coverage               # Run tests with coverage

# Utilities
pnpm update-liquity-abis    # Update contract ABIs from protocol
pnpm build-graphql          # Regenerate GraphQL types
```

## Core Concepts

### Multi-Branch Architecture
The protocol supports up to 10 collateral types ("branches"), each with its own contracts. See `src/contracts.ts:111-118` for structure. Branch ID (0-9) identifies each collateral.

### Transaction Flows
Complex transactions are managed via declarative flow definitions in `src/tx-flows/`. Each flow has:
- Request schema (Valibot validation)
- Summary/Details components
- Multi-step execution with commit/verify phases
- See `src/tx-flows/openBorrowPosition.tsx:43-180` for pattern example

### Position Types
- **Loan (borrow/multiply):** Trove positions with collateral + debt
- **Earn:** Stability pool deposits earning liquidation rewards
- **Stake:** Governance staking for voting power
- See `src/types.ts:62-138` for type definitions

### Contract Interaction
- Protocol contracts (global): BoldToken, CollateralRegistry, Governance, etc.
- Branch contracts (per-collateral): TroveManager, StabilityPool, BorrowerOperations
- Access via `getProtocolContract()` and `getBranchContract()` from `src/contracts.ts:181-221`

## Environment Configuration

All config via env vars validated by Valibot schema in `src/env.ts:107+`. Key vars:
- `CHAIN_ID`, `CHAIN_RPC_URL` - Network config
- `SUBGRAPH_URL` - GraphQL endpoint
- `COLL_0_*` through `COLL_9_*` - Per-branch contract addresses

## Additional Documentation

When working on specific areas, consult these files:

| File | Topics |
|------|--------|
| `.claude/docs/architectural_patterns.md` | Design patterns, state management, component conventions |
| `frontend/app/README.md` | Original Liquity deployment and env setup instructions |

## Quick Reference

- **Add new transaction flow:** Create file in `src/tx-flows/`, register in `src/services/TransactionFlow.tsx:27-48`
- **Add new hook for protocol data:** Add to `src/liquity-utils.ts` following existing patterns
- **Access collateral token info:** `getCollToken(branchId)` from `src/liquity-utils.ts:86-99`
- **Read contract data:** Use `useReadContract` from Wagmi with contracts from `getBranchContract()`

## Workflow Rules

### Build Verification Before Commits
After making multiple file changes, run `pnpm build` to verify there are no build errors BEFORE committing:
1. After completing a set of related changes, run `pnpm build`
2. If the build fails, fix all errors before proceeding with commits
3. Only commit changes once the build passes successfully
4. This catches TypeScript errors, import issues, and other problems early

### Git Commit After Batch Completion
When making changes to files, commit after completing a logical batch of related changes:
1. Complete a batch of related file changes (e.g., a feature component with its types and tests)
2. Run `pnpm build` to verify no errors
3. Stage all related files and commit with a descriptive message explaining the batch
4. Print a clear message in the terminal highlighting the commit was created

Example workflow:
- Edit `types.ts`, `provider.tsx`, `component.tsx` (related feature)
- Run build verification
- Commit all files together with message describing the feature
