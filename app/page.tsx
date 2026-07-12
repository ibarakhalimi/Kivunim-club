export const dynamic = "force-dynamic";

import Image from "next/image";
import { BadgePercent, Gift, GraduationCap, Sparkles, Ticket } from "lucide-react";
import { UpdateSection } from "@/components/home/update-section";
import { BenefitsLoader } from "@/components/home/benefits-loader";
import { EventsLoader } from "@/components/home/events-loader";
import { ActionsGrid } from "@/components/home/actions-grid";
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
        background: "#181A23",
        paddingBottom: 28,
      }}
    >
      <CheckInSuccessToast show={params?.checkin === "success"} />
      <section
        aria-label="לוגו האפליקציה"
        style={{
          width: "100%",
          minHeight: 248,
          background: "linear-gradient(180deg, #111522 0%, #1D2030 58%, #181A23 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 16px 34px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 38, right: 34, color: "rgba(255,255,255,0.38)" }}>
          <Gift size={24} strokeWidth={2.1} />
        </div>
        <div style={{ position: "absolute", top: 58, left: 42, color: "rgba(255,46,154,0.5)" }}>
          <BadgePercent size={25} strokeWidth={2.1} />
        </div>
        <div style={{ position: "absolute", bottom: 62, right: 48, color: "rgba(216,245,0,0.38)" }}>
          <Ticket size={22} strokeWidth={2.1} />
        </div>
        <div style={{ position: "absolute", bottom: 76, left: 36, color: "rgba(255,255,255,0.34)" }}>
          <GraduationCap size={27} strokeWidth={2.05} />
        </div>
        <div style={{ position: "absolute", top: 104, right: "20%", color: "rgba(255,255,255,0.25)" }}>
          <Sparkles size={18} strokeWidth={2.2} />
        </div>
        <Image
          src="/logo-aguda.png"
          alt="לוגו האפליקציה"
          width={126}
          height={126}
          priority
          style={{
            width: 126,
            height: 126,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: 0.96,
            position: "relative",
            zIndex: 1,
          }}
        />
        <h1
          style={{
            margin: "12px 0 0",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 1.05,
            color: "#FFFFFF",
            textAlign: "center",
            textShadow: "0 10px 26px rgba(0,0,0,0.28)",
            position: "relative",
            zIndex: 1,
          }}
        >
          הקלאב הסטודנטיאלי
        </h1>
      </section>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "6px 14px 0" }}>
        <div style={{ marginTop: 0 }}>
          <ProfileCard />
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
