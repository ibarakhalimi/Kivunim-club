import { Hero } from "@/components/home/hero";
import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";

export default function HomePage() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        paddingBottom: 40,
      }}
    >
      <Hero />
      <UpdateSection />
      <ActionsGrid />
      <EventsLoader />
      <BenefitsLoader />
    </div>
  );
}
