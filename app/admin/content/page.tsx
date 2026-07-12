import { createAdminClient } from "@/lib/supabase/admin";
import { syncExpiredBenefits } from "@/lib/benefits/expiry";
import { BenefitList } from "../benefits/benefit-list";
import { EventList } from "../events/event-list";
import { ContentCreatePanel } from "./content-create-panel";
import { UpdateList } from "./updates/update-list";

type ContentTab = "updates" | "events" | "benefits";

type AdminContentPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const tabs: Array<{ key: ContentTab; label: string; href: string }> = [
  { key: "updates", label: "עדכונים", href: "/admin/content?tab=updates" },
  { key: "events", label: "אירועים", href: "/admin/content?tab=events" },
  { key: "benefits", label: "הטבות", href: "/admin/content?tab=benefits" },
];

function resolveTab(value: string | undefined): ContentTab {
  if (value === "events" || value === "benefits") return value;
  return "updates";
}

export default async function AdminContentPage({ searchParams }: AdminContentPageProps) {
  const params = await searchParams;
  const activeTab = resolveTab(params?.tab);
  const supabase = createAdminClient();

  if (activeTab === "benefits") {
    await syncExpiredBenefits();
  }

  const [{ data: updates }, { data: events }, { data: benefits }] = await Promise.all([
    supabase.from("updates").select("*").order("published_at", { ascending: false }),
    supabase.from("events").select("*").order("event_date", { ascending: true }),
    supabase.from("benefits").select("*").order("sort_order", { ascending: true }),
  ]);
  const benefitCategories = Array.from(new Set((benefits ?? []).map((benefit) => benefit.category).filter(Boolean)));

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "32px 16px 40px",
        direction: "rtl",
        fontFamily: "var(--font-rubik)",
      }}
    >
      <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: "#0F172A" }}>
        ניהול תוכן
      </h1>
      <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: "#64748B" }}>
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
                borderRadius: 999,
                border: active ? "1px solid #0F172A" : "1px solid #E2E8F0",
                background: active ? "#0F172A" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 900,
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
            <h2 style={{ margin: "0 0 14px", fontWeight: 900, fontSize: 16, color: "#0F172A" }}>
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
              <h2 style={{ margin: "0 0 14px", fontWeight: 900, fontSize: 16, color: "#0F172A" }}>
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
              <h2 style={{ margin: "0 0 14px", fontWeight: 900, fontSize: 16, color: "#0F172A" }}>
                כל ההטבות
              </h2>
              <BenefitList benefits={benefits} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
