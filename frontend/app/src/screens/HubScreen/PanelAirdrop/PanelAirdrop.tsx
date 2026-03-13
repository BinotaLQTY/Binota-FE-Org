"use client";

import { AirdropProvider } from "@/src/services/Airdrop";
import { UnoVaultProvider } from "@/src/services/Airdrop";
import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";
import { AirdropViewer } from "./AirdropViewer";
import { EligibilityRules } from "./EligibilityRules";
import { UnoVaultPanel } from "./UnoVaultPanel";

export function PanelAirdrop() {
  return (
    <AirdropProvider>
      <UnoVaultProvider>
        <VFlex gap={32}>
          <section>
            <EligibilityRules />
          </section>

          <section
            className={css({
              padding: "24px",
              background: "surface",
              borderRadius: 0,
              border: "1px solid token(colors.separator)",
            })}
          >
            <AirdropViewer />
          </section>

          <section
            className={css({
              padding: "24px",
              background: "surface",
              borderRadius: 0,
              border: "1px solid token(colors.separator)",
            })}
          >
            <UnoVaultPanel />
          </section>
        </VFlex>
      </UnoVaultProvider>
    </AirdropProvider>
  );
}
