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
  const OPTION_COLORS = ["#e7e3da", "#e7e3da", "#e7e3da", "#e7e3da"];

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
      <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
        סקר
      </h2>

      <div
        style={{
          background: "#fff",
          border: "3px solid #000",
          borderRadius: 20,
          boxShadow: "5px 5px 0px #000",
          padding: "20px 18px 22px",
        }}
      >
        {/* Question */}
        <p
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 18,
            lineHeight: 1.3,
            color: "#111",
          }}
        >
          {poll.question}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((label, i) => {
            if (!label) return null;
            const idx = i + 1;
            const count = optimisticCounts[i];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isChosen = optimisticVote === idx;

            if (hasVoted) {
              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    background: isChosen ? "#EEC84A" : "#f0f0f0",
                  }}
                >
                  {/* Progress bar fill */}
                  <div style={{ position: "relative", padding: "11px 14px" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${pct}%`,
                        background: isChosen ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)",
                        transition: "width 0.4s ease",
                      }}
                    />
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-rubik)", fontWeight: isChosen ? 900 : 600, fontSize: 15, color: "#111" }}>
                        {isChosen ? "✓ " : ""}{label}
                      </span>
                      <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 14, color: "#111" }}>
                        {pct}%
                      </span>
                    </div>
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
                  background: OPTION_COLORS[i],
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#111",
                  cursor: isPending ? "not-allowed" : "pointer",
                  textAlign: "right",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p style={{ margin: "14px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#888", textAlign: "center" }}>
          {total} אנשים כבר ענו על הסקר
        </p>
      </div>
    </section>
  );
}
