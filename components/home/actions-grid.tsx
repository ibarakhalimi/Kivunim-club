const ACTIONS = [
  { emoji: "📅", label: "אירועים",   bg: "var(--color-card-sky)" },
  { emoji: "🎁", label: "הטבות",     bg: "var(--color-card-peach)" },
  { emoji: "📊", label: "סקרים",     bg: "var(--color-card-lime)" },
  { emoji: "💬", label: "פורום",     bg: "var(--color-card-lavender)" },
  { emoji: "🖼️", label: "גלריה",    bg: "var(--color-card-mint)" },
  { emoji: "📞", label: "צור קשר",  bg: "var(--color-card-butter)" },
];

export function ActionsGrid() {
  return (
    <section style={{ padding: "4px 16px 8px" }}>
      <h2
        style={{
          margin: "0 0 14px",
          paddingInline: 2,
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "-0.018em",
          color: "var(--color-text-primary)",
        }}
      >
        פעולות מהירות
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            className="kv-tap"
            style={{
              background: a.bg,
              border: "2px solid #0F0F0F",
              borderRadius: 0,
              boxShadow: "3px 3px 0 0 #0F0F0F",
              padding: "16px 8px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 32, lineHeight: 1 }}>{a.emoji}</span>
            <span
              style={{
                fontFamily: "var(--font-heebo)",
                fontWeight: 700,
                fontSize: 13,
                color: "var(--color-text-primary)",
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
