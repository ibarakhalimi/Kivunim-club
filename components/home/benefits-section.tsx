"use client";

import { useEffect, useMemo, useState } from "react";
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
  "חינוך": "rgba(89,52,237,0.15)",
};

const CATEGORY_COLOR: Record<string, string> = {
  "אוכל": "#EF4444", "קפה": "#FB923C", "ספורט": "#34D399",
  "בריאות": "#4DA3FF", "יופי": "#A78BFA", "בידור": "#8B5CF6",
  "קניות": "#FFBA58", "טכנולוגיה": "#34D399", "תחבורה": "#4DA3FF",
  "חינוך": "#5934ED",
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
  const currentBenefits = useMemo(() => benefits.filter((benefit) => !isExpired(benefit.expires_at)), [benefits]);
  const selectedBenefit = useMemo(
    () => currentBenefits.find((benefit) => benefit.id === openBenefitId) ?? null,
    [currentBenefits, openBenefitId]
  );

  useEffect(() => {
    document.body.style.overflow = selectedBenefit ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedBenefit]);

  if (currentBenefits.length === 0) return null;

  return (
    <>
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <div style={{ width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, paddingInline: 2 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 16, lineHeight: 1.1, color: "#290800" }}>
            ההטבות שלך
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentBenefits.map((benefit) => {
          const category = benefit.category ?? "";
          return (
            <article
              key={benefit.id}
              onClick={() => setOpenBenefitId(benefit.id)}
              style={{
                padding: 14,
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: "#EFF2EC",
                borderRadius: 22,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: "50%", background: categoryBg(category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, flexShrink: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                {benefit.image_url ? (
                  <img
                    src={benefit.image_url}
                    alt={benefit.business}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  categoryEmoji(category)
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.25, color: "#290800" }}>
                  {benefit.business}
                </p>
                {category && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, lineHeight: 1.35, color: categoryColor(category) }}>
                    {category}
                  </p>
                )}
              </div>
              <span
                style={{
                  alignSelf: "center",
                  flexShrink: 0,
                  maxWidth: "38%",
                  borderRadius: 999,
                  background: "rgba(89, 52, 237, 0.14)",
                  color: "#5934ED",
                  padding: "7px 10px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 950,
                  fontSize: 12,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {benefit.deal}
              </span>
            </article>
          );
        })}
        </div>
      </div>
    </section>
    {selectedBenefit && (
      <div
        onClick={() => setOpenBenefitId(null)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "86dvh",
            borderRadius: "26px 26px 0 0",
            background: "#EFF2EC",
            border: "1px solid rgba(41,8,0,0.08)",
            borderBottom: "none",
            overflow: "hidden",
            direction: "rtl",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ maxHeight: "86dvh", overflowY: "auto", padding: "14px 16px 28px" }}>
            <button
              type="button"
              onClick={() => setOpenBenefitId(null)}
              aria-label="סגור"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                background: "#CBD6E6",
                color: "#290800",
                fontSize: 18,
                lineHeight: 1,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              ×
            </button>

            <div
              style={{
                width: "100%",
                aspectRatio: selectedBenefit.image_url ? "1.9 / 1" : "2.8 / 1",
                borderRadius: 20,
                background: categoryBg(selectedBenefit.category ?? ""),
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: categoryColor(selectedBenefit.category ?? ""),
                fontSize: 44,
                marginBottom: 16,
              }}
            >
              {selectedBenefit.image_url ? (
                <img
                  src={selectedBenefit.image_url}
                  alt={selectedBenefit.business}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                categoryEmoji(selectedBenefit.category ?? "")
              )}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ minWidth: 0 }}>
                {selectedBenefit.category && (
                  <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 12, color: categoryColor(selectedBenefit.category) }}>
                    {selectedBenefit.category}
                  </p>
                )}
                <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 950, fontSize: 24, lineHeight: 1.15, color: "#290800" }}>
                  {selectedBenefit.business}
                </h2>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  maxWidth: "42%",
                  borderRadius: 999,
                  background: "rgba(89,52,237,0.14)",
                  color: "#5934ED",
                  padding: "7px 10px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 950,
                  fontSize: 12,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {selectedBenefit.deal}
              </span>
            </div>

            {selectedBenefit.business_description && (
              <p style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, lineHeight: 1.55, color: "#64748B" }}>
                {selectedBenefit.business_description}
              </p>
            )}

            {selectedBenefit.description && (
              <div
                dangerouslySetInnerHTML={{ __html: selectedBenefit.description }}
                style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 15, lineHeight: 1.75, color: "#290800" }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedBenefit.location && (
                <div style={{ borderRadius: 14, background: "#DFDBD3", padding: "11px 12px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: "#290800" }}>
                  {selectedBenefit.location}
                </div>
              )}
              {selectedBenefit.contact_phone && (
                <a
                  href={`tel:${selectedBenefit.contact_phone.replace(/\D/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48,
                    borderRadius: 16,
                    background: "#5934ED",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 950,
                    fontSize: 15,
                    textDecoration: "none",
                  }}
                >
                  התקשרות למימוש ההטבה
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
