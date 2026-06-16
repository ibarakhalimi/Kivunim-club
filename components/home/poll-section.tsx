"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
        background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)",
        border: "1px solid #BFDBFE",
        borderRadius: 14,
        padding: "14px",
        scrollSnapAlign: "start",
        boxShadow: "none",
      }}
    >
      <p
        style={{
          margin: "0 0 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 17,
          lineHeight: 1.3,
          color: "#0F172A",
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
                  background: isChosen ? "#EFF6FF" : "#F8FAFC",
                  border: `1px solid ${isChosen ? "#BFDBFE" : "#E2E8F0"}`,
                }}
              >
                <div style={{ position: "relative", padding: "10px 12px" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: `${pct}%`,
                      background: isChosen ? "rgba(30,64,175,0.08)" : "rgba(0,0,0,0.03)",
                      transition: "width 0.4s ease",
                    }}
                  />
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: isChosen ? 800 : 600, fontSize: 13, color: isChosen ? "#1E40AF" : "#475569" }}>
                      {isChosen ? "✓ " : ""}{label}
                    </span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: isChosen ? "#1E40AF" : "#94A3B8" }}>
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
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                fontFamily: "var(--font-rubik)",
                fontWeight: 700,
                fontSize: 13,
                color: "#0F172A",
                cursor: isPending ? "not-allowed" : "pointer",
                textAlign: "right",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p style={{ margin: "12px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#94A3B8", textAlign: "center" }}>
        {total} אנשים כבר ענו על הסקר
      </p>
    </div>
  );
}

export function PollSection({ poll, voteCounts, userVote }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const communityPolls: CommunityPoll[] = [
    {
      id: poll.id,
      question: poll.question,
      options: [poll.option_1, poll.option_2, poll.option_3, poll.option_4],
      counts: voteCounts,
      userVote,
    },
    ...DEMO_POLLS,
  ];
  const totalAnswers = voteCounts.reduce((sum, count) => sum + count, 0);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 10;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, communityPolls.length - 1));
  }

  return (
    <>
      <section style={{ width: "calc(50% - 4px)" }}>
        <Link
          href="/activities"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#fff",
            border: "1px solid #EDE9FE",
            borderRadius: 22,
            boxShadow: "none",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textAlign: "right",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div
              aria-label="סקר"
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: "#F5F3FF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7C3AED",
              }}
            >
              <MessageCircle size={19} strokeWidth={2.1} />
            </div>
            <span
              style={{
                minWidth: 24,
                height: 24,
                borderRadius: "50%",
                border: "none",
                background: "#7C3AED",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 10,
                lineHeight: 1,
              }}
            >
              {communityPolls.length}
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#7C3AED" }}>
              סקר
            </p>
            <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.25, color: "#0F172A", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {poll.question}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#64748B" }}>
              {totalAnswers} אנשים ענו על הסקר
            </p>
          </div>
        </Link>
      </section>

      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              direction: "rtl",
              maxHeight: "82dvh",
              overflowY: "auto",
              padding: "20px 14px 34px",
            }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                left: 16,
                width: 32,
                height: 32,
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

      <div
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          boxShadow: "none",
          padding: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
            פעילות קהילה
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid #E2E8F0",
              borderRadius: 99,
              background: "#F8FAFC",
              padding: "4px 8px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 11,
              color: "#64748B",
            }}
          >
            <span style={{ color: "#1E40AF" }}>{activeIndex + 1}</span>
            <span>מתוך</span>
            <span>{communityPolls.length}</span>
          </div>
        </div>

        <div
          onScroll={handleScroll}
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            padding: "0 0 2px",
          }}
        >
          {communityPolls.map((item) => (
            <PollCard key={item.id} poll={item} />
          ))}
        </div>
      </div>
          </div>
        </>
      )}
    </>
  );
}
