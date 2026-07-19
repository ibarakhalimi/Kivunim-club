interface WelcomeStripProps {
  name: string;
  points: number;
  tier: string;
}

export function WelcomeStrip({ name, points, tier }: WelcomeStripProps) {
  return (
    <div style={{ padding: "4px 20px 18px" }}>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-black)",
          fontSize: "var(--font-size-7xl)",
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
          color: "var(--color-ink)",
        }}
      >
        היי {name}{" "}
        <span style={{ display: "inline-block", transformOrigin: "70% 70%" }}>
          👋
        </span>
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px 5px",
            background: "var(--color-brand)",
            color: "var(--color-ink)",
            borderRadius: "var(--shape-radius-pill)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "-0.005em",
          }}
        >
          ✦ {tier}
        </span>
        <span
          style={{
            fontSize: "var(--font-size-md)",
            color: "var(--color-text-secondary)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {points.toLocaleString("he-IL")} נק׳ · 4 אירועים החודש
        </span>
      </div>
    </div>
  );
}
