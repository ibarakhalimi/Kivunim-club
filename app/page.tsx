export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursLoader } from "@/components/home/open-hours-loader";
import { CardSliderLoader } from "@/components/home/card-slider-loader";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#181A23",
        paddingBottom: 28,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "6px 14px 0" }}>
        <ProfileCard />
        <div style={{ marginTop: 18 }}>
          <CardSliderLoader />
        </div>
        <div style={{ marginTop: 22 }}>
          <ActionsGrid />
        </div>
        <div style={{ marginTop: 12 }}>
          <OpenHoursLoader />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 24, width: "100%" }}>
          <UpdateSection />
          <EventsLoader />
          <BenefitsLoader />
          <PollLoader />
        </div>
      </div>
    </main>
  );
}
