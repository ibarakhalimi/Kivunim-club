"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";
import { togglePoll, deletePoll } from "./actions";

type Poll = Tables<"polls">;
type Vote = { poll_id: string; option_index: number };

function PollRow({ poll, votes }: { poll: Poll; votes: Vote[] }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const options = [poll.option_1, poll.option_2, poll.option_3, poll.option_4];
  const total = votes.length;
  const deadline = poll.expires_at
    ? new Date(poll.expires_at).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
              {poll.question}
            </p>
            {!poll.is_active && (
              <span style={{ fontSize: 11, fontWeight: 600, background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", padding: "2px 7px", borderRadius: 99 }}>
                לא פעיל
              </span>
            )}
          </div>
          {options.map((opt, i) => {
            if (!opt) return null;
            const count = votes.filter((v) => v.option_index === i + 1).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ flex: 1, position: "relative", height: 26, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "#EFF6FF", transition: "width 0.3s ease" }} />
                  <span style={{ position: "relative", padding: "0 10px", fontSize: 13, fontFamily: "var(--font-rubik)", fontWeight: 500, color: "#475569", lineHeight: "26px" }}>
                    {i + 1}. {opt}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", fontFamily: "var(--font-rubik)", minWidth: 48, textAlign: "left" }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-rubik)", fontWeight: 500 }}>
            סה״כ הצבעות: {total}
          </p>
          {deadline && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", fontFamily: "var(--font-rubik)", fontWeight: 700 }}>
              מענה עד {deadline}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={async () => { setToggling(true); await togglePoll(poll.id, poll.is_active); setToggling(false); }}
            disabled={toggling}
            title={poll.is_active ? "השבת" : "הפעל"}
            style={{ ...iconBtn, background: poll.is_active ? "#DCFCE7" : "#F1F5F9", color: poll.is_active ? "#16A34A" : "#94A3B8" }}>
            {poll.is_active ? "●" : "○"}
          </button>
          <button
            onClick={async () => { if (!confirm("למחוק את הסקר?")) return; setDeleting(true); await deletePoll(poll.id); }}
            disabled={deleting}
            style={{ ...iconBtn, color: "#DC2626" }}>
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PollList({ polls, allVotes }: { polls: Poll[]; allVotes: Vote[] }) {
  if (polls.length === 0) {
    return <p style={{ color: "#64748B", fontSize: 14, fontFamily: "var(--font-rubik)" }}>אין סקרים עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {polls.map((p) => (
        <PollRow key={p.id} poll={p} votes={allVotes.filter((v) => v.poll_id === p.id)} />
      ))}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid #E2E8F0", borderRadius: 8,
  background: "#F8FAFC", cursor: "pointer", fontSize: 14, display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};
