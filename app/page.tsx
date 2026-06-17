export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursLoader } from "@/components/home/open-hours-loader";
import { CardSliderLoader } from "@/components/home/card-slider-loader";
import { BottomNav } from "@/components/home/bottom-nav";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#181A23",
        paddingBottom: 100,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 22px 0" }}>
        <ProfileCard />
        <CardSliderLoader />
        <div style={{ marginTop: 0 }}>
          <ActionsGrid />
        </div>
        <OpenHoursLoader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0 0" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 19, lineHeight: 1.2, color: "#FFFFFF" }}>
            מה חדש
          </h2>
          <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#FF2E9A" }}>
            הכל
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: -3 }}>
          <div style={{ display: "flex", gap: 11 }}>
            <UpdateSection />
            <EventsLoader />
          </div>
          <div style={{ display: "flex", gap: 11 }}>
            <BenefitsLoader />
            <PollLoader />
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
