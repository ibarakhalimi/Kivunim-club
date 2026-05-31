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
  return dateStr.slice(0, 10); // YYYY-MM-DD
}

export default async function CheckInsPage() {
  const supabase = createAdminClient();

  // All check-ins with member name
  const { data: rows } = await supabase
    .from("check_ins")
    .select("id, user_id, checked_in_at, members(name, email)")
    .order("checked_in_at", { ascending: false });

  const checkIns = rows ?? [];
  const total = checkIns.length;
  const uniqueUsers = new Set(checkIns.map((r) => r.user_id)).size;

  // Group by day
  const byDay: Record<string, typeof checkIns> = {};
  for (const row of checkIns) {
    const day = isoDay(row.checked_in_at);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(row);
  }
  const sortedDays = Object.keys(byDay).sort((a, b) => b.localeCompare(a));
  const maxCount = Math.max(...sortedDays.map((d) => byDay[d].length), 1);

  return (
    <main dir="rtl" style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px", fontFamily: "var(--font-rubik)" }}>
      <a href="/admin" style={{ fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none", fontWeight: 600 }}>← חזרה לניהול</a>

      <h1 style={{ margin: "16px 0 4px", fontWeight: 800, fontSize: 28, color: "var(--color-text-primary)" }}>
        דשבורד הגעות
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: "var(--color-text-muted)" }}>מעקב אחר כניסות לסביבת הלימודים</p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 36 }}>
        <KpiCard label="סה״כ כניסות" value={total} emoji="🚪" />
        <KpiCard label="משתמשים שונים" value={uniqueUsers} emoji="👥" />
        <KpiCard label="ימים פעילים" value={sortedDays.length} emoji="📅" />
      </div>

      {/* Bar chart by day */}
      <div style={{ background: "#fff", border: "2px solid #0F0F0F", padding: "20px 18px", boxShadow: "4px 4px 0 0 #0F0F0F", marginBottom: 28 }}>
        <h2 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: 18, color: "var(--color-text-primary)" }}>כניסות לפי יום</h2>
        {sortedDays.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>אין נתונים עדיין</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedDays.map((day) => {
              const count = byDay[day].length;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={day}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
                      {formatDayKey(day + "T12:00:00")}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-text-primary)" }}>{count}</span>
                  </div>
                  <div style={{ height: 10, background: "rgba(0,0,0,0.07)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-accent-primary)", borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent check-ins table */}
      <div style={{ background: "#fff", border: "2px solid #0F0F0F", boxShadow: "4px 4px 0 0 #0F0F0F" }}>
        <div style={{ padding: "16px 18px 14px", borderBottom: "2px solid #0F0F0F" }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: "var(--color-text-primary)" }}>רשימת כניסות</h2>
        </div>

        {checkIns.length === 0 ? (
          <p style={{ padding: "20px 18px", color: "var(--color-text-muted)", fontSize: 14 }}>אין כניסות עדיין</p>
        ) : (
          <div>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 18px", background: "rgba(0,0,0,0.04)", borderBottom: "1.5px solid #E0E0E0" }}>
              {["שם", "תאריך", "שעה"].map((h) => (
                <span key={h} style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
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
                    padding: "12px 18px",
                    borderBottom: i < checkIns.length - 1 ? "1px solid #E8E8E8" : "none",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{name}</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{formatDate(row.checked_in_at)}</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{formatTime(row.checked_in_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function KpiCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div style={{ background: "#fff", border: "2px solid #0F0F0F", boxShadow: "4px 4px 0 0 #0F0F0F", padding: "16px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 32, color: "var(--color-text-primary)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-rubik)", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}
