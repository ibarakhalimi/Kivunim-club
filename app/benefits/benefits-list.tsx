"use client";

import { useState } from "react";

type BenefitItem = {
  id: string;
  business: string;
  category: string | null;
  deal: string;
  description: string | null;
  business_description: string | null;
  location: string | null;
  expires_at: string | null;
  image_url: string | null;
};

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

const CATEGORY_BG: Record<string, string> = {
  "אוכל": "#FFF1F2",
  "קפה": "#FFFBEB",
  "ספורט": "#F0FDF4",
  "כושר": "#F0FDF4",
  "בריאות": "#EFF6FF",
  "יופי": "#FCE7F3",
  "בידור": "#F5F3FF",
  "קניות": "#FFF7ED",
  "טכנולוגיה": "#ECFDF5",
  "תחבורה": "#F0F9FF",
  "חינוך": "#FEFCE8",
  "מסעדות": "#FFF7ED",
};

const CATEGORY_ACCENT: Record<string, string> = {
  "אוכל": "#E11D48",
  "קפה": "#B45309",
  "ספורט": "#16A34A",
  "כושר": "#16A34A",
  "בריאות": "#2563EB",
  "יופי": "#DB2777",
  "בידור": "#7C3AED",
  "קניות": "#EA580C",
  "טכנולוגיה": "#059669",
  "תחבורה": "#0284C7",
  "חינוך": "#A16207",
  "מסעדות": "#EA580C",
};

function categoryEmoji(category: string | null) {
  return CATEGORY_EMOJI[category ?? ""] ?? "🎁";
}

function categoryBg(category: string | null) {
  return CATEGORY_BG[category ?? ""] ?? "#FCE7F3";
}

function categoryAccent(category: string | null) {
  return CATEGORY_ACCENT[category ?? ""] ?? "#DB2777";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BenefitsList({ benefits }: { benefits: BenefitItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const categories = Array.from(new Set(benefits.map((benefit) => benefit.category).filter(Boolean))) as string[];
  const filteredBenefits = activeCategory === "all"
    ? benefits
    : benefits.filter((benefit) => benefit.category === activeCategory);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}>
        <button
          type="button"
          onClick={() => { setActiveCategory("all"); setOpenId(null); }}
          style={{
            flexShrink: 0,
            border: activeCategory === "all" ? "1px solid #0F172A" : "1px solid #E2E8F0",
            background: activeCategory === "all" ? "#0F172A" : "#fff",
            color: activeCategory === "all" ? "#fff" : "#0F172A",
            borderRadius: 999,
            padding: "8px 12px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          כל ההטבות
        </button>
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const bg = categoryBg(category);
          const accent = categoryAccent(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => { setActiveCategory(category); setOpenId(null); }}
              style={{
                flexShrink: 0,
                border: `1px solid ${isActive ? accent : `${accent}33`}`,
                background: isActive ? accent : bg,
                color: isActive ? "#fff" : accent,
                borderRadius: 999,
                padding: "8px 12px",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredBenefits.map((benefit) => {
        const isOpen = openId === benefit.id;
        const bg = categoryBg(benefit.category);
        const accent = categoryAccent(benefit.category);

        return (
          <article
            key={benefit.id}
            style={{
              background: "#fff",
              border: `1px solid ${accent}26`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : benefit.id)}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                padding: 8,
                display: "flex",
                alignItems: "center",
                gap: 9,
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 14,
                  background: benefit.image_url ? `url(${benefit.image_url}) center / cover` : bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {!benefit.image_url && categoryEmoji(benefit.category)}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.2, color: "#0F172A" }}>
                  {benefit.business}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 14, lineHeight: 1.25, color: accent, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {benefit.deal}
                </p>
              </div>

              {benefit.category && (
                <span style={{ flexShrink: 0, borderRadius: 99, background: bg, color: accent, padding: "4px 8px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 10 }}>
                  {benefit.category}
                </span>
              )}
            </button>

            {isOpen && (
              <div style={{ borderTop: `1px solid ${accent}26`, padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {benefit.business_description && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.55, color: "#475569" }}>
                    {benefit.business_description}
                  </p>
                )}
                {benefit.description && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.55, color: "#334155" }}>
                    {benefit.description}
                  </p>
                )}
                {benefit.location && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
                    {benefit.location}
                  </p>
                )}
                {benefit.expires_at && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#94A3B8" }}>
                    בתוקף עד {formatDate(benefit.expires_at)}
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
