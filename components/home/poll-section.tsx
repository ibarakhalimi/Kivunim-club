"use client";

import { useState, useTransition } from "react";
import { submitVote } from "@/app/actions/poll";
import type { Tables } from "@/src/types/database";

type Poll = Tables<"polls">;

type CommunityPoll = {
  id: string;
  question: string;
  options: string[];
  counts: number[];
  userVote: number | null;
  isDemo?: boolean;
};

interface Props {
  poll: Poll;
  voteCounts: number[];
  userVote: number | null;
}

const DEMO_POLLS: CommunityPoll[] = [
  {
    id: "demo-community-poll",
    question: "איזו פעילות קהילה תרצו שנוסיף החודש?",
    options: ["ערב משחקים", "סדנת לינקדאין", "מפגש קפה", "קבוצת ריצה"],
    counts: [18, 24, 12, 9],
    userVote: null,
    isDemo: true,
  },
  {
    id: "demo-food-poll",
    question: "איזה כיבוד הכי מתאים לערב למידה?",
    options: ["פיצה", "סושי", "קפה ומאפים", "פירות וחטיפים"],
    counts: [31, 14, 27, 10],
    userVote: null,
    isDemo: true,
  },
  {
    id: "demo-hours-poll",
    question: "באיזה יום הכי נוח לכם להגיע לפעילות?",
    options: ["ראשון", "שלישי", "רביעי", "חמישי"],
    counts: [12, 22, 19, 16],
    userVote: null,
    isDemo: true,
  },
];

function PollCard({ poll }: { poll: CommunityPoll }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticVote, setOptimisticVote] = useState<number | null>(poll.userVote);
  const [optimisticCounts, setOptimisticCounts] = useState(poll.counts);

  const hasVoted = optimisticVote !== null;
  const total = optimisticCounts.reduce((sum, count) => sum + count, 0);

  function handleVote(optionIndex: number) {
    if (hasVoted || isPending) return;

    const newCounts = [...optimisticCounts];
    newCounts[optionIndex - 1]++;
    setOptimisticVote(optionIndex);
    setOptimisticCounts(newCounts);

    if (poll.isDemo) return;

    startTransition(async () => {
      await submitVote(poll.id, optionIndex);
    });
  }

  return (
    <div
      style={{
        flex: "0 0 100%",
        background: "#252836",
        border: "none",
        borderRadius: 22,
        padding: 18,
        scrollSnapAlign: "start",
        boxShadow: "none",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: "0 0 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 17,
          lineHeight: 1.3,
          color: "#FFFFFF",
        }}
      >
        {poll.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {poll.options.map((label, i) => {
          if (!label) return null;
          const idx = i + 1;
          const count = optimisticCounts[i] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isChosen = optimisticVote === idx;

          if (hasVoted) {
            return (
              <div
                key={idx}
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  background: isChosen ? "rgba(139,92,246,0.12)" : "#2F3344",
                  border: `1px solid ${isChosen ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div style={{ position: "relative", padding: "10px 12px" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${pct}%`,
                      background: isChosen ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
                      transition: "width 0.4s ease",
                    }}
                  />
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: isChosen ? 800 : 600, fontSize: 13, color: isChosen ? "#A78BFA" : "#9CA0AE" }}>
                      {isChosen ? "✓ " : ""}{label}
                    </span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: isChosen ? "#A78BFA" : "#7C808E" }}>
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
                padding: "10px 12px",
                background: "#2F3344",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                fontFamily: "var(--font-rubik)",
                fontWeight: 700,
                fontSize: 13,
                color: "#FFFFFF",
                cursor: isPending ? "not-allowed" : "pointer",
                textAlign: "right",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p style={{ margin: "12px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#FF2E9A", textAlign: "center" }}>
        {total} אנשים כבר ענו על הסקר
      </p>
    </div>
  );
}

export function PollSection({ poll, voteCounts, userVote }: Props) {
  const communityPolls: CommunityPoll[] = [
    {
      id: poll.id,
      question: poll.question,
      options: [poll.option_1, poll.option_2, poll.option_3, poll.option_4].filter(Boolean) as string[],
      counts: voteCounts,
      userVote,
    },
    ...DEMO_POLLS,
  ];

  return (
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {communityPolls.map((item) => (
          <PollCard key={item.id} poll={item} />
        ))}
      </div>
    </section>
  );
}
