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
      <div
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "18px 16px 20px",
        }}
      >
        {/* Question */}
        <p
          style={{
            margin: "0 0 16px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 17,
            lineHeight: 1.3,
            color: "#0F172A",
          }}
        >
          {poll.question}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                    borderRadius: 8,
                    overflow: "hidden",
                    background: isChosen ? "#EFF6FF" : "#F8FAFC",
                    border: `1px solid ${isChosen ? "#BFDBFE" : "#E2E8F0"}`,
                  }}
                >
                  <div style={{ position: "relative", padding: "10px 14px" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${pct}%`,
                        background: isChosen ? "rgba(30,64,175,0.08)" : "rgba(0,0,0,0.03)",
                        transition: "width 0.4s ease",
                      }}
                    />
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-rubik)", fontWeight: isChosen ? 700 : 500, fontSize: 14, color: isChosen ? "#1E40AF" : "#475569" }}>
                        {isChosen ? "✓ " : ""}{label}
                      </span>
                      <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: isChosen ? "#1E40AF" : "#94A3B8" }}>
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
                  padding: "11px 14px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#0F172A",
                  cursor: isPending ? "not-allowed" : "pointer",
                  textAlign: "right",
                  transition: "background 0.1s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p style={{ margin: "12px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#94A3B8", textAlign: "center" }}>
          {total} אנשים כבר ענו על הסקר
        </p>
      </div>
    </section>
  );
}
