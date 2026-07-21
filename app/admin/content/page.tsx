import { createAdminClient } from "@/lib/supabase/admin";
import { syncExpiredBenefits } from "@/lib/benefits/expiry";
import { BenefitList } from "../benefits/benefit-list";
import { EventList } from "../events/event-list";
import { getImportantInfoPages } from "../settings/actions";
import { ImportantInfoPanel } from "../settings/important-info-panel";
import { ContentCreatePanel } from "./content-create-panel";
import { UpdateList } from "./updates/update-list";

type ContentTab = "updates" | "events" | "benefits" | "info";

type AdminContentPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const tabs: Array<{ key: ContentTab; label: string; href: string }> = [
  { key: "updates", label: "עדכונים", href: "/admin/content?tab=updates" },
  { key: "events", label: "אירועים", href: "/admin/content?tab=events" },
  { key: "benefits", label: "הטבות", href: "/admin/content?tab=benefits" },
  { key: "info", label: "עמודי מידע", href: "/admin/content?tab=info" },
];

function resolveTab(value: string | undefined): ContentTab {
  if (value === "events" || value === "benefits" || value === "info") return value;
  return "updates";
}

export default async function AdminContentPage({ searchParams }: AdminContentPageProps) {
  const params = await searchParams;
  const activeTab = resolveTab(params?.tab);
  const supabase = createAdminClient();

  if (activeTab === "benefits") {
    await syncExpiredBenefits();
  }

  const [{ data: updates }, { data: events }, { data: benefits }, importantInfoPages] = await Promise.all([
    supabase.from("updates").select("*").order("published_at", { ascending: false }),
    supabase.from("events").select("*").order("event_date", { ascending: true }),
    supabase.from("benefits").select("*").order("sort_order", { ascending: true }),
    getImportantInfoPages(),
  ]);
  const benefitCategories = Array.from(new Set((benefits ?? []).map((benefit) => benefit.category).filter(Boolean)));

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface-muted)",
        padding: "32px 16px 40px",
        direction: "rtl",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      <h1 style={{ margin: "0 0 4px", fontSize: "var(--font-size-5xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
        ניהול תוכן
      </h1>
      <p style={{ margin: "0 0 20px", fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>
        ניהול עדכונים, אירועים והטבות מתוך מסך אחד.
      </p>

      <nav
        aria-label="טאבים לניהול תוכן"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          marginBottom: 22,
          paddingBottom: 2,
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <a
              key={tab.key}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              style={{
                minHeight: 40,
                minWidth: 92,
                borderRadius: "var(--shape-radius-pill)",
                border: active ? "1px solid var(--color-admin-dark)" : "1px solid var(--color-border-subtle)",
                background: active ? "var(--color-admin-dark)" : "var(--color-surface-raised)",
                color: active ? "var(--color-violet-400)" : "var(--color-slate-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "var(--font-size-base)",
                fontWeight: "var(--font-weight-black)",
                padding: "0 18px",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      {activeTab === "updates" && (
        <section>
          <ContentCreatePanel activeTab={activeTab} />
          <div style={{ marginTop: 28 }}>
            <h2 style={{ margin: "0 0 14px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
              עדכונים קיימים
            </h2>
            <UpdateList updates={updates ?? []} />
          </div>
        </section>
      )}

      {activeTab === "events" && (
        <section>
          <ContentCreatePanel activeTab={activeTab} />
          {events && events.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ margin: "0 0 14px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
                כל האירועים
              </h2>
              <EventList events={events} />
            </div>
          )}
        </section>
      )}

      {activeTab === "benefits" && (
        <section>
          <ContentCreatePanel activeTab={activeTab} benefitCategories={benefitCategories} />
          {benefits && benefits.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ margin: "0 0 14px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
                כל ההטבות
              </h2>
              <BenefitList benefits={benefits} />
            </div>
          )}
        </section>
      )}

      {activeTab === "info" && (
        <section>
          <div style={{ marginTop: 4 }}>
            <h2 style={{ margin: "0 0 14px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
              עמודי מידע
            </h2>
            <ImportantInfoPanel pages={importantInfoPages} />
          </div>
        </section>
      )}
    </div>
  );
}
