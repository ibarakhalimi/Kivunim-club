"use client";

import { useTransition, useState } from "react";
import { submitVote } from "@/app/actions/poll";
import type { Tables } from "@/src/types/database";

type Poll = Tables<"polls">;

interface Props {
  poll: Poll;
  voteCounts: number[];
  userVote: number | null;
}

export function PollSection({ poll, voteCounts: initialCounts, userVote: initialVote }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticVote, setOptimisticVote] = useState<number | null>(initialVote);
  const [optimisticCounts, setOptimisticCounts] = useState(initialCounts);

  const hasVoted = optimisticVote !== null;
  const total = optimisticCounts.reduce((s, c) => s + c, 0);

  const options = [poll.option_1, poll.option_2, poll.option_3, poll.option_4];

  function handleVote(optionIndex: number) {
    if (hasVoted || isPending) return;
    const newCounts = [...optimisticCounts];
    newCounts[optionIndex - 1]++;
    setOptimisticVote(optionIndex);
    setOptimisticCounts(newCounts);
    startTransition(async () => {
      await submitVote(poll.id, optionIndex);
    });
  }

  return (
    <section>
      <h2
        style={{
          margin: "0 0 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "-0.018em",
          color: "var(--color-text-primary)",
        }}
      >
        סקר
      </h2>

      <div
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255,255,255,0.6)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          padding: "20px 18px 22px",
        }}
      >
        {/* Question */}
        <p
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 18,
            lineHeight: 1.3,
            color: "var(--color-text-primary)",
          }}
        >
          {poll.question}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((label, i) => {
            const idx = i + 1;
            const count = optimisticCounts[i];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isChosen = optimisticVote === idx;

            if (hasVoted) {
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-rubik)",
                        fontWeight: isChosen ? 800 : 500,
                        fontSize: 14,
                        color: isChosen ? "var(--color-accent-primary)" : "var(--color-text-primary)",
                      }}
                    >
                      {isChosen ? "✓ " : ""}{label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-rubik)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: isChosen ? "var(--color-accent-primary)" : "var(--color-text-muted)",
                        marginRight: 8,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, background: "rgba(0,0,0,0.07)", borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: isChosen ? "var(--color-accent-primary)" : "rgba(0,0,0,0.2)",
                        borderRadius: 999,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => handleVote(idx)}
                disabled={isPending}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.6)",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "var(--color-text-primary)",
                  cursor: isPending ? "not-allowed" : "pointer",
                  textAlign: "right",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {hasVoted && (
          <p
            style={{
              margin: "14px 0 0",
              fontFamily: "var(--font-rubik)",
              fontSize: 12,
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            {total} הצבעות
          </p>
        )}
      </div>
    </section>
  );
}
