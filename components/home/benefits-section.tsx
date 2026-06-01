"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Benefit = Tables<"benefits">;

const CATEGORY_EMOJI: Record<string, string> = {
  "אוכל": "🍕",
  "קפה": "☕",
  "ספורט": "⚽",
  "בריאות": "💊",
  "יופי": "💅",
  "בידור": "🎬",
  "קניות": "🛍️",
  "טכנולוגיה": "💻",
  "תחבורה": "🚗",
  "חינוך": "📚",
};

const CATEGORY_COLORS = ["#B8A7E8", "#EEC84A", "#A8D464", "#F4A07A", "#7DC8E8", "#F4C2D4"];

function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

const GRADIENTS = [
  "linear-gradient(135deg, #B8A7E8, #7DC8E8)",
  "linear-gradient(135deg, #EEC84A, #F4A07A)",
  "linear-gradient(135deg, #A8D464, #7DC8E8)",
  "linear-gradient(135deg, #F4A07A, #F4C2D4)",
  "linear-gradient(135deg, #7DC8E8, #B8A7E8)",
  "linear-gradient(135deg, #EEC84A, #A8D464)",
];

const VISIBLE_COUNT = 5;

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [selected, setSelected] = useState<Benefit | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  if (benefits.length === 0) return null;

  const visible = benefits.slice(0, VISIBLE_COUNT);
  const extraCount = benefits.length - VISIBLE_COUNT;

  return (
    <>
      <section>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
            הטבות ומבצעים
          </h2>
          {extraCount > 0 && (
            <button
              onClick={() => setAllOpen(true)}
              style={{
                background: "#F4C2D4",
                border: "2px solid #000",
                borderRadius: 99,
                padding: "3px 12px",
                fontSize: 13,
                fontWeight: 700,
                color: "#111",
                fontFamily: "var(--font-rubik)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              + {extraCount} הטבות נוספות
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 6px 6px 0" }}>
          {visible.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelected(b)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                border: "3px solid #000",
                borderRadius: 20,
                boxShadow: "5px 5px 0px #000",
                background: "#fff",
                overflow: "hidden",
                cursor: "pointer",
                minHeight: 90,
                padding: 10,
                gap: 14,
              }}
            >
              {/* Category square — right side (RTL start) */}
              <div
                style={{
                  flexShrink: 0,
                  width: 70,
                  height: 70,
                  borderRadius: 20,
                  background: categoryColor(b.category ?? ""),
                  border: "2px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                }}
              >
                {categoryEmoji(b.category ?? "")}
              </div>

              {/* Content */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.2, color: "#111" }}>
                  {b.business}
                </p>
                {b.business_description && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 12, color: "#888", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {b.business_description}
                  </p>
                )}
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, color: "#111" }}>
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
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              border: "3px solid #000",
              borderBottom: "none",
              boxShadow: "0 -5px 0 #000",
              direction: "rtl",
              maxHeight: "75dvh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSelected(null)}
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

            <div style={{ padding: "24px 20px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                {selected.image_url && (
                  <div style={{ width: 64, height: 64, borderRadius: 12, border: "3px solid #000", overflow: "hidden", flexShrink: 0 }}>
                    <img src={selected.image_url} alt={selected.business} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <p style={{ margin: "0 0 2px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#111" }}>
                    {selected.business}
                  </p>
                  {selected.category && (
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 13, color: "#888" }}>
                      {selected.category}
                    </p>
                  )}
                </div>
              </div>

              {selected.business_description && (
                <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontSize: 14, lineHeight: 1.6, color: "#555" }}>
                  {selected.business_description}
                </p>
              )}
              {selected.location && (
                <p style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 600, color: "#555" }}>
                  📍 {selected.location}
                </p>
              )}
              <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 26, color: "#111" }}>
                {selected.deal}
              </p>
              {selected.description && (
                <p style={{ margin: "0 0 24px", fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.7, color: "#333" }}>
                  {selected.description}
                </p>
              )}

              <button
                style={{
                  width: "100%",
                  padding: "15px 0",
                  background: "#111",
                  color: "#fff",
                  border: "3px solid #000",
                  borderRadius: 12,
                  boxShadow: "4px 4px 0 #000",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 17,
                  cursor: "pointer",
                }}
              >
                מימוש הטבה
              </button>
            </div>
          </div>
        </>
      )}

      {/* All benefits off-canvas */}
      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }} />
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
              maxHeight: "85dvh",
              overflowY: "auto",
              padding: "24px 20px 48px",
            }}
          >
            <button
              onClick={() => setAllOpen(false)}
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

            <p style={{ margin: "0 0 18px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
              כל ההטבות
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "4px 6px 6px 0" }}>
              {benefits.map((b, i) => (
                <div
                  key={b.id}
                  onClick={() => { setAllOpen(false); setSelected(b); }}
                  style={{
                    border: "3px solid #000",
                    borderRadius: 16,
                    boxShadow: "5px 5px 0 #000",
                    background: "#fff",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {/* Image / gradient top */}
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      position: "relative",
                      background: b.image_url ? undefined : GRADIENTS[i % GRADIENTS.length],
                      borderBottom: "3px solid #000",
                      overflow: "hidden",
                    }}
                  >
                    {b.image_url && (
                      <img src={b.image_url} alt={b.business} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    {/* Category chip */}
                    {b.category && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          background: "#fff",
                          border: "2px solid #000",
                          borderRadius: 99,
                          padding: "3px 10px",
                          fontFamily: "var(--font-rubik)",
                          fontWeight: 700,
                          fontSize: 12,
                          color: "#111",
                        }}
                      >
                        {b.category}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.2, color: "#111" }}>
                      {b.business}
                    </p>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, color: "#111" }}>
                      {b.deal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
