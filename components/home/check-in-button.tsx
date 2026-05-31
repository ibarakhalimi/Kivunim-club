"use client";

import { useState, useTransition, useEffect } from "react";
import { checkIn } from "@/app/actions/check-in";

export function CheckInButton({ bg }: { bg: string }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Auto-hide toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleCheckIn() {
    startTransition(async () => {
      await checkIn();
      setDone(true);
      setOpen(false);
      setToast(true);
    });
  }

  return (
    <>
      {/* Grid button */}
      <button
        onClick={() => setOpen(true)}
        className="kv-tap"
        style={{
          background: bg,
          border: "1.5px solid rgba(255,255,255,0.7)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "20px 12px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
          cursor: "pointer",
          textAlign: "right",
          width: "100%",
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>📅</span>
        <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>
          סימון הגעה
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }}
        />
      )}

      {/* Bottom drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 0, left: 0, right: 0,
            zIndex: 51,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(255,255,255,0.7)",
            borderBottom: "none",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.10)",
            direction: "rtl",
            padding: "28px 24px 48px",
          }}
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: 16, left: 16,
              width: 34, height: 34,
              background: "rgba(0,0,0,0.06)",
              border: "none", borderRadius: 999,
              fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-text-primary)",
            }}
          >
            ✕
          </button>

          {/* Content */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: "var(--color-text-primary)" }}>
              אישור הגעה בכיוונים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              כדי להשתמש בסביבת הלימודים בצורה חופשית יש לציין שהגעת
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "16px 0",
              background: isPending ? "rgba(0,0,0,0.1)" : "var(--color-accent-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 20,
              cursor: isPending ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
            }}
          >
            {isPending ? "שומר..." : "אני פה! 🙋"}
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99,
            background: "var(--color-accent-primary)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "fadeInUp 0.25s ease",
          }}
        >
          כיף שבאת תהנה 🎉
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
