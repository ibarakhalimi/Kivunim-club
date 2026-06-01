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
          background: "#F4C2D4",
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
        <span style={{ fontSize: 26 }}>📅</span>
        <span
          style={{
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 13,
            color: "#111",
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
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50 }}
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
            border: "1.5px solid #ccc",
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
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#888",
            }}
          >
            ✕
          </button>

          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 22, color: "#111" }}>
              אישור הגעה בכיוונים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: "#666" }}>
              כדי להשתמש בסביבת הלימודים בצורה חופשית יש לציין שהגעת
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px 0",
              background: isPending ? "#ccc" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 17,
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
            background: "#111",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 99,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 15,
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
