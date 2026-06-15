export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { TopBar } from "@/components/home/top-bar";
import { PollLoader } from "@/components/home/poll-loader";
import { ProfileCard } from "@/components/home/profile-card";
import { OpenHoursSection } from "@/components/home/open-hours-section";

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
      <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "8px 16px 0" }}>
        <ProfileCard />
        <UpdateSection />
        <OpenHoursSection />
        <ActionsGrid />
        <EventsLoader />
        <BenefitsLoader />
        <PollLoader />
      </div>
    </main>
  );
}
