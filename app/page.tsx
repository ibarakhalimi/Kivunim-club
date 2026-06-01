export const dynamic = "force-dynamic";

import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
import { TopBar } from "@/components/home/top-bar";
import { PollLoader } from "@/components/home/poll-loader";

const BG = "#e7e3da";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: BG,
        backgroundAttachment: "fixed",
        paddingBottom: 40,
      }}
    >
      <TopBar />
      <div style={{ display: "flex", flexDirection: "column", gap: 36, padding: "0 20px" }}>
        <UpdateSection />
        <ActionsGrid />
        <EventsLoader />
        <BenefitsLoader />
        <PollLoader />
      </div>
    </main>
  );
}
