"use client";

import { Leaderboard } from "@/src/screens/HubScreen/components/Leaderboard";
import { PointsBreakdown } from "@/src/screens/HubScreen/components/PointsBreakdown";
import { PointsOverview } from "@/src/screens/HubScreen/components/PointsOverview";
import { PointsProvider } from "@/src/services/Hub/PointsProvider";
import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";

export function PanelPoints() {
  return (
    <PointsProvider>
      <VFlex gap={32}>
        <section>
          <PointsOverview />
        </section>

        <section
          className={css({
            padding: "24px",
            background: "surface",
            borderRadius: 0,
            border: "1px solid token(colors.separator)",
          })}
        >
          <PointsBreakdown />
        </section>

        <section
          className={css({
            padding: "24px",
            background: "surface",
            borderRadius: 0,
            border: "1px solid token(colors.separator)",
          })}
        >
          <Leaderboard />
        </section>
      </VFlex>
    </PointsProvider>
  );
}
