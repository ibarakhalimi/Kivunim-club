export const dynamic = "force-dynamic";

import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursLoader } from "@/components/home/open-hours-loader";
import { CheckInSuccessToast } from "@/components/home/check-in-success-toast";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContactSettings, getImportantInfoPages } from "./admin/settings/actions";

type HomePageProps = {
  searchParams?: Promise<{
    checkin?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const supabase = createAdminClient();
  const [contactSettings, importantInfoPages, { data: featuredUpdates }] = await Promise.all([
    getContactSettings(),
    getImportantInfoPages({ activeOnly: true }),
    supabase
      .from("updates")
      .select("id, tab_label, title, description")
      .eq("is_active", true)
      .order("published_at", { ascending: false }),
  ]);

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "var(--color-app-bg)",
        paddingBottom: 28,
      }}
    >
      <CheckInSuccessToast show={params?.checkin === "success"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "6px 14px 0" }}>
        <div style={{ marginTop: 0 }}>
          <ProfileCard />
        </div>
        <div style={{ marginTop: 22 }}>
          <FeaturedSlider updates={featuredUpdates ?? []} />
        </div>
        <div style={{ marginTop: 16 }}>
          <ActionsGrid contactSettings={contactSettings} importantInfoPages={importantInfoPages} />
        </div>
        <section id="hours" style={{ marginTop: 8, scrollMarginTop: 72 }}>
          <OpenHoursLoader />
        </section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 30, marginTop: 34, width: "100%" }}>
          <section id="events" style={{ gridColumn: "1 / -1", scrollMarginTop: 72 }}>
            <EventsLoader />
          </section>
          <section id="benefits" style={{ gridColumn: "1 / -1", scrollMarginTop: 72 }}>
            <BenefitsLoader />
          </section>
          <section id="activity" style={{ gridColumn: "1 / -1", scrollMarginTop: 72 }}>
            <PollLoader />
          </section>
        </div>
      </div>
    </main>
  );
}
