"use client";

import { useState, useTransition, useEffect } from "react";
import { checkIn } from "@/app/actions/check-in";

export function CheckInButton() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleCheckIn() {
    startTransition(async () => {
      await checkIn();
      setOpen(false);
      setToast(true);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: "14px 8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          cursor: "pointer",
          width: "100%",
          aspectRatio: "1 / 1",
        }}
      >
        <span style={{ fontSize: 24 }}>📅</span>
        <span
          style={{
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 12,
            color: "#1E40AF",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          סימון הגעה
        </span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }}
        />
      )}

      {open && (
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
            padding: "28px 24px 48px",
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: 16, left: 16,
              width: 32, height: 32,
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              fontSize: 15,
              cursor: "pointer",
              color: "#64748B",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>

          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#0F172A" }}>
              אישור הגעה בכיוונים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: "#64748B" }}>
              כדי להשתמש בסביבת הלימודים בצורה חופשית יש לציין שהגעת
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px 0",
              background: isPending ? "#94A3B8" : "#1E40AF",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 16,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "שומר..." : "אני פה! 🙋"}
          </button>
        </div>
      )}

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
          כיף שבאת תהנה 🎉
        </div>
      )}
    </>
  );
}
