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
    <div className="kv-no-scrollbar quick-actions-list">
      {FILTERS.map((f) => {
        const on = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={on ? "kv-tap quick-action active" : "kv-tap quick-action"}
            aria-pressed={on}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
