"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { submitVote } from "@/app/actions/poll";
import type { Tables } from "@/src/types/database";

type Poll = Tables<"polls">;

const GRID_EXPAND_EVENT = "home-grid-expand";

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
        border: "1px solid rgba(255,255,255,0.06)",
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
  const totalAnswers = voteCounts.reduce((sum, count) => sum + count, 0);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 10;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, communityPolls.length - 1));
  }

  function expandThisCard() {
    setExpanded(true);
    window.dispatchEvent(new CustomEvent(GRID_EXPAND_EVENT, { detail: "polls" }));
  }

  useEffect(() => {
    const handleExpand = (event: Event) => {
      const target = (event as CustomEvent<string>).detail;
      setExpanded(true);
      if (target === "polls") {
        requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    window.addEventListener(GRID_EXPAND_EVENT, handleExpand);
    return () => window.removeEventListener(GRID_EXPAND_EVENT, handleExpand);
  }, []);

  return (
    <>
      <section ref={sectionRef} style={{ width: "100%", gridColumn: expanded ? "1 / -1" : undefined, minWidth: 0, boxSizing: "border-box", transition: "grid-column 0.24s ease", scrollMarginTop: 14 }}>
        <div
          style={{
            width: "100%",
            aspectRatio: expanded ? "auto" : "1 / 1",
            background: expanded ? "transparent" : "#252836",
            border: "none",
            borderRadius: 22,
            boxShadow: "none",
            padding: expanded ? 0 : 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textAlign: "right",
            textDecoration: "none",
            font: "inherit",
            boxSizing: "border-box",
          }}
        >
          {!expanded ? (
            <button
              type="button"
              onClick={expandThisCard}
              style={{
                width: "100%",
                flex: 1,
                border: "none",
                background: "transparent",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div
                  aria-label="סקר"
                  style={{
                    width: "auto",
                    height: "auto",
                    borderRadius: 0,
                    background: "rgba(17,32,58,0.72)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#A78BFA",
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
                    background: "#111522",
                    color: "#A78BFA",
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
                <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#FF2E9A" }}>
                  סקר
                </p>
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, lineHeight: 1.22, color: "#FFFFFF", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {poll.question}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, lineHeight: 1.25, color: "#9CA0AE", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {totalAnswers} אנשים ענו על הסקר
                </p>
              </div>
            </button>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, paddingInline: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 14,
                      background: "rgba(167, 139, 250, 0.14)",
                      color: "#A78BFA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MessageCircle size={22} strokeWidth={2.2} />
                  </div>
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1.1, color: "#FFFFFF" }}>
                    פעילות קהילה
                  </p>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 99,
                    background: "#2F3344",
                    padding: "4px 8px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 800,
                    fontSize: 11,
                    color: "#9CA0AE",
                  }}
                >
                  <span style={{ color: "#A78BFA" }}>{activeIndex + 1}</span>
                  <span>מתוך</span>
                  <span>{communityPolls.length}</span>
                </div>
              </div>
              <div style={{ background: "#252836", borderRadius: 22, padding: 18, boxSizing: "border-box" }}>
            <div
              onScroll={handleScroll}
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              {communityPolls.map((item) => (
                <PollCard key={item.id} poll={item} />
              ))}
            </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              background: "#252836",
              borderRadius: "26px 26px 0 0",
              border: "1px solid rgba(255,255,255,0.06)",
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
                background: "#2F3344",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#9CA0AE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

      <div
        style={{
          background: "#252836",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18,
          boxShadow: "none",
          padding: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 14, color: "#FFFFFF" }}>
            פעילות קהילה
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 99,
              background: "#2F3344",
              padding: "4px 8px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 11,
              color: "#9CA0AE",
            }}
          >
            <span style={{ color: "#A78BFA" }}>{activeIndex + 1}</span>
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
