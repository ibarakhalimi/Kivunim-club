"use client";

import { useEffect, useState, useTransition } from "react";
import { checkIn } from "@/app/actions/check-in";

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
  const [toast, setToast] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleCheckIn() {
    startTransition(async () => {
      await checkIn();
      setToast(true);
    });
  }

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          border: "1px solid #BBF7D0",
          borderRadius: 22,
          background: "#F0FDF4",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#16A34A",
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 10, color: "#15803D" }}>
              פתוח עכשיו
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1, color: "#14532D" }}>
            עד 20:00
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setHoursOpen(true)}
            aria-label="שעות פתיחה"
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              border: "1px solid #BBF7D0",
              background: "rgba(255,255,255,0.7)",
              color: "#15803D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ↗
          </button>

        <button
          onClick={handleCheckIn}
          disabled={isPending}
          style={{
            width: "auto",
            border: "1px solid #86EFAC",
            borderRadius: 999,
            background: isPending ? "#BBF7D0" : "#16A34A",
            color: "#fff",
            padding: "9px 18px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 12,
            cursor: isPending ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isPending ? "מסמן..." : "צ׳קאין"}
        </button>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99,
            background: "#0F172A",
            color: "#fff",
            padding: "11px 22px",
            borderRadius: 99,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          כיף שבאת, תהנה
        </div>
      )}

      {hoursOpen && (
        <>
          <div
            onClick={() => setHoursOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              direction: "rtl",
              padding: "24px 20px 44px",
            }}
          >
            <button
              onClick={() => setHoursOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 32, height: 32,
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 18, color: "#0F172A" }}>
              שעות פתיחה
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {HOURS.map((row) => (
                <div
                  key={row.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    background: row.active ? "#F0FDF4" : "#F8FAFC",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                    {row.day}
                  </span>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: row.active ? "#15803D" : "#94A3B8" }}>
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
