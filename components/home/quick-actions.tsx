"use client";

import { useState } from "react";

const FILTERS = [
  { key: "all",    label: "בשבילך" },
  { key: "event",  label: "אירועים" },
  { key: "update", label: "עדכונים" },
  { key: "poll",   label: "סקרים" },
  { key: "post",   label: "פוסטים" },
] as const;

export function QuickActions() {
  const [active, setActive] = useState<string>("all");

  return (
    <div
      className="kv-no-scrollbar"
      style={{
        display: "flex",
        gap: 8,
        padding: "0 20px 18px",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
      }}
    >
      {FILTERS.map((f) => {
        const on = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className="kv-tap"
            style={{
              flex: "0 0 auto",
              minHeight: 38,
              padding: "0 16px",
              borderRadius: 999,
              background: on
                ? "var(--color-text-primary)"
                : "var(--color-bg-card)",
              color: on
                ? "var(--color-text-inverse)"
                : "var(--color-text-primary)",
              border: on
                ? "1.5px solid var(--color-text-primary)"
                : "1.5px solid var(--color-border)",
              fontFamily: "var(--font-heebo)",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "-0.005em",
              cursor: "pointer",
              scrollSnapAlign: "start",
              whiteSpace: "nowrap",
              transition: `all var(--duration-fast) var(--ease-default)`,
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
