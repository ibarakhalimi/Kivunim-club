export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { TopBar } from "@/components/home/top-bar";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursSection } from "@/components/home/open-hours-section";
import { BottomNav } from "@/components/home/bottom-nav";
import { CardSlider } from "@/components/home/card-slider";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        paddingBottom: 88,
      }}
    >
      <TopBar />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "6px 14px 0" }}>
        <ProfileCard />
        <CardSlider />
        <div style={{ marginTop: 4 }}>
          <ActionsGrid />
        </div>
        <OpenHoursSection />
        <div style={{ display: "flex", gap: 8 }}>
          <UpdateSection />
          <EventsLoader />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BenefitsLoader />
          <PollLoader />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
