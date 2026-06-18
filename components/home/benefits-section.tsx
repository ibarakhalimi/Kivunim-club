"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";
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

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

function categoryBg(category: string): string {
  return CATEGORY_BG[category] ?? "rgba(255,255,255,0.06)";
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0, left: 0, right: 0,
  zIndex: 51,
  background: "#252836",
  borderRadius: "26px 26px 0 0",
  border: "1px solid rgba(255,255,255,0.06)",
  borderBottom: "none",
  direction: "rtl",
  maxHeight: "80dvh",
  overflowY: "auto",
};

const closeBtn: React.CSSProperties = {
  position: "absolute", top: 14, left: 16,
  width: 32, height: 32,
  background: "#2F3344",
  border: "none",
  borderRadius: "50%",
  fontSize: 14,
  cursor: "pointer",
  color: "#9CA0AE",
  display: "flex", alignItems: "center", justifyContent: "center",
};

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [selected, setSelected] = useState<Benefit | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const currentBenefits = useMemo(() => benefits.filter((benefit) => !isExpired(benefit.expires_at)), [benefits]);

  const latestBenefit = useMemo(() => {
    return [...currentBenefits].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  }, [currentBenefits]);

  if (currentBenefits.length === 0) return null;

  return (
    <>
      <section style={{ width: "calc(50% - 5.5px)", flex: "0 0 calc(50% - 5.5px)", minWidth: 0 }}>
        <Link
          href="/benefits"
          style={{
            background: "#252836",
            border: "none",
            borderRadius: 22,
            boxShadow: "none",
            padding: 12,
            aspectRatio: "1 / 1",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div
              aria-label="הטבות"
              style={{
                width: "auto",
                height: "auto",
                borderRadius: 0,
                background: "rgba(17,32,58,0.72)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34D399",
              }}
            >
              <Gift size={19} strokeWidth={2.1} />
            </div>
            <span
              aria-label="כל ההטבות"
              style={{
                minWidth: 24,
                height: 24,
                borderRadius: "50%",
                border: "none",
                background: "#111522",
                color: "#34D399",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 10,
                lineHeight: 1,
                padding: 0,
              }}
            >
              {currentBenefits.length}
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#34D399" }}>
              הטבה חדשה
            </p>
            <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, lineHeight: 1.22, color: "#FFFFFF", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {latestBenefit.business}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, lineHeight: 1.25, color: "#9CA0AE", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {latestBenefit.deal}
            </p>
          </div>
        </Link>
      </section>

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={{ ...drawerStyle }}>
            <button onClick={() => setSelected(null)} style={closeBtn}>✕</button>

            <div style={{ padding: "24px 20px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                {selected.image_url ? (
                  <div style={{ width: 60, height: 60, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0 }}>
                    <img src={selected.image_url} alt={selected.business} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: categoryBg(selected.category ?? ""), border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    {categoryEmoji(selected.category ?? "")}
                  </div>
                )}
                <div>
                  <p style={{ margin: "0 0 2px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#FFFFFF" }}>
                    {selected.business}
                  </p>
                  {selected.category && (
                    <span style={{ display: "inline-block", background: "#2F3344", borderRadius: 99, padding: "2px 10px", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#9CA0AE" }}>
                      {selected.category}
                    </span>
                  )}
                </div>
              </div>

              {selected.business_description && (
                <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontSize: 14, lineHeight: 1.6, color: "#9CA0AE" }}>
                  {selected.business_description}
                </p>
              )}
              {selected.location && (
                <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 600, color: "#9CA0AE" }}>
                  📍 {selected.location}
                </p>
              )}

              <div style={{ background: "rgba(52,211,153,0.12)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid rgba(52,211,153,0.25)" }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#34D399" }}>
                  {selected.deal}
                </p>
              </div>

              {selected.description && (
                <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.7, color: "#9CA0AE" }}>
                  {selected.description}
                </p>
              )}

              <button
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: "#D8F500",
                  color: "#181A23",
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

      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={{ ...drawerStyle, padding: "24px 20px 48px" }}>
            <button onClick={() => setAllOpen(false)} style={closeBtn}>✕</button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
              כל ההטבות
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentBenefits.map((b) => (
                <div
                  key={b.id}
                  onClick={() => { setAllOpen(false); setSelected(b); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    background: "#2F3344",
                    padding: 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: categoryBg(b.category ?? ""), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {categoryEmoji(b.category ?? "")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>
                      {b.business}
                    </p>
                    <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 13, color: "#34D399" }}>
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
