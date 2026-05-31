import { CheckInButton } from "./check-in-button";

const STATIC_ACTIONS = [
  { emoji: "📞", label: "יצירת קשר" },
  { emoji: "📋", label: "מידע חשוב" },
  { emoji: "💡", label: "יש לי רעיון" },
];

export function ActionsGrid() {
  return (
    <section>
      <h2
        style={{
          margin: "0 0 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "-0.018em",
          color: "var(--color-text-primary)",
        }}
      >
        פעולות מהירות
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <CheckInButton bg="rgba(255,255,255,0.75)" />

        {STATIC_ACTIONS.map((a) => (
          <button
            key={a.label}
            className="kv-tap"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1.5px solid rgba(255,255,255,0.7)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              padding: "20px 12px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
              cursor: "pointer",
              textAlign: "right",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{a.emoji}</span>
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
