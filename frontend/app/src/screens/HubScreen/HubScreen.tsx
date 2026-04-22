"use client";

import { useBreakpointName } from "@/src/breakpoints";
import { Screen } from "@/src/comps/Screen/Screen";
import { PanelAirdrop } from "@/src/screens/HubScreen/PanelAirdrop";
import { PanelBridge } from "@/src/screens/HubScreen/PanelBridge";
import { PanelPoints } from "@/src/screens/HubScreen/PanelPoints";
import { PanelRedeem } from "@/src/screens/HubScreen/PanelRedeem";
import { css } from "@/styled-system/css";
import { Dropdown, IconChevronDown, Tabs, VFlex } from "@binota/uikit";
import { useParams, useRouter } from "next/navigation";

const TABS = [
  { label: "Bridge", id: "bridge" },
  { label: "Points", id: "points" },
  { label: "Airdrop", id: "airdrop" },
  { label: "lzBNT", id: "redeem" },
];

export function HubScreen() {
  const router = useRouter();
  const { action } = useParams();
  const breakpointName = useBreakpointName();
  const isMobile = breakpointName === "small";

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
              color: "white",
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
              <img src="/assets/BinotaIcon.svg" alt="Binota" width={24} height={24} />
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
            Bridge B1 across chains, track your points, check your airdrop and redeem lzBNT.
          </div>
        ),
      }}
    >
      <VFlex gap={24}>
        {isMobile ? (
          <div className={css({ width: "100%", "& > button": { width: "100%" } })}>
            <Dropdown
              items={TABS.map(({ label }) => ({ label }))}
              selected={TABS.findIndex(({ id }) => id === activeTab)}
              onSelect={(index) => {
                const tab = TABS[index];
                if (!tab) {
                  throw new Error("Invalid tab index");
                }
                router.push(`/hub/${tab.id}`, { scroll: false });
              }}
              floatingUpdater={({ referenceElement, floatingElement }) => {
                return async () => {
                  const refRect = referenceElement.getBoundingClientRect();
                  const buttonWidth = refRect.width * 0.5; // Match the 50% width of visible button
                  const centeredX = refRect.left + (refRect.width - buttonWidth) / 2;
                  const top = refRect.bottom + 8;
                  Object.assign(floatingElement.style, {
                    left: `${centeredX}px`,
                    top: `${top}px`,
                    width: `${buttonWidth}px`,
                  });
                };
              }}
              customButton={({ item, menuVisible }) => (
                <div className={css({ display: "flex", width: "100%", justifyContent: "center" })}>
                  <div
                    className={css({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "50%",
                      padding: "12px 16px",
                      cursor: "pointer",
                      border: "1px solid token(colors.fieldBorder)",
                      background: "fieldSurface",
                    })}
                  >
                    <span
                      className={css({
                        color: "interactive",
                        fontSize: 18,
                        fontWeight: 600,
                      })}
                    >
                      {item?.label ?? "Select"}
                    </span>
                    <div
                      className={css({
                        display: "flex",
                        alignItems: "center",
                        color: "accent",
                        transformOrigin: "50% 50%",
                        transition: "transform 80ms",
                      })}
                      style={{
                        transform: menuVisible ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <IconChevronDown size={24} />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
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
        )}

        {activeTab === "bridge" && <PanelBridge />}
        {activeTab === "points" && <PanelPoints />}
        {activeTab === "airdrop" && <PanelAirdrop />}
        {activeTab === "redeem" && <PanelRedeem />}
      </VFlex>
    </Screen>
  );
}
