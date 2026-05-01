"use client";

import {
  HERO_ID_NFT,
  KAMISAMA_NFT,
  POINTS_PER_DEBT_UNIT,
  POINTS_PER_NFT,
  POINTS_PER_TROVE,
} from "@/src/hub-utils";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import { usePoints } from "@/src/services/Hub/PointsProvider";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { InfoTooltip, VFlex } from "@binota/uikit";

export function PointsBreakdown() {
  const { isConnected } = useAccount();
  const { userPoints, nftBalances, isLoadingUserPoints } = usePoints();

  if (!isConnected) {
    return null;
  }

  if (isLoadingUserPoints) {
    return (
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          padding: "24px",
        })}
      >
        <Spinner size={24} />
      </div>
    );
  }

  if (!userPoints) {
    return null;
  }

  const breakdownItems = [
    {
      label: "Trove Points",
      value: userPoints.trovePoints,
      tooltip: `${userPoints.trovesCount} active troves x ${POINTS_PER_TROVE} points each`,
    },
    {
      label: "Debt Points",
      value: userPoints.debtPoints,
      tooltip: `${POINTS_PER_DEBT_UNIT} point per 1 B1 of debt`,
    },
    {
      label: `${HERO_ID_NFT.name} Bonus`,
      value: userPoints.heroIdBonus,
      tooltip: nftBalances
        ? `${nftBalances.heroId} NFT${nftBalances.heroId !== 1 ? "s" : ""} x ${POINTS_PER_NFT} points (on Arbitrum)`
        : "Loading...",
    },
    {
      label: `${KAMISAMA_NFT.name} Bonus`,
      value: userPoints.kamisamaBonus,
      tooltip: nftBalances
        ? `${nftBalances.kamisama} NFT${nftBalances.kamisama !== 1 ? "s" : ""} x ${POINTS_PER_NFT} points (on Ethereum)`
        : "Loading...",
    },
  ];

  return (
    <VFlex gap={0}>
      <div
        className={css({
          fontSize: 14,
          fontWeight: 500,
          color: "contentAlt",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          padding: "16px 0",
          borderBottom: "1px solid token(colors.fieldBorder)",
        })}
      >
        Points Breakdown
      </div>

      {breakdownItems.map((item) => (
        <BreakdownRow
          key={item.label}
          label={item.label}
          value={item.value}
          tooltip={item.tooltip}
        />
      ))}

      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          fontWeight: 600,
          fontSize: 18,
        })}
      >
        <span>Total</span>
        <span className={css({ color: "accent" })}>
          {userPoints.total.toLocaleString()}
        </span>
      </div>
    </VFlex>
  );
}

function BreakdownRow({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: number;
  tooltip: string;
}) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid token(colors.fieldBorder)",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: 8,
        })}
      >
        <span>{label}</span>
        <InfoTooltip heading={label}>{tooltip}</InfoTooltip>
      </div>
      <span
        className={css({
          color: value > 0 ? "content" : "contentAlt",
        })}
      >
        {value > 0 ? `+${value.toLocaleString()}` : "0"}
      </span>
    </div>
  );
}
