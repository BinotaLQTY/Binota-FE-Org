"use client";

import { css } from "@/styled-system/css";
import { VFlex } from "@binota/uikit";

const ELIGIBILITY_CRITERIA = [
  {
    id: "milestone",
    title: "Global Milestones",
    description: "Reach community B1 deposit milestones to unlock higher reward multipliers",
  },
  {
    id: "lp",
    title: "Liquidity Pools",
    description: "Provide liquidity in partner DEX pools to earn additional BNT",
  },
  {
    id: "b1",
    title: "B1 Vault",
    description: "Stake B1 tokens to boost your airdrop allocation",
  },
];

export function EligibilityRules() {
  return (
    <VFlex gap={16}>
      <div
        className={css({
          fontSize: 18,
          fontWeight: 600,
        })}
      >
        How to Earn BNT
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        })}
      >
        {ELIGIBILITY_CRITERIA.map((criteria) => (
          <CriteriaCard key={criteria.id} {...criteria} />
        ))}
      </div>
    </VFlex>
  );
}

function CriteriaCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className={css({
        padding: "20px",
        background: "fieldSurface",
        borderRadius: 0,
        border: "1px solid token(colors.fieldBorder)",
        transition: "border-color 0.2s",
        _hover: {
          borderColor: "accent",
        },
      })}
    >
      <VFlex gap={4}>
        <div
          className={css({
            fontSize: 14,
            fontWeight: 600,
          })}
        >
          {title}
        </div>
        <div
          className={css({
            fontSize: 13,
            color: "contentAlt",
            lineHeight: 1.4,
          })}
        >
          {description}
        </div>
      </VFlex>
    </div>
  );
}
