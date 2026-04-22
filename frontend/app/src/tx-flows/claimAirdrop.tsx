import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { getAirdropContract } from "@/src/airdrop-contracts";
import { Amount } from "@/src/comps/Amount/Amount";
import { EAdapters, ADAPTER_CONFIGS } from "@/src/config/adapters";
import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { usePrice } from "@/src/services/Prices";
import { vDnum } from "@/src/valibot-utils";
import * as dn from "dnum";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";

const RequestSchema = createRequestSchema(
  "claimAirdrop",
  {
    pendingRewards: vDnum(),
    adaptersToClaim: v.array(v.enum(EAdapters)),
  },
);

export type ClaimAirdropRequest = v.InferOutput<typeof RequestSchema>;

export const claimAirdrop: FlowDeclaration<ClaimAirdropRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    const ntaPrice = usePrice("BINOTA");
    const rewardsInUsd = ntaPrice.data && dn.mul(request.pendingRewards, ntaPrice.data);

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
          Claiming BNT Rewards
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          <Amount value={request.pendingRewards} suffix=" BNT" />
        </div>
        {rewardsInUsd && (
          <div style={{ fontSize: 14, color: "var(--colors-content-alt)" }}>
            <Amount value={rewardsInUsd} prefix="$" />
          </div>
        )}
        <div style={{ fontSize: 12, color: "var(--colors-content-alt)", marginTop: 8 }}>
          From {request.adaptersToClaim.length} adapter(s)
        </div>
      </div>
    );
  },

  Details({ request }) {
    const ntaPrice = usePrice("BINOTA");
    const rewardsInUsd = ntaPrice.data && dn.mul(request.pendingRewards, ntaPrice.data);

    return (
      <>
        <TransactionDetailsRow
          label="Claiming BNT rewards"
          value={[
            <Amount
              key="start"
              value={request.pendingRewards}
              suffix=" BNT"
            />,
            <Amount
              key="end"
              value={rewardsInUsd}
              prefix="$"
              fallback="−"
            />,
          ]}
        />
        <TransactionDetailsRow
          label="From adapters"
          value={[
            <span key="adapters">
              {request.adaptersToClaim
                .map((a) => ADAPTER_CONFIGS[a].name)
                .join(", ")}
            </span>,
          ]}
        />
      </>
    );
  },

  steps: {
    claimRewards: {
      name: () => "Claim BNT rewards",
      Status: TransactionStatus,

      async commit(ctx) {
        const rewardsController = getAirdropContract("NtaRewardsController");

        if (!rewardsController) {
          // Mock fallback for development/testing
          console.log("Mock: Claiming airdrop rewards", {
            account: ctx.account,
            pendingRewards: ctx.request.pendingRewards,
            adapters: ctx.request.adaptersToClaim,
          });
          return `0x${"0".repeat(64)}`;
        }

        // Get source IDs for selected adapters
        const sourceIds = ctx.request.adaptersToClaim.map(
          (a) => ADAPTER_CONFIGS[a].sourceId
        );

        return ctx.writeContract({
          ...rewardsController,
          functionName: "claim",
          args: [sourceIds, ctx.account], // sourceIds[], recipient
        });
      },

      async verify(ctx, hash) {
        const rewardsController = getAirdropContract("NtaRewardsController");

        if (!rewardsController) {
          // Mock fallback
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Mock: Airdrop claim verified", hash);
          return;
        }

        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },
  },

  async getSteps() {
    return ["claimRewards"];
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
