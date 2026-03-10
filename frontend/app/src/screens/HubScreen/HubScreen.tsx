"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { PanelAirdrop } from "@/src/screens/HubScreen/PanelAirdrop";
import { PanelBridge } from "@/src/screens/HubScreen/PanelBridge";
import { PanelPoints } from "@/src/screens/HubScreen/PanelPoints";
import { css } from "@/styled-system/css";
import { Tabs, VFlex } from "@binota/uikit";
import { useParams, useRouter } from "next/navigation";

const TABS = [
  { label: "Bridge", id: "bridge" },
  { label: "Points", id: "points" },
  { label: "Airdrop", id: "airdrop" },
];

export function HubScreen() {
  const router = useRouter();
  const { action } = useParams();

  // Default to bridge if no action specified
  const currentAction = Array.isArray(action) ? action[0] : action;
  const activeTab = currentAction || "bridge";

  return (
    <Screen
      heading={{
        title: (
          <div
            className={css({
              display: "flex",
              flexFlow: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px 8px",
              color: "token(colors.yellow:800)",
              width: "100%",
              maxWidth: "540px",
              fontSize: "28px",
              marginBottom: "16px",
              marginTop: "24px",
              small: {
                paddingLeft: "8px",
              },
            })}
          >
            <div
              className={css({
                marginRight: "16px",
                marginLeft: "16px",
                marginTop: "-16px",
              })}
            >
              {/* biome-ignore lint/performance/noImgElement: keeping pattern from StakeScreen */}
              <img src="/assets/Hand.png" alt="Binota" width={24} height={24} />
            </div>
            Hub
          </div>
        ),
        subtitle: (
          <div
            className={css({
              display: "flex",
              flexFlow: "wrap",
              alignItems: "left",
              justifyContent: "left",
              gap: "8px 8px",
              marginBottom: "16px",
              small: {
                paddingLeft: "8px",
              },
            })}
          >
            Bridge UNO across chains and track your points
          </div>
        ),
      }}
    >
      <VFlex gap={24}>
        <Tabs
          items={TABS.map(({ label, id }) => ({
            label,
            panelId: `p-${id}`,
            tabId: `t-${id}`,
          }))}
          selected={TABS.findIndex(({ id }) => id === activeTab)}
          onSelect={(index) => {
            const tab = TABS[index];
            if (!tab) {
              throw new Error("Invalid tab index");
            }
            router.push(`/hub/${tab.id}`, { scroll: false });
          }}
        />

        {activeTab === "bridge" && <PanelBridge />}
        {activeTab === "points" && <PanelPoints />}
        {activeTab === "airdrop" && <PanelAirdrop />}
      </VFlex>
    </Screen>
  );
}
