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
      <header
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "16px 16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          direction: "rtl",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.05,
            color: "var(--color-text-primary)",
          }}
        >
          קלאס סטודנטים אשדוד
        </h1>

        <button
          type="button"
          aria-label="תפריט"
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            border: "2px solid #0F0F0F",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            fontSize: 24,
            fontWeight: 700,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ☰
        </button>
      </header>

      <section
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 16px",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-heebo)",
            fontSize: 20,
            color: "var(--color-text-primary)",
          }}
        >
          היי [שם משתמש]
        </p>
        <h2
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 36,
            lineHeight: 1.05,
            color: "var(--color-text-primary)",
          }}
        >
          וולקאם הק טו דה קלאב
        </h2>
      </section>

      <ActionsGrid />
      <UpdateSection />
      <EventsLoader />
      <BenefitsLoader />
    </div>
  );
}
