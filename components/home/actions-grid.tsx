import { CheckInButton } from "./check-in-button";

const STATIC_ACTIONS = [
  { emoji: "📞", label: "יצירת קשר" },
  { emoji: "📋", label: "מידע חשוב" },
  { emoji: "💡", label: "יש לי רעיון" },
  { emoji: "🎁", label: "ההטבות שלי" },
  { emoji: "📅", label: "אירועים קרובים" },
];

export function ActionsGrid() {
  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          padding: "4px 0 6px",
        }}
      >
        <CheckInButton />

        {STATIC_ACTIONS.map((a) => (
          <button
            key={a.label}
            style={{
              background: "#fff",
              border: "3px solid #000",
              borderRadius: 20,
              boxShadow: "4px 4px 0px #000",
              padding: "16px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              width: "100%",
              aspectRatio: "1 / 1",
            }}
          >
            <span style={{ fontSize: 26 }}>{a.emoji}</span>
            <span
              style={{
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 13,
                color: "#111",
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
