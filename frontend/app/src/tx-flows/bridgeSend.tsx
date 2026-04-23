import type { FlowDeclaration } from "@/src/services/TransactionFlow";
import type { Address } from "@/src/types";

import { Amount } from "@/src/comps/Amount/Amount";
import {
  BRIDGE_ADDRESS,
  BridgeContract,
  buildSendParams,
  FEE_ASSET,
  HUB_CHAIN_NAMES,
  type HubChainId,
  B1_TOKEN_ADDRESSES,
} from "@/src/hub-utils";
import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vDnum } from "@/src/valibot-utils";
import * as v from "valibot";
import { maxUint256 } from "viem";
import { createRequestSchema, verifyTransaction } from "./shared";

const RequestSchema = createRequestSchema("bridgeSend", {
  amount: vDnum(),
  sourceChainId: v.number() as v.BaseSchema<HubChainId, HubChainId, v.BaseIssue<unknown>>,
  destinationChainId: v.number() as v.BaseSchema<HubChainId, HubChainId, v.BaseIssue<unknown>>,
  fee: vDnum(),
  recipientAddress: v.string() as v.BaseSchema<Address, Address, v.BaseIssue<unknown>>,
});

export type BridgeSendRequest = v.InferOutput<typeof RequestSchema>;

export const bridgeSend: FlowDeclaration<BridgeSendRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--color-content-alt)" }}>
          Bridge UNO
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
          <Amount value={request.amount} /> UNO
        </div>
        <div style={{ marginTop: 8, fontSize: 14 }}>
          {HUB_CHAIN_NAMES[request.sourceChainId]} →{" "}
          {HUB_CHAIN_NAMES[request.destinationChainId]}
        </div>
      </div>
    );
  },

  Details({ request }) {
    return (
      <>
        <TransactionDetailsRow
          label="You bridge"
          value={[
            <Amount key="amount" suffix=" B1" value={request.amount} />,
          ]}
        />
        <TransactionDetailsRow
          label="From"
          value={HUB_CHAIN_NAMES[request.sourceChainId]}
        />
        <TransactionDetailsRow
          label="To"
          value={HUB_CHAIN_NAMES[request.destinationChainId]}
        />
        <TransactionDetailsRow
          label="Bridge fee"
          value={[
            <Amount
              key="fee"
              value={request.fee}
              suffix={` ${FEE_ASSET[request.sourceChainId]}`}
            />,
          ]}
        />
      </>
    );
  },

  steps: {
    approve: {
      name: () => "Approve B1",
      Status: TransactionStatus,
      async commit(ctx) {
        const tokenAddress = B1_TOKEN_ADDRESSES[ctx.request.sourceChainId];

        return ctx.writeContract({
          address: tokenAddress,
          abi: [
            {
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              name: "approve",
              outputs: [{ name: "", type: "bool" }],
              stateMutability: "nonpayable",
              type: "function",
            },
          ] as const,
          functionName: "approve",
          args: [BRIDGE_ADDRESS, maxUint256],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe, false);
      },
    },

    send: {
      name: () => "Bridge B1",
      Status: TransactionStatus,
      async commit(ctx) {
        const sendParams = buildSendParams({
          destinationChainId: ctx.request.destinationChainId,
          recipientAddress: ctx.request.recipientAddress,
          amount: ctx.request.amount[0],
        });

        return ctx.writeContract({
          ...BridgeContract,
          functionName: "send",
          args: [
            sendParams,
            {
              nativeFee: ctx.request.fee[0],
              lzTokenFee: 0n,
            },
            ctx.request.recipientAddress,
          ],
          value: ctx.request.fee[0], // Send native fee
        });
      },
      async verify(ctx, hash) {
        // Don't wait for subgraph indexation as this is cross-chain
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe, false);
      },
    },
  },

  async getSteps(ctx) {
    const steps: string[] = [];

    // Check allowance
    const tokenAddress = B1_TOKEN_ADDRESSES[ctx.request.sourceChainId];
    const allowance = await ctx.readContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const,
      functionName: "allowance",
      args: [ctx.account, BRIDGE_ADDRESS],
    });

    if (ctx.request.amount[0] > allowance) {
      steps.push("approve");
    }

    steps.push("send");

    return steps;
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
