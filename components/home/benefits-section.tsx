"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Tables } from "@/src/types/database";

type Benefit = Tables<"benefits">;

const CATEGORY_EMOJI: Record<string, string> = {
  "אוכל": "🍕", "קפה": "☕", "ספורט": "⚽", "בריאות": "💊",
  "יופי": "💅", "בידור": "🎬", "קניות": "🛍️", "טכנולוגיה": "💻",
  "תחבורה": "🚗", "חינוך": "📚",
};

const CATEGORY_BG: Record<string, string> = {
  "אוכל": "rgba(239,68,68,0.15)", "קפה": "rgba(251,146,60,0.15)", "ספורט": "rgba(52,211,153,0.15)",
  "בריאות": "rgba(77,163,255,0.15)", "יופי": "rgba(167,139,250,0.15)", "בידור": "rgba(139,92,246,0.15)",
  "קניות": "rgba(255,186,88,0.15)", "טכנולוגיה": "rgba(52,211,153,0.15)", "תחבורה": "rgba(77,163,255,0.15)",
  "חינוך": "rgba(216,245,0,0.15)",
};

const CATEGORY_COLOR: Record<string, string> = {
  "אוכל": "#EF4444", "קפה": "#FB923C", "ספורט": "#34D399",
  "בריאות": "#4DA3FF", "יופי": "#A78BFA", "בידור": "#8B5CF6",
  "קניות": "#FFBA58", "טכנולוגיה": "#34D399", "תחבורה": "#4DA3FF",
  "חינוך": "#D8F500",
};

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

function categoryBg(category: string): string {
  return CATEGORY_BG[category] ?? "rgba(255,255,255,0.06)";
}

function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? "#9CA0AE";
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [openBenefitId, setOpenBenefitId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const currentBenefits = useMemo(() => benefits.filter((benefit) => !isExpired(benefit.expires_at)), [benefits]);
  const initialVisibleCount = 5;
  const additionalCount = Math.max(currentBenefits.length - initialVisibleCount, 0);
  const visibleBenefits = showAll ? currentBenefits : currentBenefits.slice(0, initialVisibleCount);

  if (currentBenefits.length === 0) return null;

  return (
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <div style={{ background: "#252836", borderRadius: 22, padding: 18, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 1000, fontSize: 16, lineHeight: 1.1, color: "#FFFFFF" }}>
            ההטבות שלך
          </h2>
          {!showAll && additionalCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              aria-label={`הצג עוד ${additionalCount} הטבות`}
              style={{
                minHeight: 32,
                border: "none",
                borderRadius: 999,
                background: "#34D399",
                color: "#111522",
                padding: "0 11px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                fontFamily: "var(--font-rubik)",
                fontWeight: 950,
                fontSize: 12,
                lineHeight: 1,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Plus size={14} strokeWidth={3} />
              {additionalCount}
            </button>
          )}
        </div>
        {visibleBenefits.map((benefit, index) => {
          const isOpen = openBenefitId === benefit.id;
          const category = benefit.category ?? "";
          return (
            <article
              key={benefit.id}
              onClick={() => {
                if (!benefit.description) return;
                setOpenBenefitId((current) => current === benefit.id ? null : benefit.id);
              }}
              style={{
                padding: "13px 0",
                display: "flex",
                gap: 12,
                borderBottom: index === visibleBenefits.length - 1 ? "none" : "1px solid rgba(52, 211, 153, 0.16)",
                cursor: benefit.description ? "pointer" : "default",
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 14, background: categoryBg(category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {categoryEmoji(category)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.25, color: "#FFFFFF" }}>
                  {benefit.business}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, lineHeight: 1.35, color: "#34D399" }}>
                  {benefit.deal}
                </p>
                {isOpen && benefit.description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: benefit.description }}
                    style={{ margin: "8px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, lineHeight: 1.6, color: "#C7CAD6" }}
                  />
                )}
              </div>
              {category && (
                <span
                  style={{
                    alignSelf: "flex-start",
                    flexShrink: 0,
                    borderRadius: 999,
                    background: categoryBg(category),
                    color: categoryColor(category),
                    padding: "5px 9px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 10,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {category}
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
