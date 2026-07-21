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
  "אוכל": "color-mix(in srgb, var(--color-red-500) 15%, transparent)", "קפה": "color-mix(in srgb, var(--color-orange-400) 15%, transparent)", "ספורט": "color-mix(in srgb, var(--color-success-bright) 15%, transparent)",
  "בריאות": "color-mix(in srgb, var(--color-sky) 15%, transparent)", "יופי": "color-mix(in srgb, var(--color-violet-400) 15%, transparent)", "בידור": "color-mix(in srgb, var(--color-violet-500) 15%, transparent)",
  "קניות": "color-mix(in srgb, var(--color-yellow-accent) 15%, transparent)", "טכנולוגיה": "color-mix(in srgb, var(--color-success-bright) 15%, transparent)", "תחבורה": "color-mix(in srgb, var(--color-sky) 15%, transparent)",
  "חינוך": "color-mix(in srgb, var(--color-brand) 15%, transparent)",
};

const CATEGORY_COLOR: Record<string, string> = {
  "אוכל": "var(--color-red-500)", "קפה": "var(--color-orange-400)", "ספורט": "var(--color-success-bright)",
  "בריאות": "var(--color-sky)", "יופי": "var(--color-violet-400)", "בידור": "var(--color-violet-500)",
  "קניות": "var(--color-yellow-accent)", "טכנולוגיה": "var(--color-success-bright)", "תחבורה": "var(--color-sky)",
  "חינוך": "var(--color-brand)",
};

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

function categoryBg(category: string): string {
  return CATEGORY_BG[category] ?? "color-mix(in srgb, var(--color-on-accent) 6%, transparent)";
}

function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? "var(--color-text-disabled)";
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
          <h2 style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xl)", lineHeight: 1.1, color: "var(--color-ink)" }}>
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
                background: "var(--color-surface)",
                borderRadius: "var(--shape-radius-5xl)",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: "var(--shape-radius-circle)", background: categoryBg(category), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-size-4xl)", flexShrink: 0, overflow: "hidden", border: "1px solid color-mix(in srgb, var(--color-on-accent) 8%, transparent)" }}>
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
                <p style={{ margin: "0 0 4px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", lineHeight: 1.25, color: "var(--color-ink)" }}>
                  {benefit.business}
                </p>
                {category && (
                  <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-sm)", lineHeight: 1.35, color: categoryColor(category) }}>
                    {category}
                  </p>
                )}
              </div>
              <span
                style={{
                  alignSelf: "center",
                  flexShrink: 0,
                  maxWidth: "38%",
                  borderRadius: "var(--shape-radius-pill)",
                  background: "color-mix(in srgb, var(--color-brand) 14%, transparent)",
                  color: "var(--color-brand)",
                  padding: "7px 10px",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-sm)",
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
          background: "color-mix(in srgb, var(--color-overlay) 50%, transparent)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "86dvh",
            borderRadius: "var(--shape-radius-sheet)",
            background: "var(--color-surface)",
            border: "1px solid color-mix(in srgb, var(--color-ink) 8%, transparent)",
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
                borderRadius: "var(--shape-radius-circle)",
                border: "none",
                background: "var(--color-neutral-blue)",
                color: "var(--color-ink)",
                fontSize: "var(--font-size-2xl)",
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
                borderRadius: "var(--shape-radius-4xl)",
                background: categoryBg(selectedBenefit.category ?? ""),
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: categoryColor(selectedBenefit.category ?? ""),
                fontSize: "var(--font-size-7xl)",
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
                  <p style={{ margin: "0 0 5px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-sm)", color: categoryColor(selectedBenefit.category) }}>
                    {selectedBenefit.category}
                  </p>
                )}
                <h2 style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-4xl)", lineHeight: 1.15, color: "var(--color-ink)" }}>
                  {selectedBenefit.business}
                </h2>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  maxWidth: "42%",
                  borderRadius: "var(--shape-radius-pill)",
                  background: "color-mix(in srgb, var(--color-brand) 14%, transparent)",
                  color: "var(--color-brand)",
                  padding: "7px 10px",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-sm)",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {selectedBenefit.deal}
              </span>
            </div>

            {selectedBenefit.business_description && (
              <p style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-base)", lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                {selectedBenefit.business_description}
              </p>
            )}

            {selectedBenefit.description && (
              <div
                dangerouslySetInnerHTML={{ __html: selectedBenefit.description }}
                style={{ margin: "0 0 16px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-lg)", lineHeight: 1.75, color: "var(--color-ink)" }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedBenefit.location && (
                <div style={{ borderRadius: "var(--shape-radius-xl)", background: "var(--color-app-bg)", padding: "11px 12px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-md)", color: "var(--color-ink)" }}>
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
                    borderRadius: "var(--shape-radius-2xl)",
                    background: "var(--color-brand)",
                    color: "var(--color-surface-raised)",
                    fontFamily: "var(--font-family-sans)",
                    fontWeight: "var(--font-weight-black)",
                    fontSize: "var(--font-size-lg)",
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
