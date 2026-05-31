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
    <div>
      {/* Vertical list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {updates.map((update) => {
          const isOpen = openId === update.id;
          return (
            <div
              key={update.id}
              onClick={() => setOpenId(isOpen ? null : update.id)}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.6)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                padding: "14px 18px 16px",
                cursor: "pointer",
              }}
            >
              <p
                suppressHydrationWarning
                style={{
                  margin: "0 0 6px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-rubik)",
                }}
              >
                {timeAgo(update.published_at)}
              </p>

              {/* Headline — 2 lines then "..." */}
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 20,
                  lineHeight: 1.25,
                  color: "var(--color-text-primary)",
                  overflow: isOpen ? "visible" : "hidden",
                  display: isOpen ? "block" : "-webkit-box",
                  WebkitLineClamp: isOpen ? undefined : 2,
                  WebkitBoxOrient: isOpen ? undefined : "vertical",
                  textOverflow: "ellipsis",
                }}
              >
                {update.title}
              </p>

              {/* Description — visible when expanded */}
              {isOpen && update.description && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 20,
                    lineHeight: 1.5,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {update.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
