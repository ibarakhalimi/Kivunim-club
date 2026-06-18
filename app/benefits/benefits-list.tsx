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
  "אוכל": "rgba(225,29,72,0.15)",
  "קפה": "rgba(251,146,60,0.15)",
  "ספורט": "rgba(52,211,153,0.15)",
  "כושר": "rgba(52,211,153,0.15)",
  "בריאות": "rgba(77,163,255,0.15)",
  "יופי": "rgba(219,39,119,0.15)",
  "בידור": "rgba(167,139,250,0.15)",
  "קניות": "rgba(234,88,12,0.15)",
  "טכנולוגיה": "rgba(5,150,105,0.15)",
  "תחבורה": "rgba(2,132,199,0.15)",
  "חינוך": "rgba(161,98,7,0.15)",
  "מסעדות": "rgba(234,88,12,0.15)",
  "הטבות שהסתיימו": "#2F3344",
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
  "הטבות שהסתיימו": "#64748B",
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

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

export function BenefitsList({ benefits }: { benefits: BenefitItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const activeBenefits = benefits.filter((benefit) => !isExpired(benefit.expires_at));
  const expiredBenefits = benefits.filter((benefit) => isExpired(benefit.expires_at));
  const categories = Array.from(new Set(activeBenefits.map((benefit) => benefit.category).filter(Boolean))) as string[];
  const filteredBenefits = activeCategory === "all"
    ? activeBenefits
    : activeBenefits.filter((benefit) => benefit.category === activeCategory);

  function renderBenefit(benefit: BenefitItem, forceEnded = false) {
    const isOpen = openId === benefit.id;
    const expired = forceEnded || isExpired(benefit.expires_at);
    const shownCategory = expired ? "הטבות שהסתיימו" : benefit.category;
    const bg = categoryBg(shownCategory);
    const accent = categoryAccent(shownCategory);

    return (
      <article
        key={benefit.id}
        style={{
          background: "#252836",
          border: "none",
          borderRadius: 22,
          overflow: "hidden",
          opacity: expired ? 0.78 : 1,
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
              background: benefit.image_url ? `linear-gradient(rgba(15,23,42,${expired ? 0.22 : 0}), rgba(15,23,42,${expired ? 0.22 : 0})), url(${benefit.image_url}) center / cover` : bg,
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
            <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.2, color: "#FFFFFF" }}>
              {benefit.business}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 14, lineHeight: 1.25, color: accent, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {benefit.deal}
            </p>
          </div>

          {shownCategory && (
            <span style={{ flexShrink: 0, borderRadius: 99, background: bg, color: accent, padding: "4px 8px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 10 }}>
              {shownCategory}
            </span>
          )}
        </button>

        {isOpen && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {benefit.business_description && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15, lineHeight: 1.65, color: "#B4B8C6" }}>
                {benefit.business_description}
              </p>
            )}
            {benefit.description && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15, lineHeight: 1.65, color: "#B4B8C6" }}>
                {benefit.description}
              </p>
            )}
            {benefit.location && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#9CA0AE" }}>
                {benefit.location}
              </p>
            )}
            {benefit.expires_at && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: expired ? "#7C808E" : "#9CA0AE" }}>
                {expired ? "הסתיימה בתאריך" : "בתוקף עד"} {formatDate(benefit.expires_at)}
              </p>
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}>
        <button
          type="button"
          onClick={() => { setActiveCategory("all"); setOpenId(null); }}
          style={{
            flexShrink: 0,
            border: "none",
            background: activeCategory === "all" ? "#34D399" : "#252836",
            color: activeCategory === "all" ? "#0F2820" : "#9CA0AE",
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
          const accent = categoryAccent(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => { setActiveCategory(category); setOpenId(null); }}
              style={{
                flexShrink: 0,
                border: "none",
                background: isActive ? accent : "#252836",
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

      {filteredBenefits.map((benefit) => renderBenefit(benefit))}

      {expiredBenefits.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, color: "#9CA0AE" }}>
            הטבות שהסתיימו
          </h2>
          {expiredBenefits.map((benefit) => renderBenefit(benefit, true))}
        </div>
      )}
    </section>
  );
}
