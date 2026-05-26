"use client";

import { useState } from "react";

type Update = {
  id: string;
  title: string;
  description: string;
  published_at: string;
  author: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
}

export function UpdateList({ updates }: { updates: Update[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {updates.map((update) => {
        const isOpen = openId === update.id;
        return (
          <div
            key={update.id}
            onClick={() => setOpenId(isOpen ? null : update.id)}
            style={{
              background: "var(--color-card-butter)",
              border: "2px solid #0F0F0F",
              borderRadius: 0,
              boxShadow: "4px 4px 0 0 #0F0F0F",
              padding: "14px 18px",
              cursor: "pointer",
            }}
          >
            <p
              suppressHydrationWarning
              style={{
                margin: "0 0 6px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-heebo)",
              }}
            >
              {timeAgo(update.published_at)}
            </p>

            <p
              style={{
                margin: "0 0 4px",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1.2,
                color: "var(--color-text-primary)",
              }}
            >
              {update.title}
            </p>

            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-heebo)",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                overflow: isOpen ? "visible" : "hidden",
                display: isOpen ? "block" : "-webkit-box",
                WebkitLineClamp: isOpen ? undefined : 1,
                WebkitBoxOrient: isOpen ? undefined : "vertical",
                textOverflow: isOpen ? "clip" : "ellipsis",
              }}
            >
              {update.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
