import { TokenIcon } from "@binota/uikit";
import * as dn from "dnum";
import type { FC } from "react";
import { CrossedText } from "@/src/comps/CrossedText";
import { Value } from "@/src/comps/Value/Value";
import { fmtnum } from "@/src/formatting";
import type { getLoanDetails } from "@/src/liquity-math";
import { getCollToken } from "@/src/liquity-utils";
import type { PositionLoan } from "@/src/types";
import { roundToDecimal } from "@/src/utils";
import { css } from "@/styled-system/css";

interface NetValueProps {
  loan: PositionLoan;
  loanDetails: ReturnType<typeof getLoanDetails>;
  prevLoanDetails: null | ReturnType<typeof getLoanDetails>;
}

export const NetValue: FC<NetValueProps> = ({ loanDetails, loan, prevLoanDetails }) => {
  const collToken = getCollToken(loan.branchId);

  if (!collToken) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          lineHeight: 1,
          gap: 12,
        })}
      >
        <div
          title={`${fmtnum(loanDetails.depositPreLeverage)} ${collToken.name}`}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 12,
          })}
        >
          <div>{fmtnum(loanDetails.depositPreLeverage)}</div>

          {prevLoanDetails?.depositPreLeverage &&
            loanDetails.depositPreLeverage &&
            !dn.eq(prevLoanDetails.depositPreLeverage, loanDetails.depositPreLeverage) && (
              <CrossedText title={`${fmtnum(prevLoanDetails.depositPreLeverage, "full")} B1`}>
                {fmtnum(prevLoanDetails.depositPreLeverage)}
              </CrossedText>
            )}

          <TokenIcon symbol={collToken.symbol} size={32} />

          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
            })}
          >
            {loanDetails.leverageFactor !== null && (
              <Value
                negative={loanDetails.status === "underwater" || loanDetails.status === "liquidatable"}
                title={`Multiply: ${roundToDecimal(loanDetails.leverageFactor, 1)}x`}
                className={css({ fontSize: 16 })}
              >
                {roundToDecimal(loanDetails.leverageFactor, 1)}x
              </Value>
            )}

            {prevLoanDetails &&
              prevLoanDetails.leverageFactor !== null &&
              prevLoanDetails.leverageFactor !== loanDetails.leverageFactor && (
                <CrossedText>{roundToDecimal(prevLoanDetails.leverageFactor, 1)}x</CrossedText>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
