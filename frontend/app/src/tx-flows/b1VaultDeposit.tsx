import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { getAdapterContract, getAirdropContract } from "@/src/airdrop-contracts";
import { Amount } from "@/src/comps/Amount/Amount";
import { EAdapters } from "@/src/config/adapters";
import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { usePrice } from "@/src/services/Prices";
import { vDnum } from "@/src/valibot-utils";
import * as dn from "dnum";
import * as v from "valibot";
import { maxUint256 } from "viem";
import { createRequestSchema, verifyTransaction } from "./shared";

const RequestSchema = createRequestSchema(
  "b1VaultDeposit",
  {
    amount: vDnum(),
    mode: v.union([v.literal("deposit"), v.literal("withdraw")]),
  },
);

export type B1VaultDepositRequest = v.InferOutput<typeof RequestSchema>;

export const b1VaultDeposit: FlowDeclaration<B1VaultDepositRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    const b1Price = usePrice("B1");
    const amountInUsd = b1Price.data && dn.mul(request.amount, b1Price.data);
    const isDeposit = request.mode === "deposit";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 14, color: "var(--colors-content-alt)" }}>
          {isDeposit ? "Staking B1" : "Unstaking B1"}
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          <Amount value={request.amount} suffix=" B1" />
        </div>
        {amountInUsd && (
          <div style={{ fontSize: 14, color: "var(--colors-content-alt)" }}>
            <Amount value={amountInUsd} prefix="$" />
          </div>
        )}
      </div>
    );
  },

  Details({ request }) {
    const b1Price = usePrice("B1");
    const amountInUsd = b1Price.data && dn.mul(request.amount, b1Price.data);
    const isDeposit = request.mode === "deposit";

    return (
      <>
        <TransactionDetailsRow
          label={isDeposit ? "Staking B1" : "Unstaking B1"}
          value={[
            <Amount
              key="start"
              value={request.amount}
              suffix=" B1"
            />,
            <Amount
              key="end"
              value={amountInUsd}
              prefix="$"
              fallback="−"
            />,
          ]}
        />
        <TransactionDetailsRow
          label="Action"
          value={[
            <span key="action">
              {isDeposit
                ? "Deposit B1 to boost airdrop allocation"
                : "Withdraw B1 from vault"}
            </span>,
          ]}
        />
      </>
    );
  },

  steps: {
    // Approval step (only for deposit)
    approveB1: {
      name: () => "Approve B1",
      Status: TransactionStatus,

      async commit(ctx) {
        const b1Token = getAirdropContract("B1Token");
        const vaultAdapter = getAdapterContract(EAdapters.B1_VAULT);

        if (!b1Token || !vaultAdapter) {
          // Mock fallback for development/testing
          console.log("Mock: Approving B1 for vault", {
            account: ctx.account,
            amount: ctx.request.amount,
          });
          return `0x${"1".repeat(64)}`;
        }

        return ctx.writeContract({
          ...b1Token,
          functionName: "approve",
          args: [vaultAdapter.address, maxUint256],
        });
      },

      async verify(ctx, hash) {
        const b1Token = getAirdropContract("B1Token");

        if (!b1Token) {
          // Mock fallback
          await new Promise((resolve) => setTimeout(resolve, 1500));
          console.log("Mock: B1 approval verified", hash);
          return;
        }

        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },

    // Deposit or withdraw step
    executeVaultAction: {
      name: (ctx) =>
        ctx.request.mode === "deposit" ? "Stake B1" : "Unstake B1",
      Status: TransactionStatus,

      async commit(ctx) {
        const isDeposit = ctx.request.mode === "deposit";
        const vaultAdapter = getAdapterContract(EAdapters.B1_VAULT);

        if (!vaultAdapter) {
          // Mock fallback for development/testing
          console.log(`Mock: ${isDeposit ? "Depositing" : "Withdrawing"} B1`, {
            account: ctx.account,
            amount: ctx.request.amount,
            mode: ctx.request.mode,
          });
          return `0x${"2".repeat(64)}`;
        }

        return ctx.writeContract({
          ...vaultAdapter,
          functionName: isDeposit ? "deposit" : "withdraw",
          args: [ctx.request.amount[0], ctx.account], // amount, receiver
        });
      },

      async verify(ctx, hash) {
        const vaultAdapter = getAdapterContract(EAdapters.B1_VAULT);

        if (!vaultAdapter) {
          // Mock fallback
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Mock: Vault action verified", hash);
          return;
        }

        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },
  },

  async getSteps(ctx) {
    if (ctx.request.mode === "deposit") {
      const b1Token = getAirdropContract("B1Token");
      const vaultAdapter = getAdapterContract(EAdapters.B1_VAULT);

      if (b1Token && vaultAdapter) {
        // Check if approval is needed
        const allowance = await ctx.readContract({
          ...b1Token,
          functionName: "allowance",
          args: [ctx.account, vaultAdapter.address],
        });

        if ((allowance as bigint) < ctx.request.amount[0]) {
          return ["approveB1", "executeVaultAction"];
        }

        return ["executeVaultAction"];
      }

      // Mock mode: always require approval for deposits
      return ["approveB1", "executeVaultAction"];
    }

    // Withdraw doesn't need approval
    return ["executeVaultAction"];
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
