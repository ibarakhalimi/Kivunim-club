"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Benefit = Tables<"benefits">;

// Pastel chip colors per category — hash-based so the same category always gets the same color
const CHIP_COLORS = ["#FFB380", "#C4B5FD", "#6EE7B7", "#93C5FD", "#FDA4AF", "#FCD34D"];

function categoryChipColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
  return CHIP_COLORS[Math.abs(hash) % CHIP_COLORS.length];
}

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [selected, setSelected] = useState<Benefit | null>(null);

  const visible = benefits.slice(0, 6);
  if (visible.length === 0) return null;

  return (
    <>
      <section>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingInline: 2 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.018em", color: "var(--color-text-primary)" }}>
            הטבות ומבצעים
          </h2>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent-secondary)" }}>
            כל ההטבות ←
          </span>
        </div>

        {/* 2-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {visible.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelected(b)}
              className="kv-tap"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.65)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Image with chip overlay */}
              <div style={{ position: "relative", width: "100%", height: 110, flexShrink: 0 }}>
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    alt={b.business}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.06)" }} />
                )}
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: categoryChipColor(b.category ?? ""),
                    borderRadius: "var(--radius-full)",
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "rgba(0,0,0,0.75)",
                  }}
                >
                  {b.category}
                </span>
              </div>

              {/* Text */}
              <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 15, lineHeight: 1.2, color: "var(--color-text-primary)" }}>
                  {b.business}
                </p>
                {b.business_description && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 12, lineHeight: 1.3, color: "var(--color-text-muted)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {b.business_description}
                  </p>
                )}
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: "var(--color-text-primary)" }}>
                  {b.deal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail drawer */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }} />
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
              maxHeight: "75dvh",
              overflowY: "auto",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
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

            <div style={{ padding: "24px 20px 36px" }}>
              {/* Chip + image */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <span
                  style={{
                    background: categoryChipColor(selected.category ?? ""),
                    borderRadius: "var(--radius-full)",
                    padding: "4px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(0,0,0,0.75)",
                  }}
                >
                  {selected.category}
                </span>
                {selected.image_url && (
                  <img src={selected.image_url} alt={selected.business} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(0,0,0,0.08)" }} />
                )}
              </div>

              <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 22, color: "var(--color-text-primary)" }}>
                {selected.business}
              </p>
              {selected.business_description && (
                <p style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                  {selected.business_description}
                </p>
              )}
              {selected.location && (
                <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>📍</span>{selected.location}
                </p>
              )}
              <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 28, color: "var(--color-text-primary)" }}>
                {selected.deal}
              </p>
              <p style={{ margin: "0 0 24px", fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
                {selected.description}
              </p>

              <button
                style={{
                  width: "100%", padding: "15px 0",
                  background: "var(--color-accent-primary)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 17,
                  cursor: "pointer",
                }}
              >
                מימוש הטבה
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
