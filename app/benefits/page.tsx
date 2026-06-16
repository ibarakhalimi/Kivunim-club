import Link from "next/link";
import { Gift } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "@/app/updates/swipe-back-home";

export const dynamic = "force-dynamic";

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
  created_at: string;
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
  "בריאות": "#EFF6FF",
  "יופי": "#FCE7F3",
  "בידור": "#F5F3FF",
  "קניות": "#FFF7ED",
  "טכנולוגיה": "#ECFDF5",
  "תחבורה": "#F0F9FF",
  "חינוך": "#FEFCE8",
};

function categoryEmoji(category: string | null) {
  return CATEGORY_EMOJI[category ?? ""] ?? "🎁";
}

function categoryBg(category: string | null) {
  return CATEGORY_BG[category ?? ""] ?? "#FCE7F3";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BenefitsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("benefits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const benefits = (data ?? []) as BenefitItem[];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "#FCE7F3",
              color: "#DB2777",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#0F172A" }}>
              הטבות
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
              כל ההטבות שמחכות לך
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#0F172A",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
          }}
        >
          ←
        </Link>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {benefits.map((benefit) => (
          <article
            key={benefit.id}
            style={{
              background: "#fff",
              border: "1px solid #FCE7F3",
              borderRadius: 18,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {benefit.image_url ? (
                <img
                  src={benefit.image_url}
                  alt={benefit.business}
                  style={{ width: 54, height: 54, borderRadius: 14, objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    background: categoryBg(benefit.category),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {categoryEmoji(benefit.category)}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.2, color: "#0F172A" }}>
                  {benefit.business}
                </p>
                {benefit.category && (
                  <span style={{ display: "inline-flex", borderRadius: 99, background: "#FCE7F3", color: "#DB2777", padding: "3px 8px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11 }}>
                    {benefit.category}
                  </span>
                )}
              </div>
            </div>

            <div style={{ borderRadius: 14, background: "#FDF2F8", padding: "12px 13px", marginBottom: 12 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.25, color: "#DB2777" }}>
                {benefit.deal}
              </p>
            </div>

            {benefit.business_description && (
              <p style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
                {benefit.business_description}
              </p>
            )}
            {benefit.description && (
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.6, color: "#334155" }}>
                {benefit.description}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
          </article>
        ))}
      </section>
      <BottomNav activeKey="benefits" alwaysOpen />
    </main>
  );
}
