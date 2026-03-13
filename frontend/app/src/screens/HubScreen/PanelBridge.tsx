"use client";

import { FlowButton } from "@/src/comps/FlowButton/FlowButton";
import { BridgeForm } from "@/src/screens/HubScreen/components/BridgeForm";
import { BridgeProvider, useBridge } from "@/src/services/Hub/BridgeProvider";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";

export function PanelBridge() {
  return (
    <BridgeProvider>
      <BridgeContent />
    </BridgeProvider>
  );
}

function BridgeContent() {
  const { address, isConnected } = useAccount();
  const {
    amount,
    sourceChainId,
    destinationChainId,
    fee,
    isValidAmount,
    errorMessage,
  } = useBridge();

  const canSubmit =
    isConnected &&
    isValidAmount &&
    destinationChainId !== null &&
    fee !== null &&
    !errorMessage;

  return (
    <VFlex gap={24}>
      <BridgeForm />

      <div className={css({ padding: "0 0 24px 0" })}>
        <FlowButton
          disabled={!canSubmit}
          request={
            canSubmit && address && fee && destinationChainId
              ? {
                  flowId: "bridgeSend",
                  backLink: ["/hub/bridge", "Back to Bridge"],
                  successLink: ["/hub", "Go to Hub"],
                  successMessage:
                    "Your UNO has been bridged successfully. It may take a few minutes to arrive on the destination chain.",
                  amount,
                  sourceChainId,
                  destinationChainId,
                  fee,
                  recipientAddress: address,
                }
              : undefined
          }
        />
      </div>

      <div
        className={css({
          padding: "16px",
          background: "surfaceAlt",
          borderRadius: 0,
          fontSize: 14,
          color: "contentAlt",
        })}
      >
        <VFlex gap={8}>
          <div className={css({ fontWeight: 500, color: "content" })}>
            About Bridge
          </div>
          <p>
            Bridge your UNO tokens between supported chains using LayerZero's
            cross-chain messaging protocol. The bridge is trustless and
            decentralized.
          </p>
          <p>
            Typical transfer times are 2-5 minutes depending on network
            conditions. You can track your transfer on LayerZero Scan.
          </p>
        </VFlex>
      </div>
    </VFlex>
  );
}
