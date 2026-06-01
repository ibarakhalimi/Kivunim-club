"use client";

import { useState } from "react";
import { CheckInButton } from "./check-in-button";

const ALL_ACTIONS = [
  { emoji: "📞", label: "יצירת קשר",     bg: "#B8A7E8" },
  { emoji: "📋", label: "מידע חשוב",     bg: "#EEC84A" },
  { emoji: "💡", label: "יש לי רעיון",   bg: "#A8D464" },
  { emoji: "🎁", label: "ההטבות שלי",    bg: "#F4A07A" },
  { emoji: "📅", label: "אירועים קרובים", bg: "#7DC8E8" },
];

const GRID_ACTIONS = ALL_ACTIONS.slice(0, 4);

export function ActionsGrid() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            padding: "4px 0 6px",
          }}
        >
          <CheckInButton />

          {GRID_ACTIONS.map((a) => (
            <button
              key={a.label}
              style={{
                background: a.bg,
                border: "3px solid #000",
                borderRadius: 20,
                boxShadow: "4px 4px 0px #000",
                padding: "16px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                width: "100%",
                aspectRatio: "1 / 1",
              }}
            >
              <span style={{ fontSize: 26 }}>{a.emoji}</span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 13, color: "#111", lineHeight: 1.2, textAlign: "center" }}>
                {a.label}
              </span>
            </button>
          ))}

          {/* כל הפעולות */}
          <button
            onClick={() => setOpen(true)}
            style={{
              background: "#fff",
              border: "3px solid #000",
              borderRadius: 20,
              boxShadow: "4px 4px 0px #000",
              padding: "16px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              width: "100%",
              aspectRatio: "1 / 1",
            }}
          >
            <span style={{ fontSize: 26 }}>⚡</span>
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 13, color: "#111", lineHeight: 1.2, textAlign: "center" }}>
              כל הפעולות
            </span>
          </button>
        </div>
      </section>

      {/* Off-canvas */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              border: "3px solid #000",
              borderBottom: "none",
              boxShadow: "0 -5px 0 #000",
              direction: "rtl",
              padding: "24px 20px 48px",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 34, height: 34,
                background: "#fff",
                border: "2.5px solid #000",
                borderRadius: "50%",
                boxShadow: "2px 2px 0 #000",
                fontSize: 16,
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
              ⚡ כל הפעולות
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ALL_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: a.bg,
                    border: "3px solid #000",
                    borderRadius: 14,
                    boxShadow: "4px 4px 0 #000",
                    padding: "14px 18px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{a.emoji}</span>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, color: "#111" }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
