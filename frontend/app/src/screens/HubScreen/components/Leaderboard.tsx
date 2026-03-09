"use client";

import type { LeaderboardEntry } from "@/src/hub-utils";

import { Spinner } from "@/src/comps/Spinner/Spinner";
import { usePoints } from "@/src/services/Hub/PointsProvider";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { shortenAddress, VFlex } from "@binota/uikit";

export function Leaderboard() {
  const { address } = useAccount();
  const { leaderboard, isLoadingLeaderboard } = usePoints();

  if (isLoadingLeaderboard) {
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

  if (!leaderboard || leaderboard.entries.length === 0) {
    return (
      <div
        className={css({
          padding: "48px 24px",
          textAlign: "center",
          color: "contentAlt",
        })}
      >
        No leaderboard data available
      </div>
    );
  }

  return (
    <VFlex gap={16}>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0 16px 0",
        })}
      >
        <div
          className={css({
            fontSize: 14,
            fontWeight: 500,
            color: "contentAlt",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          })}
        >
          Top Rankings
        </div>
        <div
          className={css({
            fontSize: 12,
            color: "contentAlt",
          })}
        >
          {leaderboard.totalParticipants} participants
        </div>
      </div>

      <div
        className={css({
          overflow: "hidden",
          borderRadius: 0,
          border: "1px solid token(colors.fieldBorder)",
        })}
      >
        <table
          className={css({
            width: "100%",
            borderCollapse: "collapse",
          })}
        >
          <thead>
            <tr
              className={css({
                background: "fieldSurface",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "contentAlt",
              })}
            >
              <th className={css({ padding: "12px 16px", textAlign: "left" })}>
                Rank
              </th>
              <th className={css({ padding: "12px 16px", textAlign: "left" })}>
                Address
              </th>
              <th className={css({ padding: "12px 16px", textAlign: "right" })}>
                Troves
              </th>
              <th className={css({ padding: "12px 16px", textAlign: "right" })}>
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.slice(0, 10).map((entry) => (
              <LeaderboardRow
                key={entry.address}
                entry={entry}
                isCurrentUser={
                  address?.toLowerCase() === entry.address.toLowerCase()
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.userEntry &&
        leaderboard.userEntry.rank > 10 &&
        address && (
          <div
            className={css({
              marginTop: 8,
              padding: "16px",
              background: "fieldSurface",
              borderRadius: 0,
              border: "1px solid token(colors.accent)",
            })}
          >
            <div
              className={css({
                fontSize: 12,
                color: "contentAlt",
                marginBottom: 8,
              })}
            >
              Your Position
            </div>
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                gap: 16,
                alignItems: "center",
              })}
            >
              <RankBadge rank={leaderboard.userEntry.rank} />
              <span>{shortenAddress(address, 4)}</span>
              <span className={css({ color: "contentAlt" })}>
                {leaderboard.userEntry.trovesCount} trove
                {leaderboard.userEntry.trovesCount !== 1 ? "s" : ""}
              </span>
              <span className={css({ fontWeight: 600, color: "accent" })}>
                {leaderboard.userEntry.points.toLocaleString()}
              </span>
            </div>
          </div>
        )}
    </VFlex>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  return (
    <tr
      className={css({
        borderTop: "1px solid token(colors.fieldBorder)",
        background: isCurrentUser ? "fieldSurface" : "transparent",
        transition: "background 0.15s",
        _hover: {
          background: "fieldSurface",
        },
      })}
    >
      <td className={css({ padding: "12px 16px" })}>
        <RankBadge rank={entry.rank} />
      </td>
      <td className={css({ padding: "12px 16px" })}>
        <span className={css({ fontFamily: "monospace" })}>
          {shortenAddress(entry.address, 4)}
        </span>
        {isCurrentUser && (
          <span
            className={css({
              marginLeft: 8,
              padding: "2px 6px",
              fontSize: 10,
              background: "accent",
              color: "accentContent",
              borderRadius: 4,
            })}
          >
            YOU
          </span>
        )}
      </td>
      <td className={css({ padding: "12px 16px", textAlign: "right", color: "contentAlt" })}>
        {entry.trovesCount}
      </td>
      <td
        className={css({
          padding: "12px 16px",
          textAlign: "right",
          fontWeight: 600,
        })}
      >
        {entry.points.toLocaleString()}
      </td>
    </tr>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  const colors: Record<number, string> = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
  };

  return (
    <span
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 28,
        height: 28,
        borderRadius: "50%",
        fontSize: 12,
        fontWeight: 600,
      })}
      style={{
        background: isTop3 ? colors[rank] : "transparent",
        color: isTop3 ? "#000" : "inherit",
        border: isTop3 ? "none" : "1px solid currentColor",
      }}
    >
      {rank}
    </span>
  );
}
