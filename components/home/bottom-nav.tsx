"use client";

import { useState } from "react";
import { Home, Calendar, Users, User } from "lucide-react";

const ITEMS = [
  { key: "home",      label: "בית",     Icon: Home },
  { key: "events",    label: "אירועים", Icon: Calendar },
  { key: "community", label: "קהילה",   Icon: Users },
  { key: "profile",   label: "הפרופיל", Icon: User },
];

export function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "10px 14px calc(env(safe-area-inset-bottom, 0px) + 16px)",
        background:
          "linear-gradient(180deg, rgba(250,250,245,0) 0%, rgba(250,250,245,0.92) 28%, rgba(250,250,245,1) 60%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "var(--color-text-primary)",
          borderRadius: 999,
          padding: 6,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
          boxShadow: "var(--shadow-lg)",
          pointerEvents: "all",
        }}
      >
        {ITEMS.map(({ key, label, Icon }) => {
          const on = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="kv-tap"
              style={{
                minHeight: 48,
                borderRadius: 999,
                background: on ? "var(--color-accent-highlight)" : "transparent",
                color: on
                  ? "var(--color-text-primary)"
                  : "rgba(255,255,255,0.65)",
                border: "none",
                cursor: "pointer",
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: `all var(--duration-normal) var(--ease-spring)`,
                fontFamily: "var(--font-heebo)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <Icon size={20} strokeWidth={1.8} />
              {on && <span>{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
