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
        background: "#fff",
        borderTop: "1px solid #E2E8F0",
        padding: "8px 8px calc(env(safe-area-inset-bottom, 0px) + 8px)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 4,
        zIndex: 20,
      }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              minHeight: 52,
              borderRadius: 10,
              background: on ? "#EFF6FF" : "transparent",
              color: on ? "#1E40AF" : "#94A3B8",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              transition: "all 140ms ease",
              fontFamily: "var(--font-rubik)",
              fontWeight: on ? 700 : 500,
              fontSize: 11,
            }}
          >
            <Icon size={20} strokeWidth={on ? 2.2 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
