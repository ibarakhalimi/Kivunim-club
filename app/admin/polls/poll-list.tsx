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

  return (
    <div style={{ background: "#fff", border: "2px solid #0F0F0F", padding: "14px 16px", boxShadow: "4px 4px 0 0 #0F0F0F" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 15, color: "var(--color-text-primary)" }}>
              {poll.question}
            </p>
            {!poll.is_active && (
              <span style={{ fontSize: 10, fontWeight: 700, background: "#FED7D7", color: "#c53030", border: "1.5px solid #c53030", padding: "1px 6px" }}>
                לא פעיל
              </span>
            )}
          </div>
          {options.map((opt, i) => {
            const count = votes.filter((v) => v.option_index === i + 1).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontFamily: "var(--font-heebo)", color: "var(--color-text-secondary)", minWidth: 160 }}>
                  {i + 1}. {opt}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)" }}>
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)" }}>
            סה״כ הצבעות: {total}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={async () => { setToggling(true); await togglePoll(poll.id, poll.is_active); setToggling(false); }}
            disabled={toggling}
            title={poll.is_active ? "השבת" : "הפעל"}
            style={{ width: 34, height: 34, border: "2px solid #0F0F0F", borderRadius: 0, background: poll.is_active ? "#0F0F0F" : "#fff", color: poll.is_active ? "#fff" : "#0F0F0F", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {poll.is_active ? "●" : "○"}
          </button>
          <button
            onClick={async () => { if (!confirm("למחוק את הסקר?")) return; setDeleting(true); await deletePoll(poll.id); }}
            disabled={deleting}
            style={{ width: 34, height: 34, border: "2px solid #0F0F0F", borderRadius: 0, background: "#fff", color: "#c53030", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PollList({ polls, allVotes }: { polls: Poll[]; allVotes: Vote[] }) {
  if (polls.length === 0) {
    return <p style={{ color: "var(--color-text-muted)", fontSize: 14, fontFamily: "var(--font-heebo)" }}>אין סקרים עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {polls.map((p) => (
        <PollRow key={p.id} poll={p} votes={allVotes.filter((v) => v.poll_id === p.id)} />
      ))}
    </div>
  );
}
