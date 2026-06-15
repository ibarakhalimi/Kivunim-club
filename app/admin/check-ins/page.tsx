import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("he-IL", {
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDayKey(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function isoDay(dateStr: string) {
  return dateStr.slice(0, 10);
}

export default async function CheckInsPage() {
  const supabase = createAdminClient();

  const { data: rows } = await supabase
    .from("check_ins")
    .select("id, user_id, checked_in_at, members(name, email)")
    .order("checked_in_at", { ascending: false });

  const checkIns = rows ?? [];
  const total = checkIns.length;
  const uniqueUsers = new Set(checkIns.map((r) => r.user_id)).size;

  const byDay: Record<string, typeof checkIns> = {};
  for (const row of checkIns) {
    const day = isoDay(row.checked_in_at);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(row);
  }
  const sortedDays = Object.keys(byDay).sort((a, b) => b.localeCompare(a));
  const maxCount = Math.max(...sortedDays.map((d) => byDay[d].length), 1);

  return (
    <div dir="rtl" style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 60px", fontFamily: "var(--font-rubik)" }}>
      <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>← חזרה לניהול</a>

      <h1 style={{ margin: "16px 0 4px", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
        דשבורד הגעות
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748B" }}>מעקב אחר כניסות לסביבת הלימודים</p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        <KpiCard label="סה״כ כניסות" value={total} emoji="🚪" />
        <KpiCard label="משתמשים שונים" value={uniqueUsers} emoji="👥" />
        <KpiCard label="ימים פעילים" value={sortedDays.length} emoji="📅" />
      </div>

      {/* Bar chart by day */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "18px 16px", marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>כניסות לפי יום</h2>
        {sortedDays.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14 }}>אין נתונים עדיין</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedDays.map((day) => {
              const count = byDay[day].length;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={day}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                      {formatDayKey(day + "T12:00:00")}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#1E40AF", borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-ins table */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#0F172A" }}>רשימת כניסות</h2>
        </div>

        {checkIns.length === 0 ? (
          <p style={{ padding: "20px 16px", color: "#94A3B8", fontSize: 14 }}>אין כניסות עדיין</p>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {["שם", "תאריך", "שעה"].map((h) => (
                <span key={h} style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.04em" }}>{h}</span>
              ))}
            </div>

            {checkIns.map((row, i) => {
              const member = Array.isArray(row.members) ? row.members[0] : row.members;
              const name = member?.name ?? "—";
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom: i < checkIns.length - 1 ? "1px solid #F1F5F9" : "none",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{name}</span>
                  <span style={{ fontSize: 13, color: "#475569" }}>{formatDate(row.checked_in_at)}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{formatTime(row.checked_in_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "16px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 28, color: "#0F172A", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-rubik)", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginTop: 4 }}>{label}</div>
    </div>
  );
}
