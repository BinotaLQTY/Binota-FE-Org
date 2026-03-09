"use client";

import { Amount } from "@/src/comps/Amount/Amount";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import { ADAPTER_CONFIGS } from "@/src/config/adapters";
import { MILESTONE_CONFIGS, MILESTONES_ORDERED } from "@/src/config/milestones";
import { useAirdrop } from "@/src/services/Airdrop";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { HFlex, VFlex } from "@binota/uikit";
import * as dn from "dnum";

export function AirdropViewer() {
  const { isConnected } = useAccount();
  const {
    milestoneData,
    isLoadingMilestoneData,
    userAllocation,
    isLoadingUserAllocation,
    adapterTotals,
  } = useAirdrop();

  if (!isConnected) {
    return (
      <div
        className={css({
          padding: "48px 24px",
          textAlign: "center",
          color: "contentAlt",
        })}
      >
        Connect your wallet to view your airdrop allocation
      </div>
    );
  }

  if (isLoadingMilestoneData || isLoadingUserAllocation) {
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

  return (
    <VFlex gap={24}>
      {/* Milestone Progress Section */}
      <VFlex gap={16}>
        <div
          className={css({
            fontSize: 16,
            fontWeight: 600,
          })}
        >
          Global Milestone Progress
        </div>

        {milestoneData && (
          <VFlex gap={12}>
            {/* Current milestone info */}
            <HFlex justifyContent="space-between" alignItems="center">
              <div className={css({ color: "contentAlt", fontSize: 14 })}>
                Current Tier:{" "}
                <span className={css({ color: "content", fontWeight: 500 })}>
                  {milestoneData.currentMilestone !== undefined
                    ? MILESTONE_CONFIGS[milestoneData.currentMilestone].name
                    : "None"}
                </span>
              </div>
              <div className={css({ color: "contentAlt", fontSize: 14 })}>
                Multiplier:{" "}
                <span className={css({ color: "accent", fontWeight: 600 })}>
                  {milestoneData.rewardMultiplier}x
                </span>
              </div>
            </HFlex>

            {/* Progress bar */}
            <div
              className={css({
                height: 8,
                background: "fieldBorder",
                borderRadius: 4,
                overflow: "hidden",
              })}
            >
              <div
                className={css({
                  height: "100%",
                  background: "accent",
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                })}
                style={{ width: `${milestoneData.progressPercent}%` }}
              />
            </div>

            {/* Milestone markers */}
            <div
              className={css({
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "contentAlt",
              })}
            >
              {MILESTONES_ORDERED.map((milestone) => {
                const config = MILESTONE_CONFIGS[milestone];
                const isAchieved = milestoneData.achievedMilestones.includes(milestone);
                return (
                  <div
                    key={milestone}
                    className={css({
                      textAlign: "center",
                    })}
                    style={{ color: isAchieved ? config.color : undefined }}
                  >
                    {config.name}
                  </div>
                );
              })}
            </div>

            {/* Next milestone info */}
            {milestoneData.nextMilestone !== undefined && (
              <div className={css({ fontSize: 13, color: "contentAlt" })}>
                <Amount
                  value={milestoneData.amountToNext}
                  format="compact"
                />{" "}
                UNO to {MILESTONE_CONFIGS[milestoneData.nextMilestone].name}
              </div>
            )}
          </VFlex>
        )}
      </VFlex>

      {/* User Allocation Section */}
      {userAllocation && (
        <VFlex gap={16}>
          <div
            className={css({
              fontSize: 16,
              fontWeight: 600,
            })}
          >
            Your Allocation
          </div>

          {/* Total pending rewards */}
          <div
            className={css({
              padding: "24px",
              background: "fieldSurface",
              borderRadius: 8,
              textAlign: "center",
            })}
          >
            <div className={css({ fontSize: 13, color: "contentAlt", marginBottom: 8 })}>
              Total Pending NTA Rewards
            </div>
            <div className={css({ fontSize: 32, fontWeight: 600, color: "accent" })}>
              <Amount value={userAllocation.totalPendingRewards} format="compact" suffix=" NTA" />
            </div>
            <div className={css({ fontSize: 13, color: "contentAlt", marginTop: 8 })}>
              Global Share:{" "}
              <Amount
                value={dn.mul(userAllocation.globalSharePercent, 100)}
                format="pct2z"
              />
            </div>
          </div>

          {/* Per-adapter breakdown */}
          <VFlex gap={8}>
            {/* Header row */}
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 100px 80px",
                gap: 16,
                padding: "0 16px 8px",
                fontSize: 12,
                color: "contentAlt",
              })}
            >
              <div>Pool Name</div>
              <div className={css({ textAlign: "right" })}>NTA</div>
              <div className={css({ textAlign: "right" })}>Deposited</div>
            </div>
            {/* Data rows */}
            {userAllocation.adapterShares
              .filter((share) => dn.gt(share.userDeposit, 0))
              .map((share) => {
                const config = ADAPTER_CONFIGS[share.adapter];
                return (
                  <div
                    key={share.adapter}
                    className={css({
                      display: "grid",
                      gridTemplateColumns: "1fr 100px 80px",
                      gap: 16,
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "fieldSurface",
                      borderRadius: 8,
                      border: "1px solid token(colors.fieldBorder)",
                    })}
                  >
                    <div className={css({ fontSize: 14 })}>
                      {config.name}
                    </div>
                    <div className={css({ fontSize: 14, fontWeight: 600, color: "accent", textAlign: "right" })}>
                      <Amount value={share.pendingRewards} format="compact" suffix=" NTA" />
                    </div>
                    <div className={css({ fontSize: 13, color: "contentAlt", textAlign: "right" })}>
                      <Amount value={share.userDeposit} format="compact" />
                    </div>
                  </div>
                );
              })}
          </VFlex>
        </VFlex>
      )}

      {/* Global Adapter Stats */}
      <VFlex gap={16}>
        <div
          className={css({
            fontSize: 16,
            fontWeight: 600,
          })}
        >
          Adapter Statistics
        </div>

        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            "& > *:last-child:nth-child(odd)": {
              gridColumn: "1 / -1",
            },
          })}
        >
          {adapterTotals.map((total) => {
            const config = ADAPTER_CONFIGS[total.adapter];
            return (
              <div
                key={total.adapter}
                className={css({
                  padding: "12px 16px",
                  background: "fieldSurface",
                  borderRadius: 8,
                })}
              >
                <div className={css({ fontSize: 11, color: "contentAlt", marginBottom: 2 })}>
                  {config.name}
                </div>
                <div className={css({ fontSize: 14, fontWeight: 500 })}>
                  <Amount value={total.totalDeposits} format="compact" />{" "}
                  {config.depositToken}
                </div>
              </div>
            );
          })}
        </div>
      </VFlex>
    </VFlex>
  );
}
