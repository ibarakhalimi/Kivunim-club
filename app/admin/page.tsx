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
      bg: "var(--color-indigo-50)",
      color: "var(--color-indigo-700)",
    },
    { label: "מדד עתידי", value: "-", bg: "var(--color-surface-raised)", color: "var(--color-text-secondary)" },
    { label: "מדד עתידי", value: "-", bg: "var(--color-surface-raised)", color: "var(--color-text-secondary)" },
    { label: "מדד עתידי", value: "-", bg: "var(--color-surface-raised)", color: "var(--color-text-secondary)" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface-muted)",
        padding: "32px 16px 40px",
        fontFamily: "var(--font-family-sans)",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          margin: "0 0 6px",
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-black)",
          fontSize: "var(--font-size-5xl)",
          color: "var(--color-admin-dark)",
        }}
      >
        ברוך הבא למערכת ניהול
      </h1>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: "var(--font-size-base)",
          color: "var(--color-text-secondary)",
          fontWeight: "var(--font-weight-semibold)",
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
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--shape-radius-2xl)",
          padding: 16,
          boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)",
        }}
      >
        <div className="kv-admin-metrics-grid">
          {metrics.map((metric, index) => (
            <article
              key={`${metric.label}-${index}`}
              style={{
                minHeight: 132,
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--shape-radius-xl)",
                background: metric.bg,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-text-secondary)" }}>
                {metric.label}
              </p>
              <p style={{ margin: 0, fontSize: "var(--font-size-6xl)", lineHeight: 1, fontWeight: "var(--font-weight-black)", color: metric.color }}>
                {metric.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
