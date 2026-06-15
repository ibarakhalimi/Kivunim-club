"use client";

import { useState } from "react";

const HOURS = [
  { day: "ראשון", hours: "08:00-20:00", active: true },
  { day: "שני", hours: "08:00-20:00", active: true },
  { day: "שלישי", hours: "08:00-20:00", active: true },
  { day: "רביעי", hours: "08:00-20:00", active: true },
  { day: "חמישי", hours: "08:00-18:00", active: true },
  { day: "שישי", hours: "סגור", active: false },
  { day: "שבת", hours: "סגור", active: false },
];

export function OpenHoursSection() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        style={{
          width: "100%",
          border: "1px solid #BBF7D0",
          borderRadius: 34,
          background: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)",
          boxShadow: "none",
          padding: "11px 14px",
          cursor: "pointer",
          textAlign: "right",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#16A34A",
                  boxShadow: "0 0 0 4px rgba(22,163,74,0.12)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: "#15803D" }}>
                פתוח עכשיו
              </span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: "#86EFAC" }}>
                ·
              </span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: "#14532D" }}>
                עד 20:00
              </span>
            </div>
          </div>

          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(21,128,61,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#15803D",
              fontSize: 14,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          >
           ⌄
          </span>
        </div>

        {open && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 9,
              borderTop: "1px solid rgba(21,128,61,0.16)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {HOURS.map((row) => (
              <div
                key={row.day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 18,
                  background: row.active ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.36)",
                }}
              >
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#14532D" }}>
                  {row.day}
                </span>
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: row.active ? "#15803D" : "#94A3B8" }}>
                  {row.hours}
                </span>
              </div>
            ))}
          </div>
        )}
      </button>
    </section>
  );
}
