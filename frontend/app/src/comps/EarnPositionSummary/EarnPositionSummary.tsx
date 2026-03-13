import { InfoTooltip, TokenIcon } from "@binota/uikit";
import * as dn from "dnum";
import type { ReactNode } from "react";
import { Amount } from "@/src/comps/Amount/Amount";
import { TagPreview } from "@/src/comps/TagPreview/TagPreview";
import { fmtnum } from "@/src/formatting";
import { getCollToken, isEarnPositionActive, useEarnPool } from "@/src/liquity-utils";
import type { BranchId, Dnum, PositionEarn } from "@/src/types";
import { css } from "@/styled-system/css";
import { EarnPositionSummaryBase } from "./EarnPositionSummaryBase";

export function EarnPositionSummary({
  branchId,
  earnPosition,
  linkToScreen,
  poolDeposit,
  prevEarnPosition = null,
  prevPoolDeposit,
  title,
  txPreviewMode,
}: {
  branchId: BranchId;
  earnPosition: PositionEarn | null;
  linkToScreen?: boolean;
  prevEarnPosition?: PositionEarn | null;
  title?: ReactNode;
  txPreviewMode?: boolean;
} & ({ poolDeposit: Dnum; prevPoolDeposit: Dnum } | { poolDeposit?: undefined; prevPoolDeposit?: undefined })) {
  const collToken = getCollToken(branchId);
  const earnPool = useEarnPool(branchId);

  // The earnUpdate tx flow provides static values
  // for poolDeposit and prevPoolDeposit. If these are
  // not provided, we use the values from the earnPool data.
  if (!poolDeposit) {
    poolDeposit = earnPool.data?.totalDeposited ?? undefined;
  }

  let share = dn.from(0, 18);
  if (earnPosition && poolDeposit && dn.gt(poolDeposit, 0)) {
    share = dn.div(earnPosition.deposit, poolDeposit);
  }

  let prevShare = dn.from(0, 18);
  if (prevEarnPosition && prevPoolDeposit && dn.gt(prevPoolDeposit, 0)) {
    prevShare = dn.div(prevEarnPosition.deposit, prevPoolDeposit);
  }

  const active = txPreviewMode || isEarnPositionActive(earnPosition);

  return (
    <EarnPositionSummaryBase
      action={
        !linkToScreen
          ? null
          : {
              label: `${active ? "Manage" : "Deposit to"} ${collToken.name} pool`,
              path: `/earn/${collToken.symbol.toLowerCase()}`,
            }
      }
      active={active}
      poolToken={collToken.symbol}
      title={title ?? `${collToken.name} Stability Pool`}
      poolInfo={
        txPreviewMode ? (
          <TagPreview />
        ) : (
          <>
            <div
              className={css({
                display: "flex",
                gap: 6,
              })}
            >
              <div
                className={css({
                  color: "contentAlt2",
                })}
              >
                APR
              </div>
              <div>
                <Amount fallback="-%" format="1z" percentage value={earnPool.data?.apr} />
              </div>
              <InfoTooltip
                content={{
                  heading: "Current APR",
                  body: "The annualized rate this stability pool’s " + "deposits earned over the last 24 hours.",
                  footerLink: {
                    label: "Check Dune for more details",
                    href: "https://dune.com/liquity/liquity-v2",
                  },
                }}
              />
            </div>
            <div
              className={css({
                display: "flex",
                gap: 4,
                fontSize: 14,
              })}
            >
              <div
                className={css({
                  whiteSpace: "nowrap",
                  color: "contentAlt2",
                })}
              >
                7d APR
              </div>
              <Amount fallback="-%" format="1z" percentage value={earnPool.data?.apr7d} />
              <InfoTooltip
                content={{
                  heading: "APR (last 7 days)",
                  body:
                    "The annualized percentage rate this stability pool’s " + "deposits earned over the past 7 days.",
                  footerLink: {
                    label: "Check Dune for more details",
                    href: "https://dune.com/liquity/liquity-v2",
                  },
                }}
              />
            </div>
          </>
        )
      }
      subtitle={
        <>
          <div>TVL</div>
          <div>
            <Amount fallback="-" format="compact" prefix="$" value={poolDeposit} />
          </div>
          <InfoTooltip heading="Total Value Locked (TVL)">
            Total amount of UNO deposited in this stability pool.
          </InfoTooltip>
        </>
      }
      infoItems={[
        {
          label: "Deposit",
          content: (
            <>
              <div
                title={active ? `${fmtnum(earnPosition?.deposit, "full")} UNO` : undefined}
                className={css({
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 4,
                  height: 24,
                })}
              >
                {active && fmtnum(earnPosition?.deposit)}
                <TokenIcon symbol="UNO" size="mini" title={null} />
              </div>
              {prevEarnPosition && (
                <div
                  title={`${fmtnum(prevEarnPosition.deposit, "full")} UNO`}
                  className={css({
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 4,
                    height: 24,
                    color: "contentAlt",
                    textDecoration: "line-through",
                  })}
                >
                  {fmtnum(prevEarnPosition.deposit)}
                  <TokenIcon symbol="UNO" size="mini" title={null} />
                </div>
              )}
            </>
          ),
        },
        txPreviewMode
          ? null
          : {
              label: "Rewards",
              content: active ? (
                <>
                  <div
                    title={`${fmtnum(earnPosition?.rewards.bold, "full")} BOLD`}
                    className={css({
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 4,
                      height: 24,
                      fontVariantNumeric: "tabular-nums",
                    })}
                  >
                    {fmtnum(earnPosition?.rewards.bold)}
                    <TokenIcon symbol="UNO" size="mini" title={null} />
                  </div>
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 4,
                      height: 24,
                    })}
                  >
                    <Amount value={earnPosition?.rewards.coll} />
                    <TokenIcon symbol={collToken.symbol} size="mini" />
                  </div>
                </>
              ) : (
                <div
                  className={css({
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: 24,
                  })}
                >
                  <TokenIcon.Group size="mini">
                    <TokenIcon symbol="UNO" />
                    <TokenIcon symbol={collToken.symbol} />
                  </TokenIcon.Group>
                </div>
              ),
            },
        !active
          ? null
          : {
              label: "Pool share",
              content: (
                <>
                  <Amount percentage value={share} />
                  {prevEarnPosition && (
                    <div
                      className={css({
                        display: "inline",
                        color: "contentAlt",
                        textDecoration: "line-through",
                      })}
                    >
                      <Amount percentage value={prevShare} />
                    </div>
                  )}
                </>
              ),
            },
      ].filter((item) => item !== null)}
    />
  );
}
