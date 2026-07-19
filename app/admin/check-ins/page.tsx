import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type CheckInRow = {
  id: string;
  user_id: string;
  checked_in_at: string;
  source: string;
};

type MemberRow = {
  user_id: string;
  name: string | null;
  email: string | null;
};

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
    .select("id, user_id, checked_in_at, source")
    .order("checked_in_at", { ascending: false });

  const rawCheckIns = (rows ?? []) as CheckInRow[];
  const userIds = [...new Set(rawCheckIns.map((row) => row.user_id))];
  const { data: members } = userIds.length
    ? await supabase
        .from("members")
        .select("user_id, name, email")
        .in("user_id", userIds)
    : { data: [] };

  const membersByUserId = new Map(
    ((members ?? []) as MemberRow[]).map((member) => [member.user_id, member])
  );

  const checkIns = rawCheckIns.map((row) => ({
    ...row,
    member: membersByUserId.get(row.user_id) ?? null,
  }));
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
    <div dir="rtl" style={{ minHeight: "100dvh", background: "var(--color-surface-muted)", padding: "24px 16px 60px", fontFamily: "var(--font-family-sans)" }}>
      <a href="/admin" style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-medium)" }}>← חזרה לניהול</a>

      <h1 style={{ margin: "16px 0 4px", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-dark)" }}>
        דשבורד הגעות
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)" }}>מעקב אחר כניסות לסביבת הלימודים</p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        <KpiCard label="סה״כ כניסות" value={total} emoji="🚪" />
        <KpiCard label="משתמשים שונים" value={uniqueUsers} emoji="👥" />
        <KpiCard label="ימים פעילים" value={sortedDays.length} emoji="📅" />
      </div>

      {/* Bar chart by day */}
      <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)", padding: "18px 16px", marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 16px", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>כניסות לפי יום</h2>
        {sortedDays.length === 0 ? (
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--font-size-base)" }}>אין נתונים עדיין</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedDays.map((day) => {
              const count = byDay[day].length;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={day}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-slate-600)" }}>
                      {formatDayKey(day + "T12:00:00")}
                    </span>
                    <span style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-bold)", color: "var(--color-admin-dark)" }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: "var(--color-surface-soft)", borderRadius: "var(--shape-radius-pill)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-brand-blue)", borderRadius: "var(--shape-radius-pill)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-ins table */}
      <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
          <h2 style={{ margin: 0, fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>רשימת כניסות</h2>
        </div>

        {checkIns.length === 0 ? (
          <p style={{ padding: "20px 16px", color: "var(--color-text-tertiary)", fontSize: "var(--font-size-base)" }}>אין כניסות עדיין</p>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.7fr 0.7fr", padding: "10px 16px", background: "var(--color-surface-muted)", borderBottom: "1px solid var(--color-border-subtle)" }}>
              {["שם", "תאריך", "שעה", "מקור"].map((h) => (
                <span key={h} style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-tertiary)", letterSpacing: "0.04em" }}>{h}</span>
              ))}
            </div>

            {checkIns.map((row, i) => {
              const name = row.member?.name ?? row.member?.email ?? "—";
              const source = row.source === "qr" || row.source === "qr_link" ? "QR" : "ידני";
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 0.7fr 0.7fr",
                    padding: "12px 16px",
                    borderBottom: i < checkIns.length - 1 ? "1px solid var(--color-surface-soft)" : "none",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-admin-dark)" }}>{name}</span>
                  <span style={{ fontSize: "var(--font-size-md)", color: "var(--color-slate-600)" }}>{formatDate(row.checked_in_at)}</span>
                  <span style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-tertiary)" }}>{formatTime(row.checked_in_at)}</span>
                  <span style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-semibold)" }}>{source}</span>
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
    <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)", padding: "16px 12px", textAlign: "center" }}>
      <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-5xl)", color: "var(--color-admin-dark)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-tertiary)", marginTop: 4 }}>{label}</div>
    </div>
  );
}
