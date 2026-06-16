"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const TEMP_UPDATE = {
  title: "נפתח מרחב למידה חדש לסטודנטים",
  description: "החל מהשבוע יעמוד לרשותכם חלל שקט ללמידה עצמאית וקבוצתית, עם עמדות עבודה, קפה וזמינות עד שעות הערב.",
  author: "צוות כיוונים",
};

export function UpdateList() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <section style={{ width: "calc(50% - 6px)" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 22,
            boxShadow: "none",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textAlign: "right",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div
              aria-label="עדכונים"
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: "#FFFBEB",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B45309",
              }}
            >
              <Megaphone size={19} strokeWidth={2.1} />
            </div>
            <span
              style={{
                borderRadius: 99,
                background: "#0F172A",
                color: "#fff",
                padding: "5px 8px",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 10,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              חדש
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#B45309" }}>
              הודעות ועדכונים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.22, color: "#0F172A", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {TEMP_UPDATE.title}
            </p>
          </div>
        </button>
      </section>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              borderRadius: "16px 16px 0 0",
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              padding: "18px 20px 34px",
              direction: "rtl",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "#F1F5F9",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginBottom: 14,
              }}
            >
              ✕
            </button>
            <p style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#B45309" }}>
              הודעות ועדכונים
            </p>
            <h2 style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1.22, color: "#0F172A" }}>
              {TEMP_UPDATE.title}
            </h2>
            <p style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
              {TEMP_UPDATE.description}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#94A3B8" }}>
              {TEMP_UPDATE.author}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
