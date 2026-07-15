import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const supabase = createAdminClient();
  const { count: membersCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  const metrics = [
    {
      label: "מס׳ חברים במועדון",
      value: membersCount ?? 0,
      bg: "#EEF2FF",
      color: "#4338CA",
    },
    { label: "מדד עתידי", value: "-", bg: "#FFFFFF", color: "#64748B" },
    { label: "מדד עתידי", value: "-", bg: "#FFFFFF", color: "#64748B" },
    { label: "מדד עתידי", value: "-", bg: "#FFFFFF", color: "#64748B" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "32px 16px 40px",
        fontFamily: "var(--font-rubik)",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          margin: "0 0 6px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 28,
          color: "#0F172A",
        }}
      >
        ברוך הבא למערכת ניהול
      </h1>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: 14,
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        כיוונים · דשבורד ראשי
      </p>

      <style>{`
        .kv-admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 980px) {
          .kv-admin-metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .kv-admin-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        aria-label="מדדי מערכת"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="kv-admin-metrics-grid">
          {metrics.map((metric, index) => (
            <article
              key={`${metric.label}-${index}`}
              style={{
                minHeight: 132,
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                background: metric.bg,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#64748B" }}>
                {metric.label}
              </p>
              <p style={{ margin: 0, fontSize: 34, lineHeight: 1, fontWeight: 950, color: metric.color }}>
                {metric.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
