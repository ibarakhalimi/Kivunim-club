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
          background: "var(--color-blue-50)",
          border: "1px solid var(--color-blue-200)",
          borderRadius: "var(--shape-radius-lg)",
          boxShadow: "none",
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
        <span style={{ fontSize: "var(--font-size-4xl)" }}>📅</span>
        <span
          style={{
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-brand-blue)",
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
          style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 3%, transparent)", zIndex: 50 }}
        />
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 0, left: 0, right: 0,
            zIndex: 51,
            background: "var(--color-surface-raised)",
            borderRadius: "var(--shape-radius-sheet-compact)",
            border: "1px solid var(--color-border-subtle)",
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
              background: "var(--color-surface-soft)",
              border: "none",
              borderRadius: "var(--shape-radius-circle)",
              fontSize: "var(--font-size-lg)",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>

          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 6px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-3xl)", color: "var(--color-ink)" }}>
              אישור הגעה בכיוונים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-regular)", fontSize: "var(--font-size-lg)", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              כדי להשתמש בסביבת הלימודים בצורה חופשית יש לציין שהגעת
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px 0",
              background: isPending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
              color: "var(--color-surface-raised)",
              border: "none",
              borderRadius: "var(--shape-radius-md)",
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-bold)",
              fontSize: "var(--font-size-xl)",
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
            background: "var(--color-admin-dark)",
            color: "var(--color-surface-raised)",
            padding: "11px 22px",
            borderRadius: "var(--shape-radius-pill)",
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-base)",
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
