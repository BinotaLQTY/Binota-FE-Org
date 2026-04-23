"use client";

import { AirdropProvider } from "@/src/services/Airdrop";
import { B1VaultProvider } from "@/src/services/Airdrop";
import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";
import { AirdropViewer } from "./AirdropViewer";
import { EligibilityRules } from "./EligibilityRules";
import { B1VaultPanel } from "./B1VaultPanel";

export function PanelAirdrop() {
  return (
    <AirdropProvider>
      <B1VaultProvider>
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
            <B1VaultPanel />
          </section>
        </VFlex>
      </B1VaultProvider>
    </AirdropProvider>
  );
}
