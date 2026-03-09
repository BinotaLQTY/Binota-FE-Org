"use client";

import { Spinner } from "@/src/comps/Spinner/Spinner";
import { usePoints } from "@/src/services/Hub/PointsProvider";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";

export function PointsOverview() {
  const { isConnected } = useAccount();
  const { userPoints, isLoadingUserPoints, userRank } = usePoints();

  if (!isConnected) {
    return (
      <div
        className={css({
          padding: "48px 24px",
          textAlign: "center",
          color: "contentAlt",
        })}
      >
        Connect your wallet to view your points
      </div>
    );
  }

  if (isLoadingUserPoints) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px",
        })}
      >
        <Spinner size={32} />
      </div>
    );
  }

  if (!userPoints) {
    return (
      <div
        className={css({
          padding: "48px 24px",
          textAlign: "center",
          color: "contentAlt",
        })}
      >
        No points data available
      </div>
    );
  }

  return (
    <VFlex gap={24}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px",
          background: "fieldSurface",
          borderRadius: 0,
        })}
      >
        <div
          className={css({
            fontSize: 14,
            color: "contentAlt",
            textTransform: "uppercase",
            letterSpacing: 1,
          })}
        >
          Your Total Points
        </div>
        <div
          className={css({
            fontSize: 48,
            fontWeight: 600,
            color: "accent",
            marginTop: 8,
          })}
        >
          {userPoints.total.toLocaleString()}
        </div>
        {userRank && (
          <div
            className={css({
              fontSize: 14,
              color: "contentAlt",
              marginTop: 8,
            })}
          >
            Rank #{userRank}
          </div>
        )}
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        })}
      >
        <StatCard label="Active Troves" value={userPoints.trovesCount} />
        <StatCard label="NFT Multipliers" value={userPoints.heroIdBonus + userPoints.kamisamaBonus > 0 ? "Active" : "None"} />
      </div>
    </VFlex>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className={css({
        padding: "16px",
        background: "fieldSurface",
        borderRadius: 0,
        border: "1px solid token(colors.fieldBorder)",
      })}
    >
      <div
        className={css({
          fontSize: 12,
          color: "contentAlt",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        })}
      >
        {label}
      </div>
      <div
        className={css({
          fontSize: 24,
          fontWeight: 500,
          marginTop: 4,
        })}
      >
        {value}
      </div>
    </div>
  );
}
