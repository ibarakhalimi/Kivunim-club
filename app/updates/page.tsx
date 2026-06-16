import Link from "next/link";
import { Megaphone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "./swipe-back-home";

export const dynamic = "force-dynamic";

type Update = {
  id: string;
  title: string;
  description: string | null;
  published_at: string;
  author: string | null;
};

const TEMP_UPDATES: Update[] = [
  {
    id: "temp-campus-evening",
    title: "ערב סטודנטים במרכז העיר",
    description: "מפגש פתוח לסטודנטים עם מוזיקה, אוכל קל והיכרות עם סטודנטים נוספים מהעיר.",
    published_at: new Date().toISOString(),
    author: "צוות כיוונים",
  },
  {
    id: "temp-exam-benefits",
    title: "הטבות חדשות לתקופת מבחנים",
    description: "ריכזנו עבורכם הטבות בקפה, הדפסות וחללי למידה שיעזרו לעבור את התקופה קצת יותר בנוח.",
    published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: "צוות כיוונים",
  },
  {
    id: "temp-volunteer-call",
    title: "מחפשים נציגי סטודנטים לפעילות הבאה",
    description: "רוצים לקחת חלק בהפקת אירועים ולייצג את הסטודנטים בעיר? זה הזמן להצטרף לצוות המתנדבים.",
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: "צוות כיוונים",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function dateParts(date: string) {
  const updateDate = new Date(date);
  return {
    day: updateDate.toLocaleDateString("he-IL", { day: "numeric" }),
    month: updateDate.toLocaleDateString("he-IL", { month: "short" }),
  };
}

export default async function UpdatesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false });

  const updates = [...((data ?? []) as Update[]), ...TEMP_UPDATES];

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
              background: "#FFFBEB",
              color: "#B45309",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Megaphone size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#0F172A" }}>
              עדכונים
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
              כל ההודעות במקום אחד
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

      <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {updates.map((update, index) => (
          <div key={update.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
            <div style={{ width: 46, flexShrink: 0, display: "flex", justifyContent: "center", position: "relative", alignSelf: "stretch" }}>
              {index < updates.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 54,
                    bottom: -18,
                    left: "50%",
                    borderLeft: "2px dashed #FDE68A",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
              <div
                aria-label={formatDate(update.published_at)}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "#FFFBEB",
                  border: "none",
                  color: "#B45309",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-rubik)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span style={{ fontWeight: 900, fontSize: 18, lineHeight: 1 }}>
                  {dateParts(update.published_at).day}
                </span>
                <span style={{ fontWeight: 800, fontSize: 11, lineHeight: 1.1 }}>
                  {dateParts(update.published_at).month}
                </span>
              </div>
            </div>
            <article
              style={{
                flex: 1,
                background: "#fff",
                border: "none",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <h2 style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.22, color: "#0F172A" }}>
                {update.title}
              </h2>
              {update.description && (
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.65, color: "#475569" }}>
                  {update.description}
                </p>
              )}
            </article>
          </div>
        ))}
      </section>
      <BottomNav activeKey="updates" alwaysOpen />
    </main>
  );
}
