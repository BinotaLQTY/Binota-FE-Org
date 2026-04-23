import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { Amount } from "@/src/comps/Amount/Amount";
import { getLzBntContract } from "@/src/redeem-contracts";
import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vDnum } from "@/src/valibot-utils";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";

const RequestSchema = createRequestSchema(
  "redeemLzBnt",
  {
    amount: vDnum(),
  },
);

export type RedeemLzBntRequest = v.InferOutput<typeof RequestSchema>;

export const redeemLzBnt: FlowDeclaration<RedeemLzBntRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
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
          Redeeming lzBNT for BNT
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          <Amount value={request.amount} suffix=" lzBNT" />
        </div>
        <div style={{ fontSize: 14, color: "var(--colors-content-alt)" }}>
          You will receive <Amount value={request.amount} suffix=" BNT" />
        </div>
      </div>
    );
  },

  Details({ request }) {
    return (
      <>
        <TransactionDetailsRow
          label="Redeeming"
          value={[
            <Amount
              key="start"
              value={request.amount}
              suffix=" lzBNT"
            />,
          ]}
        />
        <TransactionDetailsRow
          label="You will receive"
          value={[
            <Amount
              key="start"
              value={request.amount}
              suffix=" BNT"
            />,
          ]}
        />
      </>
    );
  },

  steps: {
    redeemLzBnt: {
      name: () => "Redeem lzBNT",
      Status: TransactionStatus,

      async commit(ctx) {
        const lzBntContract = getLzBntContract();

        if (!lzBntContract) {
          throw new Error("lzBNT contract is not configured");
        }

        return ctx.writeContract({
          ...lzBntContract,
          functionName: "redeem",
          args: [ctx.request.amount[0]], // bigint amount
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe, false);
      },
    },
  },

  async getSteps() {
    return ["redeemLzBnt"];
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
