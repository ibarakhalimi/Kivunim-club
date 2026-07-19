"use client";

import { Megaphone } from "lucide-react";

type Update = {
  id: string;
  title: string;
  description: string;
  published_at: string;
  author: string;
};

function timeAgo(dateStr: string, currentTime: string): string {
  const diff = new Date(currentTime).getTime() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
}

function UpdateCard({ update, currentTime }: { update: Update; currentTime: string }) {
  return (
    <article
      style={{
        width: "100%",
        minHeight: 116,
        background: "var(--color-surface)",
        border: "none",
        borderRadius: "var(--shape-radius-5xl)",
        boxShadow: "none",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "hidden",
        textAlign: "right",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
        <div
          aria-label="הודעות ועדכונים"
          style={{
            width: 46,
            height: 46,
            borderRadius: "var(--shape-radius-2xl)",
            background: "color-mix(in srgb, var(--color-orange-400) 14%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-orange-400) 22%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-orange-400)",
            flexShrink: 0,
          }}
        >
          <Megaphone size={22} strokeWidth={2.1} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <p suppressHydrationWarning style={{ margin: "0 0 5px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xs)", color: "var(--color-orange-400)" }}>
            {timeAgo(update.published_at, currentTime)}
          </p>
          <h3 style={{ margin: "0 0 5px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-lg)", lineHeight: 1.22, color: "var(--color-ink)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {update.title}
          </h3>
          {update.description && (
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", lineHeight: 1.35, color: "var(--color-text-disabled)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {update.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function UpdateList({ updates, currentTime }: { updates: Update[]; currentTime: string }) {
  if (updates.length === 0) return null;

  return (
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} currentTime={currentTime} />
        ))}
      </div>
    </section>
  );
}
