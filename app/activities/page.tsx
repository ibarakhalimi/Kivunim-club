import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "@/app/updates/swipe-back-home";

export const dynamic = "force-dynamic";

type PollItem = {
  id: string;
  question: string;
  option_1: string;
  option_2: string;
  option_3: string | null;
  option_4: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

type VoteItem = {
  poll_id: string;
  option_index: number;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function countsForPoll(votes: VoteItem[], pollId: string) {
  const counts = [0, 0, 0, 0];
  votes.forEach((vote) => {
    if (vote.poll_id !== pollId) return;
    if (vote.option_index < 1 || vote.option_index > 4) return;
    counts[vote.option_index - 1] += 1;
  });
  return counts;
}

function formatDeadline(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ActivitiesPage() {
  const supabase = createAdminClient();
  const [{ data: pollsData }, { data: votesData }] = await Promise.all([
    supabase.from("polls").select("*").order("created_at", { ascending: false }),
    supabase.from("poll_votes").select("poll_id, option_index"),
  ]);

  const polls = (pollsData ?? []) as PollItem[];
  const votes = (votesData ?? []) as VoteItem[];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "#F5F3FF",
              color: "#7C3AED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageCircle size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#0F172A" }}>
              פעילות קהילה
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
              כל הסקרים והתגובות
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#0F172A",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
          }}
        >
          ←
        </Link>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {polls.map((poll) => {
          const options = [poll.option_1, poll.option_2, poll.option_3, poll.option_4];
          const counts = countsForPoll(votes, poll.id);
          const total = counts.reduce((sum, count) => sum + count, 0);

          return (
            <div key={poll.id}>
              <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#7C3AED" }}>
                {formatDate(poll.created_at)}
              </p>
              <article
                style={{
                  background: "#fff",
                  border: "1px solid #EDE9FE",
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.22, color: "#0F172A" }}>
                    {poll.question}
                  </h2>
                  <span
                    style={{
                      flexShrink: 0,
                      borderRadius: 99,
                      background: poll.is_active ? "#7C3AED" : "#E2E8F0",
                      color: poll.is_active ? "#fff" : "#64748B",
                      padding: "5px 9px",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 800,
                      fontSize: 11,
                    }}
                  >
                    {poll.is_active ? "פעיל" : "סגור"}
                  </span>
                </div>
                {poll.expires_at && (
                  <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#7C3AED" }}>
                    מענה עד {formatDeadline(poll.expires_at)}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {options.map((option, index) => {
                    if (!option) return null;
                    const count = counts[index] ?? 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div
                        key={option}
                        style={{
                          border: "1px solid #EDE9FE",
                          borderRadius: 12,
                          background: "#F8FAFC",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ position: "relative", padding: "10px 12px" }}>
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: `${pct}%`,
                              background: "rgba(124,58,237,0.1)",
                            }}
                          />
                          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: "#0F172A" }}>
                              {option}
                            </span>
                            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 12, color: "#7C3AED" }}>
                              {pct}% · {count}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p style={{ margin: "12px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#64748B", textAlign: "center" }}>
                  {total} אנשים ענו על הסקר
                </p>
              </article>
            </div>
          );
        })}
      </section>
      <BottomNav activeKey="activity" alwaysOpen />
    </main>
  );
}
