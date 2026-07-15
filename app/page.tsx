export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursLoader } from "@/components/home/open-hours-loader";
import { CheckInSuccessToast } from "@/components/home/check-in-success-toast";
import { getContactSettings, getImportantInfoPages } from "./admin/settings/actions";

type HomePageProps = {
  searchParams?: Promise<{
    checkin?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const [contactSettings, importantInfoPages] = await Promise.all([
    getContactSettings(),
    getImportantInfoPages({ activeOnly: true }),
  ]);

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#DFDBD3",
        paddingBottom: 28,
      }}
    >
      <CheckInSuccessToast show={params?.checkin === "success"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "6px 14px 0" }}>
        <div style={{ marginTop: 0 }}>
          <ProfileCard />
        </div>
        <div style={{ marginTop: 22 }}>
          <FeaturedSlider />
        </div>
        <div style={{ marginTop: 16 }}>
          <ActionsGrid contactSettings={contactSettings} importantInfoPages={importantInfoPages} />
        </div>
        <section id="hours" style={{ marginTop: 8, scrollMarginTop: 72 }}>
          <OpenHoursLoader />
        </section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 30, marginTop: 34, width: "100%" }}>
          <section id="updates" style={{ gridColumn: "1 / -1", scrollMarginTop: 72 }}>
            <UpdateSection />
          </section>
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
