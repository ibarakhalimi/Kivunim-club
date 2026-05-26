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
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
          color: "var(--color-text-primary)",
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
            background: "var(--color-accent-highlight)",
            color: "var(--color-text-primary)",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "-0.005em",
          }}
        >
          ✦ {tier}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            fontWeight: 500,
          }}
        >
          {points.toLocaleString("he-IL")} נק׳ · 4 אירועים החודש
        </span>
      </div>
    </div>
  );
}
