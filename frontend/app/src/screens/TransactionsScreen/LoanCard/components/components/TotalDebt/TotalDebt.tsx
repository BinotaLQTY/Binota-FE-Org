import { TokenIcon } from "@binota/uikit";
import * as dn from "dnum";
import type { FC } from "react";
import { CrossedText } from "@/src/comps/CrossedText";
import { fmtnum } from "@/src/formatting";
import type { PositionLoan } from "@/src/types";
import { css } from "@/styled-system/css";

interface TotalDebtProps {
  positive?: boolean;
  loan: PositionLoan;
  prevLoan?: PositionLoan | null;
}

export const TotalDebt: FC<TotalDebtProps> = ({ positive, loan, prevLoan }) => (
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
        title={`${fmtnum(loan.borrowed, "full")} UNO`}
        className={css({
          display: "flex",
          alignItems: "center",
          gap: 12,
        })}
      >
        <div
          style={{
            color: positive ? "var(--colors-positive-alt)" : undefined,
          }}
        >
          {fmtnum(loan.borrowed)}
        </div>
        <TokenIcon symbol="UNO" size={32} />
        {prevLoan && !dn.eq(prevLoan.borrowed, loan.borrowed) && (
          <CrossedText title={`${fmtnum(prevLoan.borrowed, "full")} UNO`}>{fmtnum(prevLoan.borrowed)}</CrossedText>
        )}
      </div>
    </div>
  </div>
);
