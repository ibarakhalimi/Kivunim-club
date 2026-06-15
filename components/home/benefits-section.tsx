"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Benefit = Tables<"benefits">;

const CATEGORY_EMOJI: Record<string, string> = {
  "אוכל": "🍕", "קפה": "☕", "ספורט": "⚽", "בריאות": "💊",
  "יופי": "💅", "בידור": "🎬", "קניות": "🛍️", "טכנולוגיה": "💻",
  "תחבורה": "🚗", "חינוך": "📚",
};

const CATEGORY_BG: Record<string, string> = {
  "אוכל": "#FFF1F2", "קפה": "#FFFBEB", "ספורט": "#F0FDF4",
  "בריאות": "#EFF6FF", "יופי": "#FDF4FF", "בידור": "#F5F3FF",
  "קניות": "#FFF7ED", "טכנולוגיה": "#ECFDF5", "תחבורה": "#F0F9FF",
  "חינוך": "#FEFCE8",
};

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

function categoryBg(category: string): string {
  return CATEGORY_BG[category] ?? "#F8FAFC";
}

const VISIBLE_COUNT = 5;

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0, left: 0, right: 0,
  zIndex: 51,
  background: "#fff",
  borderRadius: "16px 16px 0 0",
  border: "1px solid #E2E8F0",
  borderBottom: "none",
  direction: "rtl",
  maxHeight: "80dvh",
  overflowY: "auto",
};

const closeBtn: React.CSSProperties = {
  position: "absolute", top: 14, left: 16,
  width: 32, height: 32,
  background: "#F1F5F9",
  border: "none",
  borderRadius: "50%",
  fontSize: 14,
  cursor: "pointer",
  color: "#64748B",
  display: "flex", alignItems: "center", justifyContent: "center",
};

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [selected, setSelected] = useState<Benefit | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  if (benefits.length === 0) return null;

  const categories = Array.from(new Set(benefits.map((b) => b.category).filter(Boolean))) as string[];
  const filteredBenefits = activeFilter === "all"
    ? benefits
    : activeFilter === "new"
      ? [...benefits].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : benefits.filter((b) => b.category === activeFilter);
  const visible = filteredBenefits.slice(0, VISIBLE_COUNT);

  return (
    <>
      <section>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 18,
            boxShadow: "none",
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
              margin: "0 -4px 12px",
              padding: "0 4px 2px",
            }}
          >
            <div style={{ flexShrink: 0, width: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <button
                onClick={() => setActiveFilter("new")}
                aria-label="חדשים"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: activeFilter === "new" ? "#FEF3C7" : "#F8FAFC",
                  border: `1px solid ${activeFilter === "new" ? "#FCD34D" : "#E2E8F0"}`,
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ✨
              </button>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 10, color: "#64748B", whiteSpace: "nowrap" }}>
                חדשים
              </span>
            </div>

            {categories.map((category) => (
              <div key={category} style={{ flexShrink: 0, width: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <button
                  onClick={() => setActiveFilter(category)}
                  aria-label={category}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: activeFilter === category ? categoryBg(category) : "#F8FAFC",
                    border: `1px solid ${activeFilter === category ? "#BFDBFE" : "#E2E8F0"}`,
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  {categoryEmoji(category)}
                </button>
                <span style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 10, color: "#64748B", whiteSpace: "nowrap" }}>
                  {category}
                </span>
              </div>
            ))}

            <button
              onClick={() => setAllOpen(true)}
              style={{
                flexShrink: 0,
                marginRight: "auto",
                height: 46,
                background: "#0F172A",
                border: "1px solid #0F172A",
                borderRadius: 99,
                padding: "0 14px",
                fontSize: 12,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "var(--font-rubik)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              כל ההטבות
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  background: "#F8FAFC",
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 72,
                  padding: 10,
                  gap: 12,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    background: categoryBg(b.category ?? ""),
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {categoryEmoji(b.category ?? "")}
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, minWidth: 0 }}>
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: "#0F172A" }}>
                    {b.business}
                  </p>
                  {b.business_description && (
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 12, color: "#94A3B8", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {b.business_description}
                    </p>
                  )}
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#1E40AF" }}>
                    {b.deal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail drawer */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div style={{ ...drawerStyle }}>
            <button onClick={() => setSelected(null)} style={closeBtn}>✕</button>

            <div style={{ padding: "24px 20px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                {selected.image_url ? (
                  <div style={{ width: 60, height: 60, borderRadius: 10, border: "1px solid #E2E8F0", overflow: "hidden", flexShrink: 0 }}>
                    <img src={selected.image_url} alt={selected.business} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: categoryBg(selected.category ?? ""), border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    {categoryEmoji(selected.category ?? "")}
                  </div>
                )}
                <div>
                  <p style={{ margin: "0 0 2px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#0F172A" }}>
                    {selected.business}
                  </p>
                  {selected.category && (
                    <span style={{ display: "inline-block", background: "#F1F5F9", borderRadius: 99, padding: "2px 10px", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#64748B" }}>
                      {selected.category}
                    </span>
                  )}
                </div>
              </div>

              {selected.business_description && (
                <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
                  {selected.business_description}
                </p>
              )}
              {selected.location && (
                <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 600, color: "#64748B" }}>
                  📍 {selected.location}
                </p>
              )}

              <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid #BFDBFE" }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#1E40AF" }}>
                  {selected.deal}
                </p>
              </div>

              {selected.description && (
                <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
                  {selected.description}
                </p>
              )}

              <button
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: "#1E40AF",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                מימוש הטבה
              </button>
            </div>
          </div>
        </>
      )}

      {/* All benefits drawer */}
      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div style={{ ...drawerStyle, padding: "24px 20px 48px" }}>
            <button onClick={() => setAllOpen(false)} style={closeBtn}>✕</button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
              כל ההטבות
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {benefits.map((b) => (
                <div
                  key={b.id}
                  onClick={() => { setAllOpen(false); setSelected(b); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    background: "#fff",
                    padding: 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: categoryBg(b.category ?? ""), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {categoryEmoji(b.category ?? "")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
                      {b.business}
                    </p>
                    <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 13, color: "#1E40AF" }}>
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
