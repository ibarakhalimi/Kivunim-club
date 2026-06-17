import { createAdminClient } from "@/lib/supabase/admin";
import { OpeningHoursForm } from "./opening-hours-form";

export const dynamic = "force-dynamic";

const FALLBACK_ROWS = [
  { day_key: "sunday", day_label: "ראשון", sort_order: 1, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "monday", day_label: "שני", sort_order: 2, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "tuesday", day_label: "שלישי", sort_order: 3, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "wednesday", day_label: "רביעי", sort_order: 4, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "thursday", day_label: "חמישי", sort_order: 5, is_open: true, open_time: "08:00", close_time: "18:00", note: null },
  { day_key: "friday", day_label: "שישי", sort_order: 6, is_open: false, open_time: null, close_time: null, note: null },
  { day_key: "saturday", day_label: "שבת", sort_order: 7, is_open: false, open_time: null, close_time: null, note: null },
];

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("opening_hours")
    .select("day_key, day_label, sort_order, is_open, open_time, close_time, note")
    .order("sort_order", { ascending: true });

  const rows = data?.length === 7 ? data : FALLBACK_ROWS;

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "24px 16px 46px",
        fontFamily: "var(--font-rubik)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 700 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0F172A" }}>הגדרות</h1>
      </div>

      <section>
        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#0F172A" }}>
            שעות פתיחה
          </p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#64748B", lineHeight: 1.45 }}>
            עדכון שעות הפתיחה והערות שיוצגו בצ׳יפים בסקשן הצ׳קאין.
          </p>
        </div>
        <OpeningHoursForm rows={rows} />
      </section>
    </div>
  );
}
