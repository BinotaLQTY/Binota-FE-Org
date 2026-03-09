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
  "unoVaultDeposit",
  {
    amount: vDnum(),
    mode: v.union([v.literal("deposit"), v.literal("withdraw")]),
  },
);

export type UnoVaultDepositRequest = v.InferOutput<typeof RequestSchema>;

export const unoVaultDeposit: FlowDeclaration<UnoVaultDepositRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    const unoPrice = usePrice("UNO");
    const amountInUsd = unoPrice.data && dn.mul(request.amount, unoPrice.data);
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
          {isDeposit ? "Staking UNO" : "Unstaking UNO"}
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          <Amount value={request.amount} suffix=" UNO" />
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
    const unoPrice = usePrice("UNO");
    const amountInUsd = unoPrice.data && dn.mul(request.amount, unoPrice.data);
    const isDeposit = request.mode === "deposit";

    return (
      <>
        <TransactionDetailsRow
          label={isDeposit ? "Staking UNO" : "Unstaking UNO"}
          value={[
            <Amount
              key="start"
              value={request.amount}
              suffix=" UNO"
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
                ? "Deposit UNO to boost airdrop allocation"
                : "Withdraw UNO from vault"}
            </span>,
          ]}
        />
      </>
    );
  },

  steps: {
    // Approval step (only for deposit)
    approveUno: {
      name: () => "Approve UNO",
      Status: TransactionStatus,

      async commit(ctx) {
        const unoToken = getAirdropContract("UnoToken");
        const vaultAdapter = getAdapterContract(EAdapters.UNO_VAULT);

        if (!unoToken || !vaultAdapter) {
          // Mock fallback for development/testing
          console.log("Mock: Approving UNO for vault", {
            account: ctx.account,
            amount: ctx.request.amount,
          });
          return `0x${"1".repeat(64)}`;
        }

        return ctx.writeContract({
          ...unoToken,
          functionName: "approve",
          args: [vaultAdapter.address, maxUint256],
        });
      },

      async verify(ctx, hash) {
        const unoToken = getAirdropContract("UnoToken");

        if (!unoToken) {
          // Mock fallback
          await new Promise((resolve) => setTimeout(resolve, 1500));
          console.log("Mock: UNO approval verified", hash);
          return;
        }

        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },

    // Deposit or withdraw step
    executeVaultAction: {
      name: (ctx) =>
        ctx.request.mode === "deposit" ? "Stake UNO" : "Unstake UNO",
      Status: TransactionStatus,

      async commit(ctx) {
        const isDeposit = ctx.request.mode === "deposit";
        const vaultAdapter = getAdapterContract(EAdapters.UNO_VAULT);

        if (!vaultAdapter) {
          // Mock fallback for development/testing
          console.log(`Mock: ${isDeposit ? "Depositing" : "Withdrawing"} UNO`, {
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
        const vaultAdapter = getAdapterContract(EAdapters.UNO_VAULT);

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
      const unoToken = getAirdropContract("UnoToken");
      const vaultAdapter = getAdapterContract(EAdapters.UNO_VAULT);

      if (unoToken && vaultAdapter) {
        // Check if approval is needed
        const allowance = await ctx.readContract({
          ...unoToken,
          functionName: "allowance",
          args: [ctx.account, vaultAdapter.address],
        });

        if ((allowance as bigint) < ctx.request.amount[0]) {
          return ["approveUno", "executeVaultAction"];
        }

        return ["executeVaultAction"];
      }

      // Mock mode: always require approval for deposits
      return ["approveUno", "executeVaultAction"];
    }

    // Withdraw doesn't need approval
    return ["executeVaultAction"];
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
